import { IncomingMessage, ServerResponse } from 'http';
import { parse as parseUrl } from 'url';
import { getServerConfig } from './paymentConfig';
import { paymentStore } from './paymentStore';
import { upiPaymentProvider } from './providers/upiProvider';
import { baseUsdcPaymentProvider } from './providers/baseUsdcProvider';
import { PublicPaymentConfig } from '../src/types/payment';

// Helper to parse JSON body
function getRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
): Promise<boolean> {
  const parsed = parseUrl(req.url || '', true);
  const pathname = parsed.pathname || '';

  // Only handle /api/*
  if (!pathname.startsWith('/api/')) {
    if (next) next();
    return false;
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return true;
  }

  try {
    // 1. GET /api/config/public - Safe public config without secrets
    if (pathname === '/api/config/public' && req.method === 'GET') {
      const config = getServerConfig();
      const publicConfig: PublicPaymentConfig = {
        upiConfigured: config.isUpiConfigured,
        upiVpa: config.isUpiConfigured ? config.upiVpa : undefined,
        upiPayeeName: config.isUpiConfigured ? config.upiPayeeName : undefined,
        upiQrImageUrl: config.upiQrImageUrl,
        usdInrRate: config.usdInrRate ?? undefined,
        baseUsdcConfigured: config.isBaseConfigured,
        baseReceiverAddress: config.isBaseConfigured ? config.baseReceiverAddress : undefined,
        baseChainId: config.baseChainId,
        baseUsdcContract: config.baseUsdcContract,
        baseConfirmationPolicy: config.baseConfirmationPolicy,
      };
      sendJson(res, 200, { success: true, config: publicConfig });
      return true;
    }

    // 2. GET /api/sponsorships/:id - Retrieve sponsorship & existing payment
    const sponsorshipMatch = pathname.match(/^\/api\/sponsorships\/([^/]+)$/);
    if (sponsorshipMatch && req.method === 'GET') {
      const sponsorshipId = decodeURIComponent(sponsorshipMatch[1]);
      const sponsorship = paymentStore.getSponsorship(sponsorshipId);
      if (!sponsorship) {
        sendJson(res, 404, { success: false, message: `Sponsorship ${sponsorshipId} not found.` });
        return true;
      }
      const payment = paymentStore.getPaymentBySponsorship(sponsorshipId);
      sendJson(res, 200, { success: true, sponsorship, payment });
      return true;
    }

    // 3. GET /api/payments/:id - Retrieve payment status
    const paymentMatch = pathname.match(/^\/api\/payments\/([^/]+)$/);
    if (paymentMatch && req.method === 'GET') {
      const paymentId = decodeURIComponent(paymentMatch[1]);
      const payment = paymentStore.getPayment(paymentId);
      if (!payment) {
        sendJson(res, 404, { success: false, message: `Payment ${paymentId} not found.` });
        return true;
      }
      const sponsorship = paymentStore.getSponsorship(payment.sponsorshipId);
      sendJson(res, 200, { success: true, payment, sponsorship });
      return true;
    }

    // 4. POST /api/payments/initiate - Start payment session (UPI or BASE_USDC)
    if (pathname === '/api/payments/initiate' && req.method === 'POST') {
      const body = await getRequestBody(req);
      const { sponsorshipId, paymentMethod } = body;

      if (!sponsorshipId || !paymentMethod) {
        sendJson(res, 400, { success: false, message: 'Missing sponsorshipId or paymentMethod' });
        return true;
      }

      const sponsorship = paymentStore.getSponsorship(sponsorshipId);
      if (!sponsorship) {
        sendJson(res, 404, { success: false, message: `Sponsorship ${sponsorshipId} not found.` });
        return true;
      }

      if (sponsorship.status === 'CONFIRMED') {
        sendJson(res, 400, { success: false, message: 'This sponsorship has already been confirmed and paid.' });
        return true;
      }

      // Check if there is an existing payment with matching method
      const existingPayment = paymentStore.getPaymentBySponsorship(sponsorshipId);
      if (existingPayment && existingPayment.paymentMethod === paymentMethod && existingPayment.paymentStatus !== 'failed') {
        sendJson(res, 200, {
          success: true,
          payment: existingPayment,
          isExisting: true,
        });
        return true;
      }

      const requestPayload = {
        sponsorshipId: sponsorship.id,
        coverId: sponsorship.coverId,
        winningBidUsd: sponsorship.winningBidUsd,
      };

      let result;
      if (paymentMethod === 'UPI') {
        result = await upiPaymentProvider.initiate(requestPayload);
      } else if (paymentMethod === 'BASE_USDC') {
        result = await baseUsdcPaymentProvider.initiate(requestPayload);
      } else {
        sendJson(res, 400, { success: false, message: `Unsupported payment method: ${paymentMethod}` });
        return true;
      }

      sendJson(res, 200, { success: true, ...result });
      return true;
    }

    // 5. POST /api/payments/verify/upi - Buyer submits UTR
    if (pathname === '/api/payments/verify/upi' && req.method === 'POST') {
      const body = await getRequestBody(req);
      const { paymentId, utr } = body;

      if (!paymentId || !utr) {
        sendJson(res, 400, { success: false, message: 'Both paymentId and utr are required.' });
        return true;
      }

      const result = await upiPaymentProvider.verify(paymentId, { utr });
      sendJson(res, result.success ? 200 : 400, result);
      return true;
    }

    // 6. POST /api/payments/verify/base-usdc - Automatic Base on-chain verification
    if (pathname === '/api/payments/verify/base-usdc' && req.method === 'POST') {
      const body = await getRequestBody(req);
      const { paymentId, txHash } = body;

      if (!paymentId || !txHash) {
        sendJson(res, 400, { success: false, message: 'Both paymentId and txHash are required.' });
        return true;
      }

      const result = await baseUsdcPaymentProvider.verify(paymentId, { txHash });
      sendJson(res, result.success || result.requiresRetry ? 200 : 400, result);
      return true;
    }

    // 7. GET /api/sponsorships - List active sponsorships (for demo/lookup helper)
    if (pathname === '/api/sponsorships' && req.method === 'GET') {
      const sponsorships = paymentStore.getAllSponsorships();
      sendJson(res, 200, { success: true, sponsorships });
      return true;
    }

    // 404 for unknown /api route
    sendJson(res, 404, { success: false, message: 'API route not found' });
    return true;
  } catch (err: any) {
    console.error('API Error:', err);
    sendJson(res, 500, { success: false, message: err.message || 'Internal server error' });
    return true;
  }
}

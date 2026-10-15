import { IPaymentProvider, PaymentInitiationRequest, PaymentInitiationResult } from './types';
import { getServerConfig } from '../paymentConfig';
import { paymentStore } from '../paymentStore';
import { PaymentRecord, VerificationResponse } from '../../src/types/payment';

export class UpiPaymentProvider implements IPaymentProvider {
  public readonly id = 'UPI';
  public readonly name = 'UPI (INR)';

  public get isEnabled(): boolean {
    return getServerConfig().isUpiConfigured;
  }

  public async initiate(request: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
    const config = getServerConfig();

    if (!config.isUpiConfigured || config.usdInrRate === null) {
      throw new Error(
        'UPI payments are not configured. The organizer must configure UPI_VPA, UPI_PAYEE_NAME, and USD_INR_RATE in the server environment.'
      );
    }

    const { sponsorshipId, coverId, winningBidUsd } = request;
    const usdToInrRate = config.usdInrRate;
    // Calculate rounded integer or 2 decimal INR amount
    const amountInr = Math.round(winningBidUsd * usdToInrRate);

    // Deterministic or clean payment ID
    const paymentId = `PAY-UPI-${sponsorshipId.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}`;
    const paymentReference = `PB-${sponsorshipId}`;

    // Standard NPCI UPI URI string format:
    // upi://pay?pa=<vpa>&pn=<payee>&am=<amount>&cu=INR&tn=<transaction_note>&tr=<reference>
    const upiUri = `upi://pay?pa=${encodeURIComponent(config.upiVpa)}&pn=${encodeURIComponent(
      config.upiPayeeName
    )}&am=${amountInr.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      `PocketBillboard ${sponsorshipId}`
    )}&tr=${encodeURIComponent(paymentReference)}`;

    const payment: PaymentRecord = {
      id: paymentId,
      sponsorshipId,
      coverId,
      winningBidAmount: winningBidUsd,
      paymentCurrency: 'INR',
      exactAmountDue: amountInr,
      usdToInrRate,
      paymentMethod: 'UPI',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    const savedPayment = paymentStore.createPayment(payment);

    return {
      payment: savedPayment,
      instructions: {
        upiUri,
        upiVpa: config.upiVpa,
        upiPayeeName: config.upiPayeeName,
        upiQrImageUrl: config.upiQrImageUrl,
        amountInr,
        usdToInrRate,
        paymentReference,
      },
    };
  }

  public async verify(paymentId: string, payload: { utr?: string }): Promise<VerificationResponse> {
    const payment = paymentStore.getPayment(paymentId);
    if (!payment) {
      return {
        success: false,
        status: 'failed',
        message: `Payment record ${paymentId} not found.`,
      };
    }

    const utr = (payload.utr || '').trim();
    if (!utr) {
      return {
        success: false,
        status: 'failed',
        message: 'Please provide a valid UTR or Bank Transaction Reference number.',
      };
    }

    // Typical UPI UTR is 12 digits, but some banking apps produce alphanumeric references
    if (utr.length < 6 || utr.length > 35) {
      return {
        success: false,
        status: 'failed',
        message: 'Invalid UTR format. Bank UTR reference is usually 12 digits.',
      };
    }

    // Constraint: Check duplicate UTR
    if (paymentStore.isTxHashUsed(utr, payment.id)) {
      return {
        success: false,
        status: 'failed',
        message: 'This UTR / Transaction Reference has already been submitted for another payment.',
      };
    }

    // CRITICAL: A submitted UTR must NEVER automatically mark payment as confirmed!
    // It is marked as 'pending_verification' for offline/bank manual reconciliation by the organizer.
    const updatedPayment = paymentStore.updatePaymentStatus(payment.id, 'pending_verification', {
      transactionReference: utr,
      payerUtr: utr,
      notes: `UTR submitted by payer at ${new Date().toISOString()}. Awaiting manual bank/app verification by organizer.`,
    });

    return {
      success: true,
      status: 'pending_verification',
      message: 'Payment details received. Your payment is awaiting verification. Your sponsorship is not yet confirmed.',
      payment: updatedPayment,
    };
  }
}

export const upiPaymentProvider = new UpiPaymentProvider();

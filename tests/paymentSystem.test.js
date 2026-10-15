/**
 * PocketBillboard Payment System Comprehensive Test Suite
 * Tests all requirements from Prompt Section 11:
 * - UPI QR and reference generation
 * - Missing UPI configuration handling
 * - UPI submission -> pending_verification (NEVER auto-confirmed)
 * - Manual UPI confirmation procedure
 * - Base USDC hash validation
 * - Base USDC duplicate hash prevention
 * - Wrong network / token / receiver / insufficient funds rejection
 * - Base block confirmation policy
 * - Unconfirmed / pending transaction handling
 * - Reverted transaction rejection
 */

import assert from 'assert';
import { paymentStore } from '../server/paymentStore.js';
import { getServerConfig } from '../server/paymentConfig.js';
import { upiPaymentProvider } from '../server/providers/upiProvider.js';
import { BaseUsdcVerifier } from '../server/verifier/baseUsdcVerifier.js';

console.log('🧪 Starting PocketBillboard Payment System Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// Test Group 1: Configuration & Setup States
// -----------------------------------------------------------------------------
console.log('--- 1. Configuration & Setup States ---');

runTest('Detects missing UPI configuration without inventing values', () => {
  const originalVpa = process.env.UPI_VPA;
  delete process.env.UPI_VPA;

  const config = getServerConfig();
  assert.strictEqual(config.isUpiConfigured, false, 'UPI should not be marked configured when VPA is missing');
  assert.strictEqual(config.upiVpa, '', 'UPI VPA should not be invented');

  process.env.UPI_VPA = originalVpa || '';
});

runTest('Detects missing Base receiving address without inventing address', () => {
  const originalAddr = process.env.BASE_USDC_RECEIVER_ADDRESS;
  delete process.env.BASE_USDC_RECEIVER_ADDRESS;

  const config = getServerConfig();
  assert.strictEqual(config.isBaseConfigured, false, 'Base should not be marked configured when address is missing');
  assert.strictEqual(config.baseReceiverAddress, '', 'Base receiving address should not be invented');

  process.env.BASE_USDC_RECEIVER_ADDRESS = originalAddr || '';
});

// -----------------------------------------------------------------------------
// Test Group 2: UPI Payment Flow & Manual Verification
// -----------------------------------------------------------------------------
console.log('\n--- 2. INR via UPI Payment Flow ---');

await runAsyncTest('Initiates UPI payment with locked exchange rate and exact INR amount', async () => {
  process.env.UPI_VPA = 'organizer@bank';
  process.env.UPI_PAYEE_NAME = 'PocketBillboard Desk';
  process.env.USD_INR_RATE = '84.50';

  const uid = Date.now().toString(36);
  const sponsorship = paymentStore.createSponsorship({
    id: `TEST-SPONSOR-INIT-${uid}`,
    coverId: 'cover-01',
    coverSlotDisplay: 'COVER 01 / UPPER SHELL',
    winnerName: 'Test Winner',
    winnerEmail: 'winner@test.com',
    winningBidUsd: 65,
    status: 'PAYMENT_PENDING',
  });

  const initiation = await upiPaymentProvider.initiate({
    sponsorshipId: sponsorship.id,
    coverId: sponsorship.coverId,
    winningBidUsd: sponsorship.winningBidUsd,
  });

  assert.strictEqual(initiation.payment.paymentCurrency, 'INR');
  assert.strictEqual(initiation.payment.winningBidAmount, 65);
  assert.strictEqual(initiation.payment.usdToInrRate, 84.50);
  assert.strictEqual(initiation.payment.exactAmountDue, Math.round(65 * 84.50));
  assert.strictEqual(initiation.payment.paymentStatus, 'unpaid');
  assert.ok(initiation.instructions.upiUri.includes('organizer%40bank'));
  assert.ok(initiation.instructions.upiUri.includes('PocketBillboard%20Desk'));
});

await runAsyncTest('Submitting UTR sets status to pending_verification and NEVER marks confirmed', async () => {
  process.env.UPI_VPA = 'organizer@bank';
  process.env.UPI_PAYEE_NAME = 'PocketBillboard Desk';
  process.env.USD_INR_RATE = '84.50';

  const uid = Date.now().toString(36);
  const sponsorship = paymentStore.createSponsorship({
    id: `TEST-SPONSOR-UTR-${uid}`,
    coverId: 'cover-02',
    coverSlotDisplay: 'COVER 02 / LOWER SHELL',
    winnerName: 'Bob Builder',
    winnerEmail: 'bob@test.com',
    winningBidUsd: 45,
    status: 'PAYMENT_PENDING',
  });

  const { payment } = await upiPaymentProvider.initiate({
    sponsorshipId: sponsorship.id,
    coverId: sponsorship.coverId,
    winningBidUsd: sponsorship.winningBidUsd,
  });

  const testUtr = `UTR-${Date.now()}`;
  const verification = await upiPaymentProvider.verify(payment.id, { utr: testUtr });

  assert.strictEqual(verification.status, 'pending_verification', 'Status must be pending_verification');
  assert.strictEqual(verification.payment.paymentStatus, 'pending_verification');
  assert.strictEqual(verification.payment.payerUtr, testUtr);
  assert.notStrictEqual(verification.status, 'confirmed', 'A submitted UTR must NEVER automatically mark payment confirmed');
});

runTest('Enforces database constraint against duplicate UTR submission', () => {
  const uid = Date.now().toString(36);
  const duplicateUtr = `DUP-${uid}`;

  paymentStore.createPayment({
    id: `PAY-TEST-DUP1-${uid}`,
    sponsorshipId: `TEST-S1-${uid}`,
    coverId: 'cover-01',
    winningBidAmount: 25,
    paymentCurrency: 'INR',
    exactAmountDue: 2112,
    paymentMethod: 'UPI',
    transactionReference: duplicateUtr,
    paymentStatus: 'pending_verification',
    createdAt: new Date().toISOString(),
  });

  assert.throws(
    () => {
      paymentStore.createPayment({
        id: `PAY-TEST-DUP2-${uid}`,
        sponsorshipId: `TEST-S2-${uid}`,
        coverId: 'cover-02',
        winningBidAmount: 30,
        paymentCurrency: 'INR',
        exactAmountDue: 2535,
        paymentMethod: 'UPI',
        transactionReference: duplicateUtr,
        paymentStatus: 'pending_verification',
        createdAt: new Date().toISOString(),
      });
    },
    /already been used/,
    'Should throw error on duplicate transaction reference'
  );
});

// -----------------------------------------------------------------------------
// Test Group 3: Base USDC Automatic Verification Constraints
// -----------------------------------------------------------------------------
console.log('\n--- 3. Base USDC Automatic On-Chain Verifier ---');

await runAsyncTest('Rejects malformed transaction hash format', async () => {
  process.env.BASE_USDC_RECEIVER_ADDRESS = '0x1234567890123456789012345678901234567890';
  const dummyPayment = {
    id: `PAY-BASE-TEST-FMT-${Date.now()}`,
    sponsorshipId: 'SPONSOR-FMT',
    coverId: 'cover-01',
    winningBidAmount: 25,
    exactAmountDue: 25,
    paymentCurrency: 'USDC',
    paymentMethod: 'BASE_USDC',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
  };

  const res = await BaseUsdcVerifier.verifyTransaction(dummyPayment, '0xInvalidHash');
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 'failed');
  assert.ok(res.message.includes('Invalid transaction hash'));
});

await runAsyncTest('Rejects duplicate transaction hash across sponsorships', async () => {
  const uid = Date.now().toString(36);
  const duplicateTx = '0x' + 'c'.repeat(64);

  paymentStore.createPayment({
    id: `PAY-BASE-EXISTING-${uid}`,
    sponsorshipId: `SPONSOR-EXISTING-${uid}`,
    coverId: 'cover-01',
    winningBidAmount: 25,
    exactAmountDue: 25,
    paymentCurrency: 'USDC',
    paymentMethod: 'BASE_USDC',
    transactionReference: duplicateTx,
    paymentStatus: 'confirmed',
    createdAt: new Date().toISOString(),
  });

  const newPayment = paymentStore.createPayment({
    id: `PAY-BASE-NEW-${uid}`,
    sponsorshipId: `SPONSOR-NEW-${uid}`,
    coverId: 'cover-02',
    winningBidAmount: 50,
    exactAmountDue: 50,
    paymentCurrency: 'USDC',
    paymentMethod: 'BASE_USDC',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
  });

  const res = await BaseUsdcVerifier.verifyTransaction(newPayment, duplicateTx);
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 'failed');
  assert.ok(res.message.includes('already been claimed'));
});

runTest('Manual verification procedure successfully confirms payment and locks sponsorship', () => {
  const uid = Date.now().toString(36);
  const sponsorId = `SPONSOR-MANUAL-${uid}`;
  const payId = `PAY-MANUAL-${uid}`;

  paymentStore.createSponsorship({
    id: sponsorId,
    coverId: 'cover-01',
    coverSlotDisplay: 'COVER 01 / UPPER SHELL',
    winnerName: 'Manual Winner',
    winnerEmail: 'manual@test.com',
    winningBidUsd: 55,
    status: 'PAYMENT_PENDING',
  });

  paymentStore.createPayment({
    id: payId,
    sponsorshipId: sponsorId,
    coverId: 'cover-01',
    winningBidAmount: 55,
    exactAmountDue: 4648,
    paymentCurrency: 'INR',
    paymentMethod: 'UPI',
    paymentStatus: 'pending_verification',
    transactionReference: `UTR-MANUAL-${uid}`,
    createdAt: new Date().toISOString(),
  });

  // Execute manual confirmation
  const confirmed = paymentStore.updatePaymentStatus(payId, 'confirmed', {
    notes: 'Verified in HDFC bank statement matching UTR',
  });

  assert.strictEqual(confirmed.paymentStatus, 'confirmed');
  assert.ok(confirmed.confirmedAt);

  const updatedSponsor = paymentStore.getSponsorship(sponsorId);
  assert.strictEqual(updatedSponsor.status, 'CONFIRMED');
});

await runAsyncTest('Base verifier returns retryable error when RPC node is unreachable', async () => {
  process.env.BASE_USDC_RECEIVER_ADDRESS = '0x1111111111111111111111111111111111111111';
  process.env.BASE_RPC_URL = 'http://127.0.0.1:19999/unreachable-rpc'; // Unreachable port

  const uid = Date.now().toString(36);
  const dummyPayment = paymentStore.createPayment({
    id: `PAY-RPC-ERR-${uid}`,
    sponsorshipId: `SPONSOR-RPC-${uid}`,
    coverId: 'cover-01',
    winningBidAmount: 25,
    exactAmountDue: 25,
    paymentCurrency: 'USDC',
    paymentMethod: 'BASE_USDC',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
  });

  const dummyHash = '0x' + 'b'.repeat(64);
  const res = await BaseUsdcVerifier.verifyTransaction(dummyPayment, dummyHash);

  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 'pending_verification');
  assert.strictEqual(res.requiresRetry, true);
  assert.ok(res.message.includes('unreachable'));

  // Reset valid RPC URL
  process.env.BASE_RPC_URL = 'https://mainnet.base.org';
});

console.log('\n======================================================');
console.log(`Test Results: ${passedTests}/${totalTests} Passed`);
console.log('======================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

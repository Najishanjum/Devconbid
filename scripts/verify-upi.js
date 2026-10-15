#!/usr/bin/env node
/**
 * PocketBillboard — Secure Server-Side Manual UPI Verification Script
 *
 * Usage:
 *   node scripts/verify-upi.js <paymentId> [optional_notes]
 *
 * Example:
 *   node scripts/verify-upi.js PAY-UPI-SPONSORC01DEVCON-1234 "Bank statement matched UTR 428901847192"
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'payments_db.json');

const args = process.argv.slice(2);
const paymentId = args[0];
const verificationNotes = args.slice(1).join(' ') || 'Manually verified via bank / UPI business app';

if (!paymentId) {
  console.log(`
Usage:
  node scripts/verify-upi.js <paymentId> [notes]

Examples:
  node scripts/verify-upi.js PAY-UPI-SPONSORC01DEVCON-K39A "Verified in HDFC bank app"
`);
  process.exit(1);
}

if (!fs.existsSync(STORE_FILE)) {
  console.error(`Error: Payment database file not found at ${STORE_FILE}`);
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
  const payment = data.payments.find(p => p.id.toLowerCase() === paymentId.toLowerCase());

  if (!payment) {
    console.error(`Error: Payment ID "${paymentId}" was not found.`);
    console.log('\nAvailable payments:');
    data.payments.forEach(p => {
      console.log(` - ID: ${p.id} | Sponsorship: ${p.sponsorshipId} | Status: ${p.paymentStatus} | Method: ${p.paymentMethod}`);
    });
    process.exit(1);
  }

  if (payment.paymentStatus === 'confirmed') {
    console.log(`Payment "${paymentId}" is already CONFIRMED on ${payment.confirmedAt}.`);
    process.exit(0);
  }

  const now = new Date().toISOString();
  payment.paymentStatus = 'confirmed';
  payment.confirmedAt = now;
  payment.lastVerificationAt = now;
  payment.verificationNotes = verificationNotes;

  // Update associated sponsorship status
  const sponsorship = data.sponsorships.find(s => s.id.toLowerCase() === payment.sponsorshipId.toLowerCase());
  if (sponsorship) {
    sponsorship.status = 'CONFIRMED';
  }

  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`
======================================================
  POCKETBILLBOARD — UPI PAYMENT MANUALLY CONFIRMED
======================================================
  Payment ID:       ${payment.id}
  Sponsorship ID:   ${payment.sponsorshipId}
  Amount Due (INR): ₹${payment.exactAmountDue}
  Winning Bid:      $${payment.winningBidAmount} USD
  Submitted UTR:    ${payment.payerUtr || payment.transactionReference || 'N/A'}
  Confirmed At:     ${now}
  Notes:            ${verificationNotes}
  Sponsorship Status: CONFIRMED
======================================================
The sponsorship is now officially marked PAID and CONFIRMED.
`);
} catch (err) {
  console.error('Error verifying payment:', err);
  process.exit(1);
}

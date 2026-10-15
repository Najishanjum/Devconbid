#!/usr/bin/env node
/**
 * PocketBillboard — Operational Sponsorship CLI Manager
 *
 * Usage:
 *   node scripts/manage-sponsorships.js list
 *   node scripts/manage-sponsorships.js create <coverSlot: 01|02|both> <winningBidUsd> <winnerName> <winnerEmail>
 *
 * Examples:
 *   node scripts/manage-sponsorships.js list
 *   node scripts/manage-sponsorships.js create 01 75 "Vitalik Buterin" "vitalik@ethereum.org"
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'payments_db.json');

const args = process.argv.slice(2);
const command = args[0] || 'list';

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let data = { sponsorships: [], payments: [], usedTxHashes: {} };
if (fs.existsSync(STORE_FILE)) {
  try {
    data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error reading database file');
  }
}

if (command === 'list') {
  console.log(`
======================================================
  POCKETBILLBOARD — CONFIRMED SPONSORSHIPS & PAYMENTS
======================================================`);
  if (data.sponsorships.length === 0) {
    console.log('No sponsorships found.');
  } else {
    data.sponsorships.forEach(s => {
      const payment = data.payments.find(p => p.sponsorshipId === s.id);
      console.log(`
  Sponsorship ID:   ${s.id}
  Winner Name:      ${s.winnerName} (${s.winnerEmail})
  Cover Slot:       ${s.coverSlotDisplay}
  Winning Bid:      $${s.winningBidUsd} USD
  Status:           ${s.status}
  Payment Status:   ${payment ? payment.paymentStatus : 'NO PAYMENT CREATED'}
  Payment Method:   ${payment ? payment.paymentMethod : 'N/A'}
  Payment Link:     http://localhost:5173/?pay=${s.id}
------------------------------------------------------`);
    });
  }
} else if (command === 'create') {
  const slot = args[1]; // '01', '02', or 'both'
  const winningBid = parseFloat(args[2]);
  const winnerName = args[3];
  const winnerEmail = args[4];

  if (!slot || isNaN(winningBid) || !winnerName || !winnerEmail) {
    console.error(`
Usage:
  node scripts/manage-sponsorships.js create <01|02|both> <winningBidUsd> <winnerName> <winnerEmail>

Example:
  node scripts/manage-sponsorships.js create 01 80 "ConsenSys" "sponsor@consensys.net"
`);
    process.exit(1);
  }

  const coverId = slot === '01' ? 'cover-01' : slot === '02' ? 'cover-02' : 'both';
  const coverSlotDisplay =
    slot === '01' ? 'COVER 01 / UPPER SHELL' : slot === '02' ? 'COVER 02 / LOWER SHELL' : 'BOTH COVERS / DUAL TAKEOVER';

  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const sponsorshipId = `SPONSOR-C${slot.toUpperCase()}-${randomSuffix}`;

  const newSponsorship = {
    id: sponsorshipId,
    coverId,
    coverSlotDisplay,
    winnerName,
    winnerEmail,
    winningBidUsd: winningBid,
    status: 'PAYMENT_PENDING',
    createdAt: new Date().toISOString(),
  };

  data.sponsorships.push(newSponsorship);
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`
======================================================
  SPONSORSHIP CREATED & PAYMENT LINK GENERATED
======================================================
  Sponsorship ID:   ${sponsorshipId}
  Winner:           ${winnerName} (${winnerEmail})
  Cover:            ${coverSlotDisplay}
  Winning Bid:      $${winningBid} USD
  Status:           PAYMENT_PENDING
  
  👉 UNIQUE SPONSORSHIP PAYMENT LINK:
  http://localhost:5173/?pay=${sponsorshipId}
======================================================
Send this unique link to the winner. They can select INR (UPI) or USDC (Base) to complete checkout.
`);
}

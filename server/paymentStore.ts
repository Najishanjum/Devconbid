import * as fs from 'fs';
import * as path from 'path';
import { PaymentRecord, SponsorshipRecord, PaymentStatus, PaymentMethod } from '../src/types/payment';

interface StoreData {
  sponsorships: SponsorshipRecord[];
  payments: PaymentRecord[];
  usedTxHashes: Record<string, string>; // hash -> paymentId
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'payments_db.json');

export class PaymentStore {
  private data: StoreData;

  constructor() {
    this.data = this.loadData();
    this.seedDefaultSponsorships();
  }

  private loadData(): StoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading payment store file:', e);
    }
    return {
      sponsorships: [],
      payments: [],
      usedTxHashes: {},
    };
  }

  private saveData(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error persisting payment store file:', e);
    }
  }

  private seedDefaultSponsorships(): void {
    // If no sponsorships exist, seed initial sample winning sponsorships for testing
    if (this.data.sponsorships.length === 0) {
      const initialSponsorships: SponsorshipRecord[] = [
        {
          id: 'SPONSOR-C01-DEVCON',
          bidRefId: 'BID-ALICE-01',
          coverId: 'cover-01',
          coverSlotDisplay: 'COVER 01 / UPPER SHELL',
          winnerName: 'Alice Vance',
          winnerEmail: 'alice@vance.dev',
          winningBidUsd: 65,
          status: 'PAYMENT_PENDING',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'SPONSOR-C02-DEVCON',
          bidRefId: 'BID-DAVID-02',
          coverId: 'cover-02',
          coverSlotDisplay: 'COVER 02 / LOWER SHELL',
          winnerName: 'David Chen',
          winnerEmail: 'david@chen.eth',
          winningBidUsd: 45,
          status: 'PAYMENT_PENDING',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      this.data.sponsorships = initialSponsorships;
      this.saveData();
    }
  }

  public getSponsorship(id: string): SponsorshipRecord | undefined {
    return this.data.sponsorships.find(s => s.id.toLowerCase() === id.toLowerCase());
  }

  public getAllSponsorships(): SponsorshipRecord[] {
    return [...this.data.sponsorships];
  }

  public createSponsorship(record: Omit<SponsorshipRecord, 'createdAt'>): SponsorshipRecord {
    const existing = this.getSponsorship(record.id);
    if (existing) {
      throw new Error(`Sponsorship with ID ${record.id} already exists`);
    }

    const sponsorship: SponsorshipRecord = {
      ...record,
      createdAt: new Date().toISOString(),
    };

    this.data.sponsorships.push(sponsorship);
    this.saveData();
    return sponsorship;
  }

  public getPayment(id: string): PaymentRecord | undefined {
    return this.data.payments.find(p => p.id.toLowerCase() === id.toLowerCase());
  }

  public getPaymentBySponsorship(sponsorshipId: string): PaymentRecord | undefined {
    return this.data.payments.find(p => p.sponsorshipId.toLowerCase() === sponsorshipId.toLowerCase());
  }

  public getAllPayments(): PaymentRecord[] {
    return [...this.data.payments];
  }

  public createPayment(payment: PaymentRecord): PaymentRecord {
    // Check constraint: only one active payment session per sponsorship
    const existing = this.getPaymentBySponsorship(payment.sponsorshipId);
    if (existing && existing.paymentStatus === 'confirmed') {
      throw new Error(`Sponsorship ${payment.sponsorshipId} has already been confirmed and paid.`);
    }

    // Constraint: prevent duplicate transaction reference
    if (payment.transactionReference) {
      const ref = payment.transactionReference.toLowerCase();
      if (this.data.usedTxHashes[ref] && this.data.usedTxHashes[ref] !== payment.id) {
        throw new Error(`Transaction reference/hash has already been used for payment ${this.data.usedTxHashes[ref]}.`);
      }
      this.data.usedTxHashes[ref] = payment.id;
    }

    // If an existing unpaid or pending payment exists for this sponsorship, replace or update it
    const index = this.data.payments.findIndex(p => p.id === payment.id || p.sponsorshipId === payment.sponsorshipId);
    if (index >= 0) {
      this.data.payments[index] = payment;
    } else {
      this.data.payments.push(payment);
    }

    // Link payment ID to sponsorship
    const sponsorship = this.getSponsorship(payment.sponsorshipId);
    if (sponsorship) {
      sponsorship.paymentId = payment.id;
    }

    this.saveData();
    return payment;
  }

  public updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    options: {
      transactionReference?: string;
      payerUtr?: string;
      payerTxHash?: string;
      notes?: string;
    } = {}
  ): PaymentRecord {
    const payment = this.getPayment(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    const now = new Date().toISOString();
    payment.paymentStatus = status;
    payment.lastVerificationAt = now;

    if (options.transactionReference) {
      const ref = options.transactionReference.toLowerCase();
      if (this.data.usedTxHashes[ref] && this.data.usedTxHashes[ref] !== paymentId) {
        throw new Error(`Transaction reference ${ref} has already been used by another payment.`);
      }
      payment.transactionReference = options.transactionReference;
      this.data.usedTxHashes[ref] = paymentId;
    }

    if (options.payerUtr) payment.payerUtr = options.payerUtr;
    if (options.payerTxHash) payment.payerTxHash = options.payerTxHash;
    if (options.notes) payment.verificationNotes = options.notes;

    if (status === 'confirmed') {
      payment.confirmedAt = now;
      // Also update the associated sponsorship
      const sponsorship = this.getSponsorship(payment.sponsorshipId);
      if (sponsorship) {
        sponsorship.status = 'CONFIRMED';
      }
    }

    this.saveData();
    return payment;
  }

  public isTxHashUsed(txHash: string, currentPaymentId?: string): boolean {
    const clean = txHash.trim().toLowerCase();
    const existingPaymentId = this.data.usedTxHashes[clean];
    if (!existingPaymentId) return false;
    return existingPaymentId !== currentPaymentId;
  }
}

export const paymentStore = new PaymentStore();

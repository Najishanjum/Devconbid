export type PaymentStatus = 'unpaid' | 'pending_verification' | 'confirmed' | 'failed' | 'expired';

export type PaymentMethod = 'UPI' | 'BASE_USDC';

export type PaymentCurrency = 'INR' | 'USDC';

export interface BlockchainDetails {
  network: string;
  chainId: number;
  tokenContract: string;
  tokenSymbol: string;
  receiverAddress: string;
}

export interface SponsorshipRecord {
  id: string; // e.g. "SPONSOR-C01-8492"
  bidRefId?: string;
  coverId: 'cover-01' | 'cover-02' | 'both';
  coverSlotDisplay: string;
  winnerName: string;
  winnerEmail: string;
  winningBidUsd: number;
  status: 'AWARDED' | 'PAYMENT_PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentId?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface PaymentRecord {
  id: string; // e.g. "PAY-2026-X84J9"
  sponsorshipId: string;
  coverId: 'cover-01' | 'cover-02' | 'both';
  winningBidAmount: number; // in USD
  paymentCurrency: PaymentCurrency;
  exactAmountDue: number; // in INR or USDC
  usdToInrRate?: number;
  paymentMethod: PaymentMethod;
  blockchainDetails?: BlockchainDetails;
  transactionReference?: string; // UTR or Tx Hash
  paymentStatus: PaymentStatus;
  createdAt: string;
  lastVerificationAt?: string;
  confirmedAt?: string;
  verificationNotes?: string;
  payerUtr?: string;
  payerTxHash?: string;
}

export interface PublicPaymentConfig {
  upiConfigured: boolean;
  upiVpa?: string;
  upiPayeeName?: string;
  upiQrImageUrl?: string;
  usdInrRate?: number;
  baseUsdcConfigured: boolean;
  baseReceiverAddress?: string;
  baseChainId: number;
  baseUsdcContract: string;
  baseConfirmationPolicy: number;
}

export interface VerifyUpiRequest {
  paymentId: string;
  utr: string;
}

export interface VerifyBaseUsdcRequest {
  paymentId: string;
  txHash: string;
}

export interface VerificationResponse {
  success: boolean;
  status: PaymentStatus;
  message: string;
  payment?: PaymentRecord;
  requiresRetry?: boolean;
}

import { PaymentRecord, PaymentStatus, VerificationResponse } from '../../src/types/payment';

export interface PaymentInitiationRequest {
  sponsorshipId: string;
  coverId: 'cover-01' | 'cover-02' | 'both';
  winningBidUsd: number;
}

export interface PaymentInitiationResult {
  payment: PaymentRecord;
  instructions: Record<string, any>;
}

export interface IPaymentProvider {
  readonly id: string;
  readonly name: string;
  readonly isEnabled: boolean;

  initiate(request: PaymentInitiationRequest): Promise<PaymentInitiationResult>;
  verify(paymentId: string, payload: Record<string, any>): Promise<VerificationResponse>;
}

/**
 * Gateway Integration Scaffold
 *
 * Implements IPaymentProvider for future commercial payment gateways (e.g. Razorpay, PhonePe Gateway).
 *
 * CRITICAL POLICY:
 * In accordance with project requirements, commercial payment gateways are strictly INACTIVE
 * until confirmed written approval is obtained for this specific sponsorship and auction business model.
 *
 * Requirements before activating:
 * 1. Written provider approval for the campaign's business category.
 * 2. Valid merchant credentials (API keys, Key Secrets).
 * 3. Test-mode verification in staging.
 * 4. Server-side webhook signature verification (e.g., HMAC-SHA256).
 * 5. Verified successful-payment callbacks and idempotent webhook processing.
 */

import { IPaymentProvider, PaymentInitiationRequest, PaymentInitiationResult } from './types';
import { VerificationResponse } from '../../src/types/payment';

export class GatewayPaymentProvider implements IPaymentProvider {
  public readonly id = 'GATEWAY_PENDING';
  public readonly name = 'Commercial Payment Gateway';

  // Strictly disabled until written merchant category approval is confirmed
  public readonly isEnabled = false;

  public async initiate(_request: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
    throw new Error(
      'Payment gateway is not currently active. Gateway integration is held pending written merchant compliance approval. Please use UPI or USDC on Base.'
    );
  }

  public async verify(_paymentId: string, _payload: Record<string, any>): Promise<VerificationResponse> {
    return {
      success: false,
      status: 'failed',
      message: 'Gateway integration is not active. Self-declared or unverified redirects are not accepted.',
    };
  }
}

export const gatewayPaymentProvider = new GatewayPaymentProvider();

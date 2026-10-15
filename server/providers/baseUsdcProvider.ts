import { IPaymentProvider, PaymentInitiationRequest, PaymentInitiationResult } from './types';
import { getServerConfig } from '../paymentConfig';
import { paymentStore } from '../paymentStore';
import { PaymentRecord, VerificationResponse } from '../../src/types/payment';
import { BaseUsdcVerifier } from '../verifier/baseUsdcVerifier';

export class BaseUsdcPaymentProvider implements IPaymentProvider {
  public readonly id = 'BASE_USDC';
  public readonly name = 'USDC on Base';

  public get isEnabled(): boolean {
    return getServerConfig().isBaseConfigured;
  }

  public async initiate(request: PaymentInitiationRequest): Promise<PaymentInitiationResult> {
    const config = getServerConfig();

    if (!config.isBaseConfigured) {
      throw new Error(
        'Base USDC payments are not configured. The organizer must configure BASE_USDC_RECEIVER_ADDRESS in the server environment.'
      );
    }

    const { sponsorshipId, coverId, winningBidUsd } = request;
    // 1:1 nominal for USD winning bid
    const amountUsdc = winningBidUsd;
    const paymentId = `PAY-BASE-${sponsorshipId.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}`;

    const payment: PaymentRecord = {
      id: paymentId,
      sponsorshipId,
      coverId,
      winningBidAmount: winningBidUsd,
      paymentCurrency: 'USDC',
      exactAmountDue: amountUsdc,
      paymentMethod: 'BASE_USDC',
      blockchainDetails: {
        network: 'Base Mainnet',
        chainId: config.baseChainId,
        tokenContract: config.baseUsdcContract,
        tokenSymbol: 'USDC',
        receiverAddress: config.baseReceiverAddress,
      },
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    const savedPayment = paymentStore.createPayment(payment);

    return {
      payment: savedPayment,
      instructions: {
        network: 'Base Mainnet',
        chainId: config.baseChainId,
        tokenContract: config.baseUsdcContract,
        receiverAddress: config.baseReceiverAddress,
        amountUsdc,
        explorerBaseUrl: 'https://basescan.org/tx/',
      },
    };
  }

  public async verify(paymentId: string, payload: { txHash?: string }): Promise<VerificationResponse> {
    const payment = paymentStore.getPayment(paymentId);
    if (!payment) {
      return {
        success: false,
        status: 'failed',
        message: `Payment record ${paymentId} not found.`,
      };
    }

    const txHash = (payload.txHash || '').trim();
    if (!txHash) {
      return {
        success: false,
        status: 'failed',
        message: 'Please provide a valid transaction hash (0x...).',
      };
    }

    // Call real on-chain Base verifier
    return await BaseUsdcVerifier.verifyTransaction(payment, txHash);
  }
}

export const baseUsdcPaymentProvider = new BaseUsdcPaymentProvider();

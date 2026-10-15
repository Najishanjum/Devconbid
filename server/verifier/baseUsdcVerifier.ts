import { createPublicClient, http, parseAbiItem, decodeEventLog } from 'viem';
import { base } from 'viem/chains';
import { getServerConfig } from '../paymentConfig';
import { paymentStore } from '../paymentStore';
import { PaymentRecord, VerificationResponse } from '../../src/types/payment';

const NATIVE_USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'.toLowerCase();
const TRANSFER_EVENT_ABI = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

export class BaseUsdcVerifier {
  public static async verifyTransaction(
    payment: PaymentRecord,
    rawTxHash: string
  ): Promise<VerificationResponse> {
    const config = getServerConfig();

    if (!config.isBaseConfigured) {
      return {
        success: false,
        status: 'failed',
        message: 'Base receiving wallet is not configured by the organizer. On-chain payments cannot be verified.',
      };
    }

    const txHash = rawTxHash.trim().toLowerCase();

    // 1. Validate hash format: 0x followed by 64 hex characters
    if (!/^0x[0-9a-f]{64}$/.test(txHash)) {
      return {
        success: false,
        status: 'failed',
        message: 'Invalid transaction hash format. Must be a 66-character hex string starting with 0x.',
      };
    }

    // 2. Prevent replay attacks / duplicate hash across payments
    if (paymentStore.isTxHashUsed(txHash, payment.id)) {
      paymentStore.updatePaymentStatus(payment.id, 'failed', {
        payerTxHash: txHash,
        notes: 'Transaction hash has already been used for another sponsorship payment.',
      });
      return {
        success: false,
        status: 'failed',
        message: 'This transaction hash has already been claimed for another sponsorship payment.',
      };
    }

    // 3. Connect to Base RPC provider
    const publicClient = createPublicClient({
      chain: base,
      transport: http(config.baseRpcUrl, {
        timeout: 10_000,
        retryCount: 2,
      }),
    });

    let receipt;
    let transaction;
    let currentBlockNumber: bigint;

    try {
      [receipt, transaction, currentBlockNumber] = await Promise.all([
        publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` }).catch(() => null),
        publicClient.getTransaction({ hash: txHash as `0x${string}` }).catch(() => null),
        publicClient.getBlockNumber(),
      ]);
    } catch (rpcErr: any) {
      console.error('Base RPC error:', rpcErr);
      return {
        success: false,
        status: 'pending_verification',
        requiresRetry: true,
        message: `Base RPC service is currently unreachable (${rpcErr.message || 'Network timeout'}). Please retry in a few moments.`,
      };
    }

    // 4. Check if transaction exists
    if (!transaction || !receipt) {
      paymentStore.updatePaymentStatus(payment.id, 'pending_verification', {
        payerTxHash: txHash,
        notes: 'Transaction submitted but not yet found on Base node.',
      });
      return {
        success: false,
        status: 'pending_verification',
        requiresRetry: true,
        message: 'Transaction not yet indexed by Base node or is currently pending in the mempool. Please wait a few seconds and retry.',
      };
    }

    // 5. Verify transaction succeeded on Base (status: 'success' in viem, or 0x1)
    if (receipt.status !== 'success') {
      paymentStore.updatePaymentStatus(payment.id, 'failed', {
        payerTxHash: txHash,
        notes: 'Transaction reverted or failed on Base.',
      });
      return {
        success: false,
        status: 'failed',
        message: 'Transaction failed or was reverted on Base mainnet. Check BaseScan for error details.',
      };
    }

    // 6. Check confirmation / finality policy
    const confirmations = currentBlockNumber - receipt.blockNumber + 1n;
    if (confirmations < BigInt(config.baseConfirmationPolicy)) {
      paymentStore.updatePaymentStatus(payment.id, 'pending_verification', {
        payerTxHash: txHash,
        notes: `Awaiting confirmations: ${confirmations}/${config.baseConfirmationPolicy}`,
      });
      return {
        success: false,
        status: 'pending_verification',
        requiresRetry: true,
        message: `Transaction is waiting for block confirmations (${confirmations.toString()}/${config.baseConfirmationPolicy}). Please retry shortly.`,
      };
    }

    // 7. Parse actual ERC-20 Transfer events from the logs
    // Native USDC on Base contract: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    // USDC uses 6 decimals: 1 USDC = 1,000,000 units (10^6)
    const expectedReceiver = config.baseReceiverAddress.toLowerCase();
    const expectedUsdcAmount = payment.exactAmountDue; // 1:1 nominal for USD winning bid
    const expectedUnits = BigInt(Math.round(expectedUsdcAmount * 1_000_000));

    let foundMatchingTransfer = false;
    let foundReceivedUnits = 0n;
    let matchedTokenContract = false;
    let transferToOtherAddress = false;

    for (const log of receipt.logs) {
      if (log.address.toLowerCase() === NATIVE_USDC_CONTRACT) {
        matchedTokenContract = true;
        try {
          const decoded = decodeEventLog({
            abi: [TRANSFER_EVENT_ABI],
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === 'Transfer') {
            const toAddress = (decoded.args.to as string).toLowerCase();
            const value = decoded.args.value as bigint;

            if (toAddress === expectedReceiver) {
              foundReceivedUnits += value;
              if (foundReceivedUnits >= expectedUnits) {
                foundMatchingTransfer = true;
                break;
              }
            } else {
              transferToOtherAddress = true;
            }
          }
        } catch {
          // Continue scanning logs if an unparseable log is encountered
        }
      }
    }

    // 8. Analyze findings and decide outcome
    if (!matchedTokenContract) {
      paymentStore.updatePaymentStatus(payment.id, 'failed', {
        payerTxHash: txHash,
        notes: 'Transaction did not interact with official native USDC contract on Base.',
      });
      return {
        success: false,
        status: 'failed',
        message: 'Transaction did not transfer native USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913). Bridged tokens or other assets are not accepted.',
      };
    }

    if (!foundMatchingTransfer) {
      if (transferToOtherAddress && foundReceivedUnits === 0n) {
        paymentStore.updatePaymentStatus(payment.id, 'failed', {
          payerTxHash: txHash,
          notes: `USDC was sent to a different address than configured receiver (${config.baseReceiverAddress}).`,
        });
        return {
          success: false,
          status: 'failed',
          message: `USDC transfer was sent to the wrong wallet address instead of ${config.baseReceiverAddress}.`,
        };
      }

      if (foundReceivedUnits > 0n && foundReceivedUnits < expectedUnits) {
        const receivedFormatted = (Number(foundReceivedUnits) / 1_000_000).toFixed(2);
        paymentStore.updatePaymentStatus(payment.id, 'failed', {
          payerTxHash: txHash,
          notes: `Insufficient funds. Expected: ${expectedUsdcAmount} USDC, Received: ${receivedFormatted} USDC.`,
        });
        return {
          success: false,
          status: 'failed',
          message: `Insufficient USDC amount transferred. Expected ${expectedUsdcAmount} USDC, but received ${receivedFormatted} USDC.`,
        };
      }

      paymentStore.updatePaymentStatus(payment.id, 'failed', {
        payerTxHash: txHash,
        notes: 'No valid transfer event matching the recipient address was found.',
      });
      return {
        success: false,
        status: 'failed',
        message: 'No valid ERC-20 transfer event to the configured receiver address was found in this transaction.',
      };
    }

    // 9. All checks passed! Mark payment confirmed and update records
    const updatedPayment = paymentStore.updatePaymentStatus(payment.id, 'confirmed', {
      transactionReference: txHash,
      payerTxHash: txHash,
      notes: `Verified on Base block ${receipt.blockNumber} with ${confirmations} confirmations. Received: ${(Number(foundReceivedUnits) / 1_000_000).toFixed(2)} USDC.`,
    });

    return {
      success: true,
      status: 'confirmed',
      message: `Payment confirmed on Base! Received ${(Number(foundReceivedUnits) / 1_000_000).toFixed(2)} native USDC. Sponsorship is now confirmed.`,
      payment: updatedPayment,
    };
  }
}

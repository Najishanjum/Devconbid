import * as dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  // UPI Configuration
  upiVpa: string;
  upiPayeeName: string;
  upiQrImageUrl?: string;
  usdInrRate: number | null;
  isUpiConfigured: boolean;

  // Base USDC Configuration
  baseReceiverAddress: string;
  baseRpcUrl: string;
  baseConfirmationPolicy: number;
  baseChainId: number;
  baseUsdcContract: string;
  isBaseConfigured: boolean;
}

const NATIVE_BASE_USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const BASE_MAINNET_CHAIN_ID = 8453;

export function getServerConfig(): ServerConfig {
  const upiVpa = (process.env.UPI_VPA || '').trim();
  const upiPayeeName = (process.env.UPI_PAYEE_NAME || '').trim();
  const upiQrImageUrl = (process.env.UPI_QR_IMAGE_URL || '').trim() || undefined;
  
  const rawRate = process.env.USD_INR_RATE ? parseFloat(process.env.USD_INR_RATE) : NaN;
  const usdInrRate = (!isNaN(rawRate) && rawRate > 0) ? rawRate : null;

  const isUpiConfigured = Boolean(upiVpa && upiPayeeName && usdInrRate !== null);

  const baseReceiverAddress = (process.env.BASE_USDC_RECEIVER_ADDRESS || '').trim();
  const baseRpcUrl = (process.env.BASE_RPC_URL || 'https://mainnet.base.org').trim();
  const rawConfirmations = parseInt(process.env.BASE_USDC_CONFIRMATION_POLICY || '1', 10);
  const baseConfirmationPolicy = isNaN(rawConfirmations) || rawConfirmations < 1 ? 1 : rawConfirmations;

  // Validate receiving address format (0x followed by 40 hex characters)
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(baseReceiverAddress);
  const isBaseConfigured = Boolean(isValidAddress && baseRpcUrl);

  return {
    upiVpa,
    upiPayeeName,
    upiQrImageUrl,
    usdInrRate,
    isUpiConfigured,
    baseReceiverAddress,
    baseRpcUrl,
    baseConfirmationPolicy,
    baseChainId: BASE_MAINNET_CHAIN_ID,
    baseUsdcContract: NATIVE_BASE_USDC_CONTRACT,
    isBaseConfigured,
  };
}

import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
  QrCode,
  Wallet,
  Building2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PaymentRecord,
  SponsorshipRecord,
  PublicPaymentConfig,
  PaymentMethod,
  VerificationResponse,
} from '../../types/payment';
import { QrCodeCanvas } from './QrCodeCanvas';

interface PaymentCheckoutModalProps {
  sponsorshipId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  sponsorshipId,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<PublicPaymentConfig | null>(null);
  const [sponsorship, setSponsorship] = useState<SponsorshipRecord | null>(null);
  const [activePayment, setActivePayment] = useState<PaymentRecord | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Form inputs
  const [utrInput, setUtrInput] = useState<string>('');
  const [txHashInput, setTxHashInput] = useState<string>('');

  // UI state
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  // Load public config & sponsorship on open
  useEffect(() => {
    if (!isOpen || !sponsorshipId) return;

    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    async function loadData() {
      try {
        const [configRes, sponsorRes] = await Promise.all([
          fetch('/api/config/public').then((r) => r.json()),
          fetch(`/api/sponsorships/${encodeURIComponent(sponsorshipId!)}`).then((r) => r.json()),
        ]);

        if (!isMounted) return;

        if (configRes.success) {
          setConfig(configRes.config);
        }

        if (sponsorRes.success && sponsorRes.sponsorship) {
          setSponsorship(sponsorRes.sponsorship);
          if (sponsorRes.payment) {
            setActivePayment(sponsorRes.payment);
            setSelectedMethod(sponsorRes.payment.paymentMethod);
            if (sponsorRes.payment.payerUtr) setUtrInput(sponsorRes.payment.payerUtr);
            if (sponsorRes.payment.payerTxHash) setTxHashInput(sponsorRes.payment.payerTxHash);
          }
        } else {
          setErrorMessage(sponsorRes.message || 'Sponsorship reference not found.');
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(`Failed to load payment checkout: ${err.message || 'Network error'}`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, sponsorshipId]);

  // Status polling when payment is in 'pending_verification'
  useEffect(() => {
    if (!isOpen || !activePayment || activePayment.paymentStatus !== 'pending_verification') return;

    const interval = setInterval(async () => {
      try {
        setIsPolling(true);
        const res = await fetch(`/api/payments/${activePayment.id}`);
        const data = await res.json();
        if (data.success && data.payment) {
          setActivePayment(data.payment);
          if (data.payment.paymentStatus === 'confirmed') {
            try {
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#A58BFA', '#10B981', '#3B82F6', '#F59E0B'],
              });
            } catch (e) {
              /* ignore */
            }
          }
        }
      } catch (err) {
        // ignore polling errors
      } finally {
        setIsPolling(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, activePayment?.id, activePayment?.paymentStatus]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSelectMethod = async (method: PaymentMethod) => {
    setSelectedMethod(method);
    setErrorMessage(null);
    setInfoMessage(null);

    // If an active payment for this method already exists, keep it
    if (activePayment && activePayment.paymentMethod === method) {
      return;
    }

    // Initiate payment on backend
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsorshipId: sponsorship!.id,
          paymentMethod: method,
        }),
      });

      const data = await res.json();
      if (data.success && data.payment) {
        setActivePayment(data.payment);
      } else {
        setErrorMessage(data.message || 'Failed to initiate payment.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initiate payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayment) return;

    const trimmedUtr = utrInput.trim();
    if (!trimmedUtr) {
      setErrorMessage('Please enter the 12-digit UPI reference number (UTR).');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setInfoMessage(null);

      const res = await fetch('/api/payments/verify/upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: activePayment.id,
          utr: trimmedUtr,
        }),
      });

      const data: VerificationResponse = await res.json();
      if (data.success && data.payment) {
        setActivePayment(data.payment);
        setInfoMessage(data.message);
      } else {
        setErrorMessage(data.message || 'Verification submission failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error submitting UTR.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBaseUsdcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayment) return;

    const trimmedHash = txHashInput.trim();
    if (!trimmedHash) {
      setErrorMessage('Please enter the transaction hash starting with 0x.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setInfoMessage(null);

      const res = await fetch('/api/payments/verify/base-usdc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: activePayment.id,
          txHash: trimmedHash,
        }),
      });

      const data: VerificationResponse = await res.json();
      if (data.payment) {
        setActivePayment(data.payment);
      }

      if (data.status === 'confirmed') {
        setInfoMessage(data.message);
        try {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10B981', '#A58BFA', '#3B82F6'],
          });
        } catch (e) {
          /* ignore */
        }
      } else if (data.status === 'pending_verification') {
        setInfoMessage(data.message);
      } else {
        setErrorMessage(data.message || 'On-chain verification failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error verifying transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to construct dynamic UPI URI
  const getDynamicUpiUri = () => {
    if (!config?.upiVpa || !activePayment || !sponsorship) return '';
    const payeeName = config.upiPayeeName || 'PocketBillboard';
    const amountInr = activePayment.exactAmountDue;
    const ref = `PB-${sponsorship.id}`;
    return `upi://pay?pa=${encodeURIComponent(config.upiVpa)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amountInr.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      `PocketBillboard ${sponsorship.id}`
    )}&tr=${encodeURIComponent(ref)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1F1E29]/65 backdrop-blur-[6px] overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-[24px] border border-[#ECEBF0] shadow-[0_25px_70px_rgba(0,0,0,0.18)] max-w-2xl w-full my-6 overflow-hidden relative text-[#22212A]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ECEBF0] bg-[#FCFCFD]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#24232E] text-white flex items-center justify-center shadow-saas-sm">
              <ShieldCheck className="w-4 h-4 text-[#A58BFA]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">
                  Official Sponsorship Checkout
                </span>
                {activePayment && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      activePayment.paymentStatus === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : activePayment.paymentStatus === 'pending_verification'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : activePayment.paymentStatus === 'failed'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                    }`}
                  >
                    {activePayment.paymentStatus.replace('_', ' ')}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#22212A]">
                {sponsorship ? sponsorship.coverSlotDisplay : 'Sponsorship Payment'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-7 h-7 text-[#A58BFA] animate-spin mx-auto" />
              <p className="text-sm font-medium text-[#777681]">Loading verified sponsorship details...</p>
            </div>
          ) : errorMessage && !sponsorship ? (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 space-y-3 text-center">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <h3 className="text-base font-bold text-rose-900">Sponsorship Not Found</h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto">{errorMessage}</p>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-2 rounded-full bg-[#24232E] text-white text-xs font-semibold hover:bg-[#353342]"
              >
                Return to Site
              </button>
            </div>
          ) : sponsorship ? (
            <>
              {/* Sponsorship Summary Pill Card */}
              <div className="bg-[#F8F7FA] border border-[#ECEBF0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-[#777681] uppercase tracking-wider">
                    Sponsorship Reference
                  </div>
                  <div className="text-sm font-bold text-[#22212A] flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[#6D28D9]">{sponsorship.id}</span>
                    <button
                      onClick={() => copyToClipboard(sponsorship.id, 'sponsorshipId')}
                      className="text-[#777681] hover:text-[#22212A]"
                      title="Copy reference"
                    >
                      {copiedField === 'sponsorshipId' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-[#777681] mt-1">
                    Awarded to: <strong className="text-[#22212A] font-semibold">{sponsorship.winnerName}</strong> ({sponsorship.winnerEmail})
                  </div>
                </div>

                <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#ECEBF0]">
                  <div className="text-[11px] font-semibold text-[#777681] uppercase tracking-wider">
                    Confirmed Winning Bid
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#22212A] tracking-tight">
                    ${sponsorship.winningBidUsd}{' '}
                    <span className="text-xs font-normal text-[#777681]">USD</span>
                  </div>
                </div>
              </div>

              {/* Status Banner for CONFIRMED */}
              {activePayment?.paymentStatus === 'confirmed' ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-950">
                    Sponsorship Payment Confirmed!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="font-semibold">{sponsorship.winnerName}</strong>! Your payment of{' '}
                    <strong>
                      {activePayment.paymentCurrency === 'INR'
                        ? `₹${activePayment.exactAmountDue}`
                        : `${activePayment.exactAmountDue} USDC`}
                    </strong>{' '}
                    has been verified. Your phone cover sponsorship is officially locked for Devcon Southeast Asia, India Blockchain Week, and ETHGlobal.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-emerald-700">
                    Confirmed at: {new Date(activePayment.confirmedAt || Date.now()).toLocaleString()}
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Choose Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-[#22212A] mb-2.5">
                      1. Select Payment Method
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Card A: UPI (INR) */}
                      <button
                        type="button"
                        onClick={() => handleSelectMethod('UPI')}
                        disabled={!config?.upiConfigured}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          selectedMethod === 'UPI'
                            ? 'bg-[#F0EAF8] border-[#A58BFA] ring-2 ring-[#A58BFA]/50 shadow-saas-sm'
                            : 'bg-white border-[#ECEBF0] hover:border-[#D5CFE8]'
                        } ${!config?.upiConfigured ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#24232E] text-white flex items-center justify-center text-xs font-bold">
                              ₹
                            </div>
                            <span className="text-sm font-bold text-[#22212A]">Pay with UPI</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            INR Fiat
                          </span>
                        </div>
                        <p className="text-xs text-[#777681] leading-relaxed">
                          Scan the QR code using your preferred supported UPI app.
                        </p>
                        {!config?.upiConfigured && (
                          <div className="mt-2 text-[11px] text-amber-700 font-medium">
                            Setup required: UPI_VPA / USD_INR_RATE
                          </div>
                        )}
                      </button>

                      {/* Card B: USDC on Base */}
                      <button
                        type="button"
                        onClick={() => handleSelectMethod('BASE_USDC')}
                        disabled={!config?.baseUsdcConfigured}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          selectedMethod === 'BASE_USDC'
                            ? 'bg-[#F0EAF8] border-[#A58BFA] ring-2 ring-[#A58BFA]/50 shadow-saas-sm'
                            : 'bg-white border-[#ECEBF0] hover:border-[#D5CFE8]'
                        } ${!config?.baseUsdcConfigured ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#0052FF] text-white flex items-center justify-center text-xs font-bold">
                              $
                            </div>
                            <span className="text-sm font-bold text-[#22212A]">Pay with USDC</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Base Mainnet
                          </span>
                        </div>
                        <p className="text-xs text-[#777681] leading-relaxed">
                          Send native USDC on Base from a compatible wallet.
                        </p>
                        {!config?.baseUsdcConfigured && (
                          <div className="mt-2 text-[11px] text-amber-700 font-medium">
                            Setup required: BASE_USDC_RECEIVER_ADDRESS
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Feedback / Alert Banners */}
                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      <div>{errorMessage}</div>
                    </div>
                  )}

                  {infoMessage && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 animate-pulse" />
                      <div>{infoMessage}</div>
                    </div>
                  )}

                  {/* Step 2: Checkout Details & Action depending on selected method */}

                  {/* OPTION A: UPI CHECKOUT SCREEN */}
                  {selectedMethod === 'UPI' && activePayment && (
                    <div className="border border-[#ECEBF0] rounded-2xl p-5 sm:p-6 bg-white space-y-5 animate-in fade-in">
                      <div className="border-b border-[#ECEBF0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider block">
                            Option A · INR via UPI
                          </span>
                          <h3 className="text-lg font-bold text-[#22212A]">
                            UPI Payment Instructions
                          </h3>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-xs text-[#777681]">Amount Payable (INR)</div>
                          <div className="text-2xl font-bold text-[#22212A]">
                            ₹{activePayment.exactAmountDue.toLocaleString('en-IN')}{' '}
                            <span className="text-[11px] font-normal text-[#777681]">
                              (@ ₹{activePayment.usdToInrRate}/$)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* QR Code and Payee Details Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center p-4 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF0] text-center">
                          {config?.upiQrImageUrl ? (
                            <img
                              src={config.upiQrImageUrl}
                              alt="Configured UPI QR"
                              className="w-44 h-44 object-contain rounded-xl border border-white shadow-sm"
                            />
                          ) : (
                            <QrCodeCanvas value={getDynamicUpiUri()} size={180} altText="UPI Payment QR" />
                          )}
                          <div className="mt-3 text-[11px] text-[#777681]">
                            Compatible with PhonePe, Google Pay, Paytm, BHIM & bank apps.
                          </div>
                        </div>

                        {/* Payee Info & Copy Button */}
                        <div className="space-y-3 text-xs">
                          <div className="p-3 bg-[#F8F7FA] rounded-xl border border-[#ECEBF0]">
                            <div className="text-[10px] font-semibold text-[#777681] uppercase">Payee Name</div>
                            <div className="text-sm font-bold text-[#22212A] mt-0.5">
                              {config?.upiPayeeName || 'Configured Payee'}
                            </div>
                          </div>

                          <div className="p-3 bg-[#F8F7FA] rounded-xl border border-[#ECEBF0]">
                            <div className="text-[10px] font-semibold text-[#777681] uppercase">UPI ID (VPA)</div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="font-mono text-sm font-bold text-[#22212A]">
                                {config?.upiVpa}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(config?.upiVpa || '', 'upiVpa')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#ECEBF0] text-[11px] font-semibold hover:bg-zinc-50"
                              >
                                {copiedField === 'upiVpa' ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" /> Copy UPI ID
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="p-3 bg-[#F8F7FA] rounded-xl border border-[#ECEBF0]">
                            <div className="text-[10px] font-semibold text-[#777681] uppercase">Payment Reference</div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="font-mono font-bold text-[#6D28D9]">
                                PB-{sponsorship.id}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(`PB-${sponsorship.id}`, 'payRef')}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] hover:text-[#22212A] text-[#777681]"
                              >
                                {copiedField === 'payRef' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* UTR Input Form */}
                      <form onSubmit={handleUpiSubmit} className="pt-2 border-t border-[#ECEBF0] space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#22212A] mb-1">
                            Bank Reference / UPI UTR Number (12 Digits)
                          </label>
                          <p className="text-[11px] text-[#777681] mb-2">
                            After completing the transfer in your UPI app, paste the 12-digit UTR from your payment receipt below.
                          </p>
                          <input
                            type="text"
                            value={utrInput}
                            onChange={(e) => setUtrInput(e.target.value)}
                            placeholder="e.g. 428901847192"
                            disabled={isSubmitting}
                            className="w-full h-11 px-4 rounded-xl border border-[#ECEBF0] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A58BFA]"
                          />
                        </div>

                        {activePayment.paymentStatus === 'pending_verification' && (
                          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                            <div className="font-bold flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                              Payment details received. Your payment is awaiting verification.
                            </div>
                            <p className="text-[11px] text-amber-800">
                              Your sponsorship is not yet confirmed. The organizer will verify the transfer in their bank app.
                            </p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting || !utrInput.trim()}
                          className="w-full h-11 rounded-full bg-[#24232E] text-white text-xs font-semibold hover:bg-[#353342] transition-colors shadow-saas-sm disabled:opacity-50"
                        >
                          {isSubmitting ? 'Submitting Details...' : "I've completed the payment"}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* OPTION B: USDC ON BASE CHECKOUT SCREEN */}
                  {selectedMethod === 'BASE_USDC' && activePayment && (
                    <div className="border border-[#ECEBF0] rounded-2xl p-5 sm:p-6 bg-white space-y-5 animate-in fade-in">
                      <div className="border-b border-[#ECEBF0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                            Option B · Direct Transfer on Base
                          </span>
                          <h3 className="text-lg font-bold text-[#22212A]">
                            Native USDC Payment
                          </h3>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-xs text-[#777681]">Exact Amount Due</div>
                          <div className="text-2xl font-bold text-[#22212A]">
                            {activePayment.exactAmountDue} USDC{' '}
                            <span className="text-[11px] font-normal text-[#777681]">(1:1 with USD)</span>
                          </div>
                        </div>
                      </div>

                      {/* Critical Warning Callout */}
                      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-blue-600 shrink-0" />
                          Send native USDC on Base only. Sending funds using another network or token may result in loss of funds.
                        </div>
                        <p className="text-[11px] text-blue-800">
                          External wallet transfer supported (MetaMask, Trust Wallet, Phantom, Coinbase Wallet). You do not need to connect your wallet. Ensure your wallet has sufficient ETH on Base for network gas.
                        </p>
                      </div>

                      {/* QR Code and Wallet Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                        <div className="flex flex-col items-center justify-center p-4 bg-[#F8F7FA] rounded-2xl border border-[#ECEBF0] text-center">
                          <QrCodeCanvas
                            value={config?.baseReceiverAddress || ''}
                            size={180}
                            altText="Base Receiving Wallet QR"
                          />
                          <div className="mt-3 text-[11px] text-[#777681]">
                            Scan with your mobile wallet app to send native USDC.
                          </div>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="p-3 bg-[#F8F7FA] rounded-xl border border-[#ECEBF0]">
                            <div className="text-[10px] font-semibold text-[#777681] uppercase">Network</div>
                            <div className="text-xs font-bold text-[#22212A] mt-0.5">
                              Base Mainnet (Chain ID: 8453)
                            </div>
                          </div>

                          <div className="p-3 bg-[#F8F7FA] rounded-xl border border-[#ECEBF0]">
                            <div className="text-[10px] font-semibold text-[#777681] uppercase">Token Asset</div>
                            <div className="text-xs font-bold text-[#22212A] mt-0.5 break-all">
                              Native USDC (Circle: <span className="font-mono text-[11px]">{config?.baseUsdcContract}</span>)
                            </div>
                          </div>

                          <div className="p-3 bg-[#F8F7FA] rounded-xl border border-[#ECEBF0]">
                            <div className="text-[10px] font-semibold text-[#777681] uppercase">Receiving Address</div>
                            <div className="font-mono text-xs font-bold text-[#22212A] break-all mt-0.5">
                              {config?.baseReceiverAddress}
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(config?.baseReceiverAddress || '', 'receiverAddress')}
                              className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#ECEBF0] text-[11px] font-semibold hover:bg-zinc-50"
                            >
                              {copiedField === 'receiverAddress' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" /> Copied Address
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy Base Receiving Address
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Hash Input and Automatic Verifier */}
                      <form onSubmit={handleBaseUsdcSubmit} className="pt-2 border-t border-[#ECEBF0] space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#22212A] mb-1">
                            Base Transaction Hash (0x...)
                          </label>
                          <p className="text-[11px] text-[#777681] mb-2">
                            Once sent from your wallet, paste the transaction hash here for automatic server-side on-chain verification.
                          </p>
                          <input
                            type="text"
                            value={txHashInput}
                            onChange={(e) => setTxHashInput(e.target.value)}
                            placeholder="0x..."
                            disabled={isSubmitting}
                            className="w-full h-11 px-4 rounded-xl border border-[#ECEBF0] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#A58BFA]"
                          />
                        </div>

                        {txHashInput.trim().startsWith('0x') && (
                          <div className="text-[11px]">
                            <a
                              href={`https://basescan.org/tx/${txHashInput.trim()}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              <span>View on BaseScan</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting || !txHashInput.trim()}
                          className="w-full h-11 rounded-full bg-[#24232E] text-white text-xs font-semibold hover:bg-[#353342] transition-colors shadow-saas-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Verifying On-Chain...
                            </>
                          ) : (
                            "I've sent the USDC"
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FCFCFD] border-t border-[#ECEBF0] flex items-center justify-between text-xs text-[#777681]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure settlement · No private keys ever requested</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full hover:bg-[#F8F7FA] text-[#22212A] font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

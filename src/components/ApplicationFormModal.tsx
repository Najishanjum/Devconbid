import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { CoverSlot } from '../types';
import { X, CheckCircle2, AlertCircle, Sparkles, Upload } from 'lucide-react';

interface ApplicationFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen = true,
  onClose,
  isInline = false,
}) => {
  const { covers, submitBid, selectedCoverForBid } = useAuction();

  const cover01 = covers.find(c => c.id === 'cover-01')!;
  const cover02 = covers.find(c => c.id === 'cover-02')!;

  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [preferredCover, setPreferredCover] = useState<CoverSlot>(selectedCoverForBid);
  const [bidAmount, setBidAmount] = useState<number>(25);
  const [note, setNote] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ refId: string; message: string } | null>(null);

  useEffect(() => {
    setPreferredCover(selectedCoverForBid);
  }, [selectedCoverForBid]);

  // Update default minimum bid amount whenever selected cover changes
  useEffect(() => {
    if (preferredCover === '01') {
      const min = cover01.bidsCount > 0 ? cover01.currentBid + 5 : cover01.startingBid;
      setBidAmount(min);
    } else if (preferredCover === '02') {
      const min = cover02.bidsCount > 0 ? cover02.currentBid + 5 : cover02.startingBid;
      setBidAmount(min);
    } else {
      const minBoth = (cover01.bidsCount > 0 ? cover01.currentBid : 25) + 
                      (cover02.bidsCount > 0 ? cover02.currentBid : 25);
      setBidAmount(Math.max(50, minBoth > 50 ? minBoth + 10 : 50));
    }
  }, [preferredCover, cover01.currentBid, cover02.currentBid, cover01.bidsCount, cover02.bidsCount, cover01.startingBid, cover02.startingBid]);

  if (!isOpen && !isInline) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|svg\+xml|webp)$/)) {
      setErrors(prev => ({ ...prev, logo: 'Please upload an SVG, PNG, or JPEG file.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: 'File size must be under 5MB.' }));
      return;
    }

    setLogoFileName(file.name);
    setErrors(prev => {
      const next = { ...prev };
      delete next.logo;
      return next;
    });

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getMinBidText = () => {
    if (preferredCover === '01') {
      return cover01.bidsCount > 0
        ? `Minimum valid next bid: >$${cover01.currentBid} (Current high: $${cover01.currentBid})`
        : `Starting bid: $${cover01.startingBid}`;
    }
    if (preferredCover === '02') {
      return cover02.bidsCount > 0
        ? `Minimum valid next bid: >$${cover02.currentBid} (Current high: $${cover02.currentBid})`
        : `Starting bid: $${cover02.startingBid}`;
    }
    const currentCombined = (cover01.bidsCount > 0 ? cover01.currentBid : 25) +
                            (cover02.bidsCount > 0 ? cover02.currentBid : 25);
    return `Combined starting bid: $50 ($25/cover). Minimum valid next bid: >$${currentCombined}`;
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name or bidder display name is required.';
    if (!workEmail.trim() || !workEmail.includes('@') || !workEmail.includes('.')) {
      errs.workEmail = 'A valid email address is required so we can contact you.';
    }
    if (!agreedTerms) {
      errs.agreedTerms = 'You must agree to the bidding and sponsorship terms.';
    }

    // Cover auction availability check
    if (preferredCover === '01') {
      if (cover01.status !== 'OPEN') {
        errs.cover = 'Cover 01 is currently not open for new bids.';
      } else if (bidAmount < cover01.startingBid) {
        errs.bidAmount = `Starting bid for Cover 01 is $${cover01.startingBid}.`;
      } else if (cover01.bidsCount > 0 && bidAmount <= cover01.currentBid) {
        errs.bidAmount = `Bid must exceed the current highest bid of $${cover01.currentBid}.`;
      }
    } else if (preferredCover === '02') {
      if (cover02.status !== 'OPEN') {
        errs.cover = 'Cover 02 is currently not open for new bids.';
      } else if (bidAmount < cover02.startingBid) {
        errs.bidAmount = `Starting bid for Cover 02 is $${cover02.startingBid}.`;
      } else if (cover02.bidsCount > 0 && bidAmount <= cover02.currentBid) {
        errs.bidAmount = `Bid must exceed the current highest bid of $${cover02.currentBid}.`;
      }
    } else {
      if (cover01.status !== 'OPEN' || cover02.status !== 'OPEN') {
        errs.cover = 'Both covers must be open to place a combined takeover bid.';
      } else {
        const combinedMin = (cover01.bidsCount > 0 ? cover01.currentBid : 25) + 
                            (cover02.bidsCount > 0 ? cover02.currentBid : 25);
        if (bidAmount < 50) {
          errs.bidAmount = 'Combined takeover starts at $50 minimum ($25 per cover).';
        } else if ((cover01.bidsCount > 0 || cover02.bidsCount > 0) && bidAmount <= combinedMin) {
          errs.bidAmount = `Combined bid must exceed the total current combined value of $${combinedMin}.`;
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = submitBid({
        fullName: fullName.trim(),
        workEmail: workEmail.trim(),
        preferredCover,
        bidAmount,
        note: note.trim() || undefined,
        logoDataUrl: logoPreview || undefined,
        agreedTerms,
      });

      setIsSubmitting(false);

      if (result.success && result.refId) {
        setSubmissionSuccess({ refId: result.refId, message: result.message });
      } else {
        setErrors(prev => ({ ...prev, submit: result.message }));
      }
    }, 450);
  };

  const resetForm = () => {
    setSubmissionSuccess(null);
    setFullName('');
    setWorkEmail('');
    setNote('');
    setLogoFileName(null);
    setLogoPreview(null);
    setAgreedTerms(false);
    setErrors({});
    if (onClose) onClose();
  };

  const formContent = (
    <div className="bg-white border border-[#ECEBF0] rounded-[24px] p-6 sm:p-8 shadow-saas-lg relative">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#ECEBF0]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-1">
            Official Bidding Flow
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-[#22212A] tracking-tight">
            Bid for Phone Cover
          </h3>
          <p className="text-xs sm:text-sm text-[#777681] mt-1">
            Starting bid is $25 per cover ($50 combined). Quick submission. Payment is collected only after winning bid confirmation.
          </p>
        </div>

        {!isInline && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {submissionSuccess ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-saas-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h4 className="text-2xl font-bold text-[#22212A] tracking-tight">
            Bid Recorded Successfully
          </h4>

          <div className="bg-[#F8F7FA] border border-[#ECEBF0] p-5 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
            <div><strong className="text-[#22212A]">Reference ID:</strong> <span className="text-[#A58BFA] font-bold">{submissionSuccess.refId}</span></div>
            <div><strong className="text-[#22212A]">Bidder Name:</strong> {fullName}</div>
            <div><strong className="text-[#22212A]">Selected Cover:</strong> {preferredCover === 'both' ? 'Both Covers (Combined Takeover)' : `Cover ${preferredCover}`}</div>
            <div>
              <strong className="text-[#22212A]">Bid Amount:</strong> ${bidAmount} USD
              {preferredCover === 'both' && (
                <span className="text-[#777681] block mt-0.5">Itemized: ${Math.round(bidAmount / 2)} allocated to Cover 01, ${Math.round(bidAmount / 2)} allocated to Cover 02</span>
              )}
            </div>
            <div><strong className="text-[#22212A]">Status:</strong> Recorded & Verified in Auction</div>
          </div>

          <p className="text-xs text-[#777681] max-w-md mx-auto">
            Your bid is active on the live board. We will contact <span className="font-semibold text-[#22212A]">{workEmail}</span> with updates and artwork requirements if you hold the winning bid at close.
          </p>

          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#24232E] text-white text-xs font-semibold hover:bg-[#353342] transition-colors shadow-saas-sm"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {errors.cover && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.cover}</span>
            </div>
          )}

          {/* 1. Selected Cover Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#22212A] mb-2">
              1. Selected Cover
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPreferredCover('01')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preferredCover === '01'
                    ? 'bg-[#F0EAF8] border-[#A58BFA] text-[#22212A] shadow-saas-sm ring-1 ring-[#A58BFA]'
                    : 'bg-white border-[#ECEBF0] text-[#777681] hover:border-[#DDDCE3]'
                }`}
              >
                <div className="text-xs font-bold text-[#22212A]">Cover 01 (Upper)</div>
                <div className="text-[11px] text-[#777681] mt-0.5">
                  Starting: ${cover01.startingBid} · High: ${cover01.currentBid}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredCover('02')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preferredCover === '02'
                    ? 'bg-[#FBF0EA] border-[#D89B30] text-[#22212A] shadow-saas-sm ring-1 ring-[#D89B30]'
                    : 'bg-white border-[#ECEBF0] text-[#777681] hover:border-[#DDDCE3]'
                }`}
              >
                <div className="text-xs font-bold text-[#22212A]">Cover 02 (Lower)</div>
                <div className="text-[11px] text-[#777681] mt-0.5">
                  Starting: ${cover02.startingBid} · High: ${cover02.currentBid}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredCover('both')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preferredCover === 'both'
                    ? 'bg-[#24232E] border-[#24232E] text-white shadow-saas-sm'
                    : 'bg-white border-[#ECEBF0] text-[#777681] hover:border-[#DDDCE3]'
                }`}
              >
                <div className="text-xs font-bold">Both Covers (Combined)</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Starting: $50 ($25 each)
                </div>
              </button>
            </div>
          </div>

          {/* 2. Bid Amount Field with itemized breakdown */}
          <div className="bg-[#F8F7FA] border border-[#ECEBF0] rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <label className="text-xs font-semibold text-[#22212A]">
                2. Your Bid Amount ($ USD)
              </label>
              <span className="text-[11px] text-[#777681]">
                {getMinBidText()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#777681]">
                  $
                </span>
                <input
                  type="number"
                  min={preferredCover === 'both' ? 50 : 25}
                  step="5"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#ECEBF0] text-sm font-semibold text-[#22212A] bg-white focus:outline-none focus:border-[#A58BFA]"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {[10, 25, 50].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setBidAmount(prev => prev + inc)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#ECEBF0] text-xs font-semibold text-[#22212A] hover:bg-[#F2F1F6] transition-colors"
                  >
                    +${inc}
                  </button>
                ))}
              </div>
            </div>

            {preferredCover === 'both' && (
              <div className="mt-2 pt-2 border-t border-[#ECEBF0]/60 text-[11px] text-[#777681] flex items-center justify-between">
                <span>Itemized breakdown:</span>
                <span className="font-semibold text-[#22212A]">
                  Cover 01: ${Math.round(bidAmount / 2)} · Cover 02: ${Math.round(bidAmount / 2)}
                </span>
              </div>
            )}

            {errors.bidAmount && (
              <p className="mt-1.5 text-xs text-red-600">{errors.bidAmount}</p>
            )}
          </div>

          {/* 3. Bidder Identity (Simplified: Full Name & Email only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                Full Name / Bidder Display Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
              />
              {errors.fullName && <p className="text-[11px] text-red-600 mt-0.5">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                Email Address (Confidential) *
              </label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
              />
              {errors.workEmail && <p className="text-[11px] text-red-600 mt-0.5">{errors.workEmail}</p>}
            </div>
          </div>

          {/* Optional Logo File Upload for Back Cover Preview */}
          <div>
            <label className="block text-xs font-medium text-[#22212A] mb-1">
              Optional Sponsor Logo (for preview & print preparation)
            </label>
            <label className="w-full px-3.5 py-2.5 rounded-xl border border-dashed border-[#ECEBF0] bg-white cursor-pointer hover:bg-[#F8F7FA] transition-colors flex items-center justify-between">
              <span className="text-xs truncate text-[#777681]">
                {logoFileName || 'Upload transparent PNG or SVG...'}
              </span>
              <Upload className="w-3.5 h-3.5 text-[#777681] shrink-0" />
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {errors.logo && <p className="text-[11px] text-red-600 mt-0.5">{errors.logo}</p>}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-medium text-[#22212A] mb-1">
              Optional Note or Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Any specific requests, preferences, or questions..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
            />
          </div>

          {/* Terms Agreement Checkbox */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#ECEBF0] text-[#24232E] focus:ring-0"
              />
              <span className="text-xs text-[#777681] leading-relaxed">
                I agree to the bidding and sponsorship terms. Each cover starting price is $25 ($50 combined). Submitting this bid does not immediately charge payment. Upon winning bid confirmation, payment is settled via crypto (USDC / ETH) or fiat.
              </span>
            </label>
            {errors.agreedTerms && <p className="text-[11px] text-red-600 mt-1">{errors.agreedTerms}</p>}
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-6 rounded-full border border-[#ECEBF0] text-xs font-semibold text-[#777681] hover:bg-[#F8F7FA] hover:text-[#22212A] transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none h-11 px-7 rounded-full bg-[#24232E] text-white text-xs font-semibold hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A58BFA]" />
              <span>{isSubmitting ? 'Recording Bid...' : `Submit Bid ($${bidAmount} USD)`}</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[540px] my-6 max-h-[90vh] overflow-y-auto rounded-[24px]"
      >
        {formContent}
      </div>
    </div>
  );
};

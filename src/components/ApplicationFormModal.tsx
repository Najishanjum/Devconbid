import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { CoverSlot } from '../types';
import { X, Upload, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

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
  const [projectName, setProjectName] = useState('');
  const [projectWebsite, setProjectWebsite] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [preferredCover, setPreferredCover] = useState<CoverSlot>(selectedCoverForBid);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['DEVCON', 'IBW_MUMBAI']);
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

  useEffect(() => {
    if (preferredCover === '01') {
      const min = cover01.bidsCount > 0 ? cover01.currentBid + 5 : 25;
      setBidAmount(min);
    } else if (preferredCover === '02') {
      const min = cover02.bidsCount > 0 ? cover02.currentBid + 5 : 25;
      setBidAmount(min);
    } else {
      const minBoth = (cover01.bidsCount > 0 ? cover01.currentBid : 25) + 
                      (cover02.bidsCount > 0 ? cover02.currentBid : 25);
      setBidAmount(Math.max(50, minBoth));
    }
  }, [preferredCover, cover01.currentBid, cover02.currentBid, cover01.bidsCount, cover02.bidsCount]);

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

  const handleEventToggle = (eventName: string) => {
    if (selectedEvents.includes(eventName)) {
      if (selectedEvents.length === 1) return;
      setSelectedEvents(selectedEvents.filter(e => e !== eventName));
    } else {
      setSelectedEvents([...selectedEvents, eventName]);
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!workEmail.trim() || !workEmail.includes('@')) errs.workEmail = 'Valid work email is required.';
    if (!projectName.trim()) errs.projectName = 'Project name is required.';
    if (!projectWebsite.trim() || !projectWebsite.includes('.')) errs.projectWebsite = 'Valid project website URL is required.';
    if (!xHandle.trim()) errs.xHandle = 'X/Twitter handle is required.';
    if (!projectDescription.trim()) errs.projectDescription = 'Short project description is required.';
    if (!agreedTerms) errs.agreedTerms = 'You must agree to the sponsorship terms.';

    if (preferredCover === '01') {
      if (bidAmount < 25) errs.bidAmount = 'Starting bid for Cover 01 is $25.';
      else if (cover01.bidsCount > 0 && bidAmount <= cover01.currentBid) {
        errs.bidAmount = `Bid must exceed current highest bid of $${cover01.currentBid}.`;
      }
    } else if (preferredCover === '02') {
      if (bidAmount < 25) errs.bidAmount = 'Starting bid for Cover 02 is $25.';
      else if (cover02.bidsCount > 0 && bidAmount <= cover02.currentBid) {
        errs.bidAmount = `Bid must exceed current highest bid of $${cover02.currentBid}.`;
      }
    } else {
      const combinedMin = (cover01.bidsCount > 0 ? cover01.currentBid : 25) + 
                          (cover02.bidsCount > 0 ? cover02.currentBid : 25);
      if (bidAmount < 50) {
        errs.bidAmount = 'Combined takeover starts at $50 minimum ($25 each).';
      } else if ((cover01.bidsCount > 0 || cover02.bidsCount > 0) && bidAmount <= combinedMin) {
        errs.bidAmount = `Combined bid must exceed total current value of $${combinedMin}.`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const result = submitBid({
        fullName,
        workEmail,
        projectName,
        projectWebsite,
        xHandle,
        projectDescription,
        preferredCover,
        preferredEvents: selectedEvents,
        bidAmount,
        note,
        logoDataUrl: logoPreview || undefined,
        agreedTerms,
      });

      setIsSubmitting(false);

      if (result.success && result.refId) {
        setSubmissionSuccess({ refId: result.refId, message: result.message });
      } else {
        setErrors(prev => ({ ...prev, submit: result.message }));
      }
    }, 500);
  };

  const resetForm = () => {
    setSubmissionSuccess(null);
    setFullName('');
    setWorkEmail('');
    setProjectName('');
    setProjectWebsite('');
    setXHandle('');
    setProjectDescription('');
    setNote('');
    setLogoFileName(null);
    setLogoPreview(null);
    setAgreedTerms(false);
    setErrors({});
    if (onClose) onClose();
  };

  const formContent = (
    <div className="bg-white border border-[#ECEBF0] rounded-[24px] p-6 sm:p-9 shadow-saas-lg relative">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#ECEBF0]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-1">
            Sponsorship Application
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-[#22212A] tracking-tight">
            Bid for phone cover placement.
          </h3>
          <p className="text-xs sm:text-sm text-[#777681] mt-1">
            Submit your bid below. Starting bid is $25 per cover. Payment is collected only after logo approval.
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
        <div className="text-center py-10 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-saas-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h4 className="text-2xl font-semibold text-[#22212A] tracking-tight">
            Bid Registered Successfully
          </h4>

          <div className="bg-[#F8F7FA] border border-[#ECEBF0] p-5 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
            <div><strong className="text-[#22212A]">Reference ID:</strong> <span className="text-[#A58BFA] font-medium">{submissionSuccess.refId}</span></div>
            <div><strong className="text-[#22212A]">Project:</strong> {projectName}</div>
            <div><strong className="text-[#22212A]">Cover Slot:</strong> {preferredCover === 'both' ? 'Both Covers (Takeover)' : `Cover ${preferredCover}`}</div>
            <div><strong className="text-[#22212A]">Bid Amount:</strong> ${bidAmount} USD</div>
            <div><strong className="text-[#22212A]">Status:</strong> Recorded & Under Review</div>
          </div>

          <p className="text-xs text-[#777681] max-w-md mx-auto">
            A confirmation record has been saved. We will review your project and logo files. You can return anytime to bid higher while the auction remains open.
          </p>

          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] transition-colors shadow-saas-sm"
          >
            Done / Place Another Bid
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

          {/* Cover Selection Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#22212A] mb-2">
              1. Choose Cover Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPreferredCover('01')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preferredCover === '01'
                    ? 'bg-[#F0EAF8] border-[#A58BFA] text-[#22212A] shadow-saas-sm'
                    : 'bg-white border-[#ECEBF0] text-[#777681] hover:border-[#DDDCE3]'
                }`}
              >
                <div className="text-[11px] font-semibold text-[#22212A]">Cover 01 (Upper)</div>
                <div className="text-xs text-[#777681] mt-0.5">
                  High: ${cover01.currentBid} · {cover01.bidsCount} bids
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredCover('02')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preferredCover === '02'
                    ? 'bg-[#FBF0EA] border-[#D89B30] text-[#22212A] shadow-saas-sm'
                    : 'bg-white border-[#ECEBF0] text-[#777681] hover:border-[#DDDCE3]'
                }`}
              >
                <div className="text-[11px] font-semibold text-[#22212A]">Cover 02 (Lower)</div>
                <div className="text-xs text-[#777681] mt-0.5">
                  High: ${cover02.currentBid} · {cover02.bidsCount} bids
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
                <div className="text-[11px] font-semibold">Both Covers (Takeover)</div>
                <div className="text-xs opacity-80 mt-0.5">
                  From $50 combined · Full back
                </div>
              </button>
            </div>
          </div>

          {/* Bid Amount Field */}
          <div className="bg-[#F8F7FA] border border-[#ECEBF0] rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="text-xs font-semibold text-[#22212A]">
                2. Your Bid Amount ($ USD)
              </label>
              <span className="text-xs text-[#777681]">
                {preferredCover === 'both' ? 'Min combined: $50' : `Starting bid: $25 (Min valid: >$${preferredCover === '01' ? cover01.currentBid : cover02.currentBid})`}
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
                    className="px-3 py-2 rounded-xl bg-white border border-[#ECEBF0] text-xs font-medium text-[#22212A] hover:bg-[#F2F1F6] transition-colors"
                  >
                    +${inc}
                  </button>
                ))}
              </div>
            </div>
            {errors.bidAmount && (
              <p className="mt-1.5 text-xs text-red-600">{errors.bidAmount}</p>
            )}
          </div>

          {/* Project Details Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Orbit Wallet"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
              />
              {errors.projectName && <p className="text-[11px] text-red-600 mt-0.5">{errors.projectName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                Project Website *
              </label>
              <input
                type="url"
                placeholder="https://yourproject.io"
                value={projectWebsite}
                onChange={(e) => setProjectWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
              />
              {errors.projectWebsite && <p className="text-[11px] text-red-600 mt-0.5">{errors.projectWebsite}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
              />
              {errors.fullName && <p className="text-[11px] text-red-600 mt-0.5">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                Work Email (Private) *
              </label>
              <input
                type="email"
                placeholder="name@company.xyz"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
              />
              {errors.workEmail && <p className="text-[11px] text-red-600 mt-0.5">{errors.workEmail}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                X / Twitter Handle *
              </label>
              <input
                type="text"
                placeholder="@yourhandle"
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
              />
              {errors.xHandle && <p className="text-[11px] text-red-600 mt-0.5">{errors.xHandle}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#22212A] mb-1">
                Logo Upload (SVG or PNG)
              </label>
              <label className="w-full px-3.5 py-2.5 rounded-xl border border-dashed border-[#ECEBF0] bg-white cursor-pointer hover:bg-[#F8F7FA] transition-colors flex items-center justify-between">
                <span className="text-xs truncate text-[#777681]">
                  {logoFileName || 'Upload vector/PNG file...'}
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
          </div>

          <div>
            <label className="block text-xs font-medium text-[#22212A] mb-1">
              One-Line Project Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Modular account abstraction wallet for DeFi builders"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-xs bg-white focus:outline-none focus:border-[#A58BFA]"
            />
            {errors.projectDescription && <p className="text-[11px] text-red-600 mt-0.5">{errors.projectDescription}</p>}
          </div>

          {/* Event Presence Selection */}
          <div>
            <label className="block text-xs font-medium text-[#22212A] mb-1.5">
              Target Conference Events
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'DEVCON', label: 'Devcon Southeast Asia' },
                { id: 'IBW_MUMBAI', label: 'India Blockchain Week (IBW)' },
                { id: 'ETH_GLOBAL', label: 'ETHGlobal Hackathons' },
              ].map(evt => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => handleEventToggle(evt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    selectedEvents.includes(evt.id)
                      ? 'bg-[#24232E] text-white font-medium shadow-saas-sm'
                      : 'bg-[#F8F7FA] text-[#777681] border border-[#ECEBF0] hover:text-[#22212A]'
                  }`}
                >
                  {selectedEvents.includes(evt.id) ? '✓ ' : '+ '}
                  {evt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#22212A] mb-1">
              Optional Note
            </label>
            <textarea
              rows={2}
              placeholder="Specific color requirements, QR code, or details..."
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
                I understand this is an independent creator sponsorship campaign. Submitting this bid does not immediately charge payment. Upon winning bid confirmation, payment is settled via crypto (USDC / ETH) or fiat.
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
              className="flex-1 sm:flex-none h-11 px-7 rounded-full bg-[#24232E] text-white text-xs font-semibold hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm flex items-center justify-center gap-2 disabled:opacity-60"
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

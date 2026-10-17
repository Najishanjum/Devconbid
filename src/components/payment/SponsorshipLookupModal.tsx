import React, { useState, useEffect } from 'react';
import { X, Search, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { SponsorshipRecord } from '../../types/payment';

interface SponsorshipLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSponsorship: (id: string) => void;
}

export const SponsorshipLookupModal: React.FC<SponsorshipLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectSponsorship,
}) => {
  const [refInput, setRefInput] = useState('');
  const [sponsorships, setSponsorships] = useState<SponsorshipRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/sponsorships')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.sponsorships) {
          setSponsorships(data.sponsorships);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = refInput.trim();
    if (!clean) {
      setError('Please enter your sponsorship reference code.');
      return;
    }
    onSelectSponsorship(clean);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[22px] border border-[#ECEBF0] shadow-[0_20px_50px_rgba(0,0,0,0.18)] max-w-md w-full p-5 sm:p-6 space-y-4 text-[#22212A] max-h-[85vh] overflow-y-auto my-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#ECEBF0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#24232E] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#A58BFA]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#22212A]">Pay Confirmed Sponsorship</h3>
              <p className="text-xs text-[#777681]">Enter your unique reference link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#22212A] mb-1">
              Sponsorship Reference ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={refInput}
                onChange={(e) => {
                  setRefInput(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. SPONSOR-C01-DEVCON"
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-[#ECEBF0] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#A58BFA]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-[#24232E] text-white hover:bg-[#353342] flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>
        </form>

        {/* Quick Click Available Sponsorships (Demo / Winner Reference) */}
        {sponsorships.length > 0 && (
          <div className="pt-2 border-t border-[#ECEBF0] space-y-2">
            <span className="text-[11px] font-bold text-[#777681] uppercase tracking-wider block">
              Active Sponsorship Payment Records:
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sponsorships.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSponsorship(s.id)}
                  className="w-full p-2.5 rounded-xl border border-[#ECEBF0] hover:border-[#A58BFA] hover:bg-[#F8F7FA] text-left transition-all flex items-center justify-between text-xs group"
                >
                  <div>
                    <div className="font-bold text-[#22212A] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#A58BFA]" />
                      <span className="font-mono text-[#6D28D9]">{s.id}</span>
                    </div>
                    <div className="text-[11px] text-[#777681] mt-0.5">
                      {s.coverSlotDisplay} · {s.winnerName} (${s.winningBidUsd})
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6D28D9] group-hover:translate-x-0.5 transition-transform">
                    <span>Pay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-[11px] text-[#777681] pt-1">
          Winning bidders also receive this payment link via direct email notification from the desk.
        </div>
      </div>
    </div>
  );
};

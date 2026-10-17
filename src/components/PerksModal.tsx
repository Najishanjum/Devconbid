import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { PERKS_DATA } from '../data/mockData';
import { X, Smartphone, Compass, Send, Globe, Camera, Layers, Check, Sparkles } from 'lucide-react';

export const PerksModal: React.FC = () => {
  const { isPerksOpen, setIsPerksOpen, setSelectedCoverForBid, setIsBidModalOpen } = useAuction();

  if (!isPerksOpen) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#24232E]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-[#24232E]" />;
      case 'Send': return <Send className="w-5 h-5 text-[#24232E]" />;
      case 'Globe': return <Globe className="w-5 h-5 text-[#24232E]" />;
      case 'Camera': return <Camera className="w-5 h-5 text-[#24232E]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#24232E]" />;
      default: return <Check className="w-5 h-5 text-[#24232E]" />;
    }
  };

  const handleBidNow = () => {
    setIsPerksOpen(false);
    setSelectedCoverForBid('01');
    setIsBidModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-[#ECEBF0] rounded-[24px] p-6 sm:p-8 shadow-saas-lg my-8 max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#ECEBF0] shrink-0">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A58BFA] block mb-1">
              Sponsor Deliverables
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#22212A] tracking-tight">
              What you receive as a sponsor.
            </h2>
            <p className="text-xs sm:text-sm text-[#777681] mt-1">
              Verifiable in-person event presence, physical hardware printing, and digital attribution.
            </p>
          </div>

          <button
            onClick={() => setIsPerksOpen(false)}
            className="p-1.5 rounded-full text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Perks Grid */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERKS_DATA.map((perk) => (
              <div
                key={perk.id}
                className="bg-[#F8F7FA] rounded-[18px] p-5 border border-[#ECEBF0] flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ECEBF0] flex items-center justify-center mb-4 shadow-saas-sm">
                    {getIcon(perk.iconName)}
                  </div>

                  <h3 className="text-sm font-semibold text-[#22212A] tracking-tight mb-1">
                    {perk.title}
                  </h3>

                  <p className="text-xs text-[#777681] leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#ECEBF0] text-[10px] text-[#A2A0AA] font-medium">
                  {perk.badge}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-[#F0EAF8]/50 border border-[#ECEBF0] p-3.5 text-center text-xs text-[#777681]">
            <span>★ Real presence in front of Web3 builders, founders & researchers. No fabricated impressions.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#ECEBF0] flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-[#777681]">
            Starting at $25 per cover
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPerksOpen(false)}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#777681] hover:text-[#22212A]"
            >
              Close
            </button>
            <button
              onClick={handleBidNow}
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] transition-colors shadow-saas-sm"
            >
              Bid for a Cover ($25+)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

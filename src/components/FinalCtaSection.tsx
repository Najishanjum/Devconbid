import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { ArrowRight } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  const { setSelectedCoverForBid, setIsBidModalOpen } = useAuction();

  const handleBidClick = () => {
    setSelectedCoverForBid('01');
    setIsBidModalOpen(true);
  };

  const scrollToFaq = () => {
    const el = document.querySelector('#faq');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto rounded-[32px] bg-[#F0EAF8]/70 border border-[#ECEBF0] py-16 px-6 sm:px-12 text-center relative overflow-hidden">
        
        <div className="max-w-xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block">
            Get Involved
          </span>

          <h2 className="text-3xl sm:text-5xl font-semibold text-[#22212A] tracking-[-0.03em] leading-tight">
            Ready to get your logo out there?
          </h2>

          <p className="text-sm sm:text-base text-[#777681]">
            Two covers. Two sponsorship spots. Starting at $25.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleBidClick}
              className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#24232E] text-white text-sm font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm gap-2"
            >
              <span>Bid for a Cover</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>

            <button
              onClick={scrollToFaq}
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-[#22212A] border border-[#ECEBF0] text-sm font-medium hover:bg-[#F8F7FA] active:scale-[0.98] transition-all shadow-saas-sm"
            >
              Ask a Question
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

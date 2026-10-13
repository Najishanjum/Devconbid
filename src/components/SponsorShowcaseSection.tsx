import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { ExternalLink, Sparkles, ArrowRight } from 'lucide-react';

export const SponsorShowcaseSection: React.FC = () => {
  const { confirmedSponsors, setSelectedCoverForBid, setIsBidModalOpen } = useAuction();

  const handleClaim = () => {
    setSelectedCoverForBid('01');
    setIsBidModalOpen(true);
  };

  return (
    <section id="sponsors" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            The Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            On the phone.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            Verified projects and teams confirmed for the physical phone covers.
          </p>
        </div>

        {/* Empty State vs Confirmed Sponsors */}
        {confirmedSponsors.length === 0 ? (
          <div className="bg-[#F8F7FA] border border-[#ECEBF0] rounded-[24px] p-10 sm:p-14 text-center max-w-xl mx-auto shadow-saas-sm">
            <div className="w-12 h-12 rounded-full bg-white border border-[#ECEBF0] flex items-center justify-center mx-auto mb-4 text-[#A58BFA] shadow-saas-sm">
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-[#22212A] tracking-tight mb-2">
              Your project could be the first one here.
            </h3>

            <p className="text-xs sm:text-sm text-[#777681] max-w-md mx-auto mb-6 leading-relaxed">
              Both Cover 01 and Cover 02 are currently open for bidding starting at $25 each ($50 combined takeover).
            </p>

            <button
              onClick={handleClaim}
              className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm gap-2"
            >
              <span>Bid for a Cover</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {confirmedSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-white rounded-[20px] p-6 border border-[#ECEBF0] shadow-saas hover:shadow-saas-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#ECEBF0]">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0EAF8] text-[#24232E]">
                    {sponsor.coverSlot}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {sponsor.status}
                  </span>
                </div>

                <div className="my-6 py-6 border border-dashed border-[#ECEBF0] rounded-xl text-center bg-[#F8F7FA]">
                  <span className="text-2xl font-bold tracking-tight text-[#22212A]">
                    {sponsor.logoPlaceholder}
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-[#22212A] tracking-tight">
                  {sponsor.projectName}
                </h4>

                <p className="text-xs text-[#777681] mt-1">
                  {sponsor.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-[#ECEBF0] flex items-center justify-between text-xs text-[#777681]">
                  <span>Tour: {sponsor.events}</span>
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#22212A] hover:text-[#A58BFA] flex items-center gap-1 transition-colors"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3 text-[#A2A0AA]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { ExternalLink } from 'lucide-react';

export const SponsorShowcaseSection: React.FC = () => {
  const { confirmedSponsors } = useAuction();

  return (
    <section id="sponsors" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
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

        {/* Clean, quiet empty area vs actual confirmed sponsors */}
        {confirmedSponsors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs sm:text-sm text-[#A2A0AA] font-normal tracking-wide">
              No sponsors confirmed yet · Bidding is currently open
            </p>
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
                  <span>Agreed Coverage: {sponsor.events}</span>
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#22212A] hover:text-[#A58BFA] flex items-center gap-1 transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3 text-[#A2A0AA]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

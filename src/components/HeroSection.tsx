import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { covers, setIsBidModalOpen, setSelectedCoverForBid } = useAuction();
  const cover01 = covers.find(c => c.id === 'cover-01')!;
  const cover02 = covers.find(c => c.id === 'cover-02')!;

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-12 pb-16 px-6 sm:px-8 text-center flex flex-col items-center">
      
      {/* Top Rounded Announcement Pill (directly matching Sniply reference pill) */}
      <div className="mb-6 inline-flex items-center gap-2 bg-white border border-[#ECEBF0] px-4 py-1.5 rounded-full shadow-saas-sm hover:border-[#DDDCE3] transition-colors cursor-default">
        <span className="text-xs">🚀</span>
        <span className="text-xs font-medium text-[#22212A]">
          Independent creator sponsorship
        </span>
        <span className="text-xs text-[#A2A0AA]">·</span>
        <span className="text-xs text-[#777681]">Mumbai Web3 events</span>
        <span className="text-xs text-[#A2A0AA]">→</span>
      </div>

      {/* Main SaaS Headline (Matching Sniply's large, clean, balanced typography) */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-6xl md:text-[68px] font-semibold text-[#22212A] tracking-[-0.035em] leading-[1.08]">
          Your logo, <br />
          <span className="text-[#777681]">on my phone.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#777681] max-w-xl mx-auto leading-relaxed font-normal">
          Two physical phone covers. Two sponsor spots. A new way for Web3 projects to show up in the real world.
        </p>

        <p className="text-xs sm:text-sm text-[#A2A0AA] max-w-lg mx-auto leading-relaxed">
          I'm bringing my phone to Devcon, IBW, and ETHGlobal. Sponsor a cover, get your approved logo printed, and travel with me through the builder community.
        </p>
      </div>

      {/* Primary & Secondary CTA Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            setSelectedCoverForBid('01');
            setIsBidModalOpen(true);
          }}
          className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#24232E] text-white text-sm font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm gap-2"
        >
          <span>Bid for a Cover</span>
          <ArrowRight className="w-4 h-4 text-white/80" />
        </button>

        <button
          onClick={() => scrollToSection('#how-it-works')}
          className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-[#22212A] border border-[#ECEBF0] text-sm font-medium hover:bg-[#F8F7FA] hover:border-[#DDDCE3] active:scale-[0.98] transition-all shadow-saas-sm"
        >
          Explore Sponsorship
        </button>
      </div>

      {/* Reassurance Micro-Copy */}
      <div className="mt-3 text-xs text-[#A2A0AA] font-normal">
        Only 2 spots available · Starting at $25 per cover
      </div>

      {/* Hero Product Showcase on Soft Lavender Panel (Faithfully matching Sniply demo container) */}
      <div className="w-full max-w-[1040px] mt-12 pt-6 pb-8 px-4 sm:px-8 rounded-[28px] sm:rounded-[36px] bg-[#FBF0EA]/60 border border-[#ECEBF0] relative">
        
        {/* Centered Minimal Brand Pill Divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-[1px] w-12 sm:w-20 bg-[#ECEBF0]" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#ECEBF0] text-[11px] font-medium text-[#777681] shadow-saas-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A58BFA]" />
            <span>POCKETBILLBOARD</span>
          </div>
          <div className="h-[1px] w-12 sm:w-20 bg-[#ECEBF0]" />
        </div>

        {/* White Inner Product Card with Studio Shadow */}
        <div className="bg-white rounded-[24px] border border-[#ECEBF0] p-6 sm:p-10 shadow-saas-lg">
          
          {/* Dual Phone Showcase Side-by-Side */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14">
            <PhoneMockup
              slot="01"
              title="Cover 01"
              themeColor="#24232E"
              textColor="#FFFFFF"
              currentBid={cover01.currentBid}
              highestBidder={cover01.highestBidder}
              onBidClick={() => {
                setSelectedCoverForBid('01');
                setIsBidModalOpen(true);
              }}
            />

            <PhoneMockup
              slot="02"
              title="Cover 02"
              themeColor="#F8F7FA"
              textColor="#22212A"
              currentBid={cover02.currentBid}
              highestBidder={cover02.highestBidder}
              onBidClick={() => {
                setSelectedCoverForBid('02');
                setIsBidModalOpen(true);
              }}
            />
          </div>

          {/* Three Compact Information Points Under Mockups */}
          <div className="mt-8 pt-6 border-t border-[#ECEBF0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="py-2 px-3 rounded-xl bg-[#F8F7FA]">
              <div className="text-xl font-semibold text-[#22212A]">02</div>
              <div className="text-xs text-[#777681] mt-0.5 font-medium">available covers</div>
            </div>
            <div className="py-2 px-3 rounded-xl bg-[#F8F7FA]">
              <div className="text-xl font-semibold text-[#22212A]">$25</div>
              <div className="text-xs text-[#777681] mt-0.5 font-medium">starting bid each</div>
            </div>
            <div className="py-2 px-3 rounded-xl bg-[#F8F7FA]">
              <div className="text-xl font-semibold text-[#22212A]">$50</div>
              <div className="text-xs text-[#777681] mt-0.5 font-medium">combined starting total</div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

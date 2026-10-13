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
      

      {/* Main SaaS Headline (Matching the ticket system / Organiser reference style) */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold text-[#22212A] tracking-[-0.035em] leading-[1.12]">
          Your logo, <br className="hidden sm:inline" />
          on my{' '}
          <span className="inline-flex items-center bg-[#E6F7F2] text-[#008767] border border-[#A7E8D6] px-4 py-0.5 sm:py-1 rounded-[22px] font-bold shadow-sm align-middle hover:scale-105 transition-transform duration-200 animate-pulse-glow">
            phone.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#52505C] max-w-xl mx-auto leading-relaxed font-normal">
          Two physical iPhone 16 Pro back covers. Two sponsor spots. A new way for Web3 projects to show up in the real world.
        </p>

        {/* Highlighted & Brightened Sponsorship Tour Callout */}
        <div className="mt-5 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#C4B5FD] shadow-[0_8px_30px_rgba(139,92,246,0.16)] hover:shadow-[0_12px_36px_rgba(139,92,246,0.24)] transition-all duration-300">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D28D9]">
              Physical Sponsorship Tour
            </span>
            <Sparkles className="w-4 h-4 text-[#7C3AED] animate-pulse" />
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#18181B] leading-relaxed">
            I'm bringing my phone to{' '}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-bold text-[#6D28D9] bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm mx-1">
              Devcon
            </span>
            ,{' '}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] shadow-sm mx-1">
              IBW
            </span>
            , and{' '}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] shadow-sm mx-1">
              ETHGlobal
            </span>
            .{' '}
            <span className="text-[#374151] font-medium block sm:inline mt-1 sm:mt-0">
              Sponsor a cover, get your approved logo printed, and travel with me through the builder community.
            </span>
          </p>
        </div>
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
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#ECEBF0] text-[11px] font-semibold tracking-wider text-[#777681] shadow-saas-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A58BFA]" />
            <span>BACKSY</span>
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

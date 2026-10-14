import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { covers, setIsBidModalOpen, setSelectedCoverForBid } = useAuction();
  const cover01 = covers.find(c => c.id === 'cover-01')!;
  const cover02 = covers.find(c => c.id === 'cover-02')!;

  // Dynamic live visitor counter starting from 110 as shown in image 2
  const [watchCount, setWatchCount] = useState<number>(110);

  useEffect(() => {
    // Check localStorage for persisted count, increment on unique session
    const stored = localStorage.getItem('pocketbillboard_watch_count');
    let current = stored ? parseInt(stored, 10) : 110;
    if (isNaN(current) || current < 110) current = 110;

    const hasVisited = sessionStorage.getItem('pocketbillboard_session_visited');
    if (!hasVisited) {
      current += 1;
      localStorage.setItem('pocketbillboard_watch_count', current.toString());
      sessionStorage.setItem('pocketbillboard_session_visited', 'true');
    }
    setWatchCount(current);

    // Subtle realistic occasional view increment
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setWatchCount(prev => {
          const next = prev + 1;
          localStorage.setItem('pocketbillboard_watch_count', next.toString());
          return next;
        });
      }
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-10 pb-16 px-6 sm:px-8 text-center flex flex-col items-center">
      
      {/* 2nd Image Style: Live Count Section "● 110 watched till now ↗" */}
      <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#ECEBF0] shadow-saas-sm hover:border-[#D1D5DB] transition-all cursor-pointer group">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] dot-live-pulse inline-block shrink-0" />
        <span className="text-sm font-extrabold text-[#111111] tracking-tight">
          {watchCount.toLocaleString()}
        </span>
        <span className="text-sm text-[#4B5563] font-normal">
          watched till now
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#111111] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>

      {/* Main SaaS Headline — Styled exactly matching the 1st reference image font & format */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-6xl md:text-[72px] font-extrabold text-[#111111] tracking-[-0.04em] leading-[1.08] font-sans">
          Walking billboard for your brand
        </h1>

        {/* Subtitle with grey inline highlight badges as in Image 1 */}
        <div className="text-base sm:text-xl text-[#374151] max-w-2xl mx-auto leading-relaxed pt-1">
          <span className="inline-block bg-[#EAEAEA] text-[#18181B] px-2.5 py-0.5 rounded-[6px] font-semibold text-sm sm:text-base border border-[#E0E0E0] shadow-xs align-baseline">
            your logo
          </span>{' '}
          on my phone,{' '}
          <span className="inline-block bg-[#EAEAEA] text-[#18181B] px-2.5 py-0.5 rounded-[6px] font-semibold text-sm sm:text-base border border-[#E0E0E0] shadow-xs align-baseline">
            attends the event
          </span>{' '}
          with me at{' '}
          <span className="inline-block bg-[#EAEAEA] text-[#18181B] px-2.5 py-0.5 rounded-[6px] font-semibold text-sm sm:text-base border border-[#E0E0E0] shadow-xs align-baseline">
            Devcon, IBW, and ETHGlobal
          </span>
        </div>

        {/* Physical Sponsorship Tour Card with clean image-styled typography */}
        <div className="mt-6 max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] transition-all duration-300">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#18181B]">
              Physical Sponsorship Tour
            </span>
            <Sparkles className="w-4 h-4 text-[#7C3AED] animate-pulse" />
          </div>
          <p className="text-sm sm:text-base text-[#27272A] leading-relaxed font-normal">
            I'm bringing my phone to{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[#18181B] bg-[#F4F4F5] border border-[#E4E4E7] mx-0.5">
              Devcon
            </span>
            ,{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[#18181B] bg-[#F4F4F5] border border-[#E4E4E7] mx-0.5">
              IBW
            </span>
            , and{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[#18181B] bg-[#F4F4F5] border border-[#E4E4E7] mx-0.5">
              ETHGlobal
            </span>
            .{' '}
            <span className="text-[#52525B] font-medium block sm:inline mt-1 sm:mt-0">
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

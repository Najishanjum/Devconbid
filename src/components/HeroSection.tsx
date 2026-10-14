import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { PhoneMockup } from './PhoneMockup';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

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
      
      {/* Google Antigravity Eyebrow Pill + Live Visitor Counter */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {/* Antigravity Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E4E4E7] shadow-[0_2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#2563EB] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#18181B]">
            YOUR PHONE. YOUR BILLBOARD.
          </span>
        </div>

        {/* Live Audience Activity Counter */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E4E4E7] shadow-[0_2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md text-xs font-medium text-[#52525B]">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] dot-live-pulse inline-block shrink-0" />
          <span className="font-extrabold text-[#111118] tracking-tight">
            {watchCount.toLocaleString()}
          </span>
          <span>watched till now</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#71717A]" />
        </div>
      </div>

      {/* Oversized Antigravity Typography Headline & Supporting Text */}
      <div className="max-w-4xl mx-auto space-y-4 text-center">
        <h1 className="text-[clamp(2.5rem,6.8vw,5.25rem)] font-extrabold text-[#111118] tracking-[-0.04em] leading-[1.04] font-sans selection:bg-[#F0EAF8]">
          Turn your phone into a<br className="hidden sm:inline" /> moving billboard.
        </h1>

        <p className="text-base sm:text-xl text-[#52525B] max-w-2xl mx-auto leading-relaxed font-normal pt-1">
          Discover opportunities, showcase brands, and turn everyday movement into advertising visibility. Two physical modular covers carried across{' '}
          <span className="inline-block bg-[#F4F4F5] text-[#18181B] px-2.5 py-0.5 rounded-[6px] font-semibold text-sm sm:text-base border border-[#E4E4E7] shadow-2xs align-baseline">
            Devcon, IBW, and ETHGlobal
          </span>.
        </p>
      </div>

      {/* Primary & Secondary CTA Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => {
            setSelectedCoverForBid('01');
            setIsBidModalOpen(true);
          }}
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#18181B] text-white text-sm font-semibold hover:bg-[#27272A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] gap-2 group"
        >
          <span>Get Started — Bid for a Cover</span>
          <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => scrollToSection('#how-it-works')}
          className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-white text-[#18181B] border border-[#E4E4E7] text-sm font-medium hover:bg-[#F4F4F5] hover:border-[#D4D4D8] active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          Explore How It Works
        </button>
      </div>

      {/* Reassurance Micro-Copy */}
      <div className="mt-3.5 text-xs text-[#71717A] font-normal">
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

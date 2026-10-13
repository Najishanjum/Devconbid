import React, { useRef, useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Clock, History, ArrowUpRight, Flame, Layers, Sparkles } from 'lucide-react';
import { PhoneCover } from '../types';

interface SpotCardProps {
  cover: PhoneCover;
  slotLabel: string;
  slotPosition: string;
  accentBg: string;
  badgeBg: string;
  onBidClick: () => void;
  onHistoryClick: () => void;
}

const InteractiveSpotCard: React.FC<SpotCardProps> = ({
  cover,
  slotLabel,
  slotPosition,
  accentBg,
  badgeBg,
  onBidClick,
  onHistoryClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate tilt degree between -7 and +7 deg
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-8px) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
        transition: isHovered
          ? 'transform 0.12s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
      }}
      className={`relative rounded-[26px] p-7 sm:p-8 flex flex-col justify-between group overflow-hidden cursor-pointer ${
        isHovered
          ? 'bg-white border-2 border-[#A58BFA] shadow-[0_24px_50px_-12px_rgba(165,139,250,0.28),0_0_20px_rgba(165,139,250,0.15)]'
          : 'bg-white border border-[#ECEBF0] shadow-saas hover:border-[#D5CFE8]'
      }`}
    >
      {/* Dynamic Cursor Spotlight Following Mouse */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[26px] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(165, 139, 250, 0.14), transparent 75%)`,
        }}
      />

      {/* Top Details & Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-[#ECEBF0]">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 ${
                isHovered
                  ? 'bg-[#7C3AED] text-white shadow-sm scale-105'
                  : `${badgeBg} text-[#24232E]`
              }`}
            >
              {slotLabel}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {cover.status}
            </span>
          </div>

          <span
            className={`text-xs font-medium transition-colors duration-200 ${
              isHovered ? 'text-[#7C3AED]' : 'text-[#A2A0AA]'
            }`}
          >
            {slotPosition}
          </span>
        </div>

        {/* Title & Description with smooth magnetic shift */}
        <div className="mt-5">
          <h3
            className={`text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 ${
              isHovered ? 'text-[#6D28D9] translate-x-1.5' : 'text-[#22212A]'
            }`}
          >
            {cover.title}
          </h3>
          <p
            className={`text-xs sm:text-sm mt-1.5 leading-relaxed transition-colors duration-200 ${
              isHovered ? 'text-[#374151]' : 'text-[#777681]'
            }`}
          >
            {cover.description}
          </p>
        </div>

        {/* Dynamic Bid Stats Box */}
        <div
          className={`mt-6 p-4 rounded-2xl border transition-all duration-300 grid grid-cols-2 gap-4 ${
            isHovered
              ? 'bg-[#FBF8FF] border-[#DDD6FE] shadow-sm'
              : 'bg-[#F8F7FA] border-[#ECEBF0]'
          }`}
        >
          <div>
            <span className="text-[11px] font-semibold text-[#A2A0AA] uppercase block">
              Starting Bid
            </span>
            <span className="text-2xl font-bold text-[#22212A] block mt-0.5">
              ${cover.startingBid}
            </span>
          </div>

          <div>
            <span
              className={`text-[11px] font-bold uppercase block transition-colors duration-200 ${
                isHovered ? 'text-[#6D28D9]' : 'text-[#A58BFA]'
              }`}
            >
              Current Highest Bid
            </span>
            <span
              className={`text-2xl sm:text-3xl font-extrabold block mt-0.5 transition-all duration-300 origin-left ${
                isHovered
                  ? 'text-[#6D28D9] scale-110'
                  : 'text-[#24232E]'
              }`}
            >
              ${cover.currentBid}
            </span>
          </div>
        </div>

        {/* Status / Highest Bidder Note */}
        <div className="mt-4 text-xs">
          {cover.bidsCount > 0 ? (
            <div
              className={`flex items-center gap-1.5 font-semibold transition-all duration-200 ${
                isHovered ? 'text-emerald-800 translate-x-1' : 'text-emerald-700'
              }`}
            >
              <Flame
                className={`w-4 h-4 text-amber-500 transition-transform duration-300 ${
                  isHovered ? 'scale-125 rotate-12' : ''
                }`}
              />
              <span>
                Leader: {cover.highestBidder} ({cover.bidsCount} bids)
              </span>
            </div>
          ) : (
            <span className="text-[#A2A0AA] italic">No bids yet. Be the first.</span>
          )}
        </div>
      </div>

      {/* Actions (Bid History & Place Bid) */}
      <div className="mt-8 pt-5 border-t border-[#ECEBF0] flex items-center justify-between gap-3 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHistoryClick();
          }}
          className="text-xs font-medium text-[#777681] hover:text-[#22212A] flex items-center gap-1.5 transition-colors py-1 px-2 rounded-lg hover:bg-[#F8F7FA]"
        >
          <History className="w-3.5 h-3.5 text-[#A2A0AA]" />
          <span>Bid History ({cover.bidsCount})</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBidClick();
          }}
          className={`inline-flex items-center justify-center h-11 px-6 rounded-full text-xs font-semibold transition-all duration-300 shadow-saas-sm gap-2 ${
            isHovered
              ? 'bg-[#6D28D9] text-white shadow-[0_8px_20px_rgba(109,40,217,0.35)] scale-105'
              : 'bg-[#24232E] text-white hover:bg-[#353342]'
          }`}
        >
          <span>Bid on {cover.id === 'cover-01' ? 'Cover 01' : 'Cover 02'}</span>
          <ArrowUpRight
            className={`w-4 h-4 transition-transform duration-300 ${
              isHovered ? 'translate-x-1 -translate-y-1' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export const AuctionSection: React.FC = () => {
  const { covers, openHistoryFor, setSelectedCoverForBid, setIsBidModalOpen } = useAuction();

  const cover01 = covers.find((c) => c.id === 'cover-01')!;
  const cover02 = covers.find((c) => c.id === 'cover-02')!;

  // Takeover Card Mouse Animation State
  const takeoverCardRef = useRef<HTMLDivElement>(null);
  const [takeoverMouse, setTakeoverMouse] = useState({ x: 0, y: 0 });
  const [takeoverHover, setTakeoverHover] = useState(false);
  const [takeoverTilt, setTakeoverTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleTakeoverMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!takeoverCardRef.current) return;
    const rect = takeoverCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTakeoverMouse({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTakeoverTilt({ rotateX, rotateY });
  };

  const handleBidClick = (slot: '01' | '02' | 'both') => {
    setSelectedCoverForBid(slot);
    setIsBidModalOpen(true);
  };

  return (
    <section id="auction" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] block mb-2">
            The Auction
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            Choose your spot.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            Two physical covers. Two independent auctions. Each card responds dynamically as you explore.
          </p>
        </div>

        {/* Closing Deadline Information Banner */}
        <div className="mb-10 bg-[#F8F7FA] border border-[#ECEBF0] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#777681]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#24232E]" />
            <span className="font-medium text-[#22212A]">AUCTION DEADLINE:</span>
            <span>Nov 1, 2026 · 23:59 IST</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-emerald-800">Live Bidding Active</span>
          </div>
        </div>

        {/* Interactive Mouse-Animated Spot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InteractiveSpotCard
            cover={cover01}
            slotLabel="COVER 01 · SLOT A"
            slotPosition="Upper Shell"
            accentBg="#F0EAF8"
            badgeBg="bg-[#F0EAF8]"
            onBidClick={() => handleBidClick('01')}
            onHistoryClick={() => openHistoryFor('cover-01')}
          />

          <InteractiveSpotCard
            cover={cover02}
            slotLabel="COVER 02 · SLOT B"
            slotPosition="Lower Shell"
            accentBg="#FBF0EA"
            badgeBg="bg-[#FBF0EA]"
            onBidClick={() => handleBidClick('02')}
            onHistoryClick={() => openHistoryFor('cover-02')}
          />
        </div>

        {/* Combined Dual Cover Takeover Card with Interactive Mouse Motion */}
        <div
          ref={takeoverCardRef}
          onMouseMove={handleTakeoverMove}
          onMouseEnter={() => setTakeoverHover(true)}
          onMouseLeave={() => {
            setTakeoverHover(false);
            setTakeoverTilt({ rotateX: 0, rotateY: 0 });
          }}
          style={{
            transform: takeoverHover
              ? `perspective(1000px) rotateX(${takeoverTilt.rotateX}deg) rotateY(${takeoverTilt.rotateY}deg) translateY(-4px)`
              : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
            transition: takeoverHover
              ? 'transform 0.12s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out'
              : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
          }}
          className={`mt-8 rounded-[24px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden group cursor-pointer ${
            takeoverHover
              ? 'bg-white border-2 border-[#A58BFA] shadow-[0_20px_45px_-12px_rgba(165,139,250,0.25)]'
              : 'bg-[#FBF0EA]/60 border border-[#ECEBF0]'
          }`}
        >
          {/* Spotlight Effect for Takeover Card */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[24px] transition-opacity duration-300"
            style={{
              opacity: takeoverHover ? 1 : 0,
              background: `radial-gradient(400px circle at ${takeoverMouse.x}px ${takeoverMouse.y}px, rgba(165, 139, 250, 0.12), transparent 75%)`,
            }}
          />

          <div className="flex items-start gap-4 relative z-10">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-saas-sm transition-all duration-300 ${
                takeoverHover
                  ? 'bg-[#6D28D9] text-white scale-110 shadow-[0_4px_16px_rgba(109,40,217,0.3)]'
                  : 'bg-white border border-[#ECEBF0] text-[#24232E]'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={`text-base sm:text-lg font-bold transition-all duration-300 ${
                    takeoverHover ? 'text-[#6D28D9] translate-x-1' : 'text-[#22212A]'
                  }`}
                >
                  Want the entire phone back exclusively?
                </h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Takeover
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-0.5 max-w-xl transition-colors duration-200 ${
                  takeoverHover ? 'text-[#374151]' : 'text-[#777681]'
                }`}
              >
                Sponsor both Cover 01 and Cover 02 together. Starting combined total:{' '}
                <strong className="text-[#22212A] font-bold">$50</strong> ($25 each). Zero co-sponsors. Total physical billboard takeover.
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBidClick('both');
            }}
            className={`w-full sm:w-auto shrink-0 inline-flex items-center justify-center h-11 px-7 rounded-full text-xs font-semibold transition-all duration-300 shadow-saas-sm gap-1.5 relative z-10 ${
              takeoverHover
                ? 'bg-[#6D28D9] text-white shadow-[0_8px_20px_rgba(109,40,217,0.35)] scale-105'
                : 'bg-[#24232E] text-white hover:bg-[#353342]'
            }`}
          >
            <span>Bid on Both Covers ($50+)</span>
            <ArrowUpRight
              className={`w-4 h-4 transition-transform duration-300 ${
                takeoverHover ? 'translate-x-1 -translate-y-1' : ''
              }`}
            />
          </button>
        </div>

      </div>
    </section>
  );
};

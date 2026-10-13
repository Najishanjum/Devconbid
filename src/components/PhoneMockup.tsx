import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Smartphone, Eye } from 'lucide-react';

interface PhoneMockupProps {
  slot: '01' | '02';
  title: string;
  themeColor: string;
  textColor: string;
  currentBid: number;
  highestBidder?: string | null;
  onBidClick?: () => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  slot,
  title,
  themeColor,
  textColor,
  currentBid,
  highestBidder,
  onBidClick,
}) => {
  const isSlot01 = slot === '01';
  const [showHardware, setShowHardware] = useState(false);

  // Real iPhone photo path
  const iphoneImg = isSlot01 ? '/images/iphone_dark.jpg' : '/images/iphone_user.jpg';

  return (
    <div className="relative group flex flex-col items-center">
      
      {/* Top Switcher Tag */}
      <div className="mb-3 flex items-center gap-1 bg-white border border-[#ECEBF0] rounded-full px-2.5 py-1 shadow-saas-sm">
        <button
          type="button"
          onClick={() => setShowHardware(false)}
          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all ${
            !showHardware ? 'bg-[#24232E] text-white' : 'text-[#777681] hover:text-[#22212A]'
          }`}
        >
          Cover {slot}
        </button>
        <button
          type="button"
          onClick={() => setShowHardware(true)}
          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 ${
            showHardware ? 'bg-[#F0EAF8] text-[#24232E]' : 'text-[#777681] hover:text-[#22212A]'
          }`}
        >
          <Eye className="w-3 h-3 text-[#777681]" />
          <span>Device</span>
        </button>
      </div>

      {/* Modern Studio iPhone Body Container */}
      <div className="w-[240px] sm:w-[260px] md:w-[270px] h-[490px] sm:h-[510px] rounded-[42px] bg-[#1A1921] p-2.5 shadow-saas-product border border-[#ECEBF0] flex flex-col justify-between relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        
        {/* Subtle glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-[40px] z-20" />

        {showHardware ? (
          /* Actual iPhone Hardware View */
          <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black flex flex-col justify-between">
            <img
              src={iphoneImg}
              alt={`Physical iPhone for Cover ${slot}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/75 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1 rounded-full border border-white/20 whitespace-nowrap shadow-sm">
              iPhone 16 Pro Hardware
            </div>
          </div>
        ) : (
          /* Sleek Minimalist Custom Cover */
          <div
            style={{ backgroundColor: isSlot01 ? '#24232E' : '#F8F7FA' }}
            className={`relative w-full h-full rounded-[34px] p-4 flex flex-col justify-between border border-black/10 overflow-hidden ${
              isSlot01 ? 'text-white' : 'text-[#22212A]'
            }`}
          >
            {/* Top: Precision Camera Island Cutout */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="w-16 h-16 rounded-[18px] bg-[#121118] border border-black/20 p-1 flex flex-wrap justify-between items-center shadow-inner">
                <div className="w-6 h-6 rounded-full bg-[#1C1B24] border border-[#333]" />
                <div className="w-6 h-6 rounded-full bg-[#1C1B24] border border-[#333]" />
                <div className="w-6 h-6 rounded-full bg-[#1C1B24] border border-[#333]" />
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFEBA3]" />
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isSlot01 ? 'bg-white/15 text-white' : 'bg-black/5 text-[#777681]'
                }`}>
                  COVER {slot}
                </span>
                <div className="text-[11px] font-semibold mt-1">
                  FROM $25
                </div>
              </div>
            </div>

            {/* Center: Clean Sponsor Canvas */}
            <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center text-center">
              {highestBidder ? (
                <div className="w-full bg-white text-[#22212A] p-3.5 rounded-2xl border border-[#ECEBF0] shadow-saas-sm">
                  <span className="text-[9px] uppercase tracking-wider text-[#777681] font-semibold block mb-0.5">
                    CONFIRMED SPONSOR
                  </span>
                  <span className="text-lg font-bold tracking-tight block truncate">
                    {highestBidder}
                  </span>
                  <span className="text-xs font-semibold text-[#A58BFA] block mt-1">
                    Current Bid: ${currentBid}
                  </span>
                </div>
              ) : (
                <div
                  onClick={onBidClick}
                  className={`w-full py-7 px-3 rounded-2xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSlot01
                      ? 'border-white/30 bg-white/5 hover:bg-white/10'
                      : 'border-[#DDDCE3] bg-white hover:bg-[#F2F1F6]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    isSlot01 ? 'bg-white/10 text-white' : 'bg-[#F0EAF8] text-[#24232E]'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight block">
                    Your Logo Here
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isSlot01 ? 'text-white/60' : 'text-[#777681]'}`}>
                    Starting at $25
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Footer Details */}
            <div className="relative z-10 pt-3 border-t border-current/10 flex items-center justify-between text-[10px]">
              <span className="opacity-70 font-medium">Devcon & IBW Tour</span>
              {onBidClick && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBidClick();
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all ${
                    isSlot01
                      ? 'bg-white text-[#22212A] hover:bg-[#F0EAF8]'
                      : 'bg-[#24232E] text-white hover:bg-[#353342]'
                  }`}
                >
                  <span>Bid</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Minimal caption below mockup */}
      <div className="mt-3 text-center">
        <span className="text-xs font-medium text-[#777681]">
          {isSlot01 ? 'Slot A · Upper Case' : 'Slot B · Lower Case'}
        </span>
      </div>
    </div>
  );
};

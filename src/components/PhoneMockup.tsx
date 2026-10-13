import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Eye, ShieldCheck } from 'lucide-react';

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

  // Real iPhone 16 Pro image uploaded by user
  const iphoneImg = isSlot01 ? '/images/iphone_dark.jpg' : '/images/iphone_user.jpg';

  return (
    <div className="relative group flex flex-col items-center">
      
      {/* View Switcher: Fitted Cover vs Titanium Device */}
      <div className="mb-4 flex items-center gap-1.5 bg-white border border-[#ECEBF0] rounded-full p-1 shadow-saas-sm">
        <button
          type="button"
          onClick={() => setShowHardware(false)}
          className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all ${
            !showHardware
              ? 'bg-[#24232E] text-white shadow-sm'
              : 'text-[#777681] hover:text-[#22212A]'
          }`}
        >
          Cover {slot} {isSlot01 ? '(Slot A)' : '(Slot B)'}
        </button>
        <button
          type="button"
          onClick={() => setShowHardware(true)}
          className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
            showHardware
              ? 'bg-[#F0EAF8] text-[#24232E] shadow-sm'
              : 'text-[#777681] hover:text-[#22212A]'
          }`}
        >
          <Eye className="w-3 h-3 text-[#777681]" />
          <span>iPhone 16 Pro</span>
        </button>
      </div>

      {/* Main iPhone 16 Pro Physical Frame Container (with realistic buttons on sides) */}
      <div className="relative">
        
        {/* Left Side Buttons: Action Button + Volume Buttons */}
        <div className="absolute -left-[3px] top-[72px] w-[3px] h-[18px] bg-[#9C9893] rounded-l-[1px]" title="Action Button" />
        <div className="absolute -left-[3px] top-[106px] w-[3px] h-[34px] bg-[#9C9893] rounded-l-[1px]" title="Volume Up" />
        <div className="absolute -left-[3px] top-[152px] w-[3px] h-[34px] bg-[#9C9893] rounded-l-[1px]" title="Volume Down" />

        {/* Right Side Buttons: Power Button + Camera Control */}
        <div className="absolute -right-[3px] top-[110px] w-[3px] h-[48px] bg-[#9C9893] rounded-r-[1px]" title="Side Button" />
        <div className="absolute -right-[3px] top-[280px] w-[3px] h-[36px] bg-[#787470] rounded-r-[2px] opacity-90" title="iPhone 16 Pro Camera Control" />

        {/* iPhone 16 Pro Body Chassis (6.3" Proportions: 270px × 564px) */}
        <div className="w-[264px] sm:w-[276px] h-[550px] sm:h-[564px] rounded-[48px] bg-[#2E2C2A] p-[5px] shadow-saas-product border-[1.5px] border-[#9E9A94] flex flex-col justify-between relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
          
          {/* Titanium Frame Chamfer Ring */}
          <div className="absolute inset-0 rounded-[47px] border border-white/20 pointer-events-none z-30" />
          
          {/* Subtle Studio Glass Specular Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-[45px] z-20" />

          {showHardware ? (
            /* Naked iPhone 16 Pro Hardware from real photo */
            <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-[#1E1C1A] flex flex-col justify-between">
              <img
                src={iphoneImg}
                alt={`Apple iPhone 16 Pro Hardware`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full border border-white/20 whitespace-nowrap shadow-md">
                Apple iPhone 16 Pro · Titanium
              </div>
            </div>
          ) : (
            /* Removable Snap-On Physical Back Cover with Accurate Camera Plateau Cutout */
            <div
              style={{
                backgroundColor: isSlot01 ? '#222634' : '#EFEAE1',
              }}
              className={`relative w-full h-full rounded-[42px] p-4 flex flex-col justify-between border border-black/10 overflow-hidden select-none ${
                isSlot01 ? 'text-white' : 'text-[#22212A]'
              }`}
            >
              {/* Cover Surface Satin Micro-Texture */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />

              {/* Top Row: Accurate iPhone 16 Pro Triple-Lens Camera Plateau Cutout */}
              <div className="relative z-10 flex items-start justify-between">
                
                {/* iPhone 16 Pro Raised Camera Plateau (Triangular 3-Lens Arrangement) */}
                <div className="w-[84px] h-[84px] rounded-[22px] bg-[#161514] border border-[#524E48] p-1.5 relative shadow-inner">
                  {/* Glass plateau sheen */}
                  <div className="absolute inset-0 rounded-[21px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                  {/* Top Lens: Main 48MP Fusion Camera */}
                  <div className="absolute top-2 left-2 w-[30px] h-[30px] rounded-full bg-[#201F1E] border-[1.5px] border-[#66625B] flex items-center justify-center shadow-md">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#080808] border border-[#2B2927] flex items-center justify-center">
                      <div className="w-[8px] h-[8px] rounded-full bg-[#0D182E] border border-blue-900/60" />
                    </div>
                  </div>

                  {/* Bottom-Left Lens: Ultra Wide 48MP Camera */}
                  <div className="absolute bottom-2 left-2 w-[30px] h-[30px] rounded-full bg-[#201F1E] border-[1.5px] border-[#66625B] flex items-center justify-center shadow-md">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#080808] border border-[#2B2927] flex items-center justify-center">
                      <div className="w-[8px] h-[8px] rounded-full bg-[#0A1428] border border-blue-900/50" />
                    </div>
                  </div>

                  {/* Right Lens: 5x Telephoto Tetraprism Camera */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-2 w-[30px] h-[30px] rounded-full bg-[#201F1E] border-[1.5px] border-[#66625B] flex items-center justify-center shadow-md">
                    <div className="w-[18px] h-[18px] rounded-full bg-[#080808] border border-[#2B2927] flex items-center justify-center">
                      <div className="w-[8px] h-[8px] rounded-full bg-[#081224] border border-indigo-900/60" />
                    </div>
                  </div>

                  {/* Top-Right: True Tone Dual Flash */}
                  <div className="absolute top-3 right-3 w-[8px] h-[8px] rounded-full bg-[#FFF2B8] border border-[#9E9060] shadow-[0_0_4px_#FFECA0]" />

                  {/* Bottom-Right: LiDAR Scanner + Mic */}
                  <div className="absolute bottom-3.5 right-3 w-[7px] h-[7px] rounded-full bg-[#262422] border border-[#47433E]" />
                  <div className="absolute bottom-2 right-4 w-[2px] h-[2px] rounded-full bg-[#5C5750]" />
                </div>

                {/* Cover Slot Tag & Pricing */}
                <div className="text-right space-y-1">
                  <div className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                    isSlot01 ? 'bg-white/15 text-white' : 'bg-black/10 text-[#22212A]'
                  }`}>
                    COVER {slot}
                  </div>
                  <div className="text-xs font-bold block tracking-tight">
                    STARTING $25
                  </div>
                  <div className={`text-[10px] block font-medium ${
                    isSlot01 ? 'text-white/70' : 'text-[#777681]'
                  }`}>
                    {isSlot01 ? 'Slot A · Upper Shell' : 'Slot B · Lower Shell'}
                  </div>
                </div>
              </div>

              {/* Center: Unobstructed Physical Sponsor Canvas */}
              <div className="relative z-10 my-auto py-5 flex flex-col items-center justify-center text-center px-1">
                {highestBidder ? (
                  <div className="w-full bg-white text-[#22212A] p-4 rounded-2xl border border-[#ECEBF0] shadow-saas">
                    <div className="text-[10px] uppercase font-semibold text-[#777681] tracking-wider mb-1">
                      APPROVED SPONSOR PRINT
                    </div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tight block truncate">
                      {highestBidder}
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#ECEBF0] flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#008767]">High Bid: ${currentBid}</span>
                      <span className="text-[#777681] text-[11px]">Print Ready</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={onBidClick}
                    className={`w-full py-9 px-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSlot01
                        ? 'border-white/30 bg-white/5 hover:bg-white/10'
                        : 'border-[#CCC5B8] bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
                      isSlot01 ? 'bg-white/15 text-white' : 'bg-[#E6F7F2] text-[#008767]'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-base sm:text-lg font-bold tracking-tight block">
                      YOUR LOGO HERE
                    </span>
                    <span className={`text-[11px] mt-0.5 ${isSlot01 ? 'text-white/70' : 'text-[#777681]'}`}>
                      Click to place a bid ($25+)
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Specs: Event Circuit & Bid Action */}
              <div className="relative z-10 pt-3 border-t border-current/15 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-semibold block">Devcon & IBW Tour</span>
                  <span className="text-[9px] opacity-75">Physical UV Printed Cover</span>
                </div>

                {onBidClick && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBidClick();
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all shadow-sm ${
                      isSlot01
                        ? 'bg-white text-[#22212A] hover:bg-[#F0EAF8]'
                        : 'bg-[#24232E] text-white hover:bg-[#353342]'
                    }`}
                  >
                    <span>Bid</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Label under mockup */}
      <div className="mt-3 text-center space-y-0.5">
        <span className="text-xs font-semibold text-[#22212A] block">
          iPhone 16 Pro · Cover {slot}
        </span>
        <span className="text-[11px] text-[#777681] block">
          Starting bid: $25 USD
        </span>
      </div>
    </div>
  );
};

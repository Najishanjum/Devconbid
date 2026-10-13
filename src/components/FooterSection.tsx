import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const { setIsAdminOpen, setIsPerksOpen } = useAuction();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-14 px-6 sm:px-8 bg-white text-[#777681]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#ECEBF0]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#24232E] flex items-center justify-center text-white">
                <div className="w-2 h-2 rounded-sm bg-[#A58BFA] rotate-45" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-[#22212A]">
                POCKETBILLBOARD
              </span>
            </div>
            <p className="text-xs text-[#777681] max-w-sm leading-relaxed">
              Two physical smartphone back covers sponsored by Web3 protocols and carried throughout Devcon, India Blockchain Week, and ETHGlobal.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <span className="font-semibold text-[#22212A] block mb-1">Navigation</span>
            <div><a href="#how-it-works" className="hover:text-[#22212A] transition-colors">How It Works</a></div>
            <div><a href="#auction" className="hover:text-[#22212A] transition-colors">The Auction</a></div>
            <div>
              <button onClick={() => setIsPerksOpen(true)} className="hover:text-[#22212A] transition-colors text-left">
                Sponsor Perks
              </button>
            </div>
            <div><a href="#events" className="hover:text-[#22212A] transition-colors">Tour Events</a></div>
            <div><a href="#faq" className="hover:text-[#22212A] transition-colors">FAQs</a></div>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-4 space-y-2.5 text-xs">
            <span className="font-semibold text-[#22212A] block mb-1">Creator & Admin</span>
            <div><a href="https://x.com/Najish_anjum" target="_blank" rel="noreferrer" className="hover:text-[#22212A] transition-colors">𝕏 @Najish_anjum</a></div>
            <div><a href="https://t.me/Najish_anjum" target="_blank" rel="noreferrer" className="hover:text-[#22212A] transition-colors">Telegram @Najish_anjum</a></div>
            <div><a href="https://github.com/Najishanjum" target="_blank" rel="noreferrer" className="hover:text-[#22212A] transition-colors">GitHub: Najishanjum</a></div>
            <div><a href="mailto:najishanjum058@gmail.com" className="hover:text-[#22212A] transition-colors">najishanjum058@gmail.com</a></div>
            <div>
              <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#22212A] transition-colors inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#A2A0AA]" />
                <span>Admin Operations</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Footer Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A2A0AA]">
          <div>
            © {currentYear} POCKETBILLBOARD. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="hover:text-[#22212A] transition-colors inline-flex items-center gap-1 font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-3 text-[11px] text-[#A2A0AA] leading-relaxed">
          POCKETBILLBOARD is an independent personal creator initiative. It is not affiliated with, sponsored by, or endorsed by the Ethereum Foundation, Devcon, India Blockchain Week (IBW), or ETHGlobal.
        </div>

      </div>
    </footer>
  );
};

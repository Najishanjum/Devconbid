import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { ArrowUp, X, ShieldAlert } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const { setIsPerksOpen } = useAuction();
  const currentYear = new Date().getFullYear();
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Privacy Policy',
      content: 'PocketBillboard respects your privacy. All contact information (such as your full name and email address) submitted during the bidding process is treated as confidential and is used solely to contact winning bidders regarding logo review and printing specifications. We do not sell, share, or publish private bidder details. Approved public sponsor logos and names are displayed exclusively with written permission.'
    });
  };

  const openTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({
      title: 'Sponsorship & Bidding Terms',
      content: 'PocketBillboard offers two physical back cover spots on an Apple iPhone 16 Pro, carried across selected Web3 developer conferences. Each cover starts at $25 USD ($50 combined starting total). Submitting a bid records an intent to sponsor. Payment is settled via cryptocurrency (USDC / ETH) or fiat upon winning bid confirmation. PocketBillboard reserves the right to reject submissions that promote illegal activities, scams, or violate community guidelines.'
    });
  };

  return (
    <footer className="py-14 px-6 sm:px-8 bg-white text-[#777681]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#ECEBF0]">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#24232E] flex items-center justify-center text-white">
                <div className="w-2 h-2 rounded-sm bg-[#A58BFA] rotate-45" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[#22212A]">
                PocketBillboard
              </span>
            </div>
            <p className="text-xs text-[#777681] max-w-sm leading-relaxed">
              Two physical iPhone 16 Pro back covers sponsored by Web3 protocols and carried throughout Devcon, India Blockchain Week, and ETHGlobal.
            </p>
          </div>

          {/* Links Column 1: Exploration */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <span className="font-semibold text-[#22212A] block mb-1">Explore</span>
            <div><a href="#hero" className="hover:text-[#22212A] transition-colors">Home</a></div>
            <div><a href="#how-it-works" className="hover:text-[#22212A] transition-colors">How It Works</a></div>
            <div><a href="#why-sponsor" className="hover:text-[#22212A] transition-colors">Why You Should</a></div>
            <div><a href="#auction" className="hover:text-[#22212A] transition-colors">Available Covers</a></div>
            <div><a href="#configurator" className="hover:text-[#22212A] transition-colors">3D Interactive Viewer</a></div>
            <div>
              <button onClick={() => setIsPerksOpen(true)} className="hover:text-[#22212A] transition-colors text-left">
                Sponsor Perks
              </button>
            </div>
            <div><a href="#faq" className="hover:text-[#22212A] transition-colors">FAQs</a></div>
          </div>

          {/* Links Column 2: Legal & Trust */}
          <div className="md:col-span-2 space-y-2.5 text-xs">
            <span className="font-semibold text-[#22212A] block mb-1">Trust & Policy</span>
            <div>
              <button onClick={openPrivacy} className="hover:text-[#22212A] transition-colors text-left">
                Privacy Policy
              </button>
            </div>
            <div>
              <button onClick={openTerms} className="hover:text-[#22212A] transition-colors text-left">
                Sponsorship Terms
              </button>
            </div>
            <div>
              <a href="mailto:najishanjum058@gmail.com" className="hover:text-[#22212A] transition-colors">
                Contact Sponsor Desk
              </a>
            </div>
          </div>

          {/* Links Column 3: Community & Social Profiles */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <span className="font-semibold text-[#22212A] block mb-1">Social Profiles</span>
            <div><a href="https://x.com/Najish_anjum" target="_blank" rel="noreferrer" className="hover:text-[#22212A] transition-colors">𝕏 @Najish_anjum</a></div>
            <div><a href="https://t.me/Najish_anjum" target="_blank" rel="noreferrer" className="hover:text-[#22212A] transition-colors">Telegram @Najish_anjum</a></div>
            <div><a href="https://github.com/Najishanjum" target="_blank" rel="noreferrer" className="hover:text-[#22212A] transition-colors">GitHub @Najishanjum</a></div>
            <div><a href="mailto:najishanjum058@gmail.com" className="hover:text-[#22212A] transition-colors">Email Organizer</a></div>
          </div>

        </div>

        {/* Bottom Footer Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A2A0AA]">
          <div>
            © {currentYear} PocketBillboard. All rights reserved.
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
          PocketBillboard is an independent personal creator initiative. It is not affiliated with, sponsored by, or endorsed by the Ethereum Foundation, Devcon, India Blockchain Week (IBW), or ETHGlobal.
        </div>

      </div>

      {/* Lightweight Public Modal for Privacy & Terms */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] border border-[#ECEBF0] p-6 max-w-md w-full shadow-saas-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECEBF0]">
              <h3 className="text-lg font-bold text-[#22212A]">
                {modalContent.title}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 rounded-full text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#52505C] leading-relaxed">
              {modalContent.content}
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setModalContent(null)}
                className="px-5 py-2 rounded-full bg-[#24232E] text-white text-xs font-semibold hover:bg-[#353342]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Menu, X } from 'lucide-react';

export const SiteNavigation: React.FC = () => {
  const { setIsBidModalOpen, setSelectedCoverForBid, setIsPerksOpen } = useAuction();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Why Sponsor', href: '#why-sponsor' },
    { name: 'Auction', href: '#auction' },
    { name: '3D Configurator', href: '#configurator' },
    { name: 'Sponsor Perks', href: '#perks', isPerksTrigger: true },
    { name: 'FAQs', href: '#faq' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);

    if (link.isPerksTrigger) {
      setIsPerksOpen(true);
      return;
    }

    const element = document.querySelector(link.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetSpot = () => {
    setSelectedCoverForBid('01');
    setIsBidModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#ECEBF0] transition-all">
      <div className="max-w-[1140px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Minimal geometric mark */}
        <div className="flex items-center gap-3">
          <a 
            href="#hero" 
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
            title="PocketBillboard Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#24232E] flex items-center justify-center text-white shadow-sm">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#A58BFA] rotate-45" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[#22212A]">
              PocketBillboard
            </span>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#777681]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link);
              }}
              className="hover:text-[#22212A] transition-colors py-1 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Actions: Dark Pill Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGetSpot}
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#24232E] text-white text-[13px] font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm"
          >
            Bid for a Cover
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA] transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#ECEBF0] px-6 py-4 space-y-2 shadow-lg">
          <div className="flex flex-col gap-1.5 text-sm font-medium text-[#777681]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link);
                }}
                className="py-2 px-3 rounded-lg hover:bg-[#F8F7FA] hover:text-[#22212A] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

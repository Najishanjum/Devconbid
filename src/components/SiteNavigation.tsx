import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const SiteNavigation: React.FC = () => {
  const { setIsBidModalOpen, setSelectedCoverForBid, setIsAdminOpen, setIsPerksOpen } = useAuction();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Auction', href: '#auction' },
    { name: 'Sponsor Perks', href: '#perks', isPerksTrigger: true },
    { name: 'Events', href: '#events' },
    { name: 'About', href: '#about' },
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
        
        {/* Brand Logo - Minimal geometric mark inspired by reference */}
        <div className="flex items-center gap-3">
          <a 
            href="#hero" 
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-85"
            title="Backsy Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#24232E] flex items-center justify-center text-white shadow-sm">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#A58BFA] rotate-45" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-[#22212A]">
              Backsy
            </span>
          </a>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#777681]">
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

        {/* Right Actions: Admin link & Dark Pill Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-[#777681] hover:text-[#22212A] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A2A0AA]" />
            <span>Admin</span>
          </button>

          <button
            onClick={handleGetSpot}
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#24232E] text-white text-[13px] font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm"
          >
            Get a Spot
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
        <div className="md:hidden bg-white border-b border-[#ECEBF0] px-6 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col gap-2 text-sm font-medium text-[#777681]">
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
            
            <div className="pt-2 border-t border-[#ECEBF0] flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="text-xs text-[#777681] hover:text-[#22212A] font-medium"
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

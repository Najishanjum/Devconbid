import React from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { SiteNavigation } from './components/SiteNavigation';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AuctionSection } from './components/AuctionSection';
import { PerksSection } from './components/PerksSection';
import { EventsSection } from './components/EventsSection';
import { AboutSection } from './components/AboutSection';
import { SponsorShowcaseSection } from './components/SponsorShowcaseSection';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { FAQSection } from './components/FAQSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { FooterSection } from './components/FooterSection';
import { BidHistoryModal } from './components/BidHistoryModal';
import { AdminModal } from './components/AdminModal';
import { PerksModal } from './components/PerksModal';

const MainLayout: React.FC = () => {
  const { isBidModalOpen, setIsBidModalOpen } = useAuction();

  return (
    /* Outer Desktop Canvas Shell on Deep Charcoal Backdrop (#1F1E29) */
    <div className="min-h-screen bg-[#1F1E29] py-3 sm:py-8 md:py-10 px-2 sm:px-6 md:px-8 flex justify-center selection:bg-[#F0EAF8] selection:text-[#24232E]">
      
      {/* Central Large White Website Canvas with Rounded Corners (inspired by Sniply screenshot) */}
      <div className="w-full max-w-[1160px] bg-white rounded-[14px] sm:rounded-[20px] shadow-2xl flex flex-col relative overflow-hidden border border-[#2D2B3B]/40">
        
        {/* Navigation Bar */}
        <SiteNavigation />

        {/* Hero Section */}
        <HeroSection />

        {/* Minimal Trust & Campaign Details Strip */}
        <TrustStrip />

        {/* Section: How It Works */}
        <HowItWorksSection />

        {/* Section: Sponsorship Auction */}
        <AuctionSection />

        {/* Section: Sponsor Perks */}
        <PerksSection />

        {/* Section: Events Circuit */}
        <EventsSection />

        {/* Section: About the Creator */}
        <AboutSection />

        {/* Section: Confirmed Sponsors Showcase */}
        <SponsorShowcaseSection />

        {/* Section: FAQs Accordion */}
        <FAQSection />

        {/* Final CTA Section */}
        <FinalCtaSection />

        {/* Minimal SaaS Footer */}
        <FooterSection />

        {/* Interactive Modals */}
        {isBidModalOpen && (
          <ApplicationFormModal isOpen={isBidModalOpen} onClose={() => setIsBidModalOpen(false)} />
        )}
        <BidHistoryModal />
        <AdminModal />
        <PerksModal />

      </div>

    </div>
  );
};

export default function App() {
  return (
    <AuctionProvider>
      <MainLayout />
    </AuctionProvider>
  );
}

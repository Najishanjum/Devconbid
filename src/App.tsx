import React from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { ParticleBackground } from './components/ParticleBackground';
import { SiteNavigation } from './components/SiteNavigation';
import { HeroSection } from './components/HeroSection';
import { TrustStrip } from './components/TrustStrip';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhyYouShouldSection } from './components/WhyYouShouldSection';
import { AuctionSection } from './components/AuctionSection';
import { Phone3DSection } from './components/Phone3DSection';
import { AboutSection } from './components/AboutSection';
import { SponsorShowcaseSection } from './components/SponsorShowcaseSection';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { FAQSection } from './components/FAQSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { FooterSection } from './components/FooterSection';
import { BidHistoryModal } from './components/BidHistoryModal';
import { PerksModal } from './components/PerksModal';
import { PaymentCheckoutModal } from './components/payment/PaymentCheckoutModal';
import { SponsorshipLookupModal } from './components/payment/SponsorshipLookupModal';

const MainLayout: React.FC = () => {
  const {
    isBidModalOpen,
    setIsBidModalOpen,
    activePaymentSponsorshipId,
    closePayment,
    openPaymentFor,
    isPaymentLookupOpen,
    setIsPaymentLookupOpen,
  } = useAuction();

  return (
    /* Outer Desktop Canvas Shell with clean Antigravity light background */
    <div className="min-h-screen bg-[#FCFCFD] py-2 sm:py-6 md:py-8 px-2 sm:px-6 md:px-8 flex justify-center selection:bg-[#F0EAF8] selection:text-[#18181B] relative overflow-x-hidden">
      
      {/* Full-viewport Interactive Particle Background (Google Antigravity Inspired) */}
      <ParticleBackground />

      {/* Central Large White Website Canvas with semi-translucent backdrop */}
      <div className="w-full max-w-[1160px] bg-white/85 backdrop-blur-[3px] rounded-[16px] sm:rounded-[24px] shadow-[0_20px_70px_rgba(0,0,0,0.05)] flex flex-col relative z-10 border border-[#E4E4E7]/80">
        
        {/* Navigation Bar */}
        <SiteNavigation />

        {/* Hero Section */}
        <HeroSection />

        {/* Minimal Trust & Campaign Details Strip */}
        <TrustStrip />

        {/* Section: How It Works */}
        <HowItWorksSection />

        {/* Section: Why You Should — NEW */}
        <WhyYouShouldSection />

        {/* Section: Sponsorship Auction */}
        <AuctionSection />

        {/* Section: Interactive 3D Phone Viewer — NEW */}
        <Phone3DSection />

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

        {/* Interactive Modals — no admin modal */}
        {isBidModalOpen && (
          <ApplicationFormModal isOpen={isBidModalOpen} onClose={() => setIsBidModalOpen(false)} />
        )}
        <BidHistoryModal />
        <PerksModal />

        {/* Verified Sponsorship Payment Checkout Modal */}
        {activePaymentSponsorshipId && (
          <PaymentCheckoutModal
            isOpen={Boolean(activePaymentSponsorshipId)}
            sponsorshipId={activePaymentSponsorshipId}
            onClose={closePayment}
          />
        )}

        {/* Sponsorship Lookup / Payment Link Finder Modal */}
        {isPaymentLookupOpen && (
          <SponsorshipLookupModal
            isOpen={isPaymentLookupOpen}
            onClose={() => setIsPaymentLookupOpen(false)}
            onSelectSponsorship={(id) => openPaymentFor(id)}
          />
        )}

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

import React from 'react';
import { Smartphone, MapPin, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

export const WhyYouShouldSection: React.FC = () => {
  const scrollToAuction = () => {
    const el = document.querySelector('#auction');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    {
      num: 'BENEFIT 01',
      title: 'PHYSICAL BRAND PLACEMENT',
      description: 'Your approved logo gets printed on one of two physical iPhone back covers.',
      icon: Smartphone,
    },
    {
      num: 'BENEFIT 02',
      title: 'SHOW UP IN PERSON',
      description: 'The sponsored phone travels to the events included in the agreed campaign coverage.',
      icon: MapPin,
    },
    {
      num: 'BENEFIT 03',
      title: 'BUILDER COMMUNITY CONVERSATIONS',
      description: 'Give people an easy conversation starter when they notice your project on the phone.',
      icon: MessageCircle,
    },
    {
      num: 'BENEFIT 04',
      title: 'A MEMORABLE EXPERIMENT',
      description: 'Support a small, unconventional sponsorship idea instead of another ordinary banner placement.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="why-sponsor" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            WHY SPONSOR A PHONE COVER?
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            Your brand deserves to leave the screen.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-3 leading-relaxed">
            Most marketing happens online. This little experiment takes your logo into the real world — on a phone that travels with its owner.
          </p>
        </div>

        {/* 4 Polished Benefit Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.num}
                className="bg-white rounded-[22px] p-7 border border-[#ECEBF0] shadow-saas hover:shadow-saas-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#ECEBF0]">
                    <span className="text-[11px] font-bold text-[#A58BFA] tracking-wider uppercase">
                      {benefit.num}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] flex items-center justify-center text-[#24232E]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#22212A] tracking-tight mt-5">
                    {benefit.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#777681] mt-2.5 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA at Bottom */}
        <div className="mt-12 text-center">
          <button
            onClick={scrollToAuction}
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#24232E] text-white text-xs sm:text-sm font-semibold hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm gap-2"
          >
            <span>Explore the Covers</span>
            <ArrowRight className="w-4 h-4 text-white/80" />
          </button>
        </div>

      </div>
    </section>
  );
};

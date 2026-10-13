import React from 'react';
import { Layers, Send, Printer } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose a Cover',
      desc: 'Select Cover 01, Cover 02, or both. Each starts at $25. Sponsor both covers for exclusive full-back takeover.',
      icon: Layers,
    },
    {
      num: '02',
      title: 'Place Your Bid',
      desc: 'Submit your project details and bid. You can place a higher bid while the auction remains open.',
      icon: Send,
    },
    {
      num: '03',
      title: 'Get Your Logo Printed',
      desc: 'After the winning bid, logo approval, and payment verification, your brand gets printed on the selected physical cover.',
      icon: Printer,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            The Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            From bid to back cover.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            A simple, transparent process.
          </p>
        </div>

        {/* 3 Clean SaaS Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-[20px] p-7 border border-[#ECEBF0] shadow-saas hover:shadow-saas-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F8F7FA] border border-[#ECEBF0] flex items-center justify-center text-[#24232E] mb-6">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-xs font-semibold text-[#A2A0AA] block mb-1">
                    Step {step.num}
                  </span>

                  <h3 className="text-lg font-semibold text-[#22212A] tracking-tight mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#777681] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

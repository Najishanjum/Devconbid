import React, { useEffect, useRef, useState } from 'react';
import { Layers, Send, Printer, ArrowRight, Check } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Step cycling animation for interactive visual rhythm
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(interval);
  }, [isVisible]);

  const steps = [
    {
      num: '01',
      title: 'Choose a Cover',
      desc: 'Select Cover 01, Cover 02, or both. Each starts at $25. Sponsor both covers for exclusive full-back takeover.',
      icon: Layers,
      highlight: 'Slot Selection',
    },
    {
      num: '02',
      title: 'Place Your Bid',
      desc: 'Submit your project details and bid. You can place a higher bid while the auction remains open.',
      icon: Send,
      highlight: 'Instant Verification',
    },
    {
      num: '03',
      title: 'Get Your Logo Printed',
      desc: 'After the winning bid, logo approval, and payment verification, your brand gets printed on the selected physical cover.',
      icon: Printer,
      highlight: 'Physical Production',
    },
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0] overflow-hidden">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header with smooth entrance */}
        <div className={`text-center max-w-xl mx-auto mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EAF8] border border-[#DDD6FE] text-xs font-semibold uppercase tracking-wider text-[#7C3AED] mb-3">
            <span>The Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            From bid to back cover.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            A simple, transparent process.
          </p>

          {/* Stepper progress indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {steps.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeStep === idx
                    ? 'bg-[#24232E] text-white shadow-sm scale-105'
                    : 'bg-[#F8F7FA] text-[#777681] hover:bg-[#ECEBF0]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeStep === idx ? 'bg-[#A58BFA] animate-ping' : 'bg-[#A2A0AA]'}`} />
                <span>Step {step.num}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3 Step Cards appearing one by one */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCardActive = activeStep === index;
            // Delay for one-by-one sequential appearance
            const delayClass =
              index === 0
                ? 'animate-appear-step-1'
                : index === 1
                ? 'animate-appear-step-2'
                : 'animate-appear-step-3';

            return (
              <div
                key={step.num}
                onMouseEnter={() => setActiveStep(index)}
                className={`relative rounded-[22px] p-7 transition-all duration-500 flex flex-col justify-between group cursor-pointer ${
                  isVisible ? delayClass : 'opacity-0 translate-y-8'
                } ${
                  isCardActive
                    ? 'bg-white border-2 border-[#A58BFA] shadow-[0_12px_36px_rgba(165,139,250,0.18)] -translate-y-2'
                    : 'bg-white border border-[#ECEBF0] shadow-saas hover:shadow-saas-lg hover:border-[#D5CFE8] hover:-translate-y-1'
                }`}
              >
                {/* Top Step Pill & Step Number */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCardActive
                          ? 'bg-[#24232E] text-white shadow-sm scale-110'
                          : 'bg-[#F8F7FA] border border-[#ECEBF0] text-[#24232E] group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                          isCardActive
                            ? 'bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]'
                            : 'bg-[#F8F7FA] text-[#A2A0AA] border border-[#ECEBF0]'
                        }`}
                      >
                        Step {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Step Title with subtle hover animation */}
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#22212A] tracking-tight group-hover:text-[#6D28D9] transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A58BFA] block mb-3">
                    {step.highlight}
                  </span>

                  {/* Step Description with clear readability */}
                  <p className="text-sm text-[#52505C] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator Bar */}
                <div className="mt-8 pt-4 border-t border-[#ECEBF0] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#777681]">
                    <span className={`w-2 h-2 rounded-full transition-colors ${isCardActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span>{isCardActive ? 'Active Step' : `Part ${index + 1} of 3`}</span>
                  </div>

                  {index < 2 && (
                    <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isCardActive ? 'text-[#7C3AED] translate-x-1' : 'text-[#A2A0AA]'}`} />
                  )}
                  {index === 2 && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


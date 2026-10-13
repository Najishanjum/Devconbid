import React, { useState } from 'react';
import { FAQ_DATA } from '../data/mockData';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const toggleFAQ = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(item => item !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  return (
    <section id="faq" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[780px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            FAQs
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            Frequently asked questions.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            Everything you need to know about the auction, hardware, and event coverage.
          </p>
        </div>

        {/* Clean Minimalist Accordion */}
        <div className="space-y-3">
          {FAQ_DATA.map((item) => {
            const isOpen = openIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-[16px] border border-[#ECEBF0] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm sm:text-[15px] font-medium text-[#22212A] hover:bg-[#F8F7FA] transition-colors focus:outline-none"
                >
                  <span className="leading-snug">{item.question}</span>
                  <div className={`p-1 rounded-full text-[#777681] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#22212A]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#777681] leading-relaxed border-t border-[#ECEBF0]/60">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

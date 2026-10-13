import React from 'react';
import { PERKS_DATA } from '../data/mockData';
import { Smartphone, Compass, Send, Globe, Camera, Layers, Check } from 'lucide-react';

export const PerksSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#24232E]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-[#24232E]" />;
      case 'Send': return <Send className="w-5 h-5 text-[#24232E]" />;
      case 'Globe': return <Globe className="w-5 h-5 text-[#24232E]" />;
      case 'Camera': return <Camera className="w-5 h-5 text-[#24232E]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#24232E]" />;
      default: return <Check className="w-5 h-5 text-[#24232E]" />;
    }
  };

  return (
    <section id="perks" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            Deliverables
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            More than a logo on a phone.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            Every sponsorship includes verifiable real-world and digital deliverables.
          </p>
        </div>

        {/* Clean Grid of Minimal Perk Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERKS_DATA.map((perk) => (
            <div
              key={perk.id}
              className="bg-white rounded-[20px] p-6 border border-[#ECEBF0] shadow-saas hover:shadow-saas-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F8F7FA] border border-[#ECEBF0] flex items-center justify-center mb-5">
                  {getIcon(perk.iconName)}
                </div>

                <h3 className="text-base font-semibold text-[#22212A] tracking-tight mb-1.5">
                  {perk.title}
                </h3>

                <p className="text-xs text-[#777681] leading-relaxed">
                  {perk.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#ECEBF0] flex items-center justify-between text-[11px] text-[#A2A0AA]">
                <span>Included Deliverable</span>
                <span className="text-[#A58BFA] font-medium">{perk.badge}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle Transparency Note */}
        <div className="mt-10 rounded-xl bg-[#F8F7FA] border border-[#ECEBF0] p-4 text-center text-xs text-[#777681]">
          <span>★ Only deliverables explicitly defined in the sponsorship agreement will be provided. No fabricated impression counts.</span>
        </div>

      </div>
    </section>
  );
};

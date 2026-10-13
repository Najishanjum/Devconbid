import React from 'react';
import { Shield, Sparkles, CheckCircle2, Award } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const items = [
    { icon: Shield, label: 'Independent creator campaign' },
    { icon: Sparkles, label: 'Physical logo placement' },
    { icon: CheckCircle2, label: 'Transparent bidding process' },
    { icon: Award, label: 'Approved sponsor listings' },
  ];

  return (
    <div className="w-full border-y border-[#ECEBF0] bg-[#F8F7FA]/70 py-4 px-6">
      <div className="max-w-[1040px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-[#777681]">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.label}>
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-[#24232E]" />
                <span>{item.label}</span>
              </div>
              {index < items.length - 1 && (
                <div className="hidden md:block w-[1px] h-3.5 bg-[#ECEBF0]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

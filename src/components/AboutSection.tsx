import React from 'react';
import { Mail, ExternalLink, Globe } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            The Creator
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            A small idea with a real-world footprint.
          </h2>
        </div>

        {/* Clean Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Creator Portrait */}
          <div className="md:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-[24px] overflow-hidden border border-[#ECEBF0] shadow-saas-lg bg-[#F8F7FA]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="Creator holding phone"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#ECEBF0] text-center shadow-saas-sm">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#777681]">
                  THE PERSON BEHIND THE PHONE
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Links */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-4 text-sm sm:text-base text-[#777681] leading-relaxed">
              <p className="text-lg sm:text-xl font-medium text-[#22212A] leading-snug">
                I'm a builder spending time around Web3 and developer communities.
              </p>
              <p>
                This is a small experiment in making project discovery a little more tangible: two physical phone covers, a few interesting projects, and conversations with people building the future.
              </p>
              <p className="text-xs sm:text-sm text-[#A2A0AA]">
                Instead of another disposable flyer or ignored digital ad, your project lives on the device I use all day long across hackathons, conferences, and meetups.
              </p>
            </div>

            {/* Social & Contact Links */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-xs font-medium text-[#22212A] hover:bg-[#F0EAF8] transition-colors"
              >
                <span>𝕏 / Twitter</span>
                <ExternalLink className="w-3 h-3 text-[#777681]" />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-xs font-medium text-[#22212A] hover:bg-[#F0EAF8] transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-[#777681]" />
              </a>

              <a
                href="mailto:campaign@pocketbillboard.xyz"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-xs font-medium text-[#22212A] hover:bg-[#F0EAF8] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#777681]" />
                <span>Email Creator</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

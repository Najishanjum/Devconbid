import React from 'react';
import { Mail, ExternalLink, Send } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#008767] bg-[#E6F7F2] border border-[#A7E8D6] px-3 py-0.5 rounded-full inline-block mb-3">
            The Creator
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#22212A] tracking-[-0.03em]">
            A small idea with a real-world footprint.
          </h2>
        </div>

        {/* Clean Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Creator Portrait */}
          <div className="md:col-span-5 flex flex-col items-center sm:items-start">
            <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-[24px] overflow-hidden border border-[#ECEBF0] shadow-saas-lg bg-[#1F1E29]">
              <img
                src="/images/najish_portrait.jpg"
                alt="Md Najish speaking at event"
                className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#ECEBF0] text-center shadow-saas-sm">
                <span className="text-xs font-bold text-[#22212A] block">
                  Md Najish
                </span>
                <span className="text-[10px] font-medium text-[#777681] block">
                  Web3 Builder · Devcon Circuit 🇮🇳
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Verified Social Links */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-4 text-sm sm:text-base text-[#52505C] leading-relaxed">
              <p className="text-xl sm:text-2xl font-bold text-[#22212A] tracking-tight leading-snug">
                Hi, I'm Md Najish.
              </p>
              <p>
                I'm a builder spending time across Web3 communities, developer hackathons, and crypto ecosystems in India and Southeast Asia.
              </p>
              <p>
                This is a personal experiment in making project discovery tangible and memorable: two physical Apple iPhone 16 Pro back covers, two dedicated sponsor spots, and organic conversations with engineers, founders, and community leads building the future.
              </p>
              <p className="text-xs sm:text-sm text-[#737180]">
                Instead of being scrolled past in a crowded timeline, your approved project travels on the phone I carry into developer lounges, keynotes, and founder meetups at Devcon, IBW, and ETHGlobal.
              </p>
            </div>

            {/* Social & Contact Channels */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://x.com/Najish_anjum"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-xs font-semibold text-[#22212A] hover:bg-[#E6F7F2] hover:text-[#008767] hover:border-[#A7E8D6] transition-all"
              >
                <span>𝕏 @Najish_anjum</span>
                <ExternalLink className="w-3 h-3 text-[#777681]" />
              </a>

              <a
                href="https://t.me/Najish_anjum"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-xs font-semibold text-[#22212A] hover:bg-[#E6F7F2] hover:text-[#008767] hover:border-[#A7E8D6] transition-all"
              >
                <Send className="w-3 h-3 text-[#008767]" />
                <span>Telegram: @Najish_anjum</span>
              </a>

              <a
                href="https://github.com/Najishanjum"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-xs font-semibold text-[#22212A] hover:bg-[#F8F7FA] hover:border-[#DDDCE3] transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#22212A]" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub: Najishanjum</span>
                <ExternalLink className="w-3 h-3 text-[#777681]" />
              </a>

              <a
                href="mailto:najishanjum058@gmail.com"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-xs font-semibold text-[#22212A] hover:bg-[#F0EAF8] hover:text-[#24232E] transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#777681]" />
                <span>najishanjum058@gmail.com</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

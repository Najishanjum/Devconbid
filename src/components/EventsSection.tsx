import React from 'react';
import { Calendar, MapPin, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

interface JourneyEvent {
  step: string;
  name: string;
  location: string;
  dateDisplay: string;
  officialUrl: string;
  coverageStatus: 'Intended Coverage' | 'Planned Coverage' | 'Traveling Coverage';
  description: string;
  accentGradient: string;
  borderHover: string;
  shadowGlow: string;
  badgeBg: string;
}

const JOURNEY_EVENTS: JourneyEvent[] = [
  {
    step: '01',
    name: 'DEVCON',
    location: 'Bangkok, Thailand',
    dateDisplay: 'Nov 12 – 15, 2026',
    officialUrl: 'https://devcon.org',
    coverageStatus: 'Planned Coverage',
    description: 'The premier Ethereum gathering of the year. Carried throughout official builder sessions, hacker lounges, and ecosystem side gatherings.',
    accentGradient: 'from-[#8B5CF6]/30 via-[#10B981]/25 to-[#6366F1]/30',
    borderHover: 'group-hover:border-[#A78BFA]',
    shadowGlow: 'hover:shadow-[0_16px_40px_rgba(139,92,246,0.2)]',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    step: '02',
    name: 'INDIA BLOCKCHAIN WEEK (IBW)',
    location: 'Bengaluru / Mumbai, India',
    dateDisplay: 'December 2026 (Details to be confirmed)',
    officialUrl: 'https://indiablockchainweek.com',
    coverageStatus: 'Planned Coverage',
    description: 'Ground zero for the Indian Web3 builder community. Guaranteed high-touch networking across founder roundtables, hack houses, and demo days.',
    accentGradient: 'from-[#F59E0B]/30 via-[#EC4899]/20 to-[#10B981]/30',
    borderHover: 'group-hover:border-[#FBBF24]',
    shadowGlow: 'hover:shadow-[0_16px_40px_rgba(245,158,11,0.2)]',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    step: '03',
    name: 'ETHGLOBAL',
    location: 'Official Circuit & Pop-Up Hubs',
    dateDisplay: 'Fall / Winter Circuit 2026',
    officialUrl: 'https://ethglobal.com',
    coverageStatus: 'Traveling Coverage',
    description: 'Where thousands of developers build protocols from scratch. Placed on hacker desks, charging stations, and during project showcases.',
    accentGradient: 'from-[#3B82F6]/30 via-[#06B6D4]/25 to-[#8B5CF6]/30',
    borderHover: 'group-hover:border-[#60A5FA]',
    shadowGlow: 'hover:shadow-[0_16px_40px_rgba(37,99,235,0.2)]',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
  }
];

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0] bg-gradient-to-b from-white via-[#FAF9FC] to-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-200/20 via-teal-200/20 to-blue-200/20 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-[1040px] mx-auto relative z-10">
        
        {/* Section Header with Animated Typography */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider block mb-2.5 animate-font-shimmer">
            ✦ The Event Journey ✦
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] animate-title-shimmer leading-tight font-sans">
            Where the phone goes.
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-medium">
            One phone. A few stops. More conversations with the people building Web3.
          </p>
        </div>

        {/* Desktop & Tablet: Connected Horizontal Timeline with Shining Color Cards */}
        <div className="hidden md:block relative">
          
          {/* Animated subtle connecting horizontal line behind step badges */}
          <div className="absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-purple-300 via-emerald-300 to-blue-300 -z-0 opacity-70 animate-pulse" />

          <div className="grid grid-cols-3 gap-6 relative z-10">
            {JOURNEY_EVENTS.map((event) => (
              <div key={event.step} className="flex flex-col items-center group">
                
                {/* Connected Step Marker with Animated Color Pulse */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#18181B] text-[#18181B] flex flex-col items-center justify-center font-bold text-xs shadow-saas-sm group-hover:scale-110 group-hover:border-purple-600 transition-all duration-300 relative">
                    <span className="text-[10px] text-purple-600 font-extrabold tracking-wide">STOP</span>
                    <span className="text-sm font-black leading-tight">{event.step}</span>
                    <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Event Card with Color Shine Effect & Sweep Animation */}
                <div className={`w-full rounded-[24px] p-[1.5px] bg-gradient-to-br ${event.accentGradient} ${event.shadowGlow} transition-all duration-300 flex-1 flex flex-col relative`}>
                  <div className="w-full h-full bg-white rounded-[22.5px] p-6 border border-white/60 flex flex-col justify-between flex-1 relative overflow-hidden card-shine-sweep">
                    
                    {/* Subtle colorful top ambient gradient glow inside card */}
                    <div className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-b ${event.accentGradient} opacity-20 pointer-events-none`} />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between pb-3 border-b border-[#ECEBF0]">
                        <span className="text-xs font-black text-[#18181B] tracking-wide">
                          STEP {event.step}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                          {event.coverageStatus}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[#18181B] tracking-tight mt-4 group-hover:text-purple-700 transition-colors">
                        {event.name}
                      </h3>

                      <div className="mt-3 space-y-1.5 text-xs text-[#64748B]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#18181B] shrink-0" />
                          <span className="font-semibold text-[#18181B]">{event.dateDisplay}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#52525B] mt-4 leading-relaxed font-normal">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#ECEBF0] flex items-center justify-between relative z-10">
                      <a
                        href={event.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#64748B] hover:text-[#18181B] flex items-center gap-1 transition-colors"
                      >
                        <span>Official site</span>
                        <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                      </a>

                      <span className="text-[11px] text-[#059669] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Intended stop</span>
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Mobile: Connected Vertical Timeline with Shining Color Cards */}
        <div className="md:hidden relative pl-6 border-l-2 border-purple-200 ml-4 space-y-8">
          {JOURNEY_EVENTS.map((event) => (
            <div key={event.step} className="relative">
              
              {/* Connected circular marker on the vertical line */}
              <div className="absolute -left-[35px] top-4 w-8 h-8 rounded-full bg-white border-2 border-[#18181B] text-[#18181B] flex items-center justify-center font-bold text-xs shadow-sm">
                {event.step}
              </div>

              {/* Event Card with Shining Gradient Border & Light Sweep */}
              <div className={`rounded-[22px] p-[1.5px] bg-gradient-to-br ${event.accentGradient} ${event.shadowGlow} transition-all duration-300`}>
                <div className="bg-white rounded-[20.5px] p-5 border border-white/60 relative overflow-hidden card-shine-sweep">
                  
                  {/* Internal ambient glow */}
                  <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-b ${event.accentGradient} opacity-20 pointer-events-none`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#ECEBF0]">
                      <span className="text-xs font-black text-purple-700 tracking-wide">
                        STOP {event.step}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {event.coverageStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#18181B] tracking-tight mt-3">
                      {event.name}
                    </h3>

                    <div className="mt-2.5 space-y-1 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#18181B]" />
                        <span className="font-semibold text-[#18181B]">{event.dateDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#52525B] mt-3 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#ECEBF0] flex items-center justify-between">
                      <a
                        href={event.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#64748B] hover:text-[#18181B] flex items-center gap-1"
                      >
                        <span>Official site</span>
                        <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                      </a>

                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Intended stop</span>
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Context Disclaimer Strip */}
        <div className="mt-12 p-3.5 rounded-xl bg-[#F8F7FA] border border-[#ECEBF0] text-center text-[11px] text-[#777681]">
          This connected journey represents intended campaign coverage and personal conference attendance. It does not constitute official conference partnership or formal endorsement by the event organizers.
        </div>

      </div>
    </section>
  );
};

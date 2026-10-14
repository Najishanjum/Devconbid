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
}

const JOURNEY_EVENTS: JourneyEvent[] = [
  {
    step: '01',
    name: 'DEVCON',
    location: 'Bangkok, Thailand',
    dateDisplay: 'Nov 12 – 15, 2026',
    officialUrl: 'https://devcon.org',
    coverageStatus: 'Planned Coverage',
    description: 'The premier Ethereum gathering of the year. Carried throughout official builder sessions, hacker lounges, and ecosystem side gatherings.'
  },
  {
    step: '02',
    name: 'INDIA BLOCKCHAIN WEEK (IBW)',
    location: 'Bengaluru / Mumbai, India',
    dateDisplay: 'December 2026 (Details to be confirmed)',
    officialUrl: 'https://indiablockchainweek.com',
    coverageStatus: 'Planned Coverage',
    description: 'Ground zero for the Indian Web3 builder community. Guaranteed high-touch networking across founder roundtables, hack houses, and demo days.'
  },
  {
    step: '03',
    name: 'ETHGLOBAL',
    location: 'Official Circuit & Pop-Up Hubs',
    dateDisplay: 'Fall / Winter Circuit 2026',
    officialUrl: 'https://ethglobal.com',
    coverageStatus: 'Traveling Coverage',
    description: 'Where thousands of developers build protocols from scratch. Placed on hacker desks, charging stations, and during project showcases.'
  }
];

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            The Event Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            Where the phone goes.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            One phone. A few stops. More conversations with the people building Web3.
          </p>
        </div>

        {/* Desktop & Tablet: Connected Horizontal Timeline */}
        <div className="hidden md:block relative">
          
          {/* Subtle connecting horizontal line behind step badges */}
          <div className="absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-[#ECEBF0] -z-0" />

          <div className="grid grid-cols-3 gap-6 relative z-10">
            {JOURNEY_EVENTS.map((event, index) => (
              <div key={event.step} className="flex flex-col items-center">
                
                {/* Connected Step Marker */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#24232E] text-[#24232E] flex flex-col items-center justify-center font-bold text-xs shadow-saas-sm group-hover:scale-105 transition-transform">
                    <span className="text-[10px] text-[#A58BFA] font-bold">STOP</span>
                    <span className="text-sm font-extrabold leading-tight">{event.step}</span>
                  </div>
                </div>

                {/* Event Card */}
                <div className="w-full bg-white rounded-[22px] p-6 border border-[#ECEBF0] shadow-saas hover:shadow-saas-lg transition-all duration-200 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#ECEBF0]">
                      <span className="text-xs font-bold text-[#24232E] tracking-tight">
                        STEP {event.step}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {event.coverageStatus}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#22212A] tracking-tight mt-4">
                      {event.name}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-[#777681]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#24232E] shrink-0" />
                        <span className="font-medium text-[#22212A]">{event.dateDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A2A0AA] shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#777681] mt-4 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#ECEBF0] flex items-center justify-between">
                    <a
                      href={event.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-[#777681] hover:text-[#22212A] flex items-center gap-1 transition-colors"
                    >
                      <span>Official site</span>
                      <ExternalLink className="w-3 h-3 text-[#A2A0AA]" />
                    </a>

                    <span className="text-[11px] text-[#A2A0AA] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Intended stop</span>
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Mobile: Connected Vertical Timeline */}
        <div className="md:hidden relative pl-6 border-l-2 border-[#ECEBF0] ml-4 space-y-8">
          {JOURNEY_EVENTS.map((event) => (
            <div key={event.step} className="relative">
              
              {/* Connected circular marker on the vertical line */}
              <div className="absolute -left-[35px] top-4 w-8 h-8 rounded-full bg-white border-2 border-[#24232E] text-[#24232E] flex items-center justify-center font-bold text-xs shadow-sm">
                {event.step}
              </div>

              {/* Event Card */}
              <div className="bg-white rounded-[20px] p-5 border border-[#ECEBF0] shadow-saas">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#ECEBF0]">
                  <span className="text-xs font-bold text-[#A58BFA]">
                    STOP {event.step}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {event.coverageStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#22212A] tracking-tight mt-3">
                  {event.name}
                </h3>

                <div className="mt-2.5 space-y-1 text-xs text-[#777681]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#24232E]" />
                    <span className="font-medium text-[#22212A]">{event.dateDisplay}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A2A0AA]" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-xs text-[#777681] mt-3 leading-relaxed">
                  {event.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#ECEBF0] flex items-center justify-between">
                  <a
                    href={event.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-[#777681] hover:text-[#22212A] flex items-center gap-1"
                  >
                    <span>Event Info</span>
                    <ExternalLink className="w-3 h-3 text-[#A2A0AA]" />
                  </a>

                  <span className="text-[11px] text-[#A2A0AA]">
                    Independent campaign coverage
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Context Disclaimer Strip */}
        <div className="mt-10 p-3.5 rounded-xl bg-[#F8F7FA] border border-[#ECEBF0] text-center text-[11px] text-[#777681]">
          This connected journey represents intended campaign coverage and personal conference attendance. It does not constitute official conference partnership or formal endorsement by the event organizers.
        </div>

      </div>
    </section>
  );
};

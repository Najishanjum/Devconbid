import React from 'react';
import { EVENTS_DATA } from '../data/mockData';
import { useAuction } from '../context/AuctionContext';
import { Calendar, MapPin, ExternalLink, ArrowUpRight } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { setSelectedCoverForBid, setIsBidModalOpen } = useAuction();

  const handleSelectEvent = () => {
    setSelectedCoverForBid('01');
    setIsBidModalOpen(true);
  };

  return (
    <section id="events" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            The Circuit
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            Where the phone goes.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            Independent coverage across premier Web3 conferences and builder hubs.
          </p>
        </div>

        {/* 3 Minimal Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EVENTS_DATA.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-[20px] p-6 border border-[#ECEBF0] shadow-saas hover:shadow-saas-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#ECEBF0]">
                  <span className="text-xs font-semibold text-[#A58BFA]">
                    {event.shortCode}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {event.coverageStatus}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#22212A] tracking-tight mt-4">
                  {event.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-[#777681]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#24232E]" />
                    <span className="font-medium text-[#22212A]">{event.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A2A0AA]" />
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
                  <span>Event Info</span>
                  <ExternalLink className="w-3 h-3 text-[#A2A0AA]" />
                </a>

                <button
                  onClick={handleSelectEvent}
                  className="text-xs font-medium text-[#24232E] hover:text-[#A58BFA] flex items-center gap-1 transition-colors"
                >
                  <span>Select for Bid</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

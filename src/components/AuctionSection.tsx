import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { Clock, History, ArrowUpRight, Flame, Layers } from 'lucide-react';

export const AuctionSection: React.FC = () => {
  const { covers, openHistoryFor, setSelectedCoverForBid, setIsBidModalOpen } = useAuction();

  const cover01 = covers.find(c => c.id === 'cover-01')!;
  const cover02 = covers.find(c => c.id === 'cover-02')!;

  const handleBidClick = (slot: '01' | '02' | 'both') => {
    setSelectedCoverForBid(slot);
    setIsBidModalOpen(true);
  };

  return (
    <section id="auction" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            The Auction
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            Choose your spot.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            Two physical covers. Two independent auctions.
          </p>
        </div>

        {/* Closing Deadline Information Banner */}
        <div className="mb-10 bg-[#F8F7FA] border border-[#ECEBF0] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#777681]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#24232E]" />
            <span className="font-medium text-[#22212A]">AUCTION DEADLINE:</span>
            <span>Nov 1, 2026 · 23:59 IST</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-emerald-800">Live Bidding Active</span>
          </div>
        </div>

        {/* Two Professional SaaS Auction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 01 */}
          <div className="bg-white rounded-[24px] border border-[#ECEBF0] p-7 shadow-saas hover:shadow-saas-lg transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#ECEBF0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0EAF8] text-[#24232E]">
                    COVER 01 · SLOT A
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {cover01.status}
                  </span>
                </div>
                <span className="text-xs text-[#A2A0AA]">Upper Shell</span>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-semibold text-[#22212A] tracking-tight">
                  {cover01.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#777681] mt-1 leading-relaxed">
                  {cover01.description}
                </p>
              </div>

              {/* Bid Stats */}
              <div className="mt-6 p-4 rounded-xl bg-[#F8F7FA] border border-[#ECEBF0] grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-medium text-[#A2A0AA] uppercase block">
                    Starting Bid
                  </span>
                  <span className="text-2xl font-semibold text-[#22212A] block mt-0.5">
                    ${cover01.startingBid}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-[#A58BFA] uppercase block">
                    Current Highest Bid
                  </span>
                  <span className="text-2xl font-semibold text-[#24232E] block mt-0.5">
                    ${cover01.currentBid}
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-4 text-xs">
                {cover01.bidsCount > 0 ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leader: {cover01.highestBidder} ({cover01.bidsCount} bids)</span>
                  </div>
                ) : (
                  <span className="text-[#A2A0AA] italic">No bids yet. Be the first.</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-5 border-t border-[#ECEBF0] flex items-center justify-between gap-3">
              <button
                onClick={() => openHistoryFor('cover-01')}
                className="text-xs font-medium text-[#777681] hover:text-[#22212A] flex items-center gap-1 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-[#A2A0AA]" />
                <span>Bid History ({cover01.bidsCount})</span>
              </button>

              <button
                onClick={() => handleBidClick('01')}
                className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm gap-1.5"
              >
                <span>Bid on Cover 01</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-white rounded-[24px] border border-[#ECEBF0] p-7 shadow-saas hover:shadow-saas-lg transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#ECEBF0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FBF0EA] text-[#24232E]">
                    COVER 02 · SLOT B
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {cover02.status}
                  </span>
                </div>
                <span className="text-xs text-[#A2A0AA]">Lower Shell</span>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-semibold text-[#22212A] tracking-tight">
                  {cover02.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#777681] mt-1 leading-relaxed">
                  {cover02.description}
                </p>
              </div>

              {/* Bid Stats */}
              <div className="mt-6 p-4 rounded-xl bg-[#F8F7FA] border border-[#ECEBF0] grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-medium text-[#A2A0AA] uppercase block">
                    Starting Bid
                  </span>
                  <span className="text-2xl font-semibold text-[#22212A] block mt-0.5">
                    ${cover02.startingBid}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-[#A58BFA] uppercase block">
                    Current Highest Bid
                  </span>
                  <span className="text-2xl font-semibold text-[#24232E] block mt-0.5">
                    ${cover02.currentBid}
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-4 text-xs">
                {cover02.bidsCount > 0 ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leader: {cover02.highestBidder} ({cover02.bidsCount} bids)</span>
                  </div>
                ) : (
                  <span className="text-[#A2A0AA] italic">No bids yet. Be the first.</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-5 border-t border-[#ECEBF0] flex items-center justify-between gap-3">
              <button
                onClick={() => openHistoryFor('cover-02')}
                className="text-xs font-medium text-[#777681] hover:text-[#22212A] flex items-center gap-1 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-[#A2A0AA]" />
                <span>Bid History ({cover02.bidsCount})</span>
              </button>

              <button
                onClick={() => handleBidClick('02')}
                className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm gap-1.5"
              >
                <span>Bid on Cover 02</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Combined Dual Cover Takeover Card */}
        <div className="mt-8 rounded-[20px] bg-[#FBF0EA]/60 border border-[#ECEBF0] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-white border border-[#ECEBF0] flex items-center justify-center text-[#24232E] shrink-0 shadow-saas-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-[#22212A]">
                Want the entire phone back exclusively?
              </h4>
              <p className="text-xs text-[#777681] mt-0.5 max-w-xl">
                Sponsor both Cover 01 and Cover 02 together. Starting combined total: <strong>$50</strong> ($25 each). Zero co-sponsors. Total physical billboard takeover.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleBidClick('both')}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center h-10 px-6 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm"
          >
            Bid on Both Covers ($50+)
          </button>
        </div>

      </div>
    </section>
  );
};

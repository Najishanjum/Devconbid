import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { X, ShieldCheck, History, ArrowUpRight } from 'lucide-react';

export const BidHistoryModal: React.FC = () => {
  const {
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    activeHistoryCoverId,
    covers,
    bids,
    setSelectedCoverForBid,
    setIsBidModalOpen,
  } = useAuction();

  if (!isHistoryModalOpen) return null;

  const currentCover = covers.find(c => c.id === activeHistoryCoverId)!;
  const filteredBids = bids.filter(b => b.coverId === activeHistoryCoverId || b.coverId === 'both');

  const handlePlaceBid = () => {
    setIsHistoryModalOpen(false);
    setSelectedCoverForBid(activeHistoryCoverId === 'cover-01' ? '01' : '02');
    setIsBidModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white border border-[#ECEBF0] rounded-[24px] p-6 shadow-saas-lg max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECEBF0]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A58BFA] block">
              Public Bid Log
            </span>
            <h3 className="text-xl font-semibold text-[#22212A] tracking-tight">
              {activeHistoryCoverId === 'cover-01' ? 'Cover 01 (Slot A)' : 'Cover 02 (Slot B)'}
            </h3>
          </div>

          <button
            onClick={() => setIsHistoryModalOpen(false)}
            className="p-1.5 rounded-full text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status bar */}
        <div className="my-4 p-3.5 bg-[#F8F7FA] border border-[#ECEBF0] rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[#777681]">Current High: </span>
            <span className="font-semibold text-[#22212A]">${currentCover.currentBid} USD</span>
          </div>
          <div>
            <span className="text-[#777681]">Total Bids: </span>
            <span className="font-semibold text-[#22212A]">{currentCover.bidsCount}</span>
          </div>
        </div>

        {/* Bid List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredBids.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#A2A0AA] italic">
              No bids yet for this cover. Be the first to place a bid.
            </div>
          ) : (
            filteredBids.map((bid, idx) => (
              <div
                key={bid.id}
                className="p-3 rounded-xl border border-[#ECEBF0] bg-white flex items-center justify-between hover:bg-[#F8F7FA] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#22212A]">
                      {bid.projectName}
                    </span>
                    {idx === 0 && (
                      <span className="bg-[#F0EAF8] text-[#24232E] text-[10px] font-semibold px-2 py-0.2 rounded-full">
                        Leader
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#A2A0AA]">
                    {new Date(bid.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-semibold text-[#22212A]">
                    ${bid.amount}
                  </div>
                  <div className="text-[10px] text-emerald-700 flex items-center justify-end gap-0.5 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#ECEBF0] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#A2A0AA]">
            Applicant emails remain strictly confidential.
          </span>

          <button
            onClick={handlePlaceBid}
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] transition-colors shadow-saas-sm"
          >
            Bid Now
          </button>
        </div>
      </div>
    </div>
  );
};

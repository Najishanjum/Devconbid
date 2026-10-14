import React, { useState, Suspense } from 'react';
import { useAuction } from '../context/AuctionContext';
import { ArrowUpRight, History, Upload, X, Smartphone } from 'lucide-react';
import { InteractivePhoneViewer } from './viewer3d/InteractivePhoneViewer';

type SelectedSlot = '01' | '02';

export const Phone3DSection: React.FC = () => {
  const { covers, setSelectedCoverForBid, setIsBidModalOpen, openHistoryFor } = useAuction();
  const [activeSlot, setActiveSlot] = useState<SelectedSlot>('01');
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);

  const cover01 = covers.find((c) => c.id === 'cover-01')!;
  const cover02 = covers.find((c) => c.id === 'cover-02')!;
  const activeCover = activeSlot === '01' ? cover01 : cover02;

  const handleBidClick = () => {
    setSelectedCoverForBid(activeSlot);
    setIsBidModalOpen(true);
  };

  const handleHistoryClick = () => {
    openHistoryFor(activeSlot === '01' ? 'cover-01' : 'cover-02');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.match(/^image\/(png|jpeg|svg\+xml|webp)$/)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreviewLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setPreviewLogoUrl(null);
    setLogoFileName(null);
  };

  const getStatusBadge = () => {
    if (activeCover.status === 'OPEN') {
      return (
        <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Auction Open
        </span>
      );
    }
    return (
      <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
        {activeCover.status}
      </span>
    );
  };

  return (
    <section id="configurator" className="py-20 px-6 sm:px-8 border-b border-[#ECEBF0]">
      <div className="max-w-[1040px] mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A58BFA] block mb-2">
            Interactive 3D Cover Viewer
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#22212A] tracking-[-0.03em]">
            Inspect both covers.
          </h2>
          <p className="text-sm sm:text-base text-[#777681] mt-2">
            Drag to rotate. Pinch or scroll to zoom. Preview your logo on the back cover.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left: 3D Viewer — takes up 3/5 columns */}
          <div className="lg:col-span-3">
            <InteractivePhoneViewer
              slot={activeSlot}
              sponsorLogoUrl={previewLogoUrl}
              className="w-full"
            />
          </div>

          {/* Right: Cover Selector + Auction Details + Logo Upload — 2/5 columns */}
          <div className="lg:col-span-2 space-y-5">

            {/* Cover Switcher */}
            <div>
              <p className="text-xs font-semibold text-[#22212A] mb-2 uppercase tracking-wider">Select Cover</p>
              <div className="grid grid-cols-2 gap-3">
                {(['01', '02'] as SelectedSlot[]).map((slot) => {
                  const c = slot === '01' ? cover01 : cover02;
                  const isActive = activeSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setActiveSlot(slot)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? slot === '01'
                            ? 'bg-[#F0EAF8] border-[#A58BFA] ring-1 ring-[#A58BFA]'
                            : 'bg-[#FBF0EA] border-[#D89B30] ring-1 ring-[#D89B30]'
                          : 'bg-white border-[#ECEBF0] hover:border-[#DDDCE3]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#22212A]">Cover {slot}</div>
                      <div className="text-[11px] text-[#777681] mt-0.5">
                        ${c.startingBid} start · {c.bidsCount} bid{c.bidsCount !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Cover Auction Details */}
            <div className="bg-[#F8F7FA] border border-[#ECEBF0] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#22212A]">Cover {activeSlot} — {activeCover.title}</span>
                {getStatusBadge()}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#A2A0AA] block">Starting Bid</span>
                  <span className="text-lg font-extrabold text-[#22212A]">${activeCover.startingBid}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#A58BFA] block">Current High</span>
                  <span className="text-lg font-extrabold text-[#6D28D9]">${activeCover.currentBid}</span>
                </div>
              </div>

              {activeCover.bidsCount > 0 ? (
                <p className="text-xs text-emerald-700 font-semibold">
                  🔥 Leader: {activeCover.highestBidder} ({activeCover.bidsCount} bid{activeCover.bidsCount !== 1 ? 's' : ''})
                </p>
              ) : (
                <p className="text-xs text-[#A2A0AA] italic">No bids yet — be the first.</p>
              )}

              <p className="text-[11px] text-[#777681] leading-relaxed">
                {activeCover.description}
              </p>
            </div>

            {/* Logo Preview Upload (private, local only) */}
            <div>
              <p className="text-xs font-semibold text-[#22212A] mb-1.5 uppercase tracking-wider">Preview Your Logo</p>
              <p className="text-[11px] text-[#A2A0AA] mb-2">
                Preview only — uploads stay private until your bid is approved.
              </p>

              {previewLogoUrl ? (
                <div className="relative border border-[#ECEBF0] rounded-xl bg-white p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img src={previewLogoUrl} alt="Logo preview" className="h-8 w-auto max-w-[80px] object-contain rounded" />
                    <span className="text-xs text-[#777681] truncate max-w-[100px]">{logoFileName}</span>
                  </div>
                  <button onClick={clearLogo} className="p-1 rounded-full text-[#A2A0AA] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full px-3.5 py-2.5 rounded-xl border border-dashed border-[#ECEBF0] bg-white cursor-pointer hover:bg-[#F8F7FA] transition-colors flex items-center justify-between">
                  <span className="text-xs text-[#777681]">Upload PNG or SVG for preview…</span>
                  <Upload className="w-3.5 h-3.5 text-[#777681] shrink-0" />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              {activeCover.status === 'OPEN' ? (
                <button
                  onClick={handleBidClick}
                  className="w-full h-12 px-6 rounded-full bg-[#24232E] text-white text-sm font-semibold hover:bg-[#353342] active:scale-[0.98] transition-all shadow-saas-sm flex items-center justify-center gap-2"
                >
                  <span>Bid on Cover {activeSlot}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full h-12 px-6 rounded-full bg-[#F8F7FA] border border-[#ECEBF0] text-[#A2A0AA] text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                  <span>Cover {activeSlot} — {activeCover.status}</span>
                </div>
              )}

              <button
                onClick={handleHistoryClick}
                className="w-full h-10 px-5 rounded-full border border-[#ECEBF0] bg-white text-xs font-semibold text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA] transition-all flex items-center justify-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>View Bid History ({activeCover.bidsCount})</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

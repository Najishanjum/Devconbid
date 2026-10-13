import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { X, ShieldCheck, Download, RotateCcw, Sparkles, Check, Ban } from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    applications,
    covers,
    isDemoMode,
    loadSampleDemoData,
    resetToCleanState,
    updateCoverStatus,
    approveApplication,
    rejectApplication,
    exportApplicationsCSV,
    exportApplicationsJSON,
  } = useAuction();

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');

  if (!isAdminOpen) return null;

  const filteredApps = applications.filter(app => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white border border-[#ECEBF0] rounded-[24px] p-6 sm:p-8 shadow-saas-lg max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECEBF0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#24232E] text-white flex items-center justify-center shadow-saas-sm">
              <ShieldCheck className="w-4 h-4 text-[#A58BFA]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#22212A] tracking-tight">
                Campaign Operations & Admin
              </h3>
              <p className="text-xs text-[#777681]">
                Manage cover auction statuses, review applications, and moderate bids
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-full text-[#777681] hover:text-[#22212A] hover:bg-[#F8F7FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tools & Demo Controls */}
        <div className="my-4 p-4 bg-[#F8F7FA] border border-[#ECEBF0] rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#22212A]">Data Mode:</span>
            {isDemoMode ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#F0EAF8] border border-[#ECEBF0] text-[11px] font-medium text-[#24232E]">
                Demo Data Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#ECEBF0] text-[11px] text-[#777681]">
                Clean / Zero-Bid Live State
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadSampleDemoData}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#ECEBF0] text-xs font-medium text-[#22212A] hover:bg-[#F0EAF8] flex items-center gap-1.5 transition-colors shadow-saas-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A58BFA]" />
              <span>Load Sample Bids</span>
            </button>

            <button
              onClick={resetToCleanState}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#ECEBF0] text-xs font-medium text-[#777681] hover:text-red-600 flex items-center gap-1.5 transition-colors shadow-saas-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>

            <button
              onClick={exportApplicationsCSV}
              className="px-3.5 py-1.5 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] flex items-center gap-1.5 transition-colors shadow-saas-sm"
            >
              <Download className="w-3.5 h-3.5 text-white/80" />
              <span>CSV</span>
            </button>

            <button
              onClick={exportApplicationsJSON}
              className="px-3.5 py-1.5 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] flex items-center gap-1.5 transition-colors shadow-saas-sm"
            >
              <Download className="w-3.5 h-3.5 text-white/80" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Cover Status Controllers */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {covers.map((c) => (
            <div key={c.id} className="p-3 bg-white border border-[#ECEBF0] rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#22212A]">{c.slot === '01' ? 'Cover 01' : 'Cover 02'}: </span>
                <span className="text-[#777681]">${c.currentBid} ({c.bidsCount} bids)</span>
              </div>
              <div className="flex items-center gap-1">
                {(['OPEN', 'PENDING_APPROVAL', 'SOLD'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => updateCoverStatus(c.id, st)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      c.status === st
                        ? 'bg-[#24232E] text-white'
                        : 'bg-[#F8F7FA] text-[#777681] hover:text-[#22212A]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Applications List Filter */}
        <div className="flex items-center justify-between py-2 border-b border-[#ECEBF0] text-xs">
          <span className="font-semibold text-[#22212A]">
            Applications Log ({applications.length})
          </span>

          <div className="flex items-center gap-1">
            {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${
                  filter === f
                    ? 'bg-[#24232E] text-white font-medium'
                    : 'text-[#777681] hover:text-[#22212A]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#A2A0AA] italic">
              No applications in this view. Submit a bid or click "Load Sample Bids" above.
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-white border border-[#ECEBF0] rounded-2xl hover:border-[#DDDCE3] transition-colors space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#A58BFA]">
                      {app.id}
                    </span>
                    <span className="text-sm font-semibold text-[#22212A]">
                      {app.projectName}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F8F7FA] text-[#777681]">
                      Cover: {app.preferredCover}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#22212A]">
                      ${app.bidAmount} USD
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' :
                      app.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#777681] bg-[#F8F7FA] p-2.5 rounded-xl">
                  <div><strong>Contact:</strong> {app.fullName} ({app.workEmail})</div>
                  <div><strong>Handle:</strong> {app.xHandle}</div>
                  <div><strong>Website:</strong> <a href={app.projectWebsite} target="_blank" rel="noreferrer" className="text-[#A58BFA] hover:underline">{app.projectWebsite}</a></div>
                </div>

                <p className="text-xs text-[#22212A]">
                  <strong>Pitch:</strong> {app.projectDescription}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#ECEBF0] text-xs">
                  <span className="text-[11px] text-[#A2A0AA]">
                    {new Date(app.submittedAt).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveApplication(app.id)}
                      className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => rejectApplication(app.id)}
                      className="px-3 py-1 rounded-full bg-[#F8F7FA] text-[#777681] hover:text-red-600 text-[11px] font-medium flex items-center gap-1"
                    >
                      <Ban className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#ECEBF0] text-right">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-5 py-2 rounded-full bg-[#24232E] text-white text-xs font-medium hover:bg-[#353342] transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

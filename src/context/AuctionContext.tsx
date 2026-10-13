import React, { createContext, useContext, useState, useEffect } from 'react';
import { PhoneCover, BidRecord, SponsorApplication, ConfirmedSponsor, CoverSlot } from '../types';
import { INITIAL_COVERS, INITIAL_CONFIRMED_SPONSORS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AuctionContextType {
  covers: PhoneCover[];
  bids: BidRecord[];
  applications: SponsorApplication[];
  confirmedSponsors: ConfirmedSponsor[];
  isDemoMode: boolean;
  selectedCoverForBid: CoverSlot;
  setSelectedCoverForBid: (slot: CoverSlot) => void;
  isBidModalOpen: boolean;
  setIsBidModalOpen: (open: boolean) => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (open: boolean) => void;
  isPerksOpen: boolean;
  setIsPerksOpen: (open: boolean) => void;
  activeHistoryCoverId: 'cover-01' | 'cover-02';
  openHistoryFor: (coverId: 'cover-01' | 'cover-02') => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  
  // Actions
  submitBid: (formData: Omit<SponsorApplication, 'id' | 'status' | 'submittedAt'>) => { success: boolean; message: string; refId?: string };
  loadSampleDemoData: () => void;
  resetToCleanState: () => void;
  updateCoverStatus: (coverId: 'cover-01' | 'cover-02', status: PhoneCover['status']) => void;
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string) => void;
  exportApplicationsCSV: () => void;
  exportApplicationsJSON: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COVERS: 'pocketbillboard_covers_v1',
  BIDS: 'pocketbillboard_bids_v1',
  APPLICATIONS: 'pocketbillboard_applications_v1',
  SPONSORS: 'pocketbillboard_sponsors_v1',
  DEMO_MODE: 'pocketbillboard_demo_mode_v1',
};

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [covers, setCovers] = useState<PhoneCover[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COVERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COVERS;
  });

  const [bids, setBids] = useState<BidRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BIDS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [applications, setApplications] = useState<SponsorApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [confirmedSponsors, setConfirmedSponsors] = useState<ConfirmedSponsor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPONSORS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CONFIRMED_SPONSORS;
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true';
  });

  const [selectedCoverForBid, setSelectedCoverForBid] = useState<CoverSlot>('01');
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPerksOpen, setIsPerksOpen] = useState(false);
  const [activeHistoryCoverId, setActiveHistoryCoverId] = useState<'cover-01' | 'cover-02'>('cover-01');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COVERS, JSON.stringify(covers));
  }, [covers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
  }, [bids]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPONSORS, JSON.stringify(confirmedSponsors));
  }, [confirmedSponsors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, isDemoMode.toString());
  }, [isDemoMode]);

  const openHistoryFor = (coverId: 'cover-01' | 'cover-02') => {
    setActiveHistoryCoverId(coverId);
    setIsHistoryModalOpen(true);
  };

  const submitBid = (formData: Omit<SponsorApplication, 'id' | 'status' | 'submittedAt'>) => {
    // 1. Validation against current bids
    const { preferredCover, bidAmount, projectName } = formData;
    
    if (preferredCover === '01') {
      const cover = covers.find(c => c.id === 'cover-01');
      if (cover) {
        if (cover.bidsCount > 0 && bidAmount <= cover.currentBid) {
          return { success: false, message: `Your bid ($${bidAmount}) must exceed the current highest bid ($${cover.currentBid}).` };
        }
        if (bidAmount < cover.startingBid) {
          return { success: false, message: `Starting bid for Cover 01 is $${cover.startingBid}.` };
        }
      }
    } else if (preferredCover === '02') {
      const cover = covers.find(c => c.id === 'cover-02');
      if (cover) {
        if (cover.bidsCount > 0 && bidAmount <= cover.currentBid) {
          return { success: false, message: `Your bid ($${bidAmount}) must exceed the current highest bid ($${cover.currentBid}).` };
        }
        if (bidAmount < cover.startingBid) {
          return { success: false, message: `Starting bid for Cover 02 is $${cover.startingBid}.` };
        }
      }
    } else if (preferredCover === 'both') {
      const cover1 = covers.find(c => c.id === 'cover-01')!;
      const cover2 = covers.find(c => c.id === 'cover-02')!;
      const minBoth = (cover1.bidsCount > 0 ? cover1.currentBid : cover1.startingBid) + 
                      (cover2.bidsCount > 0 ? cover2.currentBid : cover2.startingBid);
      if (bidAmount <= minBoth && (cover1.bidsCount > 0 || cover2.bidsCount > 0)) {
        return { success: false, message: `Combined takeover bid ($${bidAmount}) must be greater than combined current value ($${minBoth}).` };
      }
      if (bidAmount < 50) {
        return { success: false, message: 'Combined starting bid for both covers is $50 minimum ($25 each).' };
      }
    }

    const refId = `BID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Create application
    const newApp: SponsorApplication = {
      ...formData,
      id: refId,
      status: 'PENDING',
      submittedAt: timestamp,
    };

    // Create bid record
    const newBids: BidRecord[] = [];
    if (preferredCover === '01' || preferredCover === 'both') {
      newBids.push({
        id: `${refId}-01`,
        coverId: 'cover-01',
        coverSlotDisplay: 'COVER 01 / SLOT A',
        projectName,
        projectWebsite: formData.projectWebsite,
        amount: preferredCover === 'both' ? Math.round(bidAmount / 2) : bidAmount,
        timestamp,
        isVerified: true,
        status: 'CONFIRMED'
      });
    }

    if (preferredCover === '02' || preferredCover === 'both') {
      newBids.push({
        id: `${refId}-02`,
        coverId: 'cover-02',
        coverSlotDisplay: 'COVER 02 / SLOT B',
        projectName,
        projectWebsite: formData.projectWebsite,
        amount: preferredCover === 'both' ? Math.round(bidAmount / 2) : bidAmount,
        timestamp,
        isVerified: true,
        status: 'CONFIRMED'
      });
    }

    // Update covers
    setCovers(prev => prev.map(cover => {
      if (preferredCover === '01' && cover.id === 'cover-01') {
        return {
          ...cover,
          currentBid: bidAmount,
          highestBidder: projectName,
          highestBidderWebsite: formData.projectWebsite,
          bidsCount: cover.bidsCount + 1,
        };
      }
      if (preferredCover === '02' && cover.id === 'cover-02') {
        return {
          ...cover,
          currentBid: bidAmount,
          highestBidder: projectName,
          highestBidderWebsite: formData.projectWebsite,
          bidsCount: cover.bidsCount + 1,
        };
      }
      if (preferredCover === 'both') {
        const halfBid = Math.round(bidAmount / 2);
        return {
          ...cover,
          currentBid: halfBid,
          highestBidder: `${projectName} (Dual Takeover)`,
          highestBidderWebsite: formData.projectWebsite,
          bidsCount: cover.bidsCount + 1,
        };
      }
      return cover;
    }));

    setApplications(prev => [newApp, ...prev]);
    setBids(prev => [...newBids, ...prev]);

    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F7CD46', '#3159D8', '#F05298', '#A8DDC7', '#F06B48']
      });
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      message: `Bid for ${projectName} submitted successfully! Reference: ${refId}`,
      refId
    };
  };

  const updateCoverStatus = (coverId: 'cover-01' | 'cover-02', status: PhoneCover['status']) => {
    setCovers(prev => prev.map(c => c.id === coverId ? { ...c, status } : c));
  };

  const approveApplication = (appId: string) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: 'ACCEPTED' } : app));
  };

  const rejectApplication = (appId: string) => {
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: 'REJECTED' } : app));
  };

  const resetToCleanState = () => {
    setCovers(INITIAL_COVERS);
    setBids([]);
    setApplications([]);
    setConfirmedSponsors(INITIAL_CONFIRMED_SPONSORS);
    setIsDemoMode(false);
    localStorage.removeItem(STORAGE_KEYS.COVERS);
    localStorage.removeItem(STORAGE_KEYS.BIDS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SPONSORS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_MODE);
  };

  const loadSampleDemoData = () => {
    setIsDemoMode(true);
    const demoCovers: PhoneCover[] = [
      {
        ...INITIAL_COVERS[0],
        currentBid: 65,
        highestBidder: 'ZK-Rollup Labs',
        highestBidderWebsite: 'https://zkrollup.example.com',
        bidsCount: 3,
      },
      {
        ...INITIAL_COVERS[1],
        currentBid: 45,
        highestBidder: 'Orbit Wallet',
        highestBidderWebsite: 'https://orbitwallet.example.com',
        bidsCount: 2,
      }
    ];

    const demoBids: BidRecord[] = [
      {
        id: 'DEMO-1',
        coverId: 'cover-01',
        coverSlotDisplay: 'COVER 01 / SLOT A',
        projectName: 'ZK-Rollup Labs',
        projectWebsite: 'https://zkrollup.example.com',
        amount: 65,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        isVerified: true,
        status: 'CONFIRMED'
      },
      {
        id: 'DEMO-2',
        coverId: 'cover-01',
        coverSlotDisplay: 'COVER 01 / SLOT A',
        projectName: 'Aura Protocol',
        projectWebsite: 'https://aura.example.com',
        amount: 40,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        isVerified: true,
        status: 'OUTBID'
      },
      {
        id: 'DEMO-3',
        coverId: 'cover-02',
        coverSlotDisplay: 'COVER 02 / SLOT B',
        projectName: 'Orbit Wallet',
        projectWebsite: 'https://orbitwallet.example.com',
        amount: 45,
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        isVerified: true,
        status: 'CONFIRMED'
      },
      {
        id: 'DEMO-4',
        coverId: 'cover-02',
        coverSlotDisplay: 'COVER 02 / SLOT B',
        projectName: 'NodeFleet CLI',
        projectWebsite: 'https://nodefleet.example.com',
        amount: 30,
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        isVerified: true,
        status: 'OUTBID'
      }
    ];

    const demoSponsors: ConfirmedSponsor[] = [
      {
        id: 'sponsor-1',
        projectName: 'ETHMumbai Builders',
        tagline: 'Grassroots Web3 Developer Collective',
        coverSlot: 'COVER 01',
        events: 'Devcon + IBW Circuit',
        website: 'https://ethmumbai.example.org',
        themeStyle: 'yellow',
        logoPlaceholder: '⚡ ETH MUMBAI',
        status: 'PRINT APPROVED'
      },
      {
        id: 'sponsor-2',
        projectName: 'GasTank Relay',
        tagline: 'Instant Gasless Transactions on Base & Arb',
        coverSlot: 'COVER 02',
        events: 'Devcon Southeast Asia',
        website: 'https://gastank.example.com',
        themeStyle: 'cobalt',
        logoPlaceholder: '⛽ GASTANK',
        status: 'PRINT APPROVED'
      }
    ];

    setCovers(demoCovers);
    setBids(demoBids);
    setConfirmedSponsors(demoSponsors);
  };

  const exportApplicationsCSV = () => {
    if (applications.length === 0) {
      alert('No applications to export yet.');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Project Name', 'Website', 'X Handle', 'Cover', 'Bid Amount ($)', 'Events', 'Status', 'Submitted At'];
    const rows = applications.map(app => [
      app.id,
      `"${app.fullName}"`,
      `"${app.workEmail}"`,
      `"${app.projectName}"`,
      `"${app.projectWebsite}"`,
      `"${app.xHandle}"`,
      `"${app.preferredCover}"`,
      app.bidAmount,
      `"${app.preferredEvents.join(';')}"`,
      app.status,
      `"${app.submittedAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pocketbillboard_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportApplicationsJSON = () => {
    if (applications.length === 0) {
      alert('No applications to export yet.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pocketbillboard_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AuctionContext.Provider
      value={{
        covers,
        bids,
        applications,
        confirmedSponsors,
        isDemoMode,
        selectedCoverForBid,
        setSelectedCoverForBid,
        isBidModalOpen,
        setIsBidModalOpen,
        isHistoryModalOpen,
        setIsHistoryModalOpen,
        isPerksOpen,
        setIsPerksOpen,
        activeHistoryCoverId,
        openHistoryFor,
        isAdminOpen,
        setIsAdminOpen,
        submitBid,
        loadSampleDemoData,
        resetToCleanState,
        updateCoverStatus,
        approveApplication,
        rejectApplication,
        exportApplicationsCSV,
        exportApplicationsJSON,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

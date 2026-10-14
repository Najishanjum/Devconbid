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
  
  // Actions
  submitBid: (formData: Omit<SponsorApplication, 'id' | 'status' | 'submittedAt'>) => { success: boolean; message: string; refId?: string };
  loadSampleDemoData: () => void;
  resetToCleanState: () => void;
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
    const { preferredCover, bidAmount, fullName, workEmail, agreedTerms } = formData;

    // 1. Basic validation
    if (!fullName || !fullName.trim()) {
      return { success: false, message: 'Please provide your full name or bidder display name.' };
    }
    if (!workEmail || !workEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid contact email address.' };
    }
    if (!agreedTerms) {
      return { success: false, message: 'You must agree to the sponsorship and bidding terms.' };
    }

    const bidderDisplayName = fullName.trim();
    const cover1 = covers.find(c => c.id === 'cover-01')!;
    const cover2 = covers.find(c => c.id === 'cover-02')!;

    // 2. Cover availability & auction status validation
    if (preferredCover === '01') {
      if (cover1.status !== 'OPEN') {
        return { success: false, message: `Cover 01 is currently ${cover1.status.toLowerCase().replace('_', ' ')} and not accepting new bids.` };
      }
      if (cover1.bidsCount > 0 && bidAmount <= cover1.currentBid) {
        return { success: false, message: `Your bid ($${bidAmount}) must exceed the current highest bid ($${cover1.currentBid}).` };
      }
      if (bidAmount < cover1.startingBid) {
        return { success: false, message: `Starting bid for Cover 01 is $${cover1.startingBid}.` };
      }
    } else if (preferredCover === '02') {
      if (cover2.status !== 'OPEN') {
        return { success: false, message: `Cover 02 is currently ${cover2.status.toLowerCase().replace('_', ' ')} and not accepting new bids.` };
      }
      if (cover2.bidsCount > 0 && bidAmount <= cover2.currentBid) {
        return { success: false, message: `Your bid ($${bidAmount}) must exceed the current highest bid ($${cover2.currentBid}).` };
      }
      if (bidAmount < cover2.startingBid) {
        return { success: false, message: `Starting bid for Cover 02 is $${cover2.startingBid}.` };
      }
    } else if (preferredCover === 'both') {
      if (cover1.status !== 'OPEN' || cover2.status !== 'OPEN') {
        return { success: false, message: 'Both covers must be open to place a combined takeover bid.' };
      }
      const minBoth = (cover1.bidsCount > 0 ? cover1.currentBid : cover1.startingBid) + 
                      (cover2.bidsCount > 0 ? cover2.currentBid : cover2.startingBid);
      if (bidAmount <= minBoth && (cover1.bidsCount > 0 || cover2.bidsCount > 0)) {
        return { success: false, message: `Combined takeover bid ($${bidAmount}) must exceed the combined current value ($${minBoth}).` };
      }
      if (bidAmount < 50) {
        return { success: false, message: 'Combined starting bid for both covers is $50 minimum ($25 per cover).' };
      }
    }

    const refId = `BID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Create application record
    const newApp: SponsorApplication = {
      ...formData,
      id: refId,
      status: 'PENDING',
      submittedAt: timestamp,
    };

    // Create itemized bid records
    const newBids: BidRecord[] = [];
    if (preferredCover === '01' || preferredCover === 'both') {
      const slotAmount = preferredCover === 'both' ? Math.round(bidAmount / 2) : bidAmount;
      newBids.push({
        id: `${refId}-01`,
        coverId: 'cover-01',
        coverSlotDisplay: 'COVER 01 / UPPER SHELL',
        projectName: bidderDisplayName,
        amount: slotAmount,
        timestamp,
        isVerified: true,
        status: 'CONFIRMED'
      });
    }

    if (preferredCover === '02' || preferredCover === 'both') {
      const slotAmount = preferredCover === 'both' ? Math.round(bidAmount / 2) : bidAmount;
      newBids.push({
        id: `${refId}-02`,
        coverId: 'cover-02',
        coverSlotDisplay: 'COVER 02 / LOWER SHELL',
        projectName: bidderDisplayName,
        amount: slotAmount,
        timestamp,
        isVerified: true,
        status: 'CONFIRMED'
      });
    }

    // Update covers state
    setCovers(prev => prev.map(cover => {
      if (preferredCover === '01' && cover.id === 'cover-01') {
        return {
          ...cover,
          currentBid: bidAmount,
          highestBidder: bidderDisplayName,
          bidsCount: cover.bidsCount + 1,
        };
      }
      if (preferredCover === '02' && cover.id === 'cover-02') {
        return {
          ...cover,
          currentBid: bidAmount,
          highestBidder: bidderDisplayName,
          bidsCount: cover.bidsCount + 1,
        };
      }
      if (preferredCover === 'both') {
        const halfBid = Math.round(bidAmount / 2);
        return {
          ...cover,
          currentBid: halfBid,
          highestBidder: `${bidderDisplayName} (Dual Takeover)`,
          bidsCount: cover.bidsCount + 1,
        };
      }
      return cover;
    }));

    setApplications(prev => [newApp, ...prev]);
    setBids(prev => [...newBids, ...prev]);

    // Fire confetti celebration
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
      message: `Bid for ${bidderDisplayName} recorded successfully! Reference: ${refId}`,
      refId
    };
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
        highestBidder: 'Alice Vance',
        bidsCount: 3,
      },
      {
        ...INITIAL_COVERS[1],
        currentBid: 45,
        highestBidder: 'David Chen',
        bidsCount: 2,
      }
    ];

    const demoBids: BidRecord[] = [
      {
        id: 'DEMO-1',
        coverId: 'cover-01',
        coverSlotDisplay: 'COVER 01 / UPPER SHELL',
        projectName: 'Alice Vance',
        amount: 65,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        isVerified: true,
        status: 'CONFIRMED'
      },
      {
        id: 'DEMO-2',
        coverId: 'cover-01',
        coverSlotDisplay: 'COVER 01 / UPPER SHELL',
        projectName: 'Devon Miles',
        amount: 40,
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        isVerified: true,
        status: 'OUTBID'
      },
      {
        id: 'DEMO-3',
        coverId: 'cover-02',
        coverSlotDisplay: 'COVER 02 / LOWER SHELL',
        projectName: 'David Chen',
        amount: 45,
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        isVerified: true,
        status: 'CONFIRMED'
      },
      {
        id: 'DEMO-4',
        coverId: 'cover-02',
        coverSlotDisplay: 'COVER 02 / LOWER SHELL',
        projectName: 'Sarah Lin',
        amount: 30,
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        isVerified: true,
        status: 'OUTBID'
      }
    ];

    setCovers(demoCovers);
    setBids(demoBids);
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
        submitBid,
        loadSampleDemoData,
        resetToCleanState,
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

export type CoverSlot = '01' | '02' | 'both';

export interface PhoneCover {
  id: 'cover-01' | 'cover-02';
  slot: '01' | '02';
  title: string;
  subtitle: string;
  colorName: string;
  bgColor: string;
  accentColor: string;
  tabColor: string;
  startingBid: number;
  currentBid: number;
  highestBidder: string | null;
  highestBidderWebsite: string | null;
  highestBidderLogo?: string | null;
  bidsCount: number;
  status: 'OPEN' | 'PENDING_APPROVAL' | 'SOLD' | 'RESERVED';
  deadline: string;
  deadlineDisplay: string;
  description: string;
}

export interface BidRecord {
  id: string;
  coverId: 'cover-01' | 'cover-02' | 'both';
  coverSlotDisplay: string;
  projectName: string;
  projectWebsite: string;
  amount: number;
  timestamp: string;
  isVerified: boolean;
  status: 'CONFIRMED' | 'OUTBID' | 'UNDER_REVIEW';
}

export interface SponsorApplication {
  id: string;
  fullName: string;
  workEmail: string;
  projectName: string;
  projectWebsite: string;
  xHandle: string;
  projectDescription: string;
  logoDataUrl?: string;
  preferredCover: CoverSlot;
  preferredEvents: string[];
  bidAmount: number;
  note?: string;
  agreedTerms: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
}

export interface ConferenceEvent {
  id: string;
  name: string;
  shortCode: string;
  location: string;
  dates: string;
  verified: boolean;
  officialUrl: string;
  badgeColor: string;
  description: string;
  coverageStatus: 'PLANNED' | 'CONFIRMED' | 'TRAVELING';
  highlight: string;
}

export interface SponsorPerk {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bgHex: string;
  textColor: string;
  badge: string;
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Auction' | 'Hardware' | 'Events' | 'Rules';
}

export interface ConfirmedSponsor {
  id: string;
  projectName: string;
  tagline: string;
  coverSlot: 'COVER 01' | 'COVER 02' | 'BOTH COVERS';
  events: string;
  website: string;
  themeStyle: 'yellow' | 'white' | 'cobalt' | 'pink';
  logoPlaceholder: string;
  status: string;
}

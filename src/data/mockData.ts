import { PhoneCover, ConferenceEvent, SponsorPerk, FAQItem, ConfirmedSponsor } from '../types';

export const INITIAL_COVERS: PhoneCover[] = [
  {
    id: 'cover-01',
    slot: '01',
    title: 'THE FIRST COVER',
    subtitle: 'Primary upper-tier back shell · High glanceability in conversations',
    colorName: 'Cobalt Blue / Carbon',
    bgColor: '#171512',
    accentColor: '#3159D8',
    tabColor: '#3159D8',
    startingBid: 25,
    currentBid: 25,
    highestBidder: null,
    highestBidderWebsite: null,
    bidsCount: 0,
    status: 'OPEN',
    deadline: '2026-11-01T23:59:59+05:30',
    deadlineDisplay: 'NOV 1, 2026 · 23:59 IST',
    description: 'Upper physical back plate. Features a dedicated 70mm × 45mm matte-printed sponsor logo block right beneath the dual-lens camera ring.'
  },
  {
    id: 'cover-02',
    slot: '02',
    title: 'THE SECOND COVER',
    subtitle: 'Secondary lower-tier back plate · Palm-held visibility when in use',
    colorName: 'Bright Poster Yellow',
    bgColor: '#F7CD46',
    accentColor: '#171512',
    tabColor: '#F7CD46',
    startingBid: 25,
    currentBid: 25,
    highestBidder: null,
    highestBidderWebsite: null,
    bidsCount: 0,
    status: 'OPEN',
    deadline: '2026-11-01T23:59:59+05:30',
    deadlineDisplay: 'NOV 1, 2026 · 23:59 IST',
    description: 'Lower physical snap-on back shell. Features a bold 75mm × 50mm printed logo canvas with contrast border, directly visible when held upright.'
  }
];

export const EVENTS_DATA: ConferenceEvent[] = [
  {
    id: 'devcon',
    name: 'DEVCON SOUTHEAST ASIA & ROADSHOW',
    shortCode: 'DEVCON_2026',
    location: 'Bangkok / Mumbai Web3 Circuit',
    dates: 'NOV 12 – 15, 2026',
    verified: true,
    officialUrl: 'https://devcon.org',
    badgeColor: '#3159D8',
    coverageStatus: 'CONFIRMED',
    highlight: 'Main stage talks, hacker lounges, developer workshops & side parties',
    description: 'The premier Ethereum gathering of the year. Phone will be actively carried throughout official sessions, builder hubs, and evening gatherings.'
  },
  {
    id: 'ibw',
    name: 'INDIA BLOCKCHAIN WEEK (IBW)',
    shortCode: 'IBW_MUMBAI',
    location: 'Sheraton Grand / BKC Mumbai',
    dates: 'DEC 4 – 8, 2026',
    verified: true,
    officialUrl: 'https://indiablockchainweek.com',
    badgeColor: '#F06B48',
    coverageStatus: 'CONFIRMED',
    highlight: 'India’s largest Web3 ecosystem conference & hacker house',
    description: 'Ground zero for the Indian Web3 builder community. Guaranteed high-touch networking across hackathon pitches, founder dinners, and expo corridors.'
  },
  {
    id: 'ethglobal',
    name: 'ETHGLOBAL HACKATHONS & SIDE STAGES',
    shortCode: 'ETH_GLOBAL',
    location: 'Official Hackathons & Pop-Up Hubs',
    dates: 'FALL / WINTER CIRCUIT 2026',
    verified: true,
    officialUrl: 'https://ethglobal.com',
    badgeColor: '#F05298',
    coverageStatus: 'TRAVELING',
    highlight: '36-hour hackathons, mentor tables & demo day presentations',
    description: 'Where thousands of developers build protocols from scratch. My phone will sit on hacker desks, charging stations, and during project demos.'
  }
];

export const PERKS_DATA: SponsorPerk[] = [
  {
    id: 'perk-1',
    title: 'REAL-WORLD LOGO PLACEMENT',
    tagline: 'High-density physical UV print',
    description: 'Your approved project logo or name printed cleanly on the physical modular smartphone cover. Crisp, durable, and eye-catching.',
    bgHex: '#F7CD46',
    textColor: '#171512',
    badge: 'HARDWARE',
    iconName: 'Smartphone'
  },
  {
    id: 'perk-2',
    title: 'BUILDER EVENT VISIBILITY',
    tagline: 'Carried into Devcon, IBW & ETHGlobal',
    description: 'I will physically hold and use this phone every single day during key conference sessions, builder roundtables, and official side events.',
    bgHex: '#3159D8',
    textColor: '#FCFBF7',
    badge: 'PRESENCE',
    iconName: 'Compass'
  },
  {
    id: 'perk-3',
    title: 'SOCIAL MEDIA MENTION',
    tagline: 'Pre-event & live on X / Twitter',
    description: 'Dedicated post highlighting your project, explaining why you took this unconventional billboard, with links to your app or docs.',
    bgHex: '#F05298',
    textColor: '#FCFBF7',
    badge: 'X / TWITTER',
    iconName: 'Send'
  },
  {
    id: 'perk-4',
    title: 'PROJECT DIRECTORY',
    tagline: 'Permanent homepage tribute',
    description: 'Your project receives an approved listing on this website with verified badges, active links, one-line pitch, and sponsor story.',
    bgHex: '#A8DDC7',
    textColor: '#171512',
    badge: 'ON-SITE',
    iconName: 'Globe'
  },
  {
    id: 'perk-5',
    title: 'EVENT PHOTO REEL',
    tagline: 'Photos & video clips from the floor',
    description: 'High-res photos and candid video clips featuring your phone cover in action across conference halls, badge desks, and meetups.',
    bgHex: '#F06B48',
    textColor: '#FCFBF7',
    badge: 'CONTENT',
    iconName: 'Camera'
  },
  {
    id: 'perk-6',
    title: 'BOTH COVERS COMBO',
    tagline: '100% phone back real estate',
    description: 'Sponsor both Slot A and Slot B ($50 starting bid combined) to own the entire physical smartphone back with zero co-sponsors.',
    bgHex: '#171512',
    textColor: '#F7CD46',
    badge: 'TAKEOVER',
    iconName: 'Layers'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Hardware',
    question: 'Why are you sponsoring phone covers instead of selling digital banner ads?',
    answer: 'At crypto conferences, everyone is blind to standard banners, pull-up stands, and generic tote bags. But everyone notices the phone someone pulls out to scan Telegram handles, take selfies, check schedules, or show a demo. It sparks instant organic questions: "Wait, what is printed on your phone?" It is personal, hilarious, and 10x more memorable.'
  },
  {
    id: 'faq-2',
    category: 'Auction',
    question: 'How much does each cover cost to sponsor?',
    answer: 'Each cover starts at exactly $25 USD. Cover 01 starts at $25, Cover 02 starts at $25. If you want to claim both covers at once, the combined starting bid is $50. Once someone places a valid bid, new bids must exceed the current highest bid.'
  },
  {
    id: 'faq-3',
    category: 'Auction',
    question: 'Can I bid on both covers at the same time?',
    answer: 'Yes! In the application form, select "Both Covers (Combined Takeover)". Your bid will apply across both Slot 01 and Slot 02, allowing you to dominate the entire phone back without sharing it with another project.'
  },
  {
    id: 'faq-4',
    category: 'Hardware',
    question: 'What exactly does the winning sponsor receive?',
    answer: 'You receive: (1) High-quality UV print of your approved logo/mascot on the physical phone back; (2) Daily in-person event carriage throughout Devcon, IBW, and ETHGlobal circuit; (3) Official project directory listing on this site; (4) Agreed social media shoutout on X; (5) Photo/video proof package taken live from the conference floors.'
  },
  {
    id: 'faq-5',
    category: 'Events',
    question: 'Which events will the phone actually attend?',
    answer: 'The primary confirmed tour includes Devcon Southeast Asia / Mumbai Roadshows, India Blockchain Week (IBW) in Mumbai/Bangalore, and associated ETHGlobal hackathons and ecosystem side events during Q4 2026.'
  },
  {
    id: 'faq-6',
    category: 'Auction',
    question: 'How does the bidding process work?',
    answer: 'Submit your bid through the application form with your project name, website, and bid amount (must exceed current highest bid). The bid is recorded, and the team reviews project logos to ensure community guidelines compliance. You can return anytime before the auction closes to increase your bid.'
  },
  {
    id: 'faq-7',
    category: 'Auction',
    question: 'When is payment due and how is it paid?',
    answer: 'Payment is due within 48 hours of auction closing upon winning bid confirmation. Payment is accepted in crypto (USDC / ETH on Arbitrum/Optimism/Base/Ethereum) or fiat transfer. Submitting a bid does not charge your card or finalize a purchase until officially accepted.'
  },
  {
    id: 'faq-8',
    category: 'Hardware',
    question: 'Can you print my logo in specific brand colors?',
    answer: 'Yes! Once your bid wins, we will request your vector SVG or high-resolution PNG (300 DPI+). We run test prints on UV polymer substrate to verify sharp line fidelity and exact Pantone/hex color rendering before event departure.'
  },
  {
    id: 'faq-9',
    category: 'Auction',
    question: 'What happens if my bid is unsuccessful?',
    answer: 'If you are outbid and choose not to bid higher, you owe nothing. If you still want visibility, we can feature your project in the builder directory honorable mentions or notify you first for the next conference season.'
  },
  {
    id: 'faq-10',
    category: 'Rules',
    question: 'Are you officially affiliated with Devcon, IBW, or ETHGlobal?',
    answer: 'No. This is an entirely independent, personal creative campaign organized by a builder attending these conferences. It is not officially organized, sponsored, endorsed, or affiliated with the Ethereum Foundation, Devcon, India Blockchain Week, or ETHGlobal.'
  },
  {
    id: 'faq-11',
    category: 'Rules',
    question: 'Can my project be rejected?',
    answer: 'Yes. To protect the integrity of the campaign and adhere to event community guidelines, we reject obvious scams, malicious pump-and-dump tokens, illegal products, or NSFW content. Legitimate open-source protocols, developer tooling, DAOs, infrastructure projects, and creative Web3 experiments are enthusiastically welcomed!'
  }
];

export const INITIAL_CONFIRMED_SPONSORS: ConfirmedSponsor[] = [
  // Clean initial state: no fake confirmed sponsors in production!
];

# Backsy — Premium Web3 Phone Cover Sponsorship Platform

> **A minimal, elegant SaaS design for an independent physical phone-cover sponsorship auction targeting Devcon, India Blockchain Week (IBW), and ETHGlobal.**

---

## 🚀 Live Application

The redesigned application is active and running locally at:
👉 **`http://localhost:5173/`**

To run the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

---

## 🎨 Design System & Aesthetic (Inspired by Sniply)

- **Canvas & Framing**:
  - Outer background: Deep charcoal (`#1F1E29`) with generous margins on desktop.
  - Central canvas: Clean white rounded sheet (`#FFFFFF`, border radius `14px-20px`, max width `1160px`).
- **Typography**:
  - Font family: `Inter`, system-ui, sans-serif.
  - Hero headline: Large, lightweight-to-medium font weight, tight letter-spacing (`-0.035em`), line-height `1.08`.
  - Section headings: `32–44px`, medium/semibold weight, tight line height.
  - Body text: `14–16px`, muted gray (`#777681`) for secondary text.
- **Color System**:
  - Outer background: `#1F1E29`
  - Canvas: `#FFFFFF`
  - Text main: `#22212A`
  - Text secondary: `#777681`
  - Borders: `#ECEBF0`
  - Light surface: `#F8F7FA`
  - Primary button: `#24232E` (pill-shaped, white text)
  - Secondary button: `#FFFFFF` (pill-shaped, light-gray border)
  - Soft lavender / warm pink: `#F0EAF8` / `#FBF0EA`
  - Accent purple: `#A58BFA`
- **Product Demonstration Panel**:
  - Large rounded product showcase container set on a soft lavender/warm-pink surface.
  - Studio-presentation mockups of the physical iPhone 16 Pro back covers with clean sponsor placeholders, pricing, and live bid buttons.

---

## 📱 Core Features & Functionality

1. **Dual Physical Phone Covers**:
   - **Cover 01 (Slot A)**: Upper phone case. Starting bid **$25**.
   - **Cover 02 (Slot B)**: Lower phone case. Starting bid **$25**.
   - **Both Covers Takeover**: Exclusive dual coverage starting at **$50** combined.
2. **Interactive Bidding Engine**:
   - Independent bidding for Cover 01 and Cover 02.
   - Real-time client & server validation: new bids must exceed the current highest bid.
   - Confidential applicant contact info (only display name and amount shown publicly).
3. **Confirmed Sponsorship Payment System (INR + USDC on Base)**:
   - **Option A — INR via UPI**:
     - Configured UPI VPA & Payee Name.
     - Dynamic UPI QR code generated with exact locked payable amount and reference.
     - Payer enters 12-digit UTR upon completion.
     - Marked `pending_verification` — manual reconciliation outside the public website by the organizer.
     - Secure CLI verification command: `npm run verify-upi -- <paymentId> [notes]`.
   - **Option B — Native USDC on Base Mainnet**:
     - Direct transfers to configured Base wallet (MetaMask, Trust Wallet, Phantom, etc.).
     - No wallet connection required.
     - Real server-side on-chain verification using Base RPC (`https://mainnet.base.org`).
     - Verifies native USDC token contract (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`), ERC-20 `Transfer` event, recipient address, 6 decimal places, and block finality policy.
     - Prevents duplicate transaction hash reuse.
4. **Gateway Integration Readiness**:
   - Clean `IPaymentProvider` interface for adding commercial payment gateways (Razorpay, PhonePe) once written merchant category approval is obtained.
5. **Operational CLI Management (No Public Admin Panel)**:
   - List sponsorships & payments: `npm run manage-sponsorships list`
   - Generate unique winner payment link: `npm run manage-sponsorships create <01|02|both> <winningBidUsd> <winnerName> <winnerEmail>`
   - Verify UPI payment: `npm run verify-upi <paymentId> "Verified in bank app"`
6. **Tour Destinations**:
   - Verified details for Devcon Southeast Asia, India Blockchain Week (IBW), and ETHGlobal.
7. **Transparency & Disclaimers**:
   - Clear disclosure that this is an independent creator initiative not affiliated with or endorsed by Devcon, IBW, or ETHGlobal.

Built by najish   for devcon
IBW 

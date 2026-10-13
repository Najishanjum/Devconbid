# POCKETBILLBOARD — Premium Web3 Phone Cover Sponsorship Platform

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
   - Server-style validation: new bids must exceed the current highest bid.
   - Confidential applicant information (public logs show project name and amount only).
   - Celebration confetti on valid bid submission.
3. **Admin Operations Panel**:
   - Access via the **Admin** button in navigation or footer.
   - Review pending, approved, and rejected applications.
   - Export applications to **CSV** or **JSON**.
   - Toggle **Demo Mode** to test with mock data or reset to a 100% clean zero-bid state.
4. **Tour Destinations**:
   - Verified details for Devcon Southeast Asia, India Blockchain Week (IBW), and ETHGlobal.
5. **Transparency & Disclaimers**:
   - Clear disclosure that this is an independent creator initiative not affiliated with or endorsed by Devcon, IBW, or ETHGlobal.

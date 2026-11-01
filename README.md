# METRO-PROBATI-DIGITAL-TRANSPORT-PLATFORM

# মেট্রো প্রভাতী (Metro Probati) — Digital Transport Platform

**মেট্রো প্রভাতী | METRO PROBATI**
*Chattogram's Premier Digital Transit Network*
**Corridor:** কাপ্তাই রাস্তার মাথা ↔ কাঠগড় (Kaptai Rastar Matha ↔ Katgor via Bahaddarhat, Muradpur, 2 No Gate, GEC, WASA, Dewanhat, Chowmuhani, Agrabad, Saltgola, and EPZ).

---

## 🌟 Platform Highlights

1. **Bengali-First Responsive Website (`/`, `/routes`, `/counters`, `/fares`)**:
   - Modern Bangladeshi transit identity with deep navy, teal/emerald accents, crisp cards, and typography powered by *Hind Siliguri* & *Inter*.
   - Instant language switcher (বাংলা / English).
   - One-touch emergency helplines (`01798542469`, `01918695599`) and WhatsApp integration.

2. **Genuine Live Bus Radar & Google Maps Tracking (`/tracking`)**:
   - Strictly genuine telemetry ingestion (`/api/tracking/ping`). **Zero simulated/fake movement**.
   - GPS Freshness Classification:
     - 🟢 **Active (<3 mins)**: Glowing radar ping
     - 🟡 **Stale (3-10 mins)**: Delayed advisory
     - ⚪ **Unavailable (>10 mins / offline)**: Status offline
   - Fallback SVG corridor radar map for low-bandwidth environments.
   - Transparent disclosure of mobile browser background limitations + PWA support.

3. **Stage-Based Fare Calculator (`/fares`)**:
   - Dynamic 11x11 corridor fare calculation: Minimum fare ৳10 (1 stage) up to ৳45 (10 stages terminal-to-terminal).
   - Bengali numerals (`০-৯`) and BDT symbol formatting (`৳`).
   - Clear operator ratification disclaimers.

4. **Atomic Bus Seat Reservation (`/tickets`)**:
   - 38-seat interior bus layout (2x2 with aisle, plus back row) + 15 regulated standing capacity.
   - 5-minute atomic reservation hold with live countdown timer to prevent double-booking.
   - Digital QR verified ticket generation and printable pass.

5. **Sandbox Payment Gateway Simulator (`/payment/sandbox-checkout`)**:
   - Support for bKash, Nagad, Rocket, and Cash-at-Counter.
   - **Strict Security**: Never asks for customer PIN or OTP on client.

6. **Dedicated Operational Portals**:
   - **Counter Representative (`/counter`)**: Walk-in POS ticketing, cash intake, supervisor speed-dial, and shift sales tally.
   - **Bus Supervisor (`/supervisor`)**: Onboard seated & standing capacity counter, standing limit compliance (max 15), and emergency incident dispatch.
   - **Driver Location Sharing (`/driver`)**: Geolocation `watchPosition` transmitter, ping monitor, battery API, and off-duty privacy toggle.
   - **Super Admin Console (`/admin`)**: Fleet management, counter and stop editor, fare matrix controls, bookings audit log, and helpline config.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2.15 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS, Hind Siliguri Google Font, Lucide React Icons
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS) & Realtime
- **Telemetry**: Browser Geolocation API + Geofenced REST Endpoints
- **Payments**: Multi-gateway abstraction layer (bKash / Nagad / Rocket / Cash)
- **Testing**: Node 24 native test runner with `tsx` (`7/7 pass`)
- **Deployment**: Vercel & GitHub Actions ready

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & Node 24)
- npm 9+

### 2. Installation
```bash
# Clone the repository
cd metro-probati-platform

# Install dependencies (respecting npm script permissions)
npm install --ignore-scripts
```

### 3. Running Locally
```bash
# Development mode
npm run dev

# Or build and run production server
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Validation

```bash
# Run unit & concurrency test suite
npm test

# Run strict TypeScript verification
npm run typecheck

# Run Next.js ESLint
npm run lint
```

All 7 automated tests verify Bengali numeral conversion, stage fare calculation, geofencing, GPS freshness, double-booking prevention, and payment verification.

---

## 📚 Documentation Guides

- [Admin Operations Guide](./ADMIN_GUIDE.md)
- [Payment Gateways Setup](./PAYMENT_GATEWAYS.md)
- [Google Maps Setup Guide](./GOOGLE_MAPS_SETUP.md)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)

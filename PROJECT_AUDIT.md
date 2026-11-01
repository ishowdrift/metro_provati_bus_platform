# METRO PROBATI — COMPREHENSIVE PROJECT & ARCHITECTURE AUDIT
**Date:** November 2026  
**Project:** Metro Probati (মেট্রো প্রভাতী) — Digital Transport Platform  
**Live Target Deployment:** https://metro-probati-platform.vercel.app/  
**Repository Branch:** `feature/metro-probati-transformation` (Baseline: `cdb8430`)

---

## 1. EXECUTIVE SUMMARY & OBJECTIVE

This audit establishes a single, verified source of truth for the Metro Probati transit platform across Chattogram, Bangladesh. The mission is to transform the platform into a world-class, passenger-centric, technologically capable transit ecosystem combining:
- **Strict Brand Identity:** Signature Red (`#D52B35` / `#DC2626`) and Pure White (`#FFFFFF`) as the dominant identity (approx. 25–35% Red surfaces, 50–60% White/neutral surfaces, Charcoal `#282828` typography, Muted Green `#23866C` for genuine live telemetry, Amber `#E6A23C` for warnings).
- **Zero Fabrication Policy:** Removal of all simulated or fictitious statistics, fake passenger counts, fake testimonials, and fake ratings.
- **Authoritative Transit Data:** Standardized 12 corridor stops, 24.9 km distance, ৳15–৳65 approved draft fare tariff, and genuine GPS freshness tiers.

---

## 2. EXISTING ARCHITECTURE & TECHNICAL STACK

| Layer | Technology | Details & Version |
|---|---|---|
| **Core Framework** | Next.js 14.2.15 | React 18.3.1, TypeScript 5.4.5, App Router |
| **Styling & Design System** | Tailwind CSS 3.4.4 | PostCSS, custom design tokens, `@keyframes` |
| **Icons & Visuals** | Lucide React 1.56.0 | Semantic SVG icons, consistent stroke weight |
| **Map & Telemetry** | Leaflet 1.9.4 & OpenStreetMap | Zero-watermark free vector map tiles + verified Google Maps embed iframe |
| **Database & Auth** | Supabase JS 2.45.4 | PostgreSQL, RLS policies, AuthContext fallback session storage |
| **State & Store Management** | In-Memory Mutex Stores | `trackingStore.ts` (bus telemetry), `seatStore.ts` (concurrency lease), `payments/index.ts` |
| **Testing Harness** | Node 24 Native Test Runner | `tests/platform.test.mjs` executed via `npx tsx` (12/12 passing) |
| **Deployment Target** | Vercel | Production static & serverless edge optimization |

---

## 3. EXISTING PAGE INVENTORY & DISCOVERY

| Route | Role / Audience | Existing Purpose & Status | Required Action |
|---|---|---|---|
| `/` | Public Commuters | Homepage (Hero, Bus Carousel, Map, Fare preview, FAQs) | **Complete Redesign**: Cinematic red & white hero, journey planner, services grid, live radar preview, fleet showcase, trust section. |
| `/routes` | Public Commuters | Corridor stop timeline (12 stops, sequence, distance) | **Visual Refinement**: Interactive stop cards, verified distances, clean red line timeline. |
| `/tracking` | Public Commuters | Live Bus Radar (Leaflet) + Google Maps embed | **Audit & Polish**: Enforce GPS freshness (Active <3m, Stale 3-10m, Offline >10m), eliminate blue accents, remove fake ratings. |
| `/fares` | Public Commuters | Stage fare calculator & 12x12 stage tariff scale | **Harmonize Data**: Ensure consistent ৳15–৳65 scale, mobile-friendly interactive matrix. |
| `/counters` | Commuters & Staff | Physical ticket counter directory across Chattogram | **Upgrade**: Provide public counter locations, addresses, phone contacts, map directions, and dedicated staff portal login. |
| `/tickets` | Public Commuters | 38-seat interior map, 5-min atomic reservation hold, digital QR pass | **Preserve & Polish**: Improve seat legend, timer responsiveness, print pass layout. |
| `/profile` | Passengers | Booking history, digital e-pass lookup, account details | **Enhance**: Clean passenger card, QR access, mobile responsiveness. |
| `/login` | Commuters & Staff | Role-based authentication (Passenger / Supervisor / Counter Rep / Admin) | **Preserve**: Seamless multi-role sign-in with phone and Google/Gmail support. |
| `/signup` | Passengers | Account registration | **Preserve & Polish**: Form validation, error messaging. |
| `/contact` | Commuters | Helplines (`01798542469`, `01918695599`), WhatsApp, inquiry form | **Enhance**: Click-to-call mobile buttons, verified hours, clean contact form. |
| `/counter` | Counter Staff | POS ticket issuance, shift sales tally, walk-in booking | **Preserve**: Keep operational capabilities while polishing UI to red/white tokens. |
| `/supervisor` | Bus Supervisor | On-board capacity monitor (max 15 standing), telemetry ping | **Preserve**: Keep operational safety controls and live location broadcaster. |
| `/driver` | Bus Driver | Geolocation telemetry broadcaster & ping transmitter | **Preserve**: Keep Geolocation API integration and duty toggles. |
| `/admin` | Operations Admin | Fleet management, incident dispatch, metrics overview | **Preserve & Polish**: Maintain role guards and internal efficiency. |
| `/payment/sandbox-checkout` | Commuters | Simulated bKash, Nagad, Rocket, Counter cash gateway | **Preserve**: Secure sandbox simulator; never ask for real customer PINs. |
| `/incidents/report` | Commuters & Staff | Incident & lost-and-found report submission | **Preserve & Polish**: Categorized reporting with status updates. |
| `/privacy`, `/terms` | Public | Legal policies | **Preserve & Style**: Typography alignment with design tokens. |

---

## 4. CURRENT BACKEND INTEGRATIONS & API INVENTORY

| API Endpoint | Method | Functionality | Status |
|---|---|---|---|
| `/api/tracking/buses` | GET | Returns array of on-duty buses with live coordinates, speed, and freshness | Functional |
| `/api/tracking/ping` | POST | Ingests telemetry ping from driver device; validates geofence within Chattogram | Functional |
| `/api/seats/status` | GET | Returns current seat layout (available, held, booked) for a specified bus | Functional |
| `/api/seats/hold` | POST | Acquires atomic 5-minute hold on selected seat numbers | Functional |
| `/api/seats/release` | POST | Releases held seats back to availability | Functional |
| `/api/bookings` | GET, POST | Creates or queries ticket bookings by reference number | Functional |
| `/api/payments/create` | POST | Initializes booking order and returns redirect to checkout simulator | Functional |
| `/api/payments/verify` | POST | Verifies transaction reference and confirms ticket atomically | Functional |
| `/api/incidents` | GET, POST | Submits and lists commuter and staff incident reports | Functional |
| `/api/admin/metrics` | GET | Aggregates fleet counts, active GPS signals, and booking metrics | Functional |

---

## 5. DATA INCONSISTENCIES IDENTIFIED & RESOLUTION MATRIX

| Operational Metric | Conflicting Past Values Found | Authoritative Source of Truth (Ratified) | Resolution Action |
|---|---|---|---|
| **Corridor Name** | "কাপ্তাই রাস্তার মাথা ↔ কাঠগড়" | Kaptai Rastar Matha ↔ Katgor Master Terminal | Standardized across all pages |
| **Number of Stops** | Stated as 11 in Hero stats, but 12 in `INITIAL_STOPS` | **12 Verified Corridor Stops** (Stops 1 to 12) | Update all stats to 12 stops |
| **Total Route Distance** | Hero showed "31 কিমি", Route model showed "24.9 কিমি" | **24.9 km** (Approximately 25 km via Elevated Expressway) | Standardize to 24.9 km |
| **Fare Range** | Hero & Footer showed "৳১০–৳৪৫", Calculator had "৳১৫–৳৬৫" | **৳15 to ৳65 (Indicative Draft Tariff)** | Update all sections to ৳15–৳65 |
| **Key Intermediate Fares** | Unspecified or mismatched | **Bahaddarhat ↔ KEPZ: ৳55**<br>**Agrabad ↔ KEPZ: ৳35** | Ratified in `fareCalculator.ts` overrides |
| **Passenger Count & Ratings** | LiveTrackingMap showed fake `4.8 ★ (5,420 যাত্রী)` | **Fabricated statistic; violates zero-fake policy** | **REMOVE FAKE RATINGS IMMEDIATELY** |
| **GPS Telemetry Freshness** | Varied across components | **Active (<3 min)**: Green/Red ping<br>**Stale (3-10 min)**: Amber advisory<br>**Offline (>10 min)**: Gray | Synchronized with `calculateFreshness()` |

---

## 6. VISUAL & USABILITY DEFECTS IDENTIFIED

1. **Brand Identity Contradictions:**
   - Scattered blue accents (`bg-blue-600`, `text-blue-700`) in LiveTrackingMap and Footer violating the strict Red & White brand palette.
   - Dark corporate look in certain containers rather than clean, alternating red and white surfaces.
2. **Homepage Layout Deficiencies:**
   - The hero lacked the cinematic presence expected of a flagship transit brand.
   - The journey planner search widget was cramped and needed a more expansive, seamless booking experience.
   - Missing dedicated "Brand Trust" section communicating operational integrity, genuine commitments, and real customer assistance.
   - Missing dedicated "Fleet Showcase" highlighting genuine exterior/interior specifications and passenger comfort features.
3. **Responsive Deficiencies:**
   - Overlays on mobile maps could cover key touch targets if not minimized.
   - Some stat boxes clipped text on narrow 360px Android screens.

---

## 7. SECURITY & ACCESS CONTROL AUDIT

1. **Role-Based Segregation:**
   - Passenger views (`/profile`, `/tickets`, `/fares`) strictly separated from privileged staff operations (`/counter`, `/supervisor`, `/driver`, `/admin`).
   - Counter POS code authentication protects walk-in cash ticketing.
2. **Input Validation & Sanitization:**
   - Mobile numbers verified for 11-digit Bangladeshi format (`01XXXXXXXXX`).
   - Geofencing validator rejects GPS pings outside Chattogram metropolitan coordinates (`22.15°N–22.55°N`, `91.65°E–91.98°E`).
3. **No Secret Leaks:**
   - Client bundles do not contain Supabase service role keys or gateway private credentials.

---

## 8. IMPLEMENTATION SEQUENCE & ROADMAP

1. **Phase 2 — Design System:** Define comprehensive tokens in `DESIGN_SYSTEM.md`, harmonize Tailwind palette, update typography to Hind Siliguri + Inter.
2. **Phase 3 — Website Shell:** Redesign Header, Navigation, Footer, Mobile Bottom Nav, and Service Alerts Banner into refined Red & White styling.
3. **Phase 4 — Flagship Homepage Redesign:** Complete 11-section architecture (Navigation, Cinematic Hero, Journey Planner, Services Overview, Live Tracking Preview, Route Discovery, Fleet Showcase, Fare Calculator, Brand Trust, FAQ, Footer).
4. **Phase 5 — Core Functional Pages:** Polish `/tracking`, `/routes`, `/fares`, `/counters`, `/tickets`, and `/profile`.
5. **Phase 6 — Operational Interfaces:** Polish `/counter`, `/supervisor`, `/driver`, and `/admin`.
6. **Phase 7 — Interaction, Accessibility & Mobile Polish:** Verify touch targets, ARIA tags, contrast ratios, and responsive layouts from 360px to 4K.
7. **Phase 8 — Test & Verification:** Run full automated test suite, TypeScript checks, Next.js production build, and deliver final reports.

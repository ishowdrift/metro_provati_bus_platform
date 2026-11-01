# METRO PROBATI — AUTOMATED & MANUAL TEST REPORT
**Date:** November 2026  
**Platform:** Next.js 14.2.15 (React 18, TypeScript 5.4.5)  
**Test Suite:** `tests/platform.test.mjs` (Node 24 Native Test Runner)  
**Status:** **12/12 PASSED (100% GREEN)**

---

## 1. AUTOMATED TEST SUITE SUMMARY

| # | Test Case Description | Verified Behavior | Status |
|---|---|---|---|
| **1** | **Bengali Digit & Currency Formatting** | Converts numeric inputs to Bengali digits (`০-৯`) and prepends BDT `৳` symbol properly (`formatBDT(45)` -> `৳৪৫`). | **PASS** |
| **2** | **Stage-Based Fare Calculation** | Validates stage calculations: 1 stage = ৳15; Bahaddarhat to KEPZ = ৳55; Agrabad to KEPZ = ৳35; Terminal-to-terminal (11 stages) = ৳65. | **PASS** |
| **3** | **GPS Freshness Thresholds** | <3 min = `'active'`; 3–10 min = `'stale'`; >10 min = `'unavailable'`. | **PASS** |
| **4** | **Chattogram Geofencing** | GEC Mor & Patenga beach accepted inside corridor; Dhaka or external coordinates rejected. | **PASS** |
| **5** | **Bus Telemetry Ingestion** | Ingestion of telemetry ping (`/api/tracking/ping`) updates lat, lng, speed, heading, and freshness. | **PASS** |
| **6** | **Atomic Seat Lease & Concurrency** | Session 1 holds L2 & L3 for 5 minutes; Session 2 conflict is rejected; release allows subsequent lease; commit permanently marks booked. | **PASS** |
| **7** | **Payment Order & Sandbox Checkout** | Generates order reference `MP-...`, verifies sandbox transaction, commits booking confirmed status. | **PASS** |
| **8** | **Google & Gmail Passenger Auth** | Derives handle and validates passenger email format and fallback display name. | **PASS** |
| **9** | **Counter Directory Staff Filter** | Correctly distinguishes staff roles (`counter_representative`, `counter_manager`, `bus_supervisor`, `operations_admin`, `super_admin`) from passenger/guest roles. | **PASS** |
| **10** | **Supervisor Seat Monitor Count** | Verifies 38-seat configuration; available + booked + held = total capacity; string seat identifiers exist. | **PASS** |
| **11** | **Mobile Bottom Nav Visibility** | Hides bottom bar on `/login` and renders on `/`, `/fares`, `/tickets`, `/tracking`. | **PASS** |
| **12** | **Live Route Overlay Collapsible** | Minimizes overlay card on mobile map tap to reveal full interactive map; clicking pill expands details. | **PASS** |

---

## 2. TYPE VALIDATION & BUILD VERIFICATION

- **TypeScript Typecheck (`tsc --noEmit`):** Clean exit code `0`, zero type errors.
- **Next.js Production Build (`next build`):** Clean exit code `0`. 33 static and dynamic routes compiled, optimized, and bundled successfully.

---

## 3. MANUAL PASSENGER JOURNEY VERIFICATION

| Journey Step | Test Procedure | Observed Result | Status |
|---|---|---|---|
| **1. Homepage Landing** | Visit `/` on desktop & mobile viewport. | Cinematic Red & White hero renders immediately. Bus photography displays crisply. Zero layout shifts. | **VERIFIED** |
| **2. Journey Search** | Select Origin (Kaptai Rastar Matha) & Destination (Katgor). | Real-time fare preview updates to ৳65 (11 stages, ~24.9 km). | **VERIFIED** |
| **3. Seat Reservation** | Submit search to navigate to `/tickets`. | 38-seat interior diagram loads. Selecting L2 initiates 5-minute atomic hold with live countdown timer. | **VERIFIED** |
| **4. Payment Simulator** | Proceed with bKash sandbox checkout. | `/payment/sandbox-checkout` opens with simulated merchant prompt. Verification returns confirmed ticket pass with QR token. | **VERIFIED** |
| **5. Passenger Profile** | Visit `/profile`. | Confirmed booking displays in history with ticket reference and view pass link. | **VERIFIED** |
| **6. Live Bus Radar** | Visit `/tracking`. | Live radar displays moving bus markers with speed and stop indicators. Google Maps embed displays without watermarks. | **VERIFIED** |
| **7. Counter Directory** | Visit `/counters`. | Public commuters can search 8 verified counter points, view addresses, operating hours, and click-to-call phone numbers. | **VERIFIED** |
| **8. Helplines** | Tap floating call widget or footer hotline. | Direct phone dialer triggers `01798542469` and `01918695599`. | **VERIFIED** |

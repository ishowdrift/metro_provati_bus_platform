# METRO PROBATI — DESIGN SYSTEM SPECIFICATION
**Version:** 2.0  
**Theme:** Premium Urban Transit & Passenger Intelligence  
**Core Palette:** Signature Red & Pure White

---

## 1. BRAND COLOUR SYSTEM & TOKENS

The brand identity of Metro Probati is strictly **Red and White**, matching the real transit fleet in Chattogram.

```
┌────────────────────────────────────────────────────────┐
│  SURFACE DISTRIBUTION:                                 │
│  ████████████████████████████ White & Light (~55%)     │
│  ████████████████ Brand Red & Accents (~30%)           │
│  ██████ Charcoal & Supporting States (~15%)            │
└────────────────────────────────────────────────────────┘
```

### Primary Brand Palette
- **Brand Red (Primary):** `#D52B35` / `#DC2626` — Used for main hero backgrounds, primary CTAs, active route lines, brand emblems, and key focus states.
- **Brand Red Dark (Hover/Active):** `#B91C1C` / `#991B1B` — Hover states, pressed states, deep contrast accents.
- **Brand Red Light (Subtle Tints):** `#FEE2E2` / `#FEF2F2` — Subtle card borders, badge backgrounds, table hover states.
- **Pure White:** `#FFFFFF` — Primary background, clean card surfaces, readable typography over red.

### Functional Supporting Palette
- **Charcoal (Headings & Body):** `#282828` / `#0F172A` — Crisp, high-contrast typography, deep contrast footer elements.
- **Warm Off-White (Section Contrast):** `#F5F3F0` / `#F8FAFC` — Subtle section background alternating with pure white.
- **Muted Green (Operational Live):** `#23866C` / `#16A34A` — Used **exclusively** for genuine live satellite GPS tracking and active duty states.
- **Amber (Warnings & Advisories):** `#E6A23C` / `#D97706` — Used for stale telemetry (3–10 min old), draft tariff warnings, and route traffic advisories.
- **Neutral Greys:**
  - Border: `#E2E8F0` / `#FEE2E2`
  - Muted Text: `#64748B` / `#475569`
  - Disabled / Inactive: `#CBD5E1`

---

## 2. TYPOGRAPHY SYSTEM

Dual-script typographic harmony between Latin and Bengali:
- **Bengali Primary:** `'Hind Siliguri'`, `'Noto Sans Bengali'`, sans-serif
- **Latin Primary:** `'Inter'`, system-ui, sans-serif
- **Monospace (Numbers, Timestamps, References):** `'JetBrains Mono'`, `'SF Mono'`, ui-monospace

### Scale & Hierarchy
- **Display Hero Headline:** `text-3xl` to `text-5xl` (32px – 48px), `font-extrabold`, leading `tight`
- **Section Heading (H2):** `text-2xl` to `text-3xl` (24px – 30px), `font-extrabold`
- **Card Heading (H3):** `text-lg` to `text-xl` (18px – 20px), `font-bold`
- **Body Large:** `text-base` (16px), regular/medium, leading `relaxed`
- **Body Standard:** `text-sm` (14px), regular/medium
- **Caption & Micro-copy:** `text-xs` to `text-[11px]` (11px – 12px), `font-medium` or `font-bold`
- **Badge / Tag:** `text-[10px]` to `text-xs`, `font-bold`, uppercase tracking `wider`

---

## 3. COMPONENT PATTERNS & SPECIFICATIONS

### 3.1 Buttons
- **Primary Action (Brand Red):**
  - Class: `px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all`
- **Secondary Action (White on Red / Red Border):**
  - Class: `px-5 py-3 rounded-xl bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 active:scale-95 font-bold text-sm transition-all shadow-xs`
- **Subtle / Ghost Action:**
  - Class: `px-4 py-2 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition`

### 3.2 Cards
- **Standard Content Card:**
  - Class: `bg-white rounded-3xl border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all p-6`
- **Hero / Impact Feature Card:**
  - Class: `bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-red-500`

### 3.3 Status Badges
- **Live / Active GPS (< 3 mins):**
  - Class: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold`
  - Pulse dot: `w-2 h-2 rounded-full bg-emerald-500 animate-pulse`
- **Delayed / Stale (3 to 10 mins):**
  - Class: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold`
- **Offline / Unavailable (> 10 mins):**
  - Class: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold`

### 3.4 Form Inputs & Dropdowns
- **Input / Select:**
  - Class: `w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition`

---

## 4. RESPONSIVE BREAKPOINT STRATEGY

| Device Size | Viewport Width | Specific Layout Accommodations |
|---|---|---|
| **Compact Mobile** | 360px – 390px | Stack columns vertically, ensure touch targets ≥ 44px, compact table rows |
| **Standard Mobile** | 390px – 430px | Full width cards, collapsible map drawer |
| **Tablet** | 768px – 1023px | 2-column grids, horizontal quick stats |
| **Laptop & Desktop** | 1024px – 1440px | 12-column grid system, sticky side navigations |
| **Wide Desktop** | > 1440px | Max container constraint `max-w-7xl` (1280px) centered with comfortable margins |

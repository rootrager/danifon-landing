# Danifon 2026 Design System & Frontend Tokens

## 1. Visual Direction & Design Philosophy
- **Aesthetic**: Obsidian Glassmorphism 2.0 (Frosted deep dark surfaces, specular hairline borders, Apple Hardware minimalism).
- **Brand Identity**: Danifon (Premium iPhone & Apple Retail Store in Tehran, Iran).
- **Core Principles**:
  - **No AI Defaults**: Reject generic acid-green or purple gradients. Use tailored titanium metallic accents, frosted sapphire/emerald status indicators, and clean obsidian surfaces.
  - **Legibility & Precision**: Tabular numerals for prices, strict typographic hierarchy with Vazirmatn & Lalezar for display, high-contrast WCAG 2.1 AA text on dark glass.
  - **Tactile Ergonomics**: Generous 44px+ touch targets, instant feedback, haptic-feeling micro-animations without layout thrashing.

---

## 2. Color Palette & Surface Tokens
```css
--surface-bg:        #08080a;        /* True deep dark background */
--surface-card:      rgba(255, 255, 255, 0.05); /* Frosted glass cards */
--surface-card-hover:rgba(255, 255, 255, 0.08); /* Hover glass brightness */
--surface-border:    rgba(255, 255, 255, 0.10); /* Hairline frosted border */
--surface-border-subtle: rgba(255, 255, 255, 0.06);

/* Semantic Accents */
--accent-titanium:   #e2e8f0;        /* Natural Titanium tone */
--accent-emerald:    #10b981;        /* In-stock, authentic, battery >= 85% */
--accent-amber:      #f59e0b;        /* VIP queue, battery < 85%, used condition */
--accent-sky:        #38bdf8;        /* Calculators, Telegram actions */
--accent-indigo:     #6366f1;        /* Apple ID, inventory flagship highlight */
--text-primary:      #ffffff;
--text-secondary:    #94a3b8;
--text-muted:        #64748b;
```

---

## 3. Typography Hierarchy
- **Body & Controls**: `Vazirmatn` (Weights: 400 Regular, 500 Medium, 700 Bold, 900 Black).
- **Brand & Display Headlines**: `Lalezar` (For main product headlines & brand markers).
- **Numbers & Metrics**: Tabular numbers (`font-variant-numeric: tabular-nums`) with Persian digit conversion where appropriate.

---

## 4. Component Design: Inventory Showcase (`/inventory`)
- **Search & Quick Triage**:
  - Floating pill search bar with real-time query matching and instant clear.
  - Category segmented switcher: `همه` • `آیفون` • `اپل واچ` • `ایرپاد` • `اکسسوری`.
- **Filtering & Sorting Controls**:
  - Condition: `همه` • `آکبند` • `کارکرده (در حد نو)`.
  - Registry: `همه` • `با رجیستری` • `بدون رجیستری`.
  - Sort: `جدیدترین` • `ارزان‌ترین` • `گران‌ترین` • `بالاترین سلامت باتری`.
  - View Toggle: `نمای کارتی تفصیلی` (Showcase Cards) vs `نمای لیستی فشرده` (Compact Table).
- **Inventory Cards**:
  - Hardware silhouette avatar / category badge.
  - Condition chip with semantic color (Emerald: آکبند / Amber: در حد نو).
  - Dynamic iOS Battery Health gauge indicator.
  - Origin Part Number badge with flag indicator (`🇨🇳 CH/A` / `🇦🇪 ZA/A` / `🇺🇸 LLA`).
  - Clear price tag (`۷۴,۰۰۰,۰۰۰ تومان`) in natural RTL alignment.
  - Interactive tap: Opens detailed Technical Inspection Bottom Sheet with pre-filled WhatsApp & Telegram checkout.

---

## 5. Motion Guidelines (Emil Kowalski Philosophy)
- Avoid `transition: all`. Target only `transform`, `opacity`, `background-color`, `border-color`.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like deceleration).
- Active touch feedback: `active:scale-[0.98]` on cards and buttons.

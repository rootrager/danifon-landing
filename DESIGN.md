# Danifon Design System & Frontend Tokens

## 1. Visual Direction & Design Philosophy
- **Aesthetic**: Tech-Trust Dual Theme — Crisp Cobalt Blue & White (Light / Day mode) and Luminous Cobalt Blue & Obsidian Black (Dark / Night mode).
- **Brand Identity**: Danifon — Specialist sealed iPhone & Apple services storefront in Tehran.
- **Core Principles**:
  - **High-Trust Legibility**: Clear Persian RTL hierarchy with `Lalezar` for display headlines, `Vazirmatn` for UI/body text, and `tabular-nums` for prices and installment breakdowns.
  - **Dual-Mode Ergonomics**: Seamless day/night toggle persisted via `ThemeProvider` (`danifon-theme`), with WCAG AA contrast across cards, inputs, and badges in both themes.
  - **Tactile Touch Targets**: Generous 42px–56px touch targets, responsive desktop split layouts, and mobile bottom sheets.

---

## 2. Color Palette & Surface Tokens
```css
/* Day Mode (Blue & White) */
:root {
  --surface-canvas: #f8fbff;
  --surface-card: #ffffff;
  --surface-muted: #eff6ff;
  --surface-border: #dbeafe;
  --surface-border-strong: #bfdbfe;
  --text-primary: #0a1628;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --accent-primary: #0b63f6;
  --accent-sky: #0284c7;
  --accent-emerald: #059669;
  --accent-amber: #d97706;
}

/* Night Mode (Blue & Black) */
.dark {
  --surface-canvas: #04060c;
  --surface-card: #0b101d;
  --surface-muted: #11192e;
  --surface-border: rgba(96, 165, 250, 0.16);
  --surface-border-strong: rgba(96, 165, 250, 0.34);
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --accent-primary: #3b82f6;
  --accent-sky: #38bdf8;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
}
```

---

## 3. Typography Hierarchy
- **Body & Controls**: `Vazirmatn` (`--font-vazirmatn`).
- **Brand & Display Headlines**: `Lalezar` (`--font-lalezar`, `.font-display`).
- **Numbers & Prices**: `tabular-nums` with plain-language million-Toman helpers (`formatMillionHelper`).

---

## 4. Core Views
- **Storefront Home (`/`)**: Split hero with live showcase video, 4-tab services workbench (VIP Waitlist, Installment Calculator, Registry Fee Estimator, Apple ID Order), direct messaging channels, and Tehran store map & navigation links.
- **Inventory Catalog (`/inventory`)**: Sticky desktop filter sidebar and collapsible mobile filter drawer (search, registry status, series, exact model, capacity, body color, sealed activation status), card & desktop comparison table views, and a quick-view Technical Inspection Sheet with pre-filled Telegram/WhatsApp/phone booking.

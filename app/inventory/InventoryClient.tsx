"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import type { InventoryItem } from "./page";

/* ═══════════════════════════════════════════════════════
   SVG Icons (Modern 2026 Apple Hardware & Navigation)
   ═══════════════════════════════════════════════════════ */
const IconAll = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconIPhone = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const IconWatch = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="6" y="6" width="12" height="12" rx="3" />
    <path d="M9 6V3m6 3V3m-6 15v3m6-3v3" />
  </svg>
);

const IconAirPods = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M3 18v-6a9 9 0 1 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zm-18 0a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const IconAccessory = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2v6m0 8v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m8 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconBack = () => (
  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconGrid = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconList = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconSort = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M3 6h18M6 12h12m-9 6h6" />
  </svg>
);

const IconCheckmark = () => (
  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconShieldCheck = () => (
  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconTelegram = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const IconWhatsApp = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.552 4.17 1.599 5.986L.071 24l6.126-1.606c1.764.957 3.742 1.464 5.83 1.464 6.645 0 12.028-5.383 12.028-12.031S18.675 0 12.031 0zm0 21.849c-1.793 0-3.548-.482-5.086-1.393l-.365-.217-3.774.989 1.008-3.682-.238-.378a10.02 10.02 0 0 1-1.543-5.318C2.033 6.309 6.471 1.867 12.031 1.867c5.556 0 9.994 4.439 9.994 9.983s-4.438 9.999-9.994 9.999zm5.485-7.485c-.301-.151-1.782-.88-2.059-.982-.276-.1-.477-.151-.678.151-.201.301-.778.982-.954 1.183-.176.201-.351.226-.653.075-2.093-1.05-3.513-1.921-4.836-3.626-.176-.226-.019-.348.131-.498.136-.136.301-.351.452-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.151-.678-1.631-.929-2.233-.245-.588-.495-.508-.678-.518-.176-.008-.376-.011-.577-.011s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.51s1.079 2.911 1.229 3.112c.151.201 2.122 3.238 5.14 4.542 1.942.836 2.709.914 3.652.766.793-.125 2.457-1.004 2.802-1.97.345-.966.345-1.792.245-1.97-.101-.176-.376-.276-.678-.427z" />
  </svg>
);

const IconPhoneCall = () => (
  <svg className="w-4 h-4 fill-none shrink-0" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconClose = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconAppleLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.78-8.8-10.3-18.79-13.56-29.98-3.26-11.19-4.89-22.14-4.89-32.84 0-14.35 3.84-26.31 11.51-35.88 7.67-9.57 17.15-14.48 28.43-14.73 4.35 0 9.28 1.16 14.79 3.48 5.51 2.32 9.09 3.54 10.74 3.66 1.88 0 5.68-1.28 11.4-3.83 5.72-2.55 10.81-3.76 15.28-3.63 11.08.38 20.31 4.34 27.67 11.89 7.36 7.55 12.01 16.89 13.97 28.02-9.92 5.98-14.76 14.35-14.53 25.1.23 9.46 3.96 17.39 11.19 23.79 3.59 3.16 7.6 5.62 12.03 7.38-2.61 7.63-5.7 15.02-9.27 22.18zM119.22 31.84c0-7.38 2.65-14.18 7.95-20.4 5.3-6.23 11.83-10.15 19.59-11.77.23 1.05.35 2.12.35 3.21 0 7.38-2.73 14.36-8.2 20.93-5.46 6.57-12.05 10.36-19.78 11.38-.11-1.12-.17-2.24-.17-3.35z" />
  </svg>
);

const IconPlay = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconPause = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   Categories & Detection
   ═══════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id: "all", label: "همه کالاها", Icon: IconAll },
  { id: "iphone", label: "آیفون", Icon: IconIPhone },
  { id: "watch", label: "اپل واچ", Icon: IconWatch },
  { id: "airpods", label: "ایرپاد", Icon: IconAirPods },
  { id: "accessory", label: "اکسسوری", Icon: IconAccessory },
];

function detectCategory(item: InventoryItem): string {
  const text = `${item.model ?? ""} ${item.series ?? ""}`.toLowerCase();
  if (text.includes("iphone") || text.includes("آیفون")) return "iphone";
  if (text.includes("watch") || text.includes("واچ")) return "watch";
  if (text.includes("airpod") || text.includes("ایرپاد")) return "airpods";
  if (text.includes("access") || text.includes("اکسسوری") || text.includes("cable") || text.includes("charger")) return "accessory";
  return "other";
}

/* ═══════════════════════════════════════════════════════
   Helper: Origin Country Flag & Part Number
   ═══════════════════════════════════════════════════════ */
function getPartCountry(item: InventoryItem): { flag: string; label: string } | null {
  const combined = `${item.part ?? ""} ${item.sim ?? ""}`.toUpperCase();
  if (combined.includes("CH/A") || combined.includes("CH")) return { flag: "🇨🇳", label: "پارت چین (CH/A)" };
  if (combined.includes("ZA/A") || combined.includes("ZA")) return { flag: "🇦🇪", label: "امارات/سنگاپور (ZA/A)" };
  if (combined.includes("LL/A") || combined.includes("LLA")) return { flag: "🇺🇸", label: "پارت آمریکا (LLA)" };
  if (combined.includes("JA/A") || combined.includes("JA")) return { flag: "🇯🇵", label: "پارت ژاپن (JA/A)" };
  if (combined.includes("ZP/A") || combined.includes("ZP")) return { flag: "🇭🇰", label: "هنگ‌کنگ (ZP/A)" };
  if (combined.includes("TH/A") || combined.includes("TH")) return { flag: "🇹🇭", label: "تایلند (TH/A)" };
  if (item.part) return { flag: "🌐", label: `پارت ${item.part}` };
  return null;
}

/* ═══════════════════════════════════════════════════════
   Helper: Price formatting with clean numerals
   ═══════════════════════════════════════════════════════ */
function formatPrice(price: string | null): { formatted: string; numOnly: string; isContact: boolean; rawNum: number } {
  if (!price) return { formatted: "استعلام قیمت", numOnly: "استعلام قیمت", isContact: true, rawNum: 0 };
  const digits = price.replace(/\D/g, "");
  const n = parseInt(digits, 10);
  if (isNaN(n) || n === 0) return { formatted: price, numOnly: price, isContact: false, rawNum: 0 };
  const numOnly = n.toLocaleString("en-US");
  return { formatted: `${numOnly} تومان`, numOnly, isContact: false, rawNum: n };
}

function parseBatteryPct(battery: string | null): number | null {
  if (!battery) return null;
  const m = battery.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function relativeTime(isoDate: string): string {
  const diffSec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diffSec < 60) return "لحظاتی پیش";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} دقیقه پیش`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ساعت پیش`;
  return `${Math.floor(diffSec / 86400)} روز پیش`;
}

/* ═══════════════════════════════════════════════════════
   Battery Health iOS Widget Component
   ═══════════════════════════════════════════════════════ */
function BatteryHealthBadge({ pct }: { pct: number }) {
  const isHealthy = pct >= 85;
  const isMedium = pct >= 75 && pct < 85;
  const colorClass = isHealthy ? "text-emerald-300" : isMedium ? "text-amber-300" : "text-rose-300";
  const bgBarClass = isHealthy ? "bg-emerald-400" : isMedium ? "bg-amber-400" : "bg-rose-400";

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px]">
      <div className="w-4 h-2 rounded-[3px] border border-white/30 p-[1px] flex items-center">
        <div className={`h-full rounded-[1.5px] ${bgBarClass}`} style={{ width: `${Math.min(100, Math.max(15, pct))}%` }} />
      </div>
      <span className="text-neutral-400 font-medium">سلامت:</span>
      <span className={`font-mono font-bold ${colorClass}`}>{pct}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Technical Inspection Bottom Sheet / Modal
   ═══════════════════════════════════════════════════════ */
function TechnicalInspectionSheet({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const isNew = item.type === "new";
  const { formatted: priceFormatted } = formatPrice(item.price);
  const batteryPct = parseBatteryPct(item.battery);
  const partInfo = getPartCountry(item);

  const prefilledMessage = `سلام دانیفون، درخواست بررسی و رزرو کالا از انبار دارم:
━━━━━━━━━━━━━━━━━━━━
📱 مدل: ${item.model ?? "محصول"}
💾 ظرفیت: ${item.capacity ?? "مشخص نشده"}
🎨 وضعیت: ${item.condition ?? (isNew ? "آکبند" : "کارکرده")}
⚙️ پارت‌نامبر: ${partInfo?.label ?? item.part ?? "ثبت نشده"}
🔋 سلامت باتری: ${batteryPct ? `${batteryPct}%` : (isNew ? "100% (آکبند)" : "مشخص نشده")}
📋 رجیستری: ${item.registry ?? "ثبت رسمی"}
🛡️ مهلت تست: 10 روز مهلت تست فنی قید شده در فاکتور رسمی
💰 قیمت روز و نقدی: ${priceFormatted}
━━━━━━━━━━━━━━━━━━━━
📍 مشاهده شده در وب‌سایت دانیفون`;

  const encodedMsg = encodeURIComponent(prefilledMessage);
  const tgUrl = `https://t.me/danikamali?text=${encodedMsg}`;
  const waUrl = `https://wa.me/989128404028?text=${encodedMsg}`;
  const callUrl = `tel:+989128404028`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md" dir="rtl">
        <div className="bg-neutral-900/95 backdrop-blur-2xl border-t border-white/15 rounded-t-[32px] p-5 pb-9 shadow-[0_-12px_40px_rgba(0,0,0,0.6)] animate-fadeInSlide flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar">
          {/* Pull Handle */}
          <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto" />

          {/* Header Summary */}
          <div className="flex items-start justify-between pb-3 border-b border-white/10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white leading-snug">
                  {item.model ?? "محصول"}
                </h3>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    isNew
                      ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/30"
                      : "text-amber-300 bg-amber-500/20 border-amber-400/30"
                  }`}
                >
                  {isNew ? "آکبند نات‌اکتیو" : item.condition ?? "در حد نو"}
                </span>
              </div>
              <span className="text-xs text-neutral-400">
                {item.capacity ? `${item.capacity} • ` : ""}
                {item.sim ? `${item.sim} • ` : ""}
                کد انبار: #{item.item_id}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <IconClose />
            </button>
          </div>

          {/* Technical Inspection Checklist */}
          <div className="bg-black/40 rounded-2xl p-3.5 border border-white/10 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between font-bold text-white mb-1">
              <span className="flex items-center gap-1.5">
                <IconShieldCheck />
                کارشناسی فنی و اصالت دانیفون
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
              <div className="flex items-center gap-1.5 bg-white/[0.04] p-2 rounded-xl">
                <IconCheckmark />
                <span>وضعیت فیزیکی: بدون بازشدگی</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] p-2 rounded-xl">
                <IconCheckmark />
                <span>ال‌سی‌دی: اصلی و TrueTone فعال</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] p-2 rounded-xl">
                <IconCheckmark />
                <span>رجیستری: {item.registry || "ثبت قانونی همتا"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] p-2 rounded-xl">
                <IconCheckmark />
                <span>پارت: {partInfo?.label || "اصلی"}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-400/25 text-indigo-200 text-[11px] font-medium leading-relaxed mt-1 flex items-center gap-2">
              <span className="text-base shrink-0">🛡</span>
              <span>تضمین کتبی: این کالا دارای <b>10 روز مهلت تست فنی</b> قید شده در فاکتور رسمی دانیفون است.</span>
            </div>
          </div>

          {/* Pricing Box (Cash Price Only - No Installment) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 font-medium">قیمت روز و خرید نقدی:</span>
              <span className="text-lg font-black text-white tabular-nums">
                {priceFormatted}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-[11px] font-bold">
              <span>تحویل فوری در فروشگاه</span>
            </div>
          </div>

          {/* Action Direct CTAs */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <IconTelegram />
                <span>رزرو در تلگرام</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <IconWhatsApp />
                <span>رزرو در واتساپ</span>
              </a>
            </div>

            <a
              href={callUrl}
              className="py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-neutral-200 hover:text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-2"
            >
              <IconPhoneCall />
              <span>تماس مستقیم با کارشناس فروش (09128404028)</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Inventory Item: Showcase Card (Modern 2026 Apple Card)
   ═══════════════════════════════════════════════════════ */
function ShowcaseCard({
  item,
  onInspect,
}: {
  item: InventoryItem;
  onInspect: (item: InventoryItem) => void;
}) {
  const isNew = item.type === "new";
  const { formatted: priceText, numOnly, isContact } = formatPrice(item.price);
  const batteryPct = parseBatteryPct(item.battery);
  const partInfo = getPartCountry(item);

  return (
    <div
      onClick={() => onInspect(item)}
      className="group relative flex flex-col p-4 rounded-[26px] bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.10] hover:border-white/[0.22] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top row: Model + Status Badge */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <IconAppleLogo className="w-4 h-4 fill-current text-white/90" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-extrabold text-white group-hover:text-indigo-200 transition-colors">
              {item.model ?? "محصول دانیفون"}
            </h3>
            <span className="text-[10px] text-neutral-400 font-medium">
              {item.series ? `سری ${item.series}` : "اورجینال"}
            </span>
          </div>
        </div>

        <span
          className={`shrink-0 text-[9.5px] font-bold px-2.5 py-1 rounded-full border ${
            isNew
              ? "text-emerald-300 bg-emerald-500/15 border-emerald-500/30"
              : "text-amber-300 bg-amber-500/15 border-amber-400/30"
          }`}
        >
          {isNew ? "آکبند (پلمپ)" : item.condition ?? "در حد نو"}
        </span>
      </div>

      {/* Middle row: Hardware Spec Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {item.capacity && (
          <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-lg bg-white/10 text-neutral-200 border border-white/10">
            {item.capacity}
          </span>
        )}

        {partInfo && (
          <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-400/25 flex items-center gap-1">
            <span>{partInfo.flag}</span>
            <span>{partInfo.label}</span>
          </span>
        )}

        {item.registry && (
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.06] text-neutral-300 border border-white/10">
            {item.registry}
          </span>
        )}

        {batteryPct !== null && (
          <BatteryHealthBadge pct={batteryPct} />
        )}
      </div>

      {/* Bottom row: Price & Action CTA */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.08] mt-auto">
        <div className="flex flex-col">
          <span className="text-[9px] text-neutral-400 font-medium">قیمت روز:</span>
          {isContact ? (
            <span className="text-xs font-bold text-neutral-400">{priceText}</span>
          ) : (
            <div className="flex items-baseline gap-1 tabular-nums" dir="rtl">
              <span className="text-base font-black text-white tracking-tight">
                {numOnly}
              </span>
              <span className="text-[10px] font-medium text-neutral-400">تومان</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold transition-all">
          <span>مشخصات و رزرو</span>
          <span className="text-xs group-hover:-translate-x-0.5 transition-transform">←</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Inventory Item: Compact Row (High-Density Comparison)
   ═══════════════════════════════════════════════════════ */
function CompactRow({
  item,
  onInspect,
}: {
  item: InventoryItem;
  onInspect: (item: InventoryItem) => void;
}) {
  const isNew = item.type === "new";
  const { numOnly, isContact } = formatPrice(item.price);
  const batteryPct = parseBatteryPct(item.battery);
  const partInfo = getPartCountry(item);

  return (
    <div
      onClick={() => onInspect(item)}
      className="group flex items-center justify-between py-2.5 px-3.5 rounded-[18px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-200 cursor-pointer text-xs"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
          <IconAppleLogo className="w-3.5 h-3.5 fill-current" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white truncate text-[13px]">
              {item.model}
            </span>
            <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded ${isNew ? "text-emerald-300 bg-emerald-500/15" : "text-amber-300 bg-amber-500/15"}`}>
              {isNew ? "آکبند" : "کارکرده"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
            {item.capacity && <span>{item.capacity}</span>}
            {partInfo && <span>• {partInfo.flag} {partInfo.label.split(" ")[1] || ""}</span>}
            {batteryPct && <span>• باتری {batteryPct}%</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="font-bold text-white text-[13px] tabular-nums">
          {isContact ? "استعلام" : `${numOnly} ت`}
        </span>
        <span className="text-neutral-500 group-hover:text-indigo-300 transition-colors">←</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT: INVENTORY CLIENT
   ═══════════════════════════════════════════════════════ */
export default function InventoryClient({
  items,
  fetchedAt,
}: {
  items: InventoryItem[];
  fetchedAt: string;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [conditionFilter, setConditionFilter] = useState<"all" | "new" | "used">("all");
  const [registryFilter, setRegistryFilter] = useState<"all" | "registered" | "unregistered">("all");
  const [sortOption, setSortOption] = useState<"newest" | "price-asc" | "price-desc" | "battery-desc">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"showcase" | "compact">("showcase");
  const [inspectedItem, setInspectedItem] = useState<InventoryItem | null>(null);

  // Video Showcase Controls
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    // 1. Category filter
    if (activeCategory !== "all") {
      result = result.filter((i) => detectCategory(i) === activeCategory);
    }

    // 2. Condition filter
    if (conditionFilter === "new") {
      result = result.filter((i) => i.type === "new");
    } else if (conditionFilter === "used") {
      result = result.filter((i) => i.type !== "new");
    }

    // 3. Registry filter
    if (registryFilter === "registered") {
      result = result.filter((i) => i.registry?.includes("با") || i.registry?.includes("ثبت"));
    } else if (registryFilter === "unregistered") {
      result = result.filter((i) => i.registry?.includes("بدون"));
    }

    // 4. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((i) => {
        const text = `${i.model ?? ""} ${i.series ?? ""} ${i.capacity ?? ""} ${i.sim ?? ""} ${i.part ?? ""} ${i.condition ?? ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      const priceA = formatPrice(a.price).rawNum;
      const priceB = formatPrice(b.price).rawNum;
      const batA = parseBatteryPct(a.battery) || (a.type === "new" ? 100 : 0);
      const batB = parseBatteryPct(b.battery) || (b.type === "new" ? 100 : 0);

      switch (sortOption) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "battery-desc":
          return batB - batA;
        case "newest":
        default:
          return 0;
      }
    });

    return result;
  }, [items, activeCategory, conditionFilter, registryFilter, searchQuery, sortOption]);

  // Counts per category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    items.forEach((item) => {
      const cat = detectCategory(item);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen pt-5 pb-24 px-4 w-full relative"
      dir="rtl"
    >
      {/* Ambient Radial Lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* ── HEADER ── */}
      <header className="w-full mb-4 select-none">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all active:scale-95"
          >
            <IconBack />
            <span>بازگشت به خانه</span>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[18px] bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg">
              <IconAppleLogo className="w-6 h-6 fill-current text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-white leading-tight">
                موجودی انبار و ویترین دانیفون
              </h1>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                بروزرسانی {relativeTime(fetchedAt)} • {items.length} دستگاه آماده تحویل فوری
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── VIDEO SHOWCASE HERO CARD ── */}
      <section className="w-full mb-3 select-none" aria-label="ویترین زنده دانیفون">
        <div className="relative w-full rounded-[24px] overflow-hidden border border-white/15 bg-black/40 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all">
          {/* 16:9 Video Player */}
          <div className="relative w-full aspect-video overflow-hidden bg-neutral-950">
            <video
              ref={videoRef}
              src="/danifon-showcase.mp4"
              poster="/danifon-showcase-poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Specular Ambient Glow & Top/Bottom Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

            {/* Top Bar Floating Controls inside Video */}
            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-auto">
              {/* Live Status Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>ویترین تحویل فوری دانیفون</span>
              </div>

              {/* Action Button (Play/Pause) */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleVideoPlay}
                  className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
                  title={isVideoPlaying ? "توقف ویدیو" : "پخش ویدیو"}
                  aria-label={isVideoPlaying ? "توقف ویدیو" : "پخش ویدیو"}
                >
                  {isVideoPlaying ? <IconPause /> : <IconPlay />}
                </button>
              </div>
            </div>

            {/* Bottom Floating Info Banner inside Video */}
            <div className="absolute bottom-2.5 inset-x-2.5 pointer-events-none">
              <div className="flex items-center justify-between gap-1.5 text-[9px] sm:text-[9.5px] text-neutral-200">
                <span className="font-bold text-white flex items-center gap-1 drop-shadow-md truncate">
                  <span>✨</span>
                  <span className="truncate">تنوع رنگی و مدل‌های آماده تحویل</span>
                </span>
                <div className="flex items-center gap-1 pointer-events-auto shrink-0">
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-bold text-[8px] sm:text-[8.5px] backdrop-blur-md whitespace-nowrap">
                    ۱۰ روز مهلت تست
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white/15 border border-white/20 text-white font-bold text-[8px] sm:text-[8.5px] backdrop-blur-md whitespace-nowrap">
                    پلمپ اصلی
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="w-full mb-3 select-none">
        <div className="relative">
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <IconSearch />
          </div>
          <input
            type="text"
            placeholder="جستجوی مدل، پارت، ظرفیت (مثلاً 16 Pro Max یا CH/A)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pr-10 pl-20 rounded-[18px] bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.10] border border-white/[0.10] focus:border-indigo-400/60 text-xs text-white placeholder:text-neutral-500 outline-none transition-all backdrop-blur-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            >
              <IconClose />
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORY SEGMENTED TABS (Horizontal Scroll) ── */}
      <div className="w-full overflow-x-auto pb-1 mb-3 select-none no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 py-2 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
                  active
                    ? "bg-indigo-500/30 border-indigo-400/60 text-white shadow-[0_2px_12px_rgba(99,102,241,0.3)] scale-[1.02]"
                    : "bg-white/[0.05] border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <cat.Icon />
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? "bg-indigo-400/40 text-white" : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FILTER & SORT CONTROL BAR ── */}
      <div className="w-full mb-3 flex flex-col gap-2 select-none">
        <div className="flex items-center justify-between gap-2">
          {/* Condition Pills */}
          <div className="flex items-center gap-1">
            {(
              [
                { id: "all", label: "همه" },
                { id: "new", label: "آکبند" },
                { id: "used", label: "کارکرده" },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => setConditionFilter(c.id)}
                className={`py-1 px-2.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                  conditionFilter === c.id
                    ? "bg-white/20 border-white/30 text-white shadow-sm"
                    : "bg-black/20 border-white/[0.06] text-neutral-400 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* View Mode & Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            {/* Sort Select */}
            <div className="relative flex items-center">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                className="bg-black/40 border border-white/10 rounded-xl py-1 px-2 text-[10px] font-bold text-neutral-300 outline-none cursor-pointer appearance-none text-right pl-6"
              >
                <option value="newest" className="bg-neutral-900 text-white">جدیدترین</option>
                <option value="price-asc" className="bg-neutral-900 text-white">ارزان‌ترین</option>
                <option value="price-desc" className="bg-neutral-900 text-white">گران‌ترین</option>
                <option value="battery-desc" className="bg-neutral-900 text-white">بیشترین باتری</option>
              </select>
              <span className="absolute left-2 pointer-events-none text-neutral-400 text-[10px]">
                <IconSort />
              </span>
            </div>

            {/* View Mode Toggle Button */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("showcase")}
                className={`p-1 rounded-lg transition-all ${
                  viewMode === "showcase" ? "bg-white/20 text-white" : "text-neutral-500 hover:text-white"
                }`}
                title="نمای کارتی"
              >
                <IconGrid />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                className={`p-1 rounded-lg transition-all ${
                  viewMode === "compact" ? "bg-white/20 text-white" : "text-neutral-500 hover:text-white"
                }`}
                title="نمای فشرده"
              >
                <IconList />
              </button>
            </div>
          </div>
        </div>

        {/* Registry Status Filter Pills */}
        <div className="flex items-center gap-1.5 px-0.5">
          <span className="text-[9.5px] text-neutral-400">رجیستری:</span>
          {(
            [
              { id: "all", label: "همه" },
              { id: "registered", label: "با رجیستری" },
              { id: "unregistered", label: "بدون رجیستری" },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              onClick={() => setRegistryFilter(r.id)}
              className={`py-0.5 px-2 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                registryFilter === r.id
                  ? "bg-indigo-500/25 border-indigo-400/50 text-indigo-200 shadow-sm"
                  : "bg-black/20 border-white/[0.06] text-neutral-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Live Filter Counter Result */}
        <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1">
          <span>
            نمایش <b className="text-white">{filteredAndSorted.length}</b> دستگاه مطابق جستجو
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-indigo-300 hover:text-white underline cursor-pointer"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* ── PRODUCTS LIST / GRID ── */}
      <section className="w-full flex flex-col gap-3">
        {filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 px-4 rounded-[28px] bg-white/[0.04] border border-white/[0.08] gap-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl">
              🔍
            </div>
            <h3 className="text-sm font-bold text-white">دستگاهی با این مشخصات یافت نشد</h3>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              دستگاه مدنظرتان در انبار موجود نیست؟ همین حالا مدل دلخواه را در صف انتظار VIP ثبت کنید تا به محض ورود، با اولویت برای شما رزرو شود:
            </p>
            <div className="flex flex-col gap-2 mt-2 w-full max-w-xs">
              <Link
                href="/#waitlist"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-white text-xs font-bold text-center shadow-[0_2px_12px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🎯</span>
                <span>ثبت مدل درخواستی در صف انتظار VIP</span>
              </Link>
              <div className="flex gap-2 w-full">
                <a
                  href="https://t.me/danikamali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold text-center"
                >
                  استعلام تلگرام
                </a>
                <a
                  href="https://wa.me/989128404028"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold text-center"
                >
                  استعلام واتساپ
                </a>
              </div>
            </div>
          </div>
        ) : viewMode === "showcase" ? (
          filteredAndSorted.map((item) => (
            <ShowcaseCard
              key={item.item_id}
              item={item}
              onInspect={setInspectedItem}
            />
          ))
        ) : (
          <div className="flex flex-col gap-2">
            {filteredAndSorted.map((item) => (
              <CompactRow
                key={item.item_id}
                item={item}
                onInspect={setInspectedItem}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── STICKY BOTTOM HELP & INQUIRY BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md" dir="rtl">
        <div className="bg-neutral-950/90 backdrop-blur-2xl border-t border-white/10 px-4 py-3 flex items-center justify-between gap-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-white truncate">
              کالای مدنظرتان را پیدا نکردید؟
            </span>
            <span className="text-[9.5px] text-amber-300/90 truncate font-medium">
              ثبت رزرو رایگان در صف انتظار VIP
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#waitlist"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-400/40 text-white text-xs font-bold active:scale-95 transition-all shadow-[0_2px_12px_rgba(245,158,11,0.25)] cursor-pointer"
            >
              <span>🎯</span>
              <span>صف انتظار VIP</span>
            </Link>
            <a
              href="https://t.me/danikamali"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 text-xs active:scale-95 transition-all"
              title="ارتباط با کارشناس تلگرام"
            >
              <IconTelegram />
            </a>
            <a
              href="https://wa.me/989128404028"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs active:scale-95 transition-all"
              title="ارتباط با کارشناس واتساپ"
            >
              <IconWhatsApp />
            </a>
          </div>
        </div>
      </div>

      {/* ── TECHNICAL INSPECTION MODAL ── */}
      {inspectedItem && (
        <TechnicalInspectionSheet
          item={inspectedItem}
          onClose={() => setInspectedItem(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-8 text-[10px] text-neutral-500 text-center select-none">
        © {new Date().getFullYear()} Danifon Store • تهران، میدان آزادی
      </footer>
    </div>
  );
}

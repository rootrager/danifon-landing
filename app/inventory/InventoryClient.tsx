"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { InventoryItem } from "./page";

/* ═══════════════════════════════════════════════════════
   SVG Icons (Minimal Apple Hardware & UI Controls)
   ═══════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════
   Helpers: Model, Exact Photo Mapping, Color, Part & Price
   ═══════════════════════════════════════════════════════ */
function parseModelAndColor(modelRaw: string | null, fallbackColor: string | null = null) {
  if (!modelRaw) return { modelName: "iPhone", extractedColor: fallbackColor || "مشخص نشده" };
  const match = modelRaw.match(/^([^(]+)\s*\((.+)\)$/);
  if (match) {
    return {
      modelName: match[1].trim(),
      extractedColor: (fallbackColor || match[2]).trim(),
    };
  }
  return { modelName: modelRaw.trim(), extractedColor: fallbackColor || "مشخص نشده" };
}

function getModelImageSrc(modelName: string | null, colorName: string | null): string {
  const m = (modelName || "").toLowerCase();
  const c = (colorName || "").toLowerCase();

  // 1. iPhone 17 Air (Single camera in horizontal bar)
  if (m.includes("17 air") || m.includes("17air")) {
    if (c.includes("آبی")) return "/models/iphone17air-blue.jpg";
    if (c.includes("طلایی") || c.includes("زرد")) return "/models/iphone17air-gold.jpg";
    return "/models/iphone17air-white.jpg";
  }

  // 2. iPhone 17e & iPhone 16e (Single circular camera lens in top-left corner)
  if (m.includes("17e") || m.includes("16e")) {
    if (c.includes("مشکی")) return "/models/iphone17e-black.jpg";
    return "/models/iphone16e-white.jpg";
  }

  // 3. iPhone 17 Pro & 17 Pro Max (Triple camera in full-width plateau bar)
  if (m.includes("17 pro")) {
    if (c.includes("نارنجی")) return "/models/iphone17pro-orange.jpg";
    if (c.includes("آبی")) return "/models/iphone17pro-blue.jpg";
    return "/models/iphone17pro-white.jpg";
  }

  // 4. iPhone 16 Pro & 16 Pro Max (Triple camera in classic square top-left island)
  if (m.includes("16 pro")) {
    if (c.includes("مشکی")) return "/models/iphone16pro-black.jpg";
    if (c.includes("نچرال") || c.includes("خاکستری")) return "/models/iphone16pro-natural.jpg";
    return "/models/iphone16pro-white.jpg";
  }

  // 5. iPhone 15 & 15 Plus (Dual diagonal cameras in square top-left island)
  if (m.includes("iphone 15")) {
    if (c.includes("زرد") || c.includes("طلایی")) return "/models/iphone15-yellow.jpg";
    if (c.includes("مشکی")) return "/models/iphone15-black.jpg";
    return "/models/iphone15-blue.jpg";
  }

  // 6. iPhone 17 (Normal), iPhone 16 (Normal), iPhone 16 Plus (Dual vertical cameras in pill bump)
  if (
    m === "iphone 17" ||
    m === "iphone 16" ||
    m.includes("16 plus") ||
    (m.includes("17") && !m.includes("pro") && !m.includes("air") && !m.includes("17e")) ||
    (m.includes("16") && !m.includes("pro") && !m.includes("16e"))
  ) {
    if (c.includes("مشکی")) return "/models/iphone17-black.jpg";
    if (c.includes("سبز")) return "/models/iphone17-green.jpg";
    if (c.includes("آبی")) return "/models/iphone17-blue.jpg";
    if (c.includes("بنفش")) return "/models/iphone17-purple.jpg";
    if (c.includes("صورتی")) return "/models/iphone16-pink.jpg";
    return "/models/iphone17-white.jpg";
  }

  // 7. Default / iPhone 18 Pro & 18 Pro Max (Triple camera in wide plateau bar)
  if (c.includes("آلبالویی") || c.includes("زرشکی") || c.includes("قرمز")) {
    return "/models/iphone18-crimson.jpg";
  }
  if (c.includes("آبی")) {
    return "/models/iphone18-blue.jpg";
  }
  if (c.includes("مشکی")) {
    return "/models/iphone18-black.jpg";
  }
  return "/models/iphone18-white.jpg";
}

function getColorMeta(
  colorName: string | null,
  modelName: string | null = null
): {
  hex: string;
  shortName: string;
  compactName: string;
  imageSrc: string;
} {
  const c = (colorName || "").toLowerCase();
  const imageSrc = getModelImageSrc(modelName, colorName);

  if (c.includes("آلبالویی") || c.includes("زرشکی") || c.includes("قرمز")) {
    return {
      hex: "#9f1239",
      shortName: "آلبالویی (زرشکی)",
      compactName: "آلبالویی",
      imageSrc,
    };
  }
  if (c.includes("آبی")) {
    return {
      hex: "#60a5fa",
      shortName: "آبی",
      compactName: "آبی",
      imageSrc,
    };
  }
  if (c.includes("سفید") || c.includes("سیلور") || c.includes("نقره‌ای")) {
    return {
      hex: "#f1f5f9",
      shortName: "سفید",
      compactName: "سفید",
      imageSrc,
    };
  }
  if (c.includes("مشکی")) {
    return {
      hex: "#27272a",
      shortName: "مشکی",
      compactName: "مشکی",
      imageSrc,
    };
  }
  if (c.includes("نارنجی")) {
    return {
      hex: "#fb923c",
      shortName: "نارنجی",
      compactName: "نارنجی",
      imageSrc,
    };
  }
  if (c.includes("سبز")) {
    return {
      hex: "#34d399",
      shortName: "سبز",
      compactName: "سبز",
      imageSrc,
    };
  }
  if (c.includes("بنفش")) {
    return {
      hex: "#c084fc",
      shortName: "بنفش",
      compactName: "بنفش",
      imageSrc,
    };
  }
  if (c.includes("صورتی")) {
    return {
      hex: "#f472b6",
      shortName: "صورتی",
      compactName: "صورتی",
      imageSrc,
    };
  }
  if (c.includes("طلایی") || c.includes("زرد") || c.includes("دیزرت") || c.includes("صحرایی")) {
    return {
      hex: "#facc15",
      shortName: colorName || "طلایی",
      compactName: colorName || "طلایی",
      imageSrc,
    };
  }
  if (c.includes("نچرال") || c.includes("خاکستری")) {
    return {
      hex: "#a8a29e",
      shortName: "نچرال",
      compactName: "نچرال",
      imageSrc,
    };
  }
  return {
    hex: "#cbd5e1",
    shortName: colorName || "استاندارد",
    compactName: colorName || "استاندارد",
    imageSrc,
  };
}

function getPartCountry(item: InventoryItem): { flag: string; code: string; label: string } {
  const combined = `${item.part ?? ""} ${item.sim ?? ""}`.toUpperCase();
  if (combined.includes("5L")) {
    return { flag: "🇸🇬", code: "ZA/A (5L)", label: "پارت سنگاپور (ZA/A - 5L)" };
  }
  if (combined.includes("5X")) {
    return { flag: "🇸🇬", code: "ZA/A (5X)", label: "پارت سنگاپور (ZA/A - 5X)" };
  }
  if (combined.includes("ZA/A") || combined.includes("ZA")) {
    return { flag: "🇸🇬", code: "ZA/A", label: "پارت سنگاپور (ZA/A)" };
  }
  if (combined.includes("CH/A") || combined.includes("CH")) {
    return { flag: "🇨🇳", code: "CH/A", label: "پارت چین (CH/A)" };
  }
  if (combined.includes("QN/A") || combined.includes("QN")) {
    return { flag: "🇪🇺", code: "QN/A", label: "پارت اروپا (QN/A)" };
  }
  if (combined.includes("QL/A") || combined.includes("QL")) {
    return { flag: "🇪🇺", code: "QL/A", label: "پارت اروپا (QL/A)" };
  }
  if (combined.includes("AH/A") || combined.includes("AH")) {
    return { flag: "🇦🇪", code: "AH/A", label: "پارت امارات (AH/A)" };
  }
  if (combined.includes("HN/A") || combined.includes("HN")) {
    return { flag: "🇮🇳", code: "HN/A", label: "پارت هند (HN/A)" };
  }
  if (combined.includes("LL/A") || combined.includes("LLA")) {
    return { flag: "🇺🇸", code: "LL/A", label: "پارت آمریکا (LL/A)" };
  }
  if (combined.includes("JA/A") || combined.includes("JA")) {
    return { flag: "🇯🇵", code: "JA/A", label: "پارت ژاپن (JA/A)" };
  }
  if (combined.includes("ZP/A") || combined.includes("ZP")) {
    return { flag: "🇭🇰", code: "ZP/A", label: "پارت هنگ‌کنگ (ZP/A)" };
  }
  return { flag: "🌐", code: item.part || "Global", label: item.part ? `پارت ${item.part}` : "پارت اصلی" };
}

function getActivationMeta(conditionRaw: string | null): {
  label: string;
  shortLabel: string;
  isNotActive: boolean;
} {
  const c = (conditionRaw || "").toLowerCase();
  if (c.includes("not active") || c.includes("نات")) {
    return {
      label: "پلمپ نات‌اکتیو (Not Active)",
      shortLabel: "نات‌اکتیو",
      isNotActive: true,
    };
  }
  if (c.includes("active")) {
    return {
      label: "پلمپ اکتیو (Active)",
      shortLabel: "اکتیو",
      isNotActive: false,
    };
  }
  return {
    label: conditionRaw || "آکبند پلمپ",
    shortLabel: "آکبند",
    isNotActive: true,
  };
}

function getRegistryMeta(registryRaw: string | null): {
  isRegistered: boolean;
  shortLabel: string;
  fullLabel: string;
} {
  const r = (registryRaw || "").toLowerCase();
  if (r.includes("بدون") || r.includes("not")) {
    return {
      isRegistered: false,
      shortLabel: "بدون رجیستری",
      fullLabel: "بدون رجیستری (آنتن‌دهی طبق قوانین روز)",
    };
  }
  return {
    isRegistered: true,
    shortLabel: "با رجیستری ✅",
    fullLabel: "با رجیستری رسمی و کد فعال‌سازی همتا",
  };
}

function formatPrice(price: string | null): {
  formatted: string;
  numOnly: string;
  isContact: boolean;
  rawNum: number;
} {
  if (!price) {
    return { formatted: "استعلام قیمت", numOnly: "استعلام", isContact: true, rawNum: 0 };
  }
  const digits = price.replace(/\D/g, "");
  const n = parseInt(digits, 10);
  if (isNaN(n) || n === 0) {
    return { formatted: price, numOnly: price, isContact: false, rawNum: 0 };
  }
  const numOnly = n.toLocaleString("en-US");
  return { formatted: `${numOnly} تومان`, numOnly, isContact: false, rawNum: n };
}

function relativeTime(isoDate: string): string {
  const diffSec = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diffSec < 60) return "لحظاتی پیش";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} دقیقه پیش`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ساعت پیش`;
  return `${Math.floor(diffSec / 86400)} روز پیش`;
}

function capacityRank(cap: string | null): number {
  const c = (cap || "").toUpperCase();
  if (c.includes("128")) return 1;
  if (c.includes("256")) return 2;
  if (c.includes("512")) return 3;
  if (c.includes("1TB")) return 4;
  if (c.includes("2TB")) return 5;
  return 99;
}

/* ═══════════════════════════════════════════════════════
   Technical Inspection & Reservation Bottom Sheet
   ═══════════════════════════════════════════════════════ */
function TechnicalInspectionSheet({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const { formatted: priceFormatted } = formatPrice(item.price);
  const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
  const colorMeta = getColorMeta(extractedColor, modelName);
  const partInfo = getPartCountry(item);
  const actMeta = getActivationMeta(item.condition);
  const regMeta = getRegistryMeta(item.registry);

  const prefilledMessage = `سلام دانیفون، درخواست بررسی و رزرو فوری این دستگاه از انبار را دارم:
━━━━━━━━━━━━━━━━━━━━
📱 مدل: ${modelName}
💾 ظرفیت: ${item.capacity ?? "مشخص نشده"}
🎨 رنگ: ${colorMeta.shortName}
📦 وضعیت: ${actMeta.label}
⚙️ پارت‌نامبر: ${partInfo.label} (${item.sim ?? "دو سیم‌کارت"})
📋 رجیستری: ${regMeta.shortLabel}
💰 قیمت درج‌شده: ${priceFormatted}
━━━━━━━━━━━━━━━━━━━━
📍 کد انبار: #${item.item_id}`;

  const encodedMsg = encodeURIComponent(prefilledMessage);
  const tgUrl = `https://t.me/danikamali?text=${encodedMsg}`;
  const waUrl = `https://wa.me/989128404028?text=${encodedMsg}`;
  const callUrl = "tel:+989128404028";

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 transition-opacity animate-fadeIn"
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[460px]" dir="rtl">
        <div className="bg-neutral-900/95 backdrop-blur-2xl border-t border-white/15 rounded-t-[32px] p-4 sm:p-5 pb-sheet-safe shadow-[0_-12px_40px_rgba(0,0,0,0.75)] animate-fadeInSlide flex flex-col gap-3.5 max-h-[90dvh] overflow-y-auto no-scrollbar">
          {/* Pull Handle */}
          <div className="w-11 h-1.5 rounded-full bg-white/25 mx-auto shrink-0" />

          {/* Header Summary with 3:4 Studio-Framed Model Photo */}
          <div className="flex items-start justify-between pb-3.5 border-b border-white/10 gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Exact 3:4 Studio-Framed Model & Color Photo */}
              <div className="relative w-[84px] h-[112px] sm:w-24 sm:h-32 rounded-[20px] overflow-hidden border border-white/20 bg-neutral-950 shadow-[0_8px_28px_rgba(0,0,0,0.65)] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={colorMeta.imageSrc}
                  alt={`${modelName} - ${colorMeta.shortName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-[10.5px] font-bold text-emerald-300">
                    {actMeta.shortLabel}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold border ${
                      regMeta.isRegistered
                        ? "bg-amber-500/20 border-amber-400/40 text-amber-200"
                        : "bg-white/10 border-white/15 text-neutral-300"
                    }`}
                  >
                    {regMeta.shortLabel}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight truncate" dir="ltr">
                  {modelName}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-300">
                  <span className="font-extrabold px-2 py-0.5 rounded-lg bg-white/15 text-white font-mono text-[11px]">
                    {item.capacity}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-white">{colorMeta.shortName}</span>
                </div>
                <span className="text-[11px] text-neutral-300 font-medium">
                  {partInfo.flag} {partInfo.label}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0 touch-manipulation"
              aria-label="بستن"
            >
              <IconClose />
            </button>
          </div>

          {/* Clean 4-Box Spec Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">وضعیت پلمپ و اکتیو</span>
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-[11.5px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                {actMeta.shortLabel} شرکتی
              </span>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">پارت‌نامبر</span>
              <span className="font-bold text-white text-[11.5px]" dir="ltr">
                {partInfo.flag} {partInfo.code}
              </span>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">وضعیت رجیستری</span>
              <span
                className={`font-bold text-[11.5px] ${
                  regMeta.isRegistered ? "text-amber-300" : "text-neutral-300"
                }`}
              >
                {regMeta.shortLabel}
              </span>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex flex-col gap-1">
              <span className="text-[10px] text-neutral-400">ضمانت و اصالت</span>
              <span className="font-bold text-white flex items-center gap-1 text-[11.5px]">
                <IconCheckmark />
                ۱۰ روز مهلت تست کتبی
              </span>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/25 text-emerald-200 text-[11px] leading-relaxed flex items-center gap-2.5">
            <IconShieldCheck />
            <span>
              پلمپ اصلی شرکت اپل • تحویل فوری حضوری در فروشگاه دانیفون یا ارسال با پیک ویژه تهران
            </span>
          </div>

          {/* Price Box */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/[0.06] border border-white/15">
            <div className="flex flex-col">
              <span className="text-[11px] text-neutral-400">قیمت نقدی روز:</span>
              <span className="text-lg sm:text-xl font-black text-white tabular-nums mt-0.5">
                {priceFormatted}
              </span>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
              موجود • آماده تحویل
            </span>
          </div>

          {/* Direct Checkout CTAs (48px+ Mobile Touch Targets) */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] py-3 px-3 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <IconTelegram />
                <span>رزرو در تلگرام</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              >
                <IconWhatsApp />
                <span>رزرو در واتساپ</span>
              </a>
            </div>

            <a
              href={callUrl}
              className="min-h-[46px] py-2.5 px-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-neutral-200 hover:text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-2 touch-manipulation"
            >
              <IconPhoneCall />
              <span>تماس مستقیم با فروشگاه (09128404028)</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Mobile-First Variant Row with 3:4 Studio Thumbnail
   ═══════════════════════════════════════════════════════ */
function VariantRow({
  item,
  onInspect,
}: {
  item: InventoryItem;
  onInspect: (item: InventoryItem) => void;
}) {
  const { numOnly, isContact } = formatPrice(item.price);
  const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
  const colorMeta = getColorMeta(extractedColor, modelName);
  const partInfo = getPartCountry(item);
  const actMeta = getActivationMeta(item.condition);
  const regMeta = getRegistryMeta(item.registry);

  return (
    <button
      type="button"
      onClick={() => onInspect(item)}
      className="w-full group flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-[22px] bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.09] hover:border-white/[0.24] active:scale-[0.98] transition-all cursor-pointer text-right touch-manipulation"
    >
      {/* Right Side: 3:4 Studio Thumbnail + Stacked Specs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {/* Exact 3:4 Studio Thumbnail - Fills frame cleanly on mobile */}
        <div className="relative w-[58px] h-[76px] sm:w-[64px] sm:h-[84px] rounded-[16px] overflow-hidden border border-white/20 bg-neutral-950 shadow-[0_4px_14px_rgba(0,0,0,0.55)] shrink-0 group-hover:scale-105 group-hover:border-white/35 transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={colorMeta.imageSrc}
            alt={`${modelName} - ${colorMeta.shortName}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* Line 1: Color Name + Capacity Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] sm:text-sm font-black text-white leading-tight whitespace-nowrap">
              {colorMeta.compactName}
            </span>
            {item.capacity && (
              <span className="px-2 py-0.5 rounded-lg bg-white/15 border border-white/20 text-[10.5px] font-extrabold text-white font-mono leading-none whitespace-nowrap">
                {item.capacity}
              </span>
            )}
          </div>

          {/* Line 2: Part Number + Activation Badge */}
          <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
            <span className="text-neutral-200 font-bold" dir="ltr">
              {partInfo.flag} {partInfo.code}
            </span>
            <span className="text-neutral-500">•</span>
            <span
              className={`font-bold inline-flex items-center gap-1 ${
                actMeta.isNotActive ? "text-emerald-300" : "text-sky-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  actMeta.isNotActive ? "bg-emerald-400" : "bg-sky-400"
                }`}
              />
              {actMeta.shortLabel}
            </span>
          </div>

          {/* Line 3: Registry Badge */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                regMeta.isRegistered
                  ? "bg-amber-500/20 border-amber-400/40 text-amber-200"
                  : "bg-white/[0.06] border-white/10 text-neutral-300"
              }`}
            >
              {regMeta.shortLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Left Side: Price + Clear Mobile Action Pill */}
      <div className="flex flex-col items-end justify-center gap-1 shrink-0 pl-0.5">
        {isContact ? (
          <span className="text-xs font-bold text-amber-300">استعلام قیمت</span>
        ) : (
          <div className="flex flex-col items-end">
            <span className="text-[14px] sm:text-base font-black text-white tabular-nums tracking-tight leading-none">
              {numOnly}
            </span>
            <span className="text-[9.5px] text-neutral-400 mt-0.5">تومان</span>
          </div>
        )}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 group-hover:bg-emerald-500/25 border border-emerald-400/30 text-[9.5px] font-bold text-emerald-300 transition-colors whitespace-nowrap">
          <span>رزرو</span>
          <span className="text-[10px] group-hover:-translate-x-0.5 transition-transform">←</span>
        </span>
      </div>
    </button>
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
  const [registryFilter, setRegistryFilter] = useState<"all" | "with-reg" | "no-reg">("all");
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>("all");
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>("all");
  const [selectedCapacityFilter, setSelectedCapacityFilter] = useState<string>("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>("all");
  const [activationFilter, setActivationFilter] = useState<"all" | "not-active" | "active">("all");
  const [sortOption, setSortOption] = useState<"default" | "price-asc" | "price-desc">("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedItem, setInspectedItem] = useState<InventoryItem | null>(null);

  // Count Registry totals
  const registryCounts = useMemo(() => {
    let withReg = 0;
    let noReg = 0;
    items.forEach((item) => {
      if (getRegistryMeta(item.registry).isRegistered) withReg++;
      else noReg++;
    });
    return { withReg, noReg };
  }, [items]);

  // Extract unique models dynamically (filtered by series & registry if active)
  const availableModels = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      if (selectedSeriesFilter !== "all" && item.series !== selectedSeriesFilter) return;
      if (registryFilter !== "all") {
        const isReg = getRegistryMeta(item.registry).isRegistered;
        if (registryFilter === "with-reg" && !isReg) return;
        if (registryFilter === "no-reg" && isReg) return;
      }
      const { modelName } = parseModelAndColor(item.model, item.color);
      map.set(modelName, (map.get(modelName) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [items, selectedSeriesFilter, registryFilter]);

  // Extract unique capacities dynamically sorted (128GB -> 256GB -> 512GB -> 1TB)
  const availableCapacities = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.capacity) set.add(item.capacity);
    });
    return Array.from(set).sort((a, b) => capacityRank(a) - capacityRank(b));
  }, [items]);

  // Extract unique colors with their hex swatch, compact name, and photo
  const availableColors = useMemo(() => {
    const map = new Map<string, { compactName: string; hex: string; imageSrc: string }>();
    items.forEach((item) => {
      const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
      const meta = getColorMeta(extractedColor, modelName);
      if (!map.has(meta.shortName)) {
        map.set(meta.shortName, {
          compactName: meta.compactName,
          hex: meta.hex,
          imageSrc: meta.imageSrc,
        });
      }
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      compactName: data.compactName,
      hex: data.hex,
      imageSrc: data.imageSrc,
    }));
  }, [items]);

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // 1. Registry filter
    if (registryFilter !== "all") {
      result = result.filter((i) => {
        const isReg = getRegistryMeta(i.registry).isRegistered;
        return registryFilter === "with-reg" ? isReg : !isReg;
      });
    }

    // 2. Series filter
    if (selectedSeriesFilter !== "all") {
      result = result.filter((i) => i.series === selectedSeriesFilter);
    }

    // 3. Model filter
    if (selectedModelFilter !== "all") {
      result = result.filter(
        (i) => parseModelAndColor(i.model, i.color).modelName === selectedModelFilter
      );
    }

    // 4. Capacity filter
    if (selectedCapacityFilter !== "all") {
      result = result.filter((i) => i.capacity === selectedCapacityFilter);
    }

    // 5. Color filter
    if (selectedColorFilter !== "all") {
      result = result.filter((i) => {
        const { modelName, extractedColor } = parseModelAndColor(i.model, i.color);
        return getColorMeta(extractedColor, modelName).shortName === selectedColorFilter;
      });
    }

    // 6. Activation filter
    if (activationFilter !== "all") {
      result = result.filter((i) => {
        const meta = getActivationMeta(i.condition);
        return activationFilter === "not-active" ? meta.isNotActive : !meta.isNotActive;
      });
    }

    // 7. Search query (supports both Persian and English color/part terms)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((i) => {
        const c = (i.color ?? "").toLowerCase();
        const enColorAlias =
          c.includes("آلبالویی") || c.includes("زرشکی")
            ? "burgundy crimson red"
            : c.includes("آبی")
            ? "blue glacier"
            : c.includes("سفید")
            ? "silver white"
            : c.includes("مشکی")
            ? "black blk"
            : c.includes("نارنجی")
            ? "orange"
            : c.includes("بنفش")
            ? "purple perpul"
            : c.includes("سبز")
            ? "sage green"
            : "";
        const text = `${i.model ?? ""} ${i.capacity ?? ""} ${i.part ?? ""} ${i.color ?? ""} ${enColorAlias} ${i.condition ?? ""} ${i.registry ?? ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    // 8. Sort by price (when explicitly chosen; "default" preserves flagship list order)
    if (sortOption !== "default") {
      result.sort((a, b) => {
        const priceA = formatPrice(a.price).rawNum;
        const priceB = formatPrice(b.price).rawNum;
        return sortOption === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [
    items,
    registryFilter,
    selectedSeriesFilter,
    selectedModelFilter,
    selectedCapacityFilter,
    selectedColorFilter,
    activationFilter,
    searchQuery,
    sortOption,
  ]);

  // Group filtered items by Model Name
  const groupedByModel = useMemo(() => {
    const groups = new Map<
      string,
      {
        modelName: string;
        items: InventoryItem[];
        minPrice: number;
        previewPhotos: string[];
      }
    >();

    filteredItems.forEach((item) => {
      const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
      const { imageSrc } = getColorMeta(extractedColor, modelName);
      const priceNum = formatPrice(item.price).rawNum;
      const existing = groups.get(modelName);
      if (!existing) {
        groups.set(modelName, {
          modelName,
          items: [item],
          minPrice: priceNum > 0 ? priceNum : Infinity,
          previewPhotos: [imageSrc],
        });
      } else {
        existing.items.push(item);
        if (priceNum > 0 && priceNum < existing.minPrice) {
          existing.minPrice = priceNum;
        }
        if (!existing.previewPhotos.includes(imageSrc) && existing.previewPhotos.length < 4) {
          existing.previewPhotos.push(imageSrc);
        }
      }
    });

    return Array.from(groups.values());
  }, [filteredItems]);

  const hasActiveFilters =
    registryFilter !== "all" ||
    selectedSeriesFilter !== "all" ||
    selectedModelFilter !== "all" ||
    selectedCapacityFilter !== "all" ||
    selectedColorFilter !== "all" ||
    activationFilter !== "all" ||
    searchQuery.trim() !== "";

  const resetAllFilters = () => {
    setRegistryFilter("all");
    setSelectedSeriesFilter("all");
    setSelectedModelFilter("all");
    setSelectedCapacityFilter("all");
    setSelectedColorFilter("all");
    setActivationFilter("all");
    setSearchQuery("");
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-dvh pt-4 pb-28 px-3.5 sm:px-4 w-full relative"
      dir="rtl"
    >
      {/* Subtle Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-gradient-to-b from-emerald-500/15 via-sky-500/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ── 1. MINIMAL MOBILE HEADER ── */}
      <header className="w-full mb-3 select-none">
        <div className="flex items-center justify-between mb-2.5">
          <Link
            href="/"
            className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-bold text-neutral-200 hover:text-white transition-all active:scale-95 touch-manipulation"
          >
            <IconBack />
            <span>صفحه اصلی</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10.5px] font-bold text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>بروزرسانی {relativeTime(fetchedAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white shadow-lg shrink-0">
              <IconAppleLogo className="w-6 h-6 fill-current text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
                لیست قیمت و موجودی آکبند
              </h1>
              <span className="text-[11px] text-neutral-300 mt-0.5">
                {items.length} دستگاه پلمپ اصلی آماده تحویل فوری در دانیفون
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. MOBILE-FRAMED 3:2 4-COLOR SHOWCASE BANNER ── */}
      <section className="w-full mb-3.5 select-none" aria-label="ویترین رنگ‌بندی سری ۱۸">
        <div className="relative w-full aspect-[3/2] rounded-[24px] overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_12px_34px_rgba(0,0,0,0.55)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/models/hero-4colors-framed.jpg"
            alt="رنگ‌بندی کامل آیفون ۱۸ پرو مکس و ۱۸ پرو در فروشگاه دانیفون"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between gap-2 text-[10.5px] text-white">
            <span className="font-bold drop-shadow truncate">
              ✨ موجودی روز سری ۱۸، ۱۷ و ۱۶ (پلمپ نات‌اکتیو اصلی)
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-bold backdrop-blur-md whitespace-nowrap shrink-0">
              ۱۰ روز مهلت تست
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. MOBILE-FIRST SMART FILTER PANEL (GLASS CARD) ── */}
      <section className="w-full mb-4 p-3.5 rounded-[26px] bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col gap-3 select-none">
        {/* Search Input (44px height) */}
        <div className="relative">
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <IconSearch />
          </div>
          <input
            type="text"
            placeholder="جستجوی مدل، رنگ یا پارت (مثلاً 18، 17، ZA/A، نارنجی)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] py-2.5 pr-10 pl-9 rounded-2xl bg-black/45 border border-white/15 focus:border-emerald-400/70 text-xs text-white placeholder:text-neutral-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="w-8 h-8 flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              aria-label="پاک کردن جستجو"
            >
              <IconClose />
            </button>
          )}
        </div>

        {/* Filter Row 0: Registry Status (High-priority 3-column toggle) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-300 px-0.5">
            <span className="font-semibold">۱. وضعیت رجیستری:</span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-amber-300 hover:text-amber-200 font-bold cursor-pointer text-[11px]"
              >
                حذف فیلترها ({filteredItems.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setRegistryFilter("all");
                setSelectedModelFilter("all");
              }}
              className={`min-h-[38px] py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer touch-manipulation ${
                registryFilter === "all"
                  ? "bg-white text-neutral-950 border-white shadow-sm"
                  : "bg-black/35 border-white/10 text-neutral-300 hover:text-white"
              }`}
            >
              همه ({items.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setRegistryFilter(registryFilter === "with-reg" ? "all" : "with-reg");
                setSelectedModelFilter("all");
              }}
              className={`min-h-[38px] py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer touch-manipulation ${
                registryFilter === "with-reg"
                  ? "bg-amber-500/25 border-amber-400 text-amber-200 shadow-sm"
                  : "bg-black/35 border-white/10 text-neutral-200 hover:text-white"
              }`}
            >
              با رجیستر ({registryCounts.withReg})
            </button>
            <button
              type="button"
              onClick={() => {
                setRegistryFilter(registryFilter === "no-reg" ? "all" : "no-reg");
                setSelectedModelFilter("all");
              }}
              className={`min-h-[38px] py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer touch-manipulation ${
                registryFilter === "no-reg"
                  ? "bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-sm"
                  : "bg-black/35 border-white/10 text-neutral-200 hover:text-white"
              }`}
            >
              بدون رجیستر ({registryCounts.noReg})
            </button>
          </div>
        </div>

        {/* Filter Row 1: Series Quick Selector (4-column grid) */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] text-neutral-300 font-semibold px-0.5">۲. انتخاب سری و مدل:</span>
          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                { id: "all", label: "همه" },
                { id: "18", label: "سری ۱۸" },
                { id: "17", label: "سری ۱۷" },
                { id: "16", label: "سری ۱۶" },
              ] as const
            ).map((s) => {
              const active = selectedSeriesFilter === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSeriesFilter(active && s.id !== "all" ? "all" : s.id);
                    setSelectedModelFilter("all");
                  }}
                  className={`min-h-[36px] py-1 px-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer touch-manipulation ${
                    active
                      ? "bg-white text-neutral-950 border-white shadow-sm"
                      : "bg-black/35 border-white/10 text-neutral-200 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Specific Model Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedModelFilter("all")}
              className={`min-h-[36px] py-1 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border touch-manipulation ${
                selectedModelFilter === "all"
                  ? "bg-white/20 text-white border-white/50"
                  : "bg-black/35 text-neutral-300 border-white/10 hover:bg-white/10"
              }`}
            >
              همه مدل‌ها
            </button>
            {availableModels.map((m) => {
              const active = selectedModelFilter === m.name;
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setSelectedModelFilter(active ? "all" : m.name)}
                  className={`min-h-[36px] py-1 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center gap-1.5 touch-manipulation ${
                    active
                      ? "bg-white text-neutral-950 border-white shadow-sm"
                      : "bg-black/35 text-neutral-200 border-white/10 hover:bg-white/10"
                  }`}
                  dir="ltr"
                >
                  <span>{m.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono leading-none ${
                      active ? "bg-neutral-900/15 text-neutral-900" : "bg-white/10 text-neutral-300"
                    }`}
                  >
                    {m.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Row 2: Capacity (5-column grid on mobile for 128/256/512/1TB) */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] text-neutral-300 font-semibold px-0.5">۳. ظرفیت حافظه:</span>
          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCapacityFilter("all")}
              className={`min-h-[36px] py-1 px-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer touch-manipulation ${
                selectedCapacityFilter === "all"
                  ? "bg-emerald-500/25 border-emerald-400/70 text-emerald-200 shadow-sm"
                  : "bg-black/35 border-white/10 text-neutral-300 hover:text-white"
              }`}
            >
              همه
            </button>
            {availableCapacities.map((cap) => {
              const active = selectedCapacityFilter === cap;
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setSelectedCapacityFilter(active ? "all" : cap)}
                  className={`min-h-[36px] py-1 px-1.5 rounded-xl text-[11px] font-bold font-mono border transition-all cursor-pointer touch-manipulation ${
                    active
                      ? "bg-emerald-500/25 border-emerald-400/70 text-emerald-200 shadow-sm"
                      : "bg-black/35 border-white/10 text-neutral-200 hover:text-white"
                  }`}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Row 3: Color Swatch + Label Chips */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] text-neutral-300 font-semibold px-0.5">۴. رنگ بدنه:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedColorFilter("all")}
              className={`min-h-[36px] px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap touch-manipulation ${
                selectedColorFilter === "all"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-black/35 border-white/10 text-neutral-300"
              }`}
            >
              همه رنگ‌ها
            </button>
            {availableColors.map((col) => {
              const active = selectedColorFilter === col.name;
              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColorFilter(active ? "all" : col.name)}
                  className={`min-h-[36px] px-3 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${
                    active
                      ? "bg-white/20 border-emerald-400 text-white ring-1 ring-emerald-400/50"
                      : "bg-black/35 border-white/10 text-neutral-200 hover:bg-white/10"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0 shadow-sm"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.compactName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Row 4: Activation Status & Price Sort */}
        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-white/[0.08] text-[11px]">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {(
              [
                { id: "all", label: "همه پلمپ‌ها" },
                { id: "not-active", label: "نات‌اکتیو" },
                { id: "active", label: "اکتیو" },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setActivationFilter(st.id)}
                className={`min-h-[36px] py-1 px-2.5 rounded-xl font-bold transition-all cursor-pointer border whitespace-nowrap touch-manipulation ${
                  activationFilter === st.id
                    ? "bg-white/15 border-white/30 text-white"
                    : "bg-black/25 border-white/5 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setSortOption((prev) =>
                prev === "default" ? "price-asc" : prev === "price-asc" ? "price-desc" : "default"
              )
            }
            className="min-h-[36px] py-1 px-3 rounded-xl bg-black/35 border border-white/15 text-neutral-200 hover:text-white font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 touch-manipulation"
          >
            <span>
              {sortOption === "default"
                ? "چیدمان پرچمدار ⭐"
                : sortOption === "price-asc"
                ? "ارزان‌ترین ↑"
                : "گران‌ترین ↓"}
            </span>
          </button>
        </div>
      </section>

      {/* ── 4. GROUPED INVENTORY SECTIONS WITH MODEL PHOTOS ── */}
      <section className="w-full flex flex-col gap-4">
        {groupedByModel.length === 0 ? (
          <div className="flex flex-col items-center text-center py-10 px-4 rounded-[28px] bg-white/[0.05] border border-white/[0.10] gap-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl">
              🔍
            </div>
            <h3 className="text-sm font-bold text-white">
              دستگاهی با این فیلتر در انبار یافت نشد
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              می‌توانید فیلترها را پاک کنید یا کانفیگ دلخواهتان را در صف انتظار VIP ثبت کنید تا به محض موجود شدن به شما اطلاع دهیم.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold cursor-pointer transition-all"
              >
                نمایش کل موجودی
              </button>
              <Link
                href="/#waitlist"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black transition-all"
              >
                ثبت در صف VIP
              </Link>
            </div>
          </div>
        ) : (
          groupedByModel.map((group) => (
            <div
              key={group.modelName}
              className="w-full rounded-[28px] bg-black/40 backdrop-blur-2xl border border-white/[0.12] p-3.5 shadow-[0_10px_32px_rgba(0,0,0,0.35)] flex flex-col gap-2.5 animate-fadeIn"
            >
              {/* Model Group Header with Balanced 3:4 Studio Thumbnails */}
              <div className="flex items-center justify-between px-1 pb-3 border-b border-white/10 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Clean Mini 3:4 Studio Cards of Available Colors */}
                  <div className="flex items-center -space-x-2.5 space-x-reverse shrink-0">
                    {group.previewPhotos.map((src, idx) => (
                      <div
                        key={src}
                        style={{ zIndex: 10 - idx }}
                        className="w-9 h-12 rounded-[10px] overflow-hidden border border-white/25 bg-neutral-950 shadow-md shrink-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={group.modelName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h2 className="text-sm sm:text-base font-black text-white tracking-tight truncate" dir="ltr">
                      {group.modelName}
                    </h2>
                    <span className="text-[10.5px] text-neutral-300">
                      {group.items.length} کانفیگ آماده تحویل
                    </span>
                  </div>
                </div>

                {group.minPrice < Infinity && (
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[9.5px] text-neutral-400">شروع قیمت از:</span>
                    <span className="text-xs font-extrabold text-emerald-300 tabular-nums">
                      {group.minPrice.toLocaleString("en-US")} ت
                    </span>
                  </div>
                )}
              </div>

              {/* Clean Variant List inside this Model */}
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <VariantRow
                    key={item.item_id}
                    item={item}
                    onInspect={setInspectedItem}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* ── 5. STICKY BOTTOM VIP BAR (Safe-Area Aware) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[460px]" dir="rtl">
        <div className="bg-neutral-950/92 backdrop-blur-2xl border-t border-white/15 px-3.5 pt-2.5 pb-safe flex items-center justify-between gap-2 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-white truncate">
              رنگ یا ظرفیت خاص دیگری مدنظر دارید؟
            </span>
            <span className="text-[9.5px] text-amber-300/90 truncate font-medium">
              ثبت رایگان در صف اولویت VIP دانیفون
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/#waitlist"
              className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold active:scale-95 transition-all shadow-[0_2px_12px_rgba(245,158,11,0.25)] cursor-pointer whitespace-nowrap touch-manipulation"
            >
              <span>🎯</span>
              <span>صف انتظار VIP</span>
            </Link>
            <a
              href="https://t.me/danikamali"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 text-xs active:scale-95 transition-all touch-manipulation"
              title="ارتباط با کارشناس تلگرام"
              aria-label="ارتباط با کارشناس تلگرام"
            >
              <IconTelegram />
            </a>
            <a
              href="https://wa.me/989128404028"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs active:scale-95 transition-all touch-manipulation"
              title="ارتباط با کارشناس واتساپ"
              aria-label="ارتباط با کارشناس واتساپ"
            >
              <IconWhatsApp />
            </a>
          </div>
        </div>
      </div>

      {/* ── 6. TECHNICAL INSPECTION BOTTOM SHEET ── */}
      {inspectedItem && (
        <TechnicalInspectionSheet
          item={inspectedItem}
          onClose={() => setInspectedItem(null)}
        />
      )}
    </div>
  );
}

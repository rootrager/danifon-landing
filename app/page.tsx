"use client";

import React, { useState } from "react";
import { Lalezar } from "next/font/google";
import config from "../config.json";
import Calculators from "./components/Calculators";
import WaitlistSection from "./components/WaitlistSection";
import AppleIdSection from "./components/AppleIdSection";

const lalezar = Lalezar({ weight: "400", subsets: ["arabic"] });

type TabType = "waitlist" | "installment" | "registry" | "appleid";

interface TabItem {
  id: TabType;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  borderActive: string;
  bgActive: string;
  glowClass: string;
}

const TABS: TabItem[] = [
  {
    id: "waitlist",
    title: "صف انتظار VIP",
    subtitle: "رزرو اولویت خرید آیفون",
    icon: "🎯",
    accentColor: "text-amber-300",
    borderActive: "border-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.25)]",
    bgActive: "bg-amber-500/15",
    glowClass: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    id: "installment",
    title: "محاسبه اقساط",
    subtitle: "محاسبه چک و کارمزد",
    icon: "📊",
    accentColor: "text-sky-300",
    borderActive: "border-sky-400/80 shadow-[0_0_24px_rgba(56,189,248,0.25)]",
    bgActive: "bg-sky-500/15",
    glowClass: "from-sky-500/20 via-blue-500/10 to-transparent",
  },
  {
    id: "registry",
    title: "محاسبه ریجستری",
    subtitle: "استعلام گمرک و پاسپورت",
    icon: "⚙️",
    accentColor: "text-emerald-300",
    borderActive: "border-emerald-400/80 shadow-[0_0_24px_rgba(16,185,129,0.25)]",
    bgActive: "bg-emerald-500/15",
    glowClass: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "appleid",
    title: "سفارش اپل‌آیدی",
    subtitle: "تحویل فوری روی جیمیل شما",
    icon: "🆔",
    accentColor: "text-indigo-300",
    borderActive: "border-indigo-400/80 shadow-[0_0_24px_rgba(99,102,241,0.3)]",
    bgActive: "bg-indigo-500/15",
    glowClass: "from-indigo-500/20 via-purple-500/10 to-transparent",
  },
];

// Quick Action Channel Icons
const TelegramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`${className} fill-current text-sky-400`} viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`${className} fill-current text-emerald-400`} viewBox="0 0 24 24">
    <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.552 4.17 1.599 5.986L.071 24l6.126-1.606c1.764.957 3.742 1.464 5.83 1.464 6.645 0 12.028-5.383 12.028-12.031S18.675 0 12.031 0zm0 21.849c-1.793 0-3.548-.482-5.086-1.393l-.365-.217-3.774.989 1.008-3.682-.238-.378a10.02 10.02 0 0 1-1.543-5.318C2.033 6.309 6.471 1.867 12.031 1.867c5.556 0 9.994 4.439 9.994 9.983s-4.438 9.999-9.994 9.999zm5.485-7.485c-.301-.151-1.782-.88-2.059-.982-.276-.1-.477-.151-.678.151-.201.301-.778.982-.954 1.183-.176.201-.351.226-.653.075-2.093-1.05-3.513-1.921-4.836-3.626-.176-.226-.019-.348.131-.498.136-.136.301-.351.452-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.151-.678-1.631-.929-2.233-.245-.588-.495-.508-.678-.518-.176-.008-.376-.011-.577-.011s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.51s1.079 2.911 1.229 3.112c.151.201 2.122 3.238 5.14 4.542 1.942.836 2.709.914 3.652.766.793-.125 2.457-1.004 2.802-1.97.345-.966.345-1.792.245-1.97-.101-.176-.376-.276-.678-.427z" />
  </svg>
);

const BaleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`${className} fill-current text-indigo-400`} viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14h8v2H6v-2zm0-3h12v2H6v-2zm0-3h12v2H6V8z" />
  </svg>
);

const BotIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`${className} fill-current text-rose-400`} viewBox="0 0 24 24">
    <path d="M19 10V7c0-1.1-.9-2-2-2h-3c0-1.1-.9-2-2-2s-2 .9-2 2H7c-1.1 0-2 .9-2 2v3c-1.66 0-3 1.34-3 3s1.34 3 3 3v2c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-2c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-8 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const LocationPinIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={`${className} fill-current text-red-400`} viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("waitlist");

  const currentTabObj = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-8 pb-12 px-4.5 w-full relative">
      {/* Dynamic Ambient Background Glow that morphs with the active tab */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b ${currentTabObj.glowClass} blur-[120px] rounded-full pointer-events-none transition-all duration-700 -z-10`}
      />

      {/* BRAND HERO HEADER */}
      <header className="flex flex-col items-center mb-6 text-center select-none w-full relative">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[10px] font-semibold text-neutral-200 shadow-sm mb-3.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>فروشگاه فعال • سفارش آنلاین و تحویل فوری</span>
        </div>

        {/* Titanium Apple Emblem + Typography */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white text-2xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] animate-floatSlow">
            
          </div>
          <div className="flex flex-col text-right" dir="ltr">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight shimmer-text leading-none">
              {config.business.nameEn}
            </h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.25em] mt-0.5">
              {config.business.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* 4-WAY GLASSMORPHISM SWITCHER MATRIX (2x2 Grid) */}
      <nav className="w-full grid grid-cols-2 gap-2.5 mb-5 select-none" dir="rtl" aria-label="خدمات اصلی">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-[22px] border flex items-center gap-2.5 text-right transition-all duration-300 cursor-pointer touch-manipulation relative overflow-hidden backdrop-blur-xl group ${
                isActive
                  ? `${tab.bgActive} ${tab.borderActive} scale-[1.02]`
                  : "bg-white/[0.06] border-white/[0.10] hover:bg-white/10 hover:border-white/25 active:scale-[0.98]"
              }`}
            >
              {/* Active Indicator Glow Pip */}
              {isActive && (
                <span className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-pulse"></span>
              )}

              <div className={`w-9 h-9 rounded-[16px] shrink-0 flex items-center justify-center text-lg transition-transform duration-300 ${
                isActive ? "bg-white/20 shadow-inner scale-110" : "bg-black/30 group-hover:scale-105"
              }`}>
                {tab.icon}
              </div>

              <div className="flex flex-col min-w-0">
                <span className={`text-[13px] font-black leading-tight truncate ${
                  isActive ? "text-white" : "text-neutral-200"
                } ${lalezar.className}`}>
                  {tab.title}
                </span>
                <span className={`text-[9.5px] font-medium truncate mt-0.5 ${
                  isActive ? tab.accentColor : "text-neutral-400"
                }`}>
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* ACTIVE DASHBOARD CONTAINER CARD */}
      <section className="w-full relative z-20" dir="rtl">
        <div className="bg-white/[0.08] backdrop-blur-[28px] rounded-[30px] p-4.5 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-white/[0.14] transition-all duration-500">
          {activeTab === "waitlist" && (
            <WaitlistSection lalezarClassName={lalezar.className} />
          )}

          {activeTab === "installment" && (
            <Calculators
              lalezarClassName={lalezar.className}
              activeTab="installment"
              hideHeaderTabs={true}
            />
          )}

          {activeTab === "registry" && (
            <Calculators
              lalezarClassName={lalezar.className}
              activeTab="registry"
              hideHeaderTabs={true}
            />
          )}

          {activeTab === "appleid" && (
            <AppleIdSection lalezarClassName={lalezar.className} />
          )}
        </div>
      </section>

      {/* DIRECT CHANNELS & SOCIAL LINKS */}
      <section className="w-full mt-6 flex flex-col gap-2.5" dir="rtl">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-neutral-300">
            کانال‌ها و ارتباط مستقیم با دانیفون:
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">24/7 Support</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {config.buttons.map((btn) => {
            const getButtonIcon = () => {
              switch (btn.icon) {
                case "telegram": return <TelegramIcon />;
                case "whatsapp": return <WhatsAppIcon />;
                case "bale": return <BaleIcon />;
                case "bot": return <BotIcon />;
                default: return <TelegramIcon />;
              }
            };

            const content = (
              <div
                className={`py-2.5 px-3 rounded-[18px] bg-white/[0.06] backdrop-blur-lg border border-white/[0.10] flex items-center justify-between transition-all duration-300 ${
                  !btn.isActive
                    ? "opacity-50 grayscale cursor-not-allowed"
                    : "hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] active:scale-[0.97] cursor-pointer shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="shrink-0">{getButtonIcon()}</div>
                  <div className="flex flex-col text-right">
                    <span className={`text-xs font-bold text-white ${lalezar.className}`}>
                      {btn.title}
                    </span>
                    <span className="text-[9.5px] text-neutral-400">
                      {btn.subtitle}
                    </span>
                  </div>
                </div>
                {btn.isActive ? (
                  <span className="text-neutral-400 text-xs">↗</span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">به‌زودی</span>
                )}
              </div>
            );

            if (!btn.isActive || !btn.url || btn.url === "#") {
              return <div key={btn.id}>{content}</div>;
            }

            return (
              <a key={btn.id} href={btn.url} target="_blank" rel="noopener noreferrer" className="block outline-none">
                {content}
              </a>
            );
          })}
        </div>
      </section>

      {/* STORE LOCATION & NATIVE NAVIGATION */}
      <section className="w-full mt-6" dir="rtl">
        <div className="bg-white/[0.08] backdrop-blur-[24px] rounded-[28px] p-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/[0.12] flex flex-col gap-3.5">
          <div className="flex items-start gap-2.5 text-white">
            <div className="mt-0.5 shrink-0">
              <LocationPinIcon />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`${lalezar.className} text-base text-white`}>
                  {config.location.storeName}
                </span>
                <span className="text-[11px] text-neutral-400 font-normal">
                  ({config.business.nameEn})
                </span>
              </div>
              <span className="text-xs text-neutral-300 leading-relaxed">
                {config.location.addressText}
              </span>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                <span>👈</span>
                <span>توجه: لاین سمت چپ فروشگاه متعلق به تیم دانیفون است</span>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full aspect-video rounded-[18px] overflow-hidden relative border border-white/10 shadow-inner">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(config.location.addressText)}&z=15&output=embed`}
              className="w-full h-full border-0 brightness-[0.85] contrast-[1.05] pointer-events-none"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Quick Routing Apps Row */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-neutral-400 font-medium">مسیریابی سریع با اپلیکیشن دلخواه:</span>
            <div className="grid grid-cols-4 gap-1.5">
              <a
                href={config.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-center text-white text-[11px] font-bold transition-all border border-white/10"
              >
                🗺️ گوگل‌مپ
              </a>
              <a
                href={config.location.neshanUrl || config.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-center text-white text-[11px] font-bold transition-all border border-white/10"
              >
                🚗 نشان
              </a>
              <a
                href={config.location.baladUrl || config.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-center text-white text-[11px] font-bold transition-all border border-white/10"
              >
                📍 بلد
              </a>
              <a
                href={config.location.wazeUrl || config.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-center text-white text-[11px] font-bold transition-all border border-white/10"
              >
                🚙 ویز
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 pt-4 pb-2 text-[10px] font-medium text-neutral-400 tracking-wider select-none text-center">
        &copy; {new Date().getFullYear()} {config.business.nameEn}. ALL RIGHTS RESERVED.
        <div className="text-[9px] text-neutral-500 mt-0.5">تهران، فروشگاه تخصصی آیفون و خدمات اپل</div>
      </footer>
    </div>
  );
}

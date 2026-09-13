"use client";

import React, { useState } from "react";
import { Lalezar } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  image: string;
  tag: string;
  priceNote: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "iphone-17-pro",
    title: "آیفون 17 پرو",
    subtitle: "تیتانیوم یخی",
    badge: "پرچمدار 2026",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    image: "/showcase-iphone-17-pro.jpeg",
    tag: "آکبند • نات‌اکتیو",
    priceNote: "تحویل فوری تهران",
  },
  {
    id: "watch-ultra",
    title: "اپل واچ اولترا 2",
    subtitle: "تیتانیوم 49mm",
    badge: "موجود در انبار",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-400/40",
    image: "/showcase-apple-watch-ultra.jpeg",
    tag: "بند اوشن • ضدآب",
    priceNote: "تضمین اصالت",
  },
  {
    id: "airpods-pro",
    title: "ایرپادز پرو 2",
    subtitle: "تایپ سی (Type-C)",
    badge: "پرفروش‌ترین",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
    image: "/showcase-airpods-pro.jpeg",
    tag: "نویزکنسلینگ ANC",
    priceNote: "مهلت تست 10 روزه",
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

const AppleLogoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.78-8.8-10.3-18.79-13.56-29.98-3.26-11.19-4.89-22.14-4.89-32.84 0-14.35 3.84-26.31 11.51-35.88 7.67-9.57 17.15-14.48 28.43-14.73 4.35 0 9.28 1.16 14.79 3.48 5.51 2.32 9.09 3.54 10.74 3.66 1.88 0 5.68-1.28 11.4-3.83 5.72-2.55 10.81-3.76 15.28-3.63 11.08.38 20.31 4.34 27.67 11.89 7.36 7.55 12.01 16.89 13.97 28.02-9.92 5.98-14.76 14.35-14.53 25.1.23 9.46 3.96 17.39 11.19 23.79 3.59 3.16 7.6 5.62 12.03 7.38-2.61 7.63-5.7 15.02-9.27 22.18zM119.22 31.84c0-7.38 2.65-14.18 7.95-20.4 5.3-6.23 11.83-10.15 19.59-11.77.23 1.05.35 2.12.35 3.21 0 7.38-2.73 14.36-8.2 20.93-5.46 6.57-12.05 10.36-19.78 11.38-.11-1.12-.17-2.24-.17-3.35z" />
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
      <header className="flex flex-col items-center mb-5 text-center select-none w-full relative">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md text-[10px] font-semibold text-neutral-200 shadow-sm mb-3.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>فروشگاه تخصصی آیفون • خرید آنلاین و تحویل حضوری</span>
        </div>

        {/* Titanium Apple Emblem + Typography */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(0,0,0,0.3)] animate-floatSlow">
            <AppleLogoIcon className="w-6 h-6 fill-current text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
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

      {/* FEATURED INVENTORY SHOWCASE DASHBOARD */}
      <section className="w-full mb-5 relative select-none" dir="rtl" aria-label="ویترین موجودی دانیفون">
        <div className="bg-white/[0.07] backdrop-blur-[24px] rounded-[26px] p-3 sm:p-3.5 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col gap-2.5">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <h2 className={`text-xs sm:text-sm font-black text-white ${lalezar.className}`}>
                ویترین منتخب موجودی
              </h2>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                Live
              </span>
            </div>
            <Link
              href="/inventory"
              className="text-[10.5px] font-bold text-indigo-300 hover:text-white flex items-center gap-0.5 transition-colors group"
            >
              <span>مشاهده همه</span>
              <span className="text-xs group-hover:-translate-x-0.5 transition-transform">←</span>
            </Link>
          </div>

          {/* 3-Column Product Cards Grid */}
          <div className="grid grid-cols-3 gap-2">
            {SHOWCASE_ITEMS.map((item) => (
              <Link
                key={item.id}
                href="/inventory"
                className="group flex flex-col rounded-[18px] bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/25 p-1.5 transition-all duration-300 active:scale-[0.97] overflow-hidden"
              >
                {/* Image Container with specular overlay */}
                <div className="relative w-full aspect-[3/4] rounded-[13px] overflow-hidden bg-neutral-900/80 border border-white/10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 33vw, 150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle top & bottom shadow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
                  {/* Floating badge */}
                  <span className={`absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-md border backdrop-blur-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  {/* Floating price note at bottom */}
                  <span className="absolute bottom-1.5 right-1 left-1 text-[8px] text-center font-bold py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-300 border border-white/10 truncate">
                    {item.priceNote}
                  </span>
                </div>

                {/* Device Title & Subtitle */}
                <div className="flex flex-col mt-1.5 px-0.5 text-right">
                  <span className={`text-[11.5px] font-black text-white leading-tight truncate ${lalezar.className}`}>
                    {item.title}
                  </span>
                  <span className="text-[8.5px] text-neutral-400 truncate mt-0.5">
                    {item.subtitle}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Action Explore Bar */}
          <Link
            href="/inventory"
            className="w-full py-2 px-3 rounded-[15px] bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent hover:from-indigo-500/25 hover:to-purple-500/20 border border-indigo-400/20 hover:border-indigo-400/40 flex items-center justify-between transition-all duration-300 active:scale-[0.98] group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">📦</span>
              <div className="flex flex-col text-right">
                <span className={`text-xs font-bold text-white ${lalezar.className}`}>
                  مشاهده لیست کامل موجودی انبار
                </span>
                <span className="text-[8.5px] text-indigo-300">
                  آیفون، اپل واچ، ایرپاد و اکسسوری با قیمت روز
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 group-hover:text-white shrink-0 transition-colors">
              <span className="text-[9.5px]">ورود به انبار</span>
              <span className="text-xs group-hover:-translate-x-0.5 transition-transform">←</span>
            </div>
          </Link>
        </div>
      </section>

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
              title="موقعیت مکانی فروشگاه دانیفون روی نقشه"
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

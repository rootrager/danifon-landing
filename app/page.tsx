"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Calculator,
  ShieldCheck,
  KeyRound,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowUpLeft,
  Send,
  MessageCircle,
  MessageSquare,
  Bot,
  MapPin,
  Navigation,
  ExternalLink,
  Check,
} from "lucide-react";
import config from "../config.json";
import TopNav from "./components/TopNav";
import Calculators from "./components/Calculators";
import WaitlistSection from "./components/WaitlistSection";
import AppleIdSection from "./components/AppleIdSection";

type TabType = "waitlist" | "installment" | "registry" | "appleid";

interface TabItem {
  id: TabType;
  title: string;
  subtitle: string;
  desktopDesc: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  activeClass: string;
  accentText: string;
}

const TABS: TabItem[] = [
  {
    id: "waitlist",
    title: "صف انتظار VIP",
    subtitle: "رزرو اولویت خرید",
    desktopDesc: "ثبت رایگان مدل و رنگ دلخواه با بالاترین اولویت تحویل",
    Icon: Target,
    activeClass: "bg-amber-500/15 border-amber-400/60 text-white",
    accentText: "text-amber-300",
  },
  {
    id: "installment",
    title: "محاسبه اقساط",
    subtitle: "چک صیادی و کارمزد",
    desktopDesc: "محاسبه شفاف اقساط ۱ تا ۱۲ ماهه با چک صیادی بنفش",
    Icon: Calculator,
    activeClass: "bg-sky-500/15 border-sky-400/60 text-white",
    accentText: "text-sky-300",
  },
  {
    id: "registry",
    title: "استعلام رجیستری",
    subtitle: "گمرک و پاسپورت",
    desktopDesc: "مشاهده تعرفه رسمی گمرکی و هزینه ثبت مسافری آیفون",
    Icon: ShieldCheck,
    activeClass: "bg-emerald-500/15 border-emerald-400/60 text-white",
    accentText: "text-emerald-300",
  },
  {
    id: "appleid",
    title: "سفارش اپل‌آیدی",
    subtitle: "تحویل روی جیمیل",
    desktopDesc: "ساخت اپل‌آیدی قانونی ریجن آمریکا روی ایمیل شخصی شما",
    Icon: KeyRound,
    activeClass: "bg-indigo-500/15 border-indigo-400/60 text-white",
    accentText: "text-indigo-300",
  },
];

function getChannelIcon(iconKey: string) {
  switch (iconKey) {
    case "telegram":
      return <Send className="w-4 h-4 text-sky-400" strokeWidth={1.8} />;
    case "whatsapp":
      return <MessageCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.8} />;
    case "bale":
      return <MessageSquare className="w-4 h-4 text-indigo-400" strokeWidth={1.8} />;
    case "bot":
      return <Bot className="w-4 h-4 text-rose-400" strokeWidth={1.8} />;
    default:
      return <Send className="w-4 h-4 text-sky-400" strokeWidth={1.8} />;
  }
}

const VALID_TABS: TabType[] = ["waitlist", "installment", "registry", "appleid"];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawTab = searchParams.get("tab") as TabType | null;
  const activeTab: TabType = rawTab && VALID_TABS.includes(rawTab) ? rawTab : "waitlist";

  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const servicesSectionRef = useRef<HTMLElement | null>(null);

  const handleSelectTab = (tabId: TabType) => {
    router.replace(`/?tab=${tabId}`, { scroll: false });
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        servicesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 60);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh w-full" dir="rtl">
      <TopNav />

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 pb-14 flex flex-col gap-10 lg:gap-12 flex-1">
        {/* SECTION 1: FLAGSHIP SPLIT STOREFRONT HERO (Full Desktop Presence) */}
        <section
          aria-label="معرفی فروشگاه دانیفون و موجودی آکبند"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
        >
          {/* Editorial Copy & Primary Storefront Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6 py-1">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>فروشگاه تخصصی آیفون</span>
                <span aria-hidden="true">·</span>
                <span>تهران، تحویل حضوری و ارسال فوری</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.18] text-balance">
                مرجع تخصصی آیفون‌های پلمپ و خدمات اپل
              </h1>

              <p className="text-sm sm:text-[15px] text-neutral-300 leading-relaxed max-w-xl">
                موجودی روز آیفون‌های نات‌اکتیو سری ۱۸، ۱۷ و ۱۶ با قیمت شفاف، مشاوره تخصصی خرید نقدی و اقساطی، استعلام تعرفه رجیستری و تحویل حضوری در فروشگاه دانیفون.
              </p>

              {/* Quantitative Store Guarantees (Unboxed Metadata) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/[0.08] mt-1">
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>۱۰ روز مهلت تست کتبی</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>پلمپ اصلی نات‌اکتیو</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تحویل زیر ۳۰ دقیقه تهران</span>
                </div>
              </div>
            </div>

            {/* Primary & Secondary Action Strip */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/inventory"
                className="min-h-[54px] flex-1 py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.985] text-neutral-950 flex items-center justify-between gap-3 transition-all group cursor-pointer touch-manipulation"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center -space-x-2 space-x-reverse shrink-0">
                    {[
                      "/models/iphone18-crimson.jpg",
                      "/models/iphone18-blue.jpg",
                      "/models/iphone18-white.jpg",
                    ].map((src, idx) => (
                      <div
                        key={src}
                        style={{ zIndex: 5 - idx }}
                        className="w-7 h-9 rounded-md overflow-hidden border border-black/25 bg-neutral-900"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt="نمونه رنگ‌بندی آیفون ۱۸"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-extrabold truncate">مشاهده لیست و قیمت روز</span>
                </div>

                <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <a
                href="#services"
                className="min-h-[54px] px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.11] border border-white/12 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 touch-manipulation"
              >
                <Target className="w-4 h-4 text-amber-300" />
                <span>خدمات و صف VIP</span>
              </a>
            </div>
          </div>

          {/* Cinematic Video Showcase */}
          <div className="lg:col-span-6 rounded-3xl bg-white/[0.045] backdrop-blur-2xl border border-white/[0.10] p-3 flex flex-col">
            <div className="relative w-full h-full min-h-[220px] sm:min-h-[280px] aspect-video lg:aspect-auto rounded-2xl overflow-hidden bg-neutral-950 border border-white/10">
              <video
                ref={heroVideoRef}
                src="/videoofiphone.mp4"
                poster="/danifon-showcase-poster.jpg"
                preload="metadata"
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25 pointer-events-none" />

              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-black/65 backdrop-blur-md text-[11px] font-semibold text-emerald-300 border border-white/10">
                  ویترین موجودی آکبند
                </span>

                <button
                  type="button"
                  onClick={() => setIsVideoMuted((prev) => !prev)}
                  className="min-w-[42px] min-h-[42px] rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/15 text-neutral-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
                  title={isVideoMuted ? "پخش صدای ویدیو" : "بی‌صدا کردن ویدیو"}
                  aria-label={isVideoMuted ? "پخش صدای ویدیو" : "بی‌صدا کردن ویدیو"}
                >
                  {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="absolute bottom-3.5 inset-x-4 flex items-end justify-between gap-3 pointer-events-none">
                <div className="flex flex-col">
                  <span className="font-display text-lg sm:text-xl text-white leading-snug">
                    آماده تحویل در تهران
                  </span>
                  <span className="text-xs text-neutral-300">
                    تمامی رنگ‌بندی‌ها و ظرفیت‌های سری ۱۸ و ۱۷
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DESKTOP 2-COLUMN SERVICES STUDIO (Sidebar Rail on Desktop + Tabs on Mobile) */}
        <section
          ref={servicesSectionRef}
          id="services"
          aria-label="خدمات و ابزارهای آنلاین دانیفون"
          className="flex flex-col gap-4 scroll-mt-20"
        >
          <span id="waitlist" className="sr-only">
            صف انتظار VIP
          </span>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-white">
                میز خدمات و محاسبه‌گر هوشمند
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                رزرو صف VIP، محاسبه دقیق چک اقساط، تعرفه رجیستری و سفارش اپل‌آیدی قانونی
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Desktop Vertical Service Rail / Mobile 2x2 Grid */}
            <div
              role="tablist"
              aria-label="انتخاب سرویس"
              className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.Icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`min-h-[64px] lg:min-h-[82px] p-3.5 lg:p-4 rounded-2xl border flex items-center gap-3 text-right transition-colors cursor-pointer touch-manipulation ${
                      isActive
                        ? tab.activeClass
                        : "bg-white/[0.035] border-white/[0.08] text-neutral-300 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? "bg-white/10" : "bg-black/30"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? tab.accentText : "text-neutral-400"}`}
                        strokeWidth={1.85}
                      />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-bold leading-tight truncate">
                        {tab.title}
                      </span>
                      <span className="text-[11px] text-neutral-400 truncate mt-0.5 lg:hidden">
                        {tab.subtitle}
                      </span>
                      <span className="hidden lg:block text-xs text-neutral-400 mt-1 leading-relaxed">
                        {tab.desktopDesc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Workspace Panel */}
            <div
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="lg:col-span-8 rounded-3xl bg-white/[0.045] backdrop-blur-2xl border border-white/[0.10] p-4 sm:p-6 lg:p-7"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                >
                  {activeTab === "waitlist" && <WaitlistSection lalezarClassName="font-display" />}

                  {activeTab === "installment" && (
                    <Calculators
                      lalezarClassName="font-display"
                      activeTab="installment"
                      hideHeaderTabs={true}
                    />
                  )}

                  {activeTab === "registry" && (
                    <Calculators
                      lalezarClassName="font-display"
                      activeTab="registry"
                      hideHeaderTabs={true}
                    />
                  )}

                  {activeTab === "appleid" && <AppleIdSection lalezarClassName="font-display" />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SECTION 3: DIRECT CHANNELS & STORE LOCATION */}
        <section
          id="location"
          aria-label="ارتباط مستقیم و آدرس فروشگاه"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch scroll-mt-20"
        >
          {/* Direct Channels */}
          <div className="lg:col-span-5 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.09] p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-2xl text-white">ارتباط مستقیم و کانال‌ها</h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                استعلام قیمت لحظه‌ای، ثبت سفارش و ارتباط با واحد همکاران دانیفون
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {config.buttons.map((btn) => {
                const cardInner = (
                  <div
                    className={`min-h-[68px] p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-2 transition-colors touch-manipulation ${
                      !btn.isActive
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white/[0.09] hover:border-white/20 active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center shrink-0">
                        {getChannelIcon(btn.icon)}
                      </div>
                      <div className="flex flex-col text-right min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {btn.title}
                        </span>
                        <span className="text-[11px] text-neutral-400 truncate">{btn.subtitle}</span>
                      </div>
                    </div>
                    {btn.isActive ? (
                      <ArrowUpLeft className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap shrink-0">
                        به‌زودی
                      </span>
                    )}
                  </div>
                );

                if (!btn.isActive || !btn.url || btn.url === "#") {
                  return <div key={btn.id}>{cardInner}</div>;
                }

                return (
                  <a
                    key={btn.id}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block outline-none"
                  >
                    {cardInner}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Store Location & Routing */}
          <div className="lg:col-span-7 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.09] p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-400/25 flex items-center justify-center text-rose-300 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" strokeWidth={1.9} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl text-white">{config.location.storeName}</h2>
                  <span className="text-xs text-neutral-400" dir="ltr">
                    {config.business.nameEn}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  {config.location.addressText}
                </p>
                <p className="text-xs font-semibold text-amber-300 mt-0.5">
                  نکته مراجعه حضوری: لاین سمت چپ فروشگاه متعلق به تیم دانیفون است.
                </p>
              </div>
            </div>

            <div className="w-full aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden relative border border-white/10">
              <iframe
                title="موقعیت مکانی دقیق فروشگاه دانیفون روی نقشه"
                src={`https://maps.google.com/maps?q=${config.location.lat || 35.6994973},${config.location.lng || 51.3433422}&hl=fa&z=17&output=embed`}
                className="w-full h-full border-0 brightness-[0.86] contrast-[1.05] pointer-events-none"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={config.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="باز کردن موقعیت دقیق فروشگاه دانیفون در گوگل مپ"
                className="absolute inset-0 flex items-end justify-end p-3 bg-gradient-to-t from-black/65 via-transparent to-transparent"
              >
                <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-white inline-flex items-center gap-1.5">
                  <span>مشاهده پین دقیق روی نقشه</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "گوگل‌مپ", url: config.location.mapUrl },
                { label: "نشان", url: config.location.neshanUrl },
                { label: "بلد", url: config.location.baladUrl },
                { label: "ویز", url: config.location.wazeUrl },
              ].map((navItem) => (
                <a
                  key={navItem.label}
                  href={navItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.11] active:scale-[0.98] border border-white/[0.09] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap touch-manipulation"
                >
                  <Navigation className="w-3.5 h-3.5 text-neutral-300" />
                  <span>{navItem.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* QUIET FOOTER */}
        <footer className="mt-2 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400 select-none">
          <span>تهران، فروشگاه تخصصی آیفون و خدمات اپل</span>
          <span dir="ltr">
            &copy; {new Date().getFullYear()} {config.business.nameEn}. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#08080a]" />}>
      <HomeContent />
    </Suspense>
  );
}

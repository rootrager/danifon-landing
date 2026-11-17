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
  PhoneCall,
} from "lucide-react";
import config from "../config.json";
import TopNav from "./components/TopNav";
import ThemeToggle from "./components/ThemeToggle";
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
  activeCardClass: string;
  iconBgClass: string;
  accentText: string;
}

const TABS: TabItem[] = [
  {
    id: "waitlist",
    title: "صف انتظار VIP",
    subtitle: "رزرو مدل و رنگ دلخواه",
    desktopDesc: "ثبت رایگان مدل مدنظر با اولویت تحویل فوری",
    Icon: Target,
    activeCardClass:
      "bg-white dark:bg-[#0e1526] border-blue-600 dark:border-blue-400 ring-1 ring-blue-500/20",
    iconBgClass: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
    accentText: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "installment",
    title: "محاسبه اقساط",
    subtitle: "چک صیادی و کارمزد شفاف",
    desktopDesc: "محاسبه دقیق قسط ۱ تا ۱۲ ماهه پیش از خرید",
    Icon: Calculator,
    activeCardClass:
      "bg-white dark:bg-[#0e1526] border-blue-600 dark:border-blue-400 ring-1 ring-blue-500/20",
    iconBgClass: "bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400",
    accentText: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "registry",
    title: "استعلام رجیستری",
    subtitle: "تعرفه گمرک و پاسپورت",
    desktopDesc: "مشاهده هزینه قانونی ثبت مسافری هر مدل آیفون",
    Icon: ShieldCheck,
    activeCardClass:
      "bg-white dark:bg-[#0e1526] border-blue-600 dark:border-blue-400 ring-1 ring-blue-500/20",
    iconBgClass: "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300",
    accentText: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "appleid",
    title: "سفارش اپل‌آیدی",
    subtitle: "ساخت روی جیمیل شخصی",
    desktopDesc: "تحویل زیر ۳۰ دقیقه روی ایمیل خودتان، ریجن آمریکا",
    Icon: KeyRound,
    activeCardClass:
      "bg-white dark:bg-[#0e1526] border-blue-600 dark:border-blue-400 ring-1 ring-blue-500/20",
    iconBgClass: "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
    accentText: "text-blue-700 dark:text-blue-300",
  },
];

function getChannelIcon(iconKey: string) {
  switch (iconKey) {
    case "telegram":
      return <Send className="w-4 h-4 text-sky-600 dark:text-sky-400" strokeWidth={1.9} />;
    case "whatsapp":
      return <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.9} />;
    case "bale":
      return <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.9} />;
    case "bot":
      return <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={1.9} />;
    default:
      return <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={1.9} />;
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
  const servicesPanelRef = useRef<HTMLDivElement | null>(null);

  const handleSelectTab = (tabId: TabType) => {
    router.replace(`/?tab=${tabId}`, { scroll: false });
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        servicesPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 60);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh w-full" dir="rtl">
      <TopNav />

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-5 lg:pt-8 pb-16 flex flex-col gap-10 lg:gap-12 flex-1">
        {/* TOP UTILITY STRIP: Unboxed Store Marker + Theme Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-blue-100 dark:border-blue-400/15">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-[#0a1628] dark:text-white">فروشگاه تخصصی آیفون دانیفون</span>
            <span aria-hidden="true">·</span>
            <span>تهران، تحویل حضوری و ارسال فوری</span>
          </div>

          <ThemeToggle />
        </div>

        {/* SECTION 1: TECH-TRUST BLUE SPLIT STOREFRONT HERO */}
        <section
          aria-label="معرفی فروشگاه دانیفون و موجودی آکبند"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch"
        >
          {/* Editorial Copy & Clear Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6 py-1">
            <div className="flex flex-col gap-4">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] text-[#0a1628] dark:text-white leading-[1.18] text-balance">
                مرجع تخصصی آیفون‌های پلمپ و خدمات اپل
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                مشاهده قیمت روز و موجودی آیفون‌های پلمپ سری ۱۸، ۱۷ و ۱۶ به زبان ساده، محاسبه شفاف اقساط، استعلام تعرفه رجیستری و امکان خرید حضوری در فروشگاه دانیفون.
              </p>

              {/* Quantitative Store Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-blue-100 dark:border-blue-400/15 mt-1">
                <div className="flex items-center gap-2 text-sm text-[#0a1628] dark:text-slate-200 font-medium">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={2.5} />
                  <span>۱۰ روز مهلت تست کتبی</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0a1628] dark:text-slate-200 font-medium">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={2.5} />
                  <span>پلمپ اصلی کارخانه</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0a1628] dark:text-slate-200 font-medium">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={2.5} />
                  <span>تحویل زیر ۳۰ دقیقه تهران</span>
                </div>
              </div>
            </div>

            {/* Primary & Direct Call Action Strip */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/inventory"
                className="min-h-[56px] flex-1 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 active:scale-[0.985] text-white flex items-center justify-between gap-3 transition-all group cursor-pointer touch-manipulation shadow-[0_10px_28px_rgba(11,99,246,0.22)] dark:shadow-[0_10px_28px_rgba(59,130,246,0.28)]"
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
                        className="w-7 h-9 rounded-md overflow-hidden border border-white/40 bg-slate-900"
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
                  <span className="text-sm sm:text-base font-bold truncate">مشاهده لیست قیمت و موجودی روز</span>
                </div>

                <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <a
                href={config.contact.phoneUrl}
                className="min-h-[56px] px-5 py-3 rounded-2xl bg-white dark:bg-[#0b101d] hover:bg-blue-50/70 dark:hover:bg-[#11192e] border border-blue-200 dark:border-blue-400/25 text-[#0a1628] dark:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 touch-manipulation"
              >
                <PhoneCall className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="tabular-nums">تماس مستقیم: {config.contact.phone}</span>
              </a>
            </div>
          </div>

          {/* Clean Studio Video Showcase with Blue Frame */}
          <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-[#0b101d] border border-blue-100 dark:border-blue-400/20 p-3 flex flex-col shadow-[0_8px_32px_rgba(11,99,246,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
            <div className="relative w-full h-full min-h-[240px] sm:min-h-[300px] aspect-video lg:aspect-auto rounded-2xl overflow-hidden bg-[#04060c] border border-blue-100/60 dark:border-blue-400/15">
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

              <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/85 via-[#030712]/20 to-[#030712]/30 pointer-events-none" />

              <div className="absolute top-3.5 inset-x-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-100 drop-shadow">
                  ویترین موجودی آکبند فروشگاه
                </span>

                <button
                  type="button"
                  onClick={() => setIsVideoMuted((prev) => !prev)}
                  className="min-w-[42px] min-h-[42px] rounded-full bg-[#04060c]/70 hover:bg-[#04060c]/90 backdrop-blur-md border border-blue-300/25 text-white flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
                  title={isVideoMuted ? "پخش صدای ویدیو" : "بی‌صدا کردن ویدیو"}
                  aria-label={isVideoMuted ? "پخش صدای ویدیو" : "بی‌صدا کردن ویدیو"}
                >
                  {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3 pointer-events-none">
                <div className="flex flex-col gap-0.5">
                  <span className="font-display text-xl sm:text-2xl text-white leading-snug">
                    آماده تحویل در تهران
                  </span>
                  <span className="text-xs sm:text-sm text-blue-100/90">
                    تمامی رنگ‌بندی‌ها و ظرفیت‌های سری ۱۸، ۱۷ و ۱۶
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 4-CARD QUICK-START SERVICES + WORKBENCH */}
        <section
          id="services"
          aria-label="خدمات و ابزارهای آنلاین دانیفون"
          className="flex flex-col gap-5 scroll-mt-20"
        >
          <span id="waitlist" className="sr-only">
            صف انتظار VIP
          </span>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-[#0a1628] dark:text-white">
                میز خدمات و محاسبه‌گر هوشمند
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                یکی از گزینه‌های زیر را انتخاب کنید تا فرم مربوط به آن باز شود:
              </p>
            </div>
          </div>

          {/* 4-Column Quick-Start Selector Row */}
          <div
            role="tablist"
            aria-label="انتخاب سرویس"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
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
                  className={`min-h-[84px] p-4 rounded-2xl border flex flex-col gap-2.5 text-right transition-colors cursor-pointer touch-manipulation ${
                    isActive
                      ? tab.activeCardClass
                      : "bg-white dark:bg-[#0b101d] border-blue-100 dark:border-blue-400/15 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-400/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tab.iconBgClass}`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.9} />
                    </div>
                    {isActive && (
                      <span className={`text-xs font-bold ${tab.accentText} whitespace-nowrap`}>
                        انتخاب‌شده
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm sm:text-base font-bold text-[#0a1628] dark:text-white leading-tight truncate">
                      {tab.title}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed lg:hidden truncate">
                      {tab.subtitle}
                    </span>
                    <span className="hidden lg:block text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {tab.desktopDesc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Workspace Panel */}
          <div
            ref={servicesPanelRef}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="rounded-3xl bg-white dark:bg-[#0b101d] border border-blue-100 dark:border-blue-400/18 p-5 sm:p-7 lg:p-8 shadow-[0_6px_28px_rgba(11,99,246,0.04)] dark:shadow-none"
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
        </section>

        {/* SECTION 3: DIRECT CHANNELS & STORE LOCATION */}
        <section
          id="location"
          aria-label="ارتباط مستقیم و آدرس فروشگاه"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch scroll-mt-20"
        >
          {/* Direct Channels */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#0b101d] border border-blue-100 dark:border-blue-400/18 p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-display text-2xl text-[#0a1628] dark:text-white">
                ارتباط مستقیم و پیام‌رسان‌ها
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                اگر نیاز به راهنمایی تلفنی یا استعلام سریع دارید، مستقیم پیام دهید یا تماس بگیرید.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {config.buttons.map((btn) => {
                const cardInner = (
                  <div
                    className={`min-h-[72px] p-3.5 rounded-2xl bg-blue-50/50 dark:bg-[#11192e]/70 border border-blue-100 dark:border-blue-400/15 flex items-center justify-between gap-2 transition-colors touch-manipulation ${
                      !btn.isActive
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-50 dark:hover:bg-[#16203a] hover:border-blue-300 dark:hover:border-blue-400/40 active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#0b101d] border border-blue-100 dark:border-blue-400/15 flex items-center justify-center shrink-0">
                        {getChannelIcon(btn.icon)}
                      </div>
                      <div className="flex flex-col text-right min-w-0">
                        <span className="text-sm font-bold text-[#0a1628] dark:text-white truncate">
                          {btn.title}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {btn.subtitle}
                        </span>
                      </div>
                    </div>
                    {btn.isActive ? (
                      <ArrowUpLeft className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                    ) : (
                      <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
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

            <a
              href={config.contact.phoneUrl}
              className="min-h-[50px] w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors touch-manipulation"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span className="tabular-nums">تماس تلفنی با فروشگاه ({config.contact.phone})</span>
            </a>
          </div>

          {/* Store Location & Routing */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#0b101d] border border-blue-100 dark:border-blue-400/18 p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-400/25 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" strokeWidth={1.9} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl text-[#0a1628] dark:text-white">
                    {config.location.storeName}
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400" dir="ltr">
                    {config.business.nameEn}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {config.location.addressText}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 mt-0.5">
                  نکته مراجعه حضوری: لاین سمت چپ فروشگاه متعلق به تیم دانیفون است.
                </p>
              </div>
            </div>

            <div className="w-full aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden relative border border-blue-100 dark:border-blue-400/20">
              <iframe
                title="موقعیت مکانی دقیق فروشگاه دانیفون روی نقشه"
                src={`https://maps.google.com/maps?q=${config.location.lat || 35.6994973},${config.location.lng || 51.3433422}&hl=fa&z=17&output=embed`}
                className="w-full h-full border-0 dark:brightness-[0.86] dark:contrast-[1.05] pointer-events-none"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={config.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="باز کردن موقعیت دقیق فروشگاه دانیفون در گوگل مپ"
                className="absolute inset-0 flex items-end justify-end p-3 bg-gradient-to-t from-[#04060c]/65 via-transparent to-transparent"
              >
                <span className="px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#0b101d]/90 backdrop-blur-md border border-blue-200 dark:border-blue-400/25 text-xs font-bold text-[#0a1628] dark:text-white inline-flex items-center gap-1.5 shadow-xs">
                  <span>مشاهده پین دقیق روی نقشه</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                  className="min-h-[46px] py-2 px-3 rounded-xl bg-blue-50/70 dark:bg-[#11192e]/80 hover:bg-blue-100/80 dark:hover:bg-[#182442] active:scale-[0.98] border border-blue-100 dark:border-blue-400/18 text-[#0a1628] dark:text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap touch-manipulation"
                >
                  <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{navItem.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* QUIET FOOTER */}
        <footer className="mt-2 pt-6 border-t border-blue-100 dark:border-blue-400/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 select-none">
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
    <Suspense fallback={<div className="min-h-dvh bg-[#f8fbff] dark:bg-[#04060c]" />}>
      <HomeContent />
    </Suspense>
  );
}

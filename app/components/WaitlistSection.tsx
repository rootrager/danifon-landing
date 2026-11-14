"use client";

import React, { useState, useMemo, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  CheckCircle2,
  Send,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import phonesData from "../data/phones.json";
import config from "../../config.json";

interface WaitlistSectionProps {
  lalezarClassName?: string;
}

function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
}

const SERIES_TABS = [
  { id: "all", label: "همه" },
  { id: "18", label: "سری ۱۸" },
  { id: "17", label: "سری ۱۷" },
  { id: "16", label: "سری ۱۶" },
  { id: "15", label: "سری ۱۵" },
  { id: "14", label: "سری ۱۴" },
  { id: "13", label: "سری ۱۳" },
  { id: "12", label: "سری ۱۲" },
  { id: "11", label: "۱۱ و SE" },
];

const INTENT_OPTIONS = [
  {
    percent: 100,
    short: "۱۰۰٪ فوری",
    label: "خرید نقدی و فوری به محض موجود شدن",
    colorClass: "border-amber-400/70 bg-amber-500/15 text-amber-200",
  },
  {
    percent: 80,
    short: "۸۰٪ قطعی",
    label: "خرید قطعی تا چند روز آینده",
    colorClass: "border-sky-400/70 bg-sky-500/15 text-sky-200",
  },
  {
    percent: 50,
    short: "۵۰٪ بررسی",
    label: "بررسی قیمت و خرید در این ماه",
    colorClass: "border-emerald-400/70 bg-emerald-500/15 text-emerald-200",
  },
  {
    percent: 20,
    short: "۲۰٪ استعلام",
    label: "صرفاً استعلام قیمت و مشاوره",
    colorClass: "border-white/30 bg-white/10 text-white",
  },
];

const CONTACT_METHODS = ["تماس تلفنی", "پیام در تلگرام", "پیام در واتساپ"];

export default function WaitlistSection({ lalezarClassName = "" }: WaitlistSectionProps) {
  const uid = useId();
  const [selectedSeries, setSelectedSeries] = useState<string>("18");
  const [selectedPhoneName, setSelectedPhoneName] = useState<string>("iPhone 18 Pro Max");

  const filteredPhones = useMemo(() => {
    if (selectedSeries === "all") return phonesData;
    return phonesData.filter((p) => p.series === selectedSeries);
  }, [selectedSeries]);

  const currentPhone = useMemo(() => {
    return phonesData.find((p) => p.name === selectedPhoneName) || phonesData[0];
  }, [selectedPhoneName]);

  const [selectedStorage, setSelectedStorage] = useState<string>("256GB");
  const [selectedColor, setSelectedColor] = useState<string>("آلبالویی (زرشکی)");
  const [selectedCondition, setSelectedCondition] = useState<string>("آکبند (پلمپ)");
  const [selectedIntent, setSelectedIntent] = useState<number>(100);

  const availableConditions = useMemo(() => {
    if (currentPhone.series === "18" || currentPhone.series === "17") {
      return ["آکبند (پلمپ)", "در حد نو (کارکرده)", "فرقی ندارد"];
    }
    return ["در حد نو (کارکرده)", "فرقی ندارد"];
  }, [currentPhone.series]);

  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [contactMethod, setContactMethod] = useState<string>("تماس تلفنی");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "fallback">("idle");
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [directMessageText, setDirectMessageText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const activeIntentObj = INTENT_OPTIONS.find((i) => i.percent === selectedIntent) || INTENT_OPTIONS[0];

  const handleSeriesChange = (seriesId: string) => {
    setSelectedSeries(seriesId);
    const available = seriesId === "all" ? phonesData : phonesData.filter((p) => p.series === seriesId);
    if (available.length > 0) {
      const nextPhone = available[0];
      setSelectedPhoneName(nextPhone.name);
      setSelectedStorage(nextPhone.storages[0] || "128GB");
      setSelectedColor(nextPhone.colors[0] || "مشکی");
      setSelectedCondition(
        nextPhone.series === "18" || nextPhone.series === "17"
          ? "آکبند (پلمپ)"
          : "در حد نو (کارکرده)"
      );
    }
  };

  const handlePhoneChange = (phoneName: string) => {
    setSelectedPhoneName(phoneName);
    const p = phonesData.find((item) => item.name === phoneName);
    if (p) {
      setSelectedStorage(p.storages[0] || "128GB");
      setSelectedColor(p.colors[0] || "مشکی");
      setSelectedCondition(
        p.series === "18" || p.series === "17" ? "آکبند (پلمپ)" : "در حد نو (کارکرده)"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = toAsciiDigits(customerPhone).trim().replace(/\D/g, "");

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage("لطفاً شماره موبایل معتبر (مثلاً 09121234567) وارد کنید.");
      return;
    }

    setErrorMessage("");
    setStatus("loading");

    const code = `DANI-${Math.floor(1000 + Math.random() * 9000)}`;
    const isAkbandAllowed = currentPhone.series === "18" || currentPhone.series === "17";
    const actualCondition = isAkbandAllowed
      ? selectedCondition
      : selectedCondition === "آکبند (پلمپ)"
      ? "در حد نو (کارکرده)"
      : selectedCondition;

    const fullMessage = `سلام وقت بخیر، درخواست رزرو در صف انتظار VIP آیفون دارم.
━━━━━━━━━━━━━━━━━━━━
کد رهگیری: #${code}
مدل دستگاه: ${currentPhone.name} (${selectedStorage})
رنگ انتخابی: ${selectedColor}
وضعیت: ${actualCondition}
درصد و فوریت خرید: ${selectedIntent}% (${activeIntentObj.label})
━━━━━━━━━━━━━━━━━━━━
نام مشتری: ${customerName.trim() || "ثبت نشده"}
شماره تماس: ${cleanPhone}
روش ترجیحی ارتباط: ${contactMethod}
زمان ثبت: ${new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" })}
━━━━━━━━━━━━━━━━━━━━
ثبت شده از وب‌سایت دانیفون`;

    setTrackingCode(code);
    setDirectMessageText(fullMessage);

    const payload = {
      trackingCode: code,
      model: currentPhone.name,
      storage: selectedStorage,
      color: selectedColor,
      condition: actualCondition,
      intentPercent: selectedIntent,
      intentLabel: activeIntentObj.label,
      phone: cleanPhone,
      name: customerName.trim(),
      contactMethod,
      timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" }),
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("fallback");
      }
    } catch {
      setStatus("fallback");
    }
  };

  const handleCopy = () => {
    if (directMessageText) {
      navigator.clipboard.writeText(directMessageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setCustomerPhone("");
    setCustomerName("");
    setErrorMessage("");
    setCopied(false);
  };

  const directTelegramUrl = `${config.contact.telegramExpertUrl}?text=${encodeURIComponent(directMessageText)}`;
  const directWhatsappUrl = `${config.contact.whatsappUrl}?text=${encodeURIComponent(directMessageText)}`;

  return (
    <div className="w-full flex flex-col gap-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
            <Target className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className={`text-lg font-normal text-white truncate ${lalezarClassName}`}>
              صف انتظار VIP آیفون دلخواه
            </h3>
            <p className="text-xs text-neutral-400 truncate">
              رزرو کانفیگ مدنظر با بالاترین اولویت تحویل در فروشگاه
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-amber-300 whitespace-nowrap shrink-0">
          اولویت VIP
        </span>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center py-6 px-4 rounded-2xl bg-white/[0.03] border border-emerald-500/30 gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-lg text-white ${lalezarClassName}`}>
                درخواست شما با موفقیت ثبت شد
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
                به محض موجود شدن این کانفیگ، کارشناسان دانیفون با شما تماس خواهند گرفت.
              </p>
            </div>

            <div className="py-2 px-4 rounded-xl bg-white/[0.05] border border-white/10 flex items-center gap-2 text-xs">
              <span className="text-neutral-400">کد رهگیری:</span>
              <strong className="text-emerald-300 font-mono font-bold text-sm tracking-wider" dir="ltr">
                #{trackingCode}
              </strong>
            </div>

            <div className="w-full max-w-sm border-t border-white/[0.08] pt-3 text-xs text-neutral-300 space-y-1 text-right">
              <div className="flex justify-between">
                <span className="text-neutral-400">دستگاه:</span>
                <span className="font-semibold text-white" dir="ltr">
                  {currentPhone.name} · {selectedStorage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">رنگ و وضعیت:</span>
                <span className="font-medium text-white">
                  {selectedColor} · {selectedCondition}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">فوریت خرید:</span>
                <span className="font-medium text-amber-300 tabular-nums">{selectedIntent}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] w-full max-w-sm py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ثبت درخواست جدید</span>
            </button>
          </motion.div>
        )}

        {status === "fallback" && (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center text-center py-6 px-4 rounded-2xl bg-white/[0.03] border border-amber-500/35 gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Target className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-lg text-white ${lalezarClassName}`}>
                درخواست شما آماده ارسال است
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
                برای ثبت فوری در صف اولویت VIP، پیام آماده زیر را با یک لمس در تلگرام یا واتساپ ارسال کنید.
              </p>
            </div>

            <div className="py-1.5 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 flex items-center gap-2 text-xs">
              <span className="text-neutral-400">کد رهگیری:</span>
              <strong className="text-amber-300 font-mono font-bold text-sm" dir="ltr">
                #{trackingCode}
              </strong>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-2">
              <a
                href={directTelegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-neutral-950 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ارسال درخواست در تلگرام</span>
              </a>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-neutral-950 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ارسال درخواست در واتساپ</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[42px] w-full py-2.5 px-4 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-neutral-200 text-xs font-semibold transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "متن پیام کپی شد" : "کپی متن کامل درخواست"}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="mt-1 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                ویرایش اطلاعات فرم
              </button>
            </div>
          </motion.div>
        )}

        {status !== "success" && status !== "fallback" && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-xs"
          >
            {/* Series Filter Tabs */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-neutral-200">سری آیفون</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {SERIES_TABS.map((tab) => {
                  const active = selectedSeries === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSeriesChange(tab.id)}
                      className={`min-h-[38px] py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer touch-manipulation border ${
                        active
                          ? "bg-amber-500 text-neutral-950 border-amber-400 font-bold"
                          : "bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model + Storage in clean 2-col desktop / stacked mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-model`} className="font-semibold text-neutral-200">
                  مدل دستگاه
                </label>
                <div className="relative">
                  <select
                    id={`${uid}-model`}
                    dir="ltr"
                    value={selectedPhoneName}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full min-h-[46px] appearance-none bg-black/50 border border-white/15 rounded-xl py-2.5 pl-9 pr-3.5 text-white text-sm font-semibold outline-none focus:border-amber-400 transition-colors cursor-pointer text-right touch-manipulation"
                  >
                    {filteredPhones.map((p) => (
                      <option key={p.id} value={p.name} className="bg-neutral-900 text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-neutral-200">ظرفیت حافظه</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {currentPhone.storages.map((st) => {
                    const active = selectedStorage === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStorage(st)}
                        className={`min-h-[46px] py-2 px-1.5 rounded-xl font-bold font-mono text-xs transition-colors cursor-pointer touch-manipulation border whitespace-nowrap ${
                          active
                            ? "bg-amber-500 text-neutral-950 border-amber-400"
                            : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] border-white/[0.08]"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-neutral-200">وضعیت دستگاه</span>
              <div
                className={`grid gap-1.5 ${
                  availableConditions.length === 3 ? "grid-cols-3" : "grid-cols-2"
                }`}
              >
                {availableConditions.map((cond) => {
                  const active = selectedCondition === cond;
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setSelectedCondition(cond)}
                      className={`min-h-[42px] py-2 px-2 text-center rounded-xl font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap truncate touch-manipulation border ${
                        active
                          ? "bg-amber-500/20 text-amber-200 border-amber-400/70"
                          : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] border-white/[0.08]"
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-neutral-200">رنگ دلخواه</span>
              <div className="flex flex-wrap gap-1.5">
                {currentPhone.colorItems?.map((col) => {
                  const active = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`min-h-[40px] py-1.5 px-3 rounded-xl font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer touch-manipulation border whitespace-nowrap ${
                        active
                          ? "bg-white/15 text-white border-white/50"
                          : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] border-white/[0.08]"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-white/30"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSelectedColor("فرقی ندارد")}
                  className={`min-h-[40px] py-1.5 px-3 rounded-xl font-medium text-xs transition-colors cursor-pointer touch-manipulation border whitespace-nowrap ${
                    selectedColor === "فرقی ندارد"
                      ? "bg-white/15 text-white border-white/50"
                      : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] border-white/[0.08]"
                  }`}
                >
                  هر رنگی
                </button>
              </div>
            </div>

            {/* Purchase Intent & Urgency */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
              <div className="flex justify-between items-center gap-2">
                <span className="font-semibold text-neutral-200">درصد فوریت خرید</span>
                <span className="text-[11px] text-amber-300 truncate">{activeIntentObj.label}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {INTENT_OPTIONS.map((opt) => {
                  const active = selectedIntent === opt.percent;
                  return (
                    <button
                      key={opt.percent}
                      type="button"
                      onClick={() => setSelectedIntent(opt.percent)}
                      className={`min-h-[42px] px-2.5 py-2 rounded-xl border text-center transition-colors cursor-pointer touch-manipulation text-xs font-semibold tabular-nums whitespace-nowrap ${
                        active
                          ? opt.colorClass
                          : "border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]"
                      }`}
                    >
                      {opt.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-white/[0.08]">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-phone`} className="font-semibold text-neutral-200 flex items-center justify-between">
                  <span>شماره همراه</span>
                  <span className="text-[11px] font-normal text-amber-300">الزامی</span>
                </label>
                <input
                  id={`${uid}-phone`}
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="09121234567"
                  className="w-full min-h-[46px] bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-white font-semibold tabular-nums outline-none focus:border-amber-400 text-left placeholder:text-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-name`} className="font-medium text-neutral-300">
                  نام (اختیاری)
                </label>
                <input
                  id={`${uid}-name`}
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="نام و نام خانوادگی"
                  className="w-full min-h-[46px] bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-white outline-none focus:border-amber-400 placeholder:text-neutral-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-method`} className="font-medium text-neutral-300">
                  روش ارتباط
                </label>
                <div className="relative">
                  <select
                    id={`${uid}-method`}
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-full min-h-[46px] appearance-none bg-black/50 border border-white/15 rounded-xl py-2.5 pl-8 pr-3 text-white outline-none focus:border-amber-400 cursor-pointer touch-manipulation"
                  >
                    {CONTACT_METHODS.map((m) => (
                      <option key={m} value={m} className="bg-neutral-900 text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] disabled:opacity-60 text-neutral-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>در حال ثبت درخواست...</span>
                </>
              ) : (
                <span>ثبت در صف انتظار VIP</span>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

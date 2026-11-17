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
    colorClass:
      "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/20 text-blue-900 dark:text-blue-200 font-bold",
  },
  {
    percent: 80,
    short: "۸۰٪ قطعی",
    label: "خرید قطعی تا چند روز آینده",
    colorClass:
      "border-sky-500 bg-sky-50 dark:bg-sky-500/15 text-sky-900 dark:text-sky-200 font-bold",
  },
  {
    percent: 50,
    short: "۵۰٪ بررسی",
    label: "بررسی قیمت و خرید در این ماه",
    colorClass:
      "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 font-bold",
  },
  {
    percent: 20,
    short: "۲۰٪ استعلام",
    label: "صرفاً استعلام قیمت و مشاوره",
    colorClass:
      "border-slate-400 dark:border-blue-300/40 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold",
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
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-blue-100 dark:border-blue-400/15">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
            <Target className="w-5 h-5" strokeWidth={1.9} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className={`text-xl font-normal text-[#0a1628] dark:text-white truncate ${lalezarClassName}`}>
              صف انتظار VIP آیفون دلخواه
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
              مدل مورد نظرتان را ثبت کنید تا به محض موجود شدن با شما تماس بگیریم
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0">
          ثبت رایگان
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
            className="flex flex-col items-center text-center py-6 px-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/35 gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-400/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.9} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-xl text-[#0a1628] dark:text-white ${lalezarClassName}`}>
                درخواست شما با موفقیت ثبت شد
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                به محض موجود شدن این گوشی با مشخصات دلخواه شما، همکاران دانیفون با شما تماس می‌گیرند.
              </p>
            </div>

            <div className="py-2 px-4 rounded-xl bg-white dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 flex items-center gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">کد پیگیری:</span>
              <strong className="text-blue-700 dark:text-blue-300 font-mono font-bold text-base tracking-wider" dir="ltr">
                #{trackingCode}
              </strong>
            </div>

            <div className="w-full max-w-sm border-t border-blue-200/70 dark:border-blue-400/15 pt-3 text-sm text-slate-700 dark:text-slate-300 space-y-1.5 text-right">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">مدل گوشی:</span>
                <span className="font-semibold text-[#0a1628] dark:text-white" dir="ltr">
                  {currentPhone.name} · {selectedStorage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">رنگ و وضعیت:</span>
                <span className="font-medium text-[#0a1628] dark:text-white">
                  {selectedColor} · {selectedCondition}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">اولویت خرید:</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300 tabular-nums">{selectedIntent}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[46px] w-full max-w-sm py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
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
            className="flex flex-col items-center text-center py-6 px-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-500/35 gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <Target className="w-6 h-6" strokeWidth={1.9} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-xl text-[#0a1628] dark:text-white ${lalezarClassName}`}>
                درخواست شما آماده ارسال است
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                برای ثبت سریع‌تر در صف VIP، یکی از دکمه‌های زیر را بزنید تا متن آماده مستقیماً برای کارشناس ما ارسال شود.
              </p>
            </div>

            <div className="py-1.5 px-4 rounded-xl bg-white dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 flex items-center gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">کد پیگیری:</span>
              <strong className="text-blue-700 dark:text-blue-300 font-mono font-bold text-base" dir="ltr">
                #{trackingCode}
              </strong>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-2.5">
              <a
                href={directTelegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 active:scale-[0.98] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ارسال درخواست در تلگرام</span>
              </a>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.98] text-white dark:text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ارسال درخواست در واتساپ</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[44px] w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#11192e] hover:bg-blue-50 dark:hover:bg-[#182442] text-[#0a1628] dark:text-slate-100 text-sm font-semibold transition-colors border border-blue-200 dark:border-blue-400/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "متن پیام کپی شد" : "کپی متن کامل درخواست"}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="mt-1 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0a1628] dark:hover:text-white transition-colors cursor-pointer"
              >
                بازگشت و ویرایش فرم
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
            className="flex flex-col gap-5 text-sm"
          >
            {/* Step 1: Series Filter Tabs */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-[#0a1628] dark:text-slate-200">
                ۱. انتخاب سری گوشی
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {SERIES_TABS.map((tab) => {
                  const active = selectedSeries === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSeriesChange(tab.id)}
                      className={`min-h-[40px] py-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer touch-manipulation border ${
                        active
                          ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-400 font-bold"
                          : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-300 hover:text-[#0a1628] dark:hover:text-white hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Model + Storage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-model`} className="font-semibold text-[#0a1628] dark:text-slate-200">
                  ۲. مدل دقیق گوشی
                </label>
                <div className="relative">
                  <select
                    id={`${uid}-model`}
                    dir="ltr"
                    value={selectedPhoneName}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full min-h-[48px] appearance-none bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 pl-10 pr-3.5 text-[#0a1628] dark:text-white text-sm font-semibold outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors cursor-pointer text-right touch-manipulation"
                  >
                    {filteredPhones.map((p) => (
                      <option key={p.id} value={p.name} className="bg-white dark:bg-[#0b101d] text-[#0a1628] dark:text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-[#0a1628] dark:text-slate-200">حافظه دستگاه</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {currentPhone.storages.map((st) => {
                    const active = selectedStorage === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStorage(st)}
                        className={`min-h-[48px] py-2 px-1.5 rounded-xl font-bold font-mono text-xs sm:text-sm transition-colors cursor-pointer touch-manipulation border whitespace-nowrap ${
                          active
                            ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-400"
                            : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-200 hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Condition */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-[#0a1628] dark:text-slate-200">وضعیت دستگاه</span>
              <div
                className={`grid gap-2 ${
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
                      className={`min-h-[44px] py-2 px-2 text-center rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap truncate touch-manipulation border ${
                        active
                          ? "bg-blue-50 dark:bg-blue-500/20 text-blue-900 dark:text-blue-200 border-blue-600 dark:border-blue-400"
                          : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-300 hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Color Swatches */}
            <div className="flex flex-col gap-1.5">
              <span className="font-semibold text-[#0a1628] dark:text-slate-200">رنگ دلخواه</span>
              <div className="flex flex-wrap gap-2">
                {currentPhone.colorItems?.map((col) => {
                  const active = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`min-h-[42px] py-1.5 px-3.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer touch-manipulation border whitespace-nowrap ${
                        active
                          ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-400 font-semibold"
                          : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-200 hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/20 dark:border-white/30"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSelectedColor("فرقی ندارد")}
                  className={`min-h-[42px] py-1.5 px-3.5 rounded-xl font-medium text-xs sm:text-sm transition-colors cursor-pointer touch-manipulation border whitespace-nowrap ${
                    selectedColor === "فرقی ندارد"
                      ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-400 font-semibold"
                      : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-200 hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                  }`}
                >
                  هر رنگی
                </button>
              </div>
            </div>

            {/* Purchase Intent */}
            <div className="flex flex-col gap-2 pt-4 border-t border-blue-100 dark:border-blue-400/15">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="font-semibold text-[#0a1628] dark:text-slate-200">زمان و قصد خرید</span>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">{activeIntentObj.label}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INTENT_OPTIONS.map((opt) => {
                  const active = selectedIntent === opt.percent;
                  return (
                    <button
                      key={opt.percent}
                      type="button"
                      onClick={() => setSelectedIntent(opt.percent)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl border text-center transition-colors cursor-pointer touch-manipulation text-xs sm:text-sm font-semibold tabular-nums whitespace-nowrap ${
                        active
                          ? opt.colorClass
                          : "border-blue-100 dark:border-blue-400/15 bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-300 hover:bg-blue-100/70 dark:hover:bg-[#182442]"
                      }`}
                    >
                      {opt.short}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-blue-100 dark:border-blue-400/15">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-phone`} className="font-semibold text-[#0a1628] dark:text-slate-200 flex items-center justify-between">
                  <span>شماره موبایل</span>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">الزامی</span>
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
                  className="w-full min-h-[48px] bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 px-3.5 text-[#0a1628] dark:text-white font-semibold tabular-nums outline-none focus:border-blue-600 dark:focus:border-blue-400 text-left placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-name`} className="font-medium text-slate-700 dark:text-slate-300">
                  نام و نام خانوادگی (اختیاری)
                </label>
                <input
                  id={`${uid}-name`}
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثلاً: علی رضایی"
                  className="w-full min-h-[48px] bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 px-3.5 text-[#0a1628] dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-400 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-method`} className="font-medium text-slate-700 dark:text-slate-300">
                  چطور با شما تماس بگیریم؟
                </label>
                <div className="relative">
                  <select
                    id={`${uid}-method`}
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-full min-h-[48px] appearance-none bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 pl-9 pr-3.5 text-[#0a1628] dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-400 cursor-pointer touch-manipulation"
                  >
                    {CONTACT_METHODS.map((m) => (
                      <option key={m} value={m} className="bg-white dark:bg-[#0b101d] text-[#0a1628] dark:text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-sm text-rose-800 dark:text-rose-200 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-[52px] w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 active:scale-[0.99] disabled:opacity-60 text-white font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation shadow-[0_6px_20px_rgba(11,99,246,0.20)]"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>در حال ثبت درخواست...</span>
                </>
              ) : (
                <span>ثبت رایگان در صف انتظار VIP</span>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

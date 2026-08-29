"use client";

import React, { useState, useMemo } from "react";
import phonesData from "../data/phones.json";
import config from "../../config.json";

interface WaitlistSectionProps {
  lalezarClassName?: string;
  isStandaloneCard?: boolean;
}

// Convert Persian and Arabic digits to ASCII digits
function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
}

const SERIES_TABS = [
  { id: "all", label: "همه" },
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
    label: "خرید نقدی و فوری (به محض موجود شدن)",
    badge: "⚡ ۱۰۰٪ فوری",
    colorClass: "border-amber-400 bg-amber-500/20 text-amber-300",
  },
  {
    percent: 80,
    label: "خرید قطعی تا چند روز آینده",
    badge: "🔥 ۸۰٪ قطعی",
    colorClass: "border-sky-400 bg-sky-500/20 text-sky-300",
  },
  {
    percent: 50,
    label: "بررسی قیمت و خرید در این ماه",
    badge: "⏳ ۵۰٪ بررسی",
    colorClass: "border-emerald-400 bg-emerald-500/20 text-emerald-300",
  },
  {
    percent: 20,
    label: "صرفاً استعلام قیمت و مشاوره",
    badge: "💬 ۲۰٪ استعلام",
    colorClass: "border-neutral-400 bg-white/10 text-neutral-300",
  },
];

const CONTACT_METHODS = ["تماس تلفنی 📞", "پیام در تلگرام ✈️", "پیام در واتساپ 💬"];

export default function WaitlistSection({
  lalezarClassName = "",
}: WaitlistSectionProps) {
  // Filter & Selection State
  const [selectedSeries, setSelectedSeries] = useState<string>("17");
  const [selectedPhoneName, setSelectedPhoneName] = useState<string>("iPhone 17 Pro Max");

  // Model dynamic list
  const filteredPhones = useMemo(() => {
    if (selectedSeries === "all") return phonesData;
    return phonesData.filter((p) => p.series === selectedSeries);
  }, [selectedSeries]);

  const currentPhone = useMemo(() => {
    return phonesData.find((p) => p.name === selectedPhoneName) || phonesData[0];
  }, [selectedPhoneName]);

  // Selected specs
  const [selectedStorage, setSelectedStorage] = useState<string>("256GB");
  const [selectedColor, setSelectedColor] = useState<string>("نارنجی");
  const [selectedCondition, setSelectedCondition] = useState<string>("آکبند (پلمپ)");
  const [selectedIntent, setSelectedIntent] = useState<number>(100);

  // Available conditions rule: Akband only for series 17
  const availableConditions = useMemo(() => {
    if (currentPhone.series === "17") {
      return ["آکبند (پلمپ)", "در حد نو (کارکرده)", "فرقی ندارد"];
    }
    return ["در حد نو (کارکرده)", "فرقی ندارد"];
  }, [currentPhone.series]);

  // Customer Contact Info
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [contactMethod, setContactMethod] = useState<string>("تماس تلفنی 📞");

  // Submission Status
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "fallback">("idle");
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [directMessageText, setDirectMessageText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handle series tab change
  const handleSeriesChange = (seriesId: string) => {
    setSelectedSeries(seriesId);
    const available = seriesId === "all" ? phonesData : phonesData.filter((p) => p.series === seriesId);
    if (available.length > 0) {
      const nextPhone = available[0];
      setSelectedPhoneName(nextPhone.name);
      setSelectedStorage(nextPhone.storages[0] || "128GB");
      setSelectedColor(nextPhone.colors[0] || "مشکی");
      if (nextPhone.series === "17") {
        setSelectedCondition("آکبند (پلمپ)");
      } else {
        setSelectedCondition("در حد نو (کارکرده)");
      }
    }
  };

  // Handle phone model change
  const handlePhoneChange = (phoneName: string) => {
    setSelectedPhoneName(phoneName);
    const p = phonesData.find((item) => item.name === phoneName);
    if (p) {
      setSelectedStorage(p.storages[0] || "128GB");
      setSelectedColor(p.colors[0] || "مشکی");
      if (p.series === "17") {
        setSelectedCondition("آکبند (پلمپ)");
      } else {
        setSelectedCondition("در حد نو (کارکرده)");
      }
    }
  };

  // Submit Handler
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
    const intentObj = INTENT_OPTIONS.find((i) => i.percent === selectedIntent);

    const actualCondition = currentPhone.series === "17" ? selectedCondition : (selectedCondition === "آکبند (پلمپ)" ? "در حد نو (کارکرده)" : selectedCondition);

    const fullMessage = `سلام وقت بخیر، درخواست رزرو در صف انتظار VIP آیفون دارم.
━━━━━━━━━━━━━━━━━━━━
🔢 کد رهگیری: #${code}
📱 مدل دستگاه: ${currentPhone.name} (${selectedStorage})
🎨 رنگ انتخابی: ${selectedColor}
📦 وضعیت: ${actualCondition}
⚡ درصد و فوریت خرید: ${selectedIntent}% (${intentObj?.label || "خرید فوری"})
━━━━━━━━━━━━━━━━━━━━
👤 نام مشتری: ${customerName.trim() || "ثبت نشده"}
📞 شماره تماس: ${cleanPhone}
💬 روش ترجیحی ارتباط: ${contactMethod}
⏰ زمان ثبت: ${new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}
━━━━━━━━━━━━━━━━━━━━
📍 ثبت شده از وب‌سایت دانیفون`;

    setTrackingCode(code);
    setDirectMessageText(fullMessage);

    const payload = {
      trackingCode: code,
      model: currentPhone.name,
      storage: selectedStorage,
      color: selectedColor,
      condition: actualCondition,
      intentPercent: selectedIntent,
      intentLabel: intentObj?.label || "خرید فوری",
      phone: cleanPhone,
      name: customerName.trim(),
      contactMethod: contactMethod,
      timestamp: new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }),
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
        // Fallback to direct telegram/whatsapp if server bot failed
        console.warn("Server-side bot notification failed, switching to direct messaging fallback:", data);
        setStatus("fallback");
      }
    } catch (err: unknown) {
      console.warn("Network error during waitlist submit, switching to direct messaging fallback:", err);
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

  const directTelegramUrl = `https://t.me/daniphoneir?text=${encodeURIComponent(directMessageText)}`;
  const directWhatsappUrl = `${config.registry.whatsappUrl}?text=${encodeURIComponent(directMessageText)}`;

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeInSlide" dir="rtl">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            🎯
          </div>
          <div className="flex flex-col">
            <h3 className={`text-base font-black text-white ${lalezarClassName}`}>
              صف انتظار VIP آیفون دلخواه
            </h3>
            <span className="text-[10px] text-neutral-300">
              رزرو کانفیگ مدنظر با بالاترین اولویت تحویل
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          VIP Queue
        </span>
      </div>

      {/* 1. SUCCESS CONFIRMATION STATE */}
      {status === "success" && (
        <div className="flex flex-col items-center text-center p-4 bg-black/40 rounded-[24px] border border-emerald-500/40 gap-3.5 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl">
            ✅
          </div>
          <div>
            <h3 className={`text-base font-bold text-white mb-1 ${lalezarClassName}`}>
              درخواست شما با موفقیت در صف ثبت شد!
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-xs">
              گوشی مدنظر شما با اولویت VIP ثبت گردید. به محض ورود این کانفیگ، کارشناسان دانیفون فوراً با شما تماس خواهند گرفت.
            </p>
          </div>

          {/* Tracking Code Chip */}
          <div className="py-2 px-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-2 text-xs">
            <span className="text-neutral-400">کد رهگیری اختصاصی:</span>
            <strong className="text-emerald-300 font-mono font-bold text-sm tracking-wider">
              #{trackingCode}
            </strong>
          </div>

          {/* Summary details */}
          <div className="w-full bg-black/30 rounded-xl p-3 text-[11px] text-neutral-300 flex flex-col gap-1.5 text-right border border-white/5">
            <div>📱 <strong>دستگاه:</strong> {currentPhone.name} ({selectedStorage})</div>
            <div>🎨 <strong>رنگ:</strong> {selectedColor} | <strong>وضعیت:</strong> {selectedCondition}</div>
            <div>⚡ <strong>درصد فوریت:</strong> {selectedIntent}%</div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className={`w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer ${lalezarClassName}`}
          >
            ثبت یک درخواست دیگر
          </button>
        </div>
      )}

      {/* 2. DIRECT ACTION FALLBACK STATE (Guarantees zero lost leads) */}
      {status === "fallback" && (
        <div className="flex flex-col items-center text-center p-4 bg-black/50 rounded-[24px] border border-amber-500/50 gap-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <h3 className={`text-base font-bold text-white mb-1 ${lalezarClassName}`}>
              درخواست شما آماده ثبت نهایی است!
            </h3>
            <p className="text-xs text-neutral-200 leading-relaxed max-w-xs">
              جهت دریافت اولویت تحویل VIP و پیگیری فوری، درخواست خود را با یک کلیک در تلگرام یا واتساپ برای ما ارسال کنید:
            </p>
          </div>

          {/* Tracking Code Chip */}
          <div className="py-1.5 px-3.5 rounded-xl bg-white/10 border border-white/20 flex items-center gap-2 text-xs">
            <span className="text-neutral-400">کد رهگیری شما:</span>
            <strong className="text-amber-300 font-mono font-bold text-sm">
              #{trackingCode}
            </strong>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2 mt-1">
            <a
              href={directTelegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 px-3 rounded-[16px] bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] text-white font-bold text-xs shadow-[0_4px_16px_rgba(56,189,248,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer ${lalezarClassName}`}
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              <span>✈️ ارسال درخواست در تلگرام دانیفون</span>
            </a>

            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 px-3 rounded-[16px] bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-bold text-xs shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer ${lalezarClassName}`}
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.552 4.17 1.599 5.986L.071 24l6.126-1.606c1.764.957 3.742 1.464 5.83 1.464 6.645 0 12.028-5.383 12.028-12.031S18.675 0 12.031 0zm0 21.849c-1.793 0-3.548-.482-5.086-1.393l-.365-.217-3.774.989 1.008-3.682-.238-.378a10.02 10.02 0 0 1-1.543-5.318C2.033 6.309 6.471 1.867 12.031 1.867c5.556 0 9.994 4.439 9.994 9.983s-4.438 9.999-9.994 9.999zm5.485-7.485c-.301-.151-1.782-.88-2.059-.982-.276-.1-.477-.151-.678.151-.201.301-.778.982-.954 1.183-.176.201-.351.226-.653.075-2.093-1.05-3.513-1.921-4.836-3.626-.176-.226-.019-.348.131-.498.136-.136.301-.351.452-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.151-.678-1.631-.929-2.233-.245-.588-.495-.508-.678-.518-.176-.008-.376-.011-.577-.011s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.51s1.079 2.911 1.229 3.112c.151.201 2.122 3.238 5.14 4.542 1.942.836 2.709.914 3.652.766.793-.125 2.457-1.004 2.802-1.97.345-.966.345-1.792.245-1.97-.101-.176-.376-.276-.678-.427z" />
              </svg>
              <span>💬 ارسال درخواست در واتساپ دانیفون</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 text-neutral-200 text-xs font-semibold transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{copied ? "✅ متن پیام کپی شد" : "📋 کپی متن کامل درخواست"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="mt-1 text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
            >
              ویرایش اطلاعات فرم
            </button>
          </div>
        </div>
      )}

      {/* 3. FORM STATE */}
      {status !== "success" && status !== "fallback" && (
        /* FORM STATE */
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          {/* 1. Series Filter Tabs */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-neutral-200">
              ۱. سری آیفون مدنظر:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
              {SERIES_TABS.map((tab) => {
                const active = selectedSeries === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSeriesChange(tab.id)}
                    className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer touch-manipulation ${
                      active
                        ? "bg-amber-500 text-white shadow-[0_2px_10px_rgba(245,158,11,0.4)] border border-amber-400"
                        : "bg-white/10 text-neutral-300 hover:text-white hover:bg-white/15 border border-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Model Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-neutral-200">
              ۲. مدل دقیق دستگاه:
            </label>
            <select
              value={selectedPhoneName}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-[16px] py-2.5 px-3.5 text-white text-sm font-bold outline-none focus:border-amber-400 transition-colors cursor-pointer dir-ltr text-right"
            >
              {filteredPhones.map((p) => (
                <option key={p.id} value={p.name} className="bg-neutral-900 text-white py-1.5">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Storage & Condition in 2 columns */}
          <div className="grid grid-cols-2 gap-2">
            {/* Storage */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-neutral-200">
                ۳. ظرفیت حافظه:
              </label>
              <div className="flex flex-wrap gap-1">
                {currentPhone.storages.map((st) => {
                  const active = selectedStorage === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStorage(st)}
                      className={`py-1 px-2.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                        active
                          ? "bg-amber-500 text-white border border-amber-400 shadow-sm"
                          : "bg-black/30 text-neutral-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-neutral-200">
                ۴. وضعیت دستگاه:
              </label>
              <div className="flex flex-col gap-1">
                {availableConditions.map((cond) => {
                  const active = selectedCondition === cond;
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setSelectedCondition(cond)}
                      className={`py-1 px-2 text-center rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                        active
                          ? "bg-amber-500/30 text-white border border-amber-400 shadow-sm"
                          : "bg-black/30 text-neutral-400 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Color Swatches */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-neutral-200">
              ۵. رنگ دلخواه:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {currentPhone.colorItems?.map((col) => {
                const active = selectedColor === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`py-1 px-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      active
                        ? "bg-white/25 text-white border border-white/40 shadow-sm"
                        : "bg-black/30 text-neutral-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setSelectedColor("فرقی ندارد")}
                className={`py-1 px-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  selectedColor === "فرقی ندارد"
                    ? "bg-white/25 text-white border border-white/40 shadow-sm"
                    : "bg-black/30 text-neutral-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                🌈 هر رنگی
              </button>
            </div>
          </div>

          {/* 5. Purchase Intent & Urgency */}
          <div className="flex flex-col gap-1.5 p-3 bg-black/30 rounded-[18px] border border-white/10">
            <div className="flex justify-between items-center">
              <label className="font-bold text-white text-xs">
                ۶. درصد فوریت خرید شما:
              </label>
              <span className="text-[10px] font-bold text-amber-300">
                (جهت اولویت‌بندی تماس)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {INTENT_OPTIONS.map((opt) => {
                const active = selectedIntent === opt.percent;
                return (
                  <button
                    key={opt.percent}
                    type="button"
                    onClick={() => setSelectedIntent(opt.percent)}
                    className={`p-2 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      active
                        ? `${opt.colorClass} shadow-md`
                        : "border-white/5 bg-black/20 text-neutral-400 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-[11px] font-semibold">{opt.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Contact Info */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-neutral-200">
                ۷. شماره همراه شما (الزامی):
              </label>
              <input
                type="tel"
                inputMode="numeric"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="مثال: 09121234567"
                className="w-full bg-black/40 border border-white/20 rounded-[16px] py-2 px-3.5 text-white font-bold outline-none focus:border-amber-400 text-left dir-ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-[11px]">
                  نام (اختیاری):
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="نام شما"
                  className="w-full bg-black/40 border border-white/20 rounded-[14px] py-2 px-3 text-white outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-neutral-300 text-[11px]">
                  روش ارتباط:
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-[14px] py-2 px-2 text-white outline-none focus:border-amber-400 text-xs cursor-pointer"
                >
                  {CONTACT_METHODS.map((m) => (
                    <option key={m} value={m} className="bg-neutral-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-[11px] text-rose-200 leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`w-full py-3.5 px-4 rounded-[18px] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-white font-bold text-sm shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 ${lalezarClassName}`}
          >
            {status === "loading" ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>در حال ثبت در صف انتظار...</span>
              </div>
            ) : (
              <>
                <span>🚀</span>
                <span>ثبت در صف انتظار آیفون دلخواه</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

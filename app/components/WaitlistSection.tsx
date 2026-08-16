"use client";

import React, { useState, useMemo, useEffect } from "react";
import phonesData from "../data/phones.json";
import config from "../../config.json";

interface WaitlistSectionProps {
  lalezarClassName?: string;
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
    label: "خریدار نقد و فوری (به محض موجود شدن)",
    badge: "⚡ ۱۰۰٪ فوری",
    colorClass: "border-emerald-400 bg-emerald-500/20 text-emerald-300",
  },
  {
    percent: 80,
    label: "خرید قطعی تا چند روز آینده (قیمت منصفانه)",
    badge: "🔥 ۸۰٪ قطعی",
    colorClass: "border-sky-400 bg-sky-500/20 text-sky-300",
  },
  {
    percent: 50,
    label: "بررسی قیمت و برنامه‌ریزی خرید در این ماه",
    badge: "⏳ ۵۰٪ بررسی",
    colorClass: "border-amber-400 bg-amber-500/20 text-amber-300",
  },
  {
    percent: 20,
    label: "صرفاً استعلام موجودی و مشاوره",
    badge: "💬 ۲۰٪ استعلام",
    colorClass: "border-neutral-400 bg-white/10 text-neutral-300",
  },
];

const CONTACT_METHODS = ["تماس تلفنی 📞", "پیام در تلگرام ✈️", "پیام در واتساپ 💬"];

export default function WaitlistSection({ lalezarClassName = "" }: WaitlistSectionProps) {
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

  // If phone changes to non-17, ensure condition resets from Akband to Kar-karde
  useEffect(() => {
    if (currentPhone.series !== "17" && selectedCondition === "آکبند (پلمپ)") {
      setSelectedCondition("در حد نو (کارکرده)");
    }
  }, [currentPhone.series, selectedCondition]);

  // Customer Contact Info
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [contactMethod, setContactMethod] = useState<string>("تماس تلفنی 📞");

  // Submission Status
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [trackingCode, setTrackingCode] = useState<string>("");
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

    const payload = {
      trackingCode: code,
      model: currentPhone.name,
      storage: selectedStorage,
      color: selectedColor,
      condition: selectedCondition,
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
        setTrackingCode(code);
        setStatus("success");
      } else {
        throw new Error(data.error || "خطا در برقراری ارتباط");
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
      // Client-side fallback if direct fetch to route failed
      try {
        const botToken = config.telegramBot.botToken;
        const chatId = config.telegramBot.chatId;
        const directText = `🎯 <b>درخواست جدید در صف انتظار آیفون دلخواه</b>\n🔢 <b>کد:</b> <code>#${code}</code>\n📱 <b>مدل:</b> ${currentPhone.name} (${selectedStorage})\n🎨 <b>رنگ:</b> ${selectedColor}\n📦 <b>وضعیت:</b> ${selectedCondition}\n⚡ <b>قطعیت:</b> ${selectedIntent}%\n👤 <b>نام:</b> ${customerName || "ثبت نشده"}\n📞 <b>تماس:</b> <code>${cleanPhone}</code>\n💬 <b>روش:</b> ${contactMethod}`;

        const directRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: directText, parse_mode: "HTML" }),
        });
        const directData = await directRes.json();
        if (directData.ok) {
          setTrackingCode(code);
          setStatus("success");
          return;
        }
      } catch {}

      setErrorMessage(
        "ارسال خودکار با تاخیر مواجه شد. می‌توانید درخواست خود را مستقیماً در واتساپ یا تلگرام ارسال کنید."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setCustomerPhone("");
    setCustomerName("");
    setErrorMessage("");
  };

  return (
    <section className="w-full mt-7 relative z-20" dir="rtl">
      <div className="bg-white/[0.08] backdrop-blur-[24px] rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/[0.12] flex flex-col gap-4">
        {/* Header Title with VIP Badge */}
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div className="flex flex-col">
              <h2 className={`text-base font-black text-white ${lalezarClassName}`}>
                صف انتظار آیفون دلخواه
              </h2>
              <span className="text-[10px] text-neutral-300">
                ثبت کانفیگ مدنظر جهت خرید با بالاترین اولویت به محض موجود شدن
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            VIP Queue
          </span>
        </div>

        {/* SUCCESS CONFIRMATION STATE */}
        {status === "success" ? (
          <div className="flex flex-col items-center text-center p-4 bg-black/40 rounded-[24px] border border-emerald-500/40 gap-3.5 animate-fadeIn">
            <div className="w-13 h-13 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <h3 className={`text-lg font-bold text-white mb-1 ${lalezarClassName}`}>
                درخواست شما با موفقیت ثبت شد!
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-xs">
                گوشی مدنظر شما در لیست انتظار ثبت گردید. به محض موجود شدن کانفیگ انتخابی، با اولویت بالا با شما تماس گرفته می‌شود.
              </p>
            </div>

            {/* Tracking Code Chip */}
            <div className="py-2 px-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-2 text-xs">
              <span className="text-neutral-400">کد پیگیری شما:</span>
              <strong className="text-emerald-300 font-mono font-bold text-sm tracking-wider">
                #{trackingCode}
              </strong>
            </div>

            {/* Summary details */}
            <div className="w-full bg-black/30 rounded-xl p-3 text-[11px] text-neutral-300 flex flex-col gap-1.5 text-right border border-white/5">
              <div>📱 <strong>دستگاه:</strong> {currentPhone.name} - {selectedStorage}</div>
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
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs animate-fadeIn">
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
                          ? "bg-sky-500 text-white shadow-[0_2px_10px_rgba(56,189,248,0.4)] border border-sky-400"
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
                ۲. انتخاب مدل دقیق:
              </label>
              <select
                value={selectedPhoneName}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-[16px] py-2.5 px-3.5 text-white text-sm font-bold outline-none focus:border-sky-400 transition-colors cursor-pointer dir-ltr text-right"
              >
                {filteredPhones.map((p) => (
                  <option key={p.id} value={p.name} className="bg-neutral-900 text-white py-1.5">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Storage Options */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-neutral-200">
                ۳. ظرفیت حافظه:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentPhone.storages.map((st) => {
                  const active = selectedStorage === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStorage(st)}
                      className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        active
                          ? "bg-white/25 text-white border border-white/40 shadow-sm"
                          : "bg-black/30 text-neutral-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Color Swatches (Market Names) */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-neutral-200">
                ۴. رنگ دلخواه:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentPhone.colorItems?.map((col) => {
                  const active = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`py-1.5 px-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
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
                  className={`py-1.5 px-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    selectedColor === "فرقی ندارد"
                      ? "bg-white/25 text-white border border-white/40 shadow-sm"
                      : "bg-black/30 text-neutral-300 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  🌈 هر رنگی
                </button>
              </div>
            </div>

            {/* 5. Device Condition (Akband only for Series 17) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-neutral-200">
                  ۵. وضعیت دستگاه:
                </label>
                {currentPhone.series !== "17" && (
                  <span className="text-[10px] text-amber-300/90 font-medium">
                    (آکبند این مدل در بازار موجود نیست)
                  </span>
                )}
              </div>
              <div className={`grid gap-1.5 ${availableConditions.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                {availableConditions.map((cond) => {
                  const active = selectedCondition === cond;
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setSelectedCondition(cond)}
                      className={`py-2 px-1 text-center rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                        active
                          ? "bg-sky-500/30 text-white border border-sky-400 shadow-sm"
                          : "bg-black/30 text-neutral-400 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Purchase Intent & Urgency Gauge */}
            <div className="flex flex-col gap-2 p-3 bg-black/30 rounded-[20px] border border-white/10">
              <div className="flex justify-between items-center">
                <label className="font-bold text-white text-xs">
                  ۶. میزان قطعیت و فوریت خرید شما:
                </label>
                <span className="text-[10px] font-bold text-sky-300">
                  (جهت اولویت‌بندی تماس)
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {INTENT_OPTIONS.map((opt) => {
                  const active = selectedIntent === opt.percent;
                  return (
                    <button
                      key={opt.percent}
                      type="button"
                      onClick={() => setSelectedIntent(opt.percent)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                        active
                          ? `${opt.colorClass} shadow-md`
                          : "border-white/5 bg-black/20 text-neutral-400 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${active ? "border-current bg-current/20" : "border-neutral-600"}`}>
                          {active && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
                        </span>
                        <span className="text-xs font-semibold">{opt.label}</span>
                      </div>
                      <span className="text-[10px] font-bold shrink-0 ml-1">
                        {opt.percent}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Contact Info */}
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-neutral-200">
                  ۷. شماره همراه شما (الزامی):
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="مثال: 09121234567"
                  className="w-full bg-black/40 border border-white/20 rounded-[16px] py-2.5 px-3.5 text-white font-bold outline-none focus:border-sky-400 text-left dir-ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-neutral-300 text-[11px]">
                    نام و نام خانوادگی (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="نام شما"
                    className="w-full bg-black/40 border border-white/20 rounded-[14px] py-2 px-3 text-white outline-none focus:border-sky-400 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-medium text-neutral-300 text-[11px]">
                    نحوه ارتباط ترجیحی:
                  </label>
                  <select
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-[14px] py-2 px-2 text-white outline-none focus:border-sky-400 text-xs cursor-pointer"
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
              className={`w-full py-3.5 px-4 rounded-[18px] bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-sm shadow-[0_4px_20px_rgba(56,189,248,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1 ${lalezarClassName}`}
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
    </section>
  );
}


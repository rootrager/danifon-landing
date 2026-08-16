"use client";

import React, { useState, useMemo } from "react";
import config from "../../config.json";

interface CalculatorsProps {
  lalezarClassName?: string;
}

// Convert Persian and Arabic digits to ASCII digits
function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
}

// Utility to format numbers with commas in English digits
function formatCurrency(val: number): string {
  if (isNaN(val) || val <= 0) return "0";
  return val.toLocaleString("en-US");
}

const SERIES_FILTERS = [
  { id: "all", label: "همه" },
  { id: "17", label: "سری ۱۷", match: (name: string) => name.includes("17") },
  { id: "16", label: "سری ۱۶", match: (name: string) => name.includes("16") },
  { id: "15", label: "سری ۱۵", match: (name: string) => name.includes("15") },
  { id: "14", label: "سری ۱۴", match: (name: string) => name.includes("14") },
  { id: "13", label: "سری ۱۳", match: (name: string) => name.includes("13") },
  { id: "older", label: "۱۲ و قبل‌تر", match: (name: string) => !["17", "16", "15", "14", "13"].some((s) => name.includes(s)) },
];

export default function Calculators({ lalezarClassName = "" }: CalculatorsProps) {
  const [activeTab, setActiveTab] = useState<"installment" | "registry">("installment");

  // --- Installment State ---
  const [amountStr, setAmountStr] = useState<string>("47000000"); // Default 47M
  const [selectedMonths, setSelectedMonths] = useState<number>(6); // Default 6 months

  const asciiAmount = toAsciiDigits(amountStr);
  const parsedAmount = Math.max(0, parseInt(asciiAmount.replace(/\D/g, "") || "0", 10));

  // Installment Formulas:
  // 1. base_with_fee = principal_amount * 1.10 (Adds 10%)
  // 2. monthly_interest = base_with_fee * 0.05 (5% of base_with_fee)
  // 3. total_interest = monthly_interest * months
  // 4. total_payback = base_with_fee + total_interest
  // 5. monthly_check = total_payback / months
  const baseWithFee = parsedAmount * (1 + config.installment.baseFeeRate);
  const monthlyInterest = baseWithFee * config.installment.monthlyInterestRate;
  const totalInterest = monthlyInterest * selectedMonths;
  const totalPayback = baseWithFee + totalInterest;
  const monthlyCheck = selectedMonths > 0 ? totalPayback / selectedMonths : 0;

  // Monthly Payment Cap Rule (Max 15,000,000 Toman per month)
  const MAX_MONTHLY_PAYMENT = 15000000;
  const isMonthlyExceeded = monthlyCheck > MAX_MONTHLY_PAYMENT;
  const isInvalidAmount = parsedAmount <= 0;

  // --- Registry State ---
  const models = config.registry.models;
  const [selectedSeries, setSelectedSeries] = useState<string>("15");
  const [selectedModelName, setSelectedModelName] = useState<string>("iPhone 15 Pro");

  // Filter models based on selected series pill
  const filteredModels = useMemo(() => {
    if (selectedSeries === "all") return models;
    const filter = SERIES_FILTERS.find((f) => f.id === selectedSeries);
    if (!filter || !filter.match) return models;
    return models.filter((m) => filter.match!(m.name));
  }, [models, selectedSeries]);

  // Current active model object
  const currentModel = useMemo(() => {
    return models.find((m) => m.name === selectedModelName) || models[0];
  }, [models, selectedModelName]);

  const passportFee = currentModel.passportFee;
  const totalRegistryFee = currentModel.customsFee + passportFee;

  // Handle series switch
  const handleSeriesChange = (seriesId: string) => {
    setSelectedSeries(seriesId);
    if (seriesId === "all") return;
    const filter = SERIES_FILTERS.find((f) => f.id === seriesId);
    if (filter && filter.match) {
      const firstInSeries = models.find((m) => filter.match!(m.name));
      if (firstInSeries) {
        setSelectedModelName(firstInSeries.name);
      }
    }
  };

  return (
    <section className="w-full mt-7 relative z-20" dir="rtl">
      <div className="bg-white/[0.08] backdrop-blur-[24px] rounded-[32px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/[0.12] flex flex-col gap-5">
        {/* Segmented Glass Switcher Header */}
        <div className="grid grid-cols-2 gap-2 bg-black/20 p-1.5 rounded-[22px] border border-white/[0.08] relative z-30">
          <button
            type="button"
            onClick={() => setActiveTab("installment")}
            className={`py-3 px-3 rounded-[16px] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation relative z-30 select-none ${
              activeTab === "installment"
                ? "bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-md"
                : "text-neutral-300 hover:text-white hover:bg-white/5 active:bg-white/10"
            }`}
          >
            <span>📊</span>
            <span className={lalezarClassName}>محاسبه اقساط</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("registry")}
            className={`py-3 px-3 rounded-[16px] text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation relative z-30 select-none ${
              activeTab === "registry"
                ? "bg-white/20 text-white shadow-lg border border-white/30 backdrop-blur-md"
                : "text-neutral-300 hover:text-white hover:bg-white/5 active:bg-white/10"
            }`}
          >
            <span>⚙️</span>
            <span className={lalezarClassName}>محاسبه رجیستری</span>
          </button>
        </div>

        {/* TAB 1: INSTALLMENT CALCULATOR */}
        {activeTab === "installment" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Freeform Amount Input (Supports English & Persian digits) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-200">
                مبلغ گوشی / درخواست اقساط (تومان):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={parsedAmount > 0 ? parsedAmount.toLocaleString("en-US") : ""}
                  onChange={(e) => {
                    const ascii = toAsciiDigits(e.target.value);
                    const raw = ascii.replace(/\D/g, "");
                    setAmountStr(raw);
                  }}
                  placeholder="مبلغ دلخواه را وارد کنید (مثلاً 47,000,000)"
                  className={`w-full bg-black/30 border rounded-[18px] py-3 px-4 text-white text-lg font-bold outline-none transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] placeholder:text-neutral-500 placeholder:font-normal placeholder:text-xs ${
                    isInvalidAmount
                      ? "border-amber-500/50 focus:border-amber-400"
                      : isMonthlyExceeded
                      ? "border-rose-500/80 focus:border-rose-400"
                      : "border-white/20 focus:border-sky-400/80"
                  }`}
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                  تومان
                </span>
              </div>
              {isInvalidAmount && (
                <p className="text-[11px] text-amber-300 font-medium mt-0.5">
                  ⚠️ لطفاً مبلغ مورد نظر برای اقساط را به تومان وارد کنید.
                </p>
              )}
            </div>

            {/* Months Selection Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-200">
                تعداد ماه (چک صیادی):
              </label>
              <select
                value={selectedMonths}
                onChange={(e) => setSelectedMonths(parseInt(e.target.value, 10))}
                className="w-full bg-black/40 border border-white/20 rounded-[18px] py-3 px-4 text-white text-base font-bold outline-none focus:border-sky-400/80 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer touch-manipulation"
              >
                {config.installment.monthsOptions.map((m) => (
                  <option key={m} value={m} className="bg-neutral-900 text-white py-2">
                    {m} ماه
                  </option>
                ))}
              </select>
            </div>

            {/* Calculations Breakdown Card */}
            <div className="bg-black/30 rounded-[22px] p-4 border border-white/10 flex flex-col gap-2.5 text-xs text-neutral-200">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-300">مبلغ اولیه:</span>
                <span className="font-bold text-white text-sm">
                  {formatCurrency(parsedAmount)} تومان
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-300">مجموع بازپرداخت ({selectedMonths} ماه):</span>
                <span className="font-bold text-sky-300 text-sm">
                  {formatCurrency(Math.round(totalPayback))} تومان
                </span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="font-bold text-neutral-200 text-sm">مبلغ هر قسط / چک ماهانه:</span>
                <span
                  className={`font-black text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
                    isMonthlyExceeded
                      ? "text-rose-400 drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]"
                      : "text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)]"
                  } ${lalezarClassName}`}
                >
                  {formatCurrency(Math.round(monthlyCheck))} تومان
                </span>
              </div>
            </div>

            {/* 15M Limit Exceeded Warning Box */}
            {isMonthlyExceeded && (
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-[18px] p-3 text-xs text-rose-200 font-medium leading-relaxed flex items-start gap-2 backdrop-blur-md">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <strong className="block mb-0.5 text-rose-300">سقف مجاز اقساط ماهانه:</strong>
                  مبلغ قسط ماهانه نباید بالای 15,000,000 تومان باشد. لطفاً تعداد ماهها را افزایش دهید یا مبلغ اولیه را کاهش دهید.
                </div>
              </div>
            )}

            {/* Telegram Order CTA */}
            {isMonthlyExceeded || isInvalidAmount ? (
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-4 bg-neutral-800/80 text-neutral-400 font-bold rounded-[20px] cursor-not-allowed border border-white/10 text-xs text-center"
              >
                <span className={lalezarClassName}>
                  {isInvalidAmount
                    ? "مبلغ اقساط را وارد کنید"
                    : "مبلغ قسط بالای سقف مجاز (15 میلیون) است"}
                </span>
              </button>
            ) : (
              <a
                href={`${config.installment.telegramUrl}?text=${encodeURIComponent(
                  `سلام وقت بخیر، درخواست اقساط دارم.\nمبلغ اولیه: ${parsedAmount.toLocaleString("en-US")} تومان\nتعداد ماه: ${selectedMonths} ماه\nمبلغ هر قسط: ${Math.round(monthlyCheck).toLocaleString("en-US")} تومان`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white font-bold rounded-[20px] transition-all shadow-[0_4px_20px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 cursor-pointer mt-1 touch-manipulation"
              >
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className={lalezarClassName}>ثبت درخواست اقساط در تلگرام</span>
              </a>
            )}
          </div>
        )}

        {/* TAB 2: REGISTRY CALCULATOR */}
        {activeTab === "registry" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Series Quick-Filter Pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-200">
                دسته‌بندی سری آیفون:
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                {SERIES_FILTERS.map((s) => {
                  const isSelected = selectedSeries === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSeriesChange(s.id)}
                      className={`py-1.5 px-3 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer touch-manipulation ${
                        isSelected
                          ? "bg-emerald-500 text-white shadow-[0_2px_10px_rgba(16,185,129,0.4)] border border-emerald-400"
                          : "bg-white/10 text-neutral-300 hover:text-white hover:bg-white/15 border border-white/10"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* iPhone Model Dropdown Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-200">
                انتخاب مدل دقیق:
              </label>
              <select
                value={selectedModelName}
                onChange={(e) => setSelectedModelName(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-[18px] py-3 px-4 text-white text-base font-bold outline-none focus:border-emerald-400/80 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] cursor-pointer dir-ltr text-right touch-manipulation"
              >
                {filteredModels.map((m) => (
                  <option key={m.name} value={m.name} className="bg-neutral-900 text-white py-2">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculations Breakdown Card */}
            <div className="bg-black/30 rounded-[22px] p-4 border border-white/10 flex flex-col gap-2.5 text-xs text-neutral-200">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-300">مدل انتخابی:</span>
                <span className="font-bold text-white text-sm dir-ltr">{currentModel.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-300">هزینه گمرکی دستگاه:</span>
                <span className="font-bold text-neutral-200 text-sm">
                  {formatCurrency(currentModel.customsFee)} تومان
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-300">ثبت رسمی و حق پاسپورت:</span>
                <span className="font-bold text-amber-300 text-sm">
                  {formatCurrency(passportFee)} تومان
                </span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="font-bold text-emerald-400 text-sm">مجموع کل هزینه رجیستری:</span>
                <span className={`font-black text-emerald-400 text-base drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)] ${lalezarClassName}`}>
                  {formatCurrency(totalRegistryFee)} تومان
                </span>
              </div>
            </div>

            {/* Contact CTA Guidance & Buttons with Automated Pre-filled Model Info */}
            <div className="flex flex-col gap-2.5 mt-1">
              <p className="text-xs text-neutral-300 font-medium text-center leading-relaxed">
                جهت ثبت گمرک و فعالسازی رجیستری، اطلاعات مدل انتخاب شده خودکار ارسال میشود:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`${config.registry.whatsappUrl}?text=${encodeURIComponent(
                    `سلام وقت بخیر، قصد انجام رجیستری دارم.\nمدل دستگاه: ${currentModel.name}\nهزینه گمرک: ${formatCurrency(currentModel.customsFee)} تومان\nمبلغ کل رجیستری: ${formatCurrency(totalRegistryFee)} تومان`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-bold rounded-[18px] transition-all shadow-[0_4px_16px_rgba(52,211,153,0.3)] flex items-center justify-center gap-1.5 cursor-pointer text-xs touch-manipulation"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.12.552 4.17 1.599 5.986L.071 24l6.126-1.606c1.764.957 3.742 1.464 5.83 1.464 6.645 0 12.028-5.383 12.028-12.031S18.675 0 12.031 0zm0 21.849c-1.793 0-3.548-.482-5.086-1.393l-.365-.217-3.774.989 1.008-3.682-.238-.378a10.02 10.02 0 0 1-1.543-5.318C2.033 6.309 6.471 1.867 12.031 1.867c5.556 0 9.994 4.439 9.994 9.983s-4.438 9.999-9.994 9.999zm5.485-7.485c-.301-.151-1.782-.88-2.059-.982-.276-.1-.477-.151-.678.151-.201.301-.778.982-.954 1.183-.176.201-.351.226-.653.075-2.093-1.05-3.513-1.921-4.836-3.626-.176-.226-.019-.348.131-.498.136-.136.301-.351.452-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.527-.075-.151-.678-1.631-.929-2.233-.245-.588-.495-.508-.678-.518-.176-.008-.376-.011-.577-.011s-.527.075-.803.376c-.276.301-1.054 1.029-1.054 2.51s1.079 2.911 1.229 3.112c.151.201 2.122 3.238 5.14 4.542 1.942.836 2.709.914 3.652.766.793-.125 2.457-1.004 2.802-1.97.345-.966.345-1.792.245-1.97-.101-.176-.376-.276-.678-.427z" />
                  </svg>
                  <span className={lalezarClassName}>پیام در واتساپ</span>
                </a>

                <a
                  href={`${config.registry.telegramUrl}?text=${encodeURIComponent(
                    `سلام وقت بخیر، قصد انجام رجیستری دارم.\nمدل دستگاه: ${currentModel.name}\nهزینه گمرک: ${formatCurrency(currentModel.customsFee)} تومان\nمبلغ کل رجیستری: ${formatCurrency(totalRegistryFee)} تومان`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white font-bold rounded-[18px] transition-all shadow-[0_4px_16px_rgba(56,189,248,0.3)] flex items-center justify-center gap-1.5 cursor-pointer text-xs touch-manipulation"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  <span className={lalezarClassName}>پیام در تلگرام</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


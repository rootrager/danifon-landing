"use client";

import React, { useState, useMemo, useEffect, useId } from "react";
import { Calculator, ShieldCheck, Send, MessageCircle, AlertTriangle, ChevronDown } from "lucide-react";
import config from "../../config.json";

interface CalculatorsProps {
  lalezarClassName?: string;
  activeTab?: "installment" | "registry";
  onTabChange?: (tab: "installment" | "registry") => void;
  hideHeaderTabs?: boolean;
}

function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
}

function formatCurrency(val: number): string {
  if (isNaN(val) || val <= 0) return "0";
  return val.toLocaleString("en-US");
}

const SERIES_FILTERS = [
  { id: "all", label: "همه" },
  { id: "18", label: "سری ۱۸", match: (name: string) => name.includes("18") },
  { id: "17", label: "سری ۱۷", match: (name: string) => name.includes("17") },
  { id: "16", label: "سری ۱۶", match: (name: string) => name.includes("16") },
  { id: "15", label: "سری ۱۵", match: (name: string) => name.includes("15") },
  { id: "14", label: "سری ۱۴", match: (name: string) => name.includes("14") },
  { id: "13", label: "سری ۱۳", match: (name: string) => name.includes("13") },
  {
    id: "older",
    label: "۱۲ و قبلتر",
    match: (name: string) =>
      name.startsWith("iPhone") && !["18", "17", "16", "15", "14", "13"].some((s) => name.includes(s)),
  },
];

const PRESET_AMOUNTS = [
  { label: "۳۰ م", value: 30000000 },
  { label: "۵۰ م", value: 50000000 },
  { label: "۷۰ م", value: 70000000 },
  { label: "۱۰۰ م", value: 100000000 },
];

export default function Calculators({
  lalezarClassName = "",
  activeTab: controlledTab,
  onTabChange,
  hideHeaderTabs = false,
}: CalculatorsProps) {
  const uid = useId();
  const [internalTab, setInternalTab] = useState<"installment" | "registry">("installment");
  const currentTab = controlledTab || internalTab;

  const handleTabSwitch = (tab: "installment" | "registry") => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Installment State
  const [amountStr, setAmountStr] = useState<string>("50000000");
  const [selectedMonths, setSelectedMonths] = useState<number>(6);

  const asciiAmount = toAsciiDigits(amountStr);
  const parsedAmount = Math.max(0, parseInt(asciiAmount.replace(/\D/g, "") || "0", 10));

  const baseWithFee = parsedAmount * (1 + config.installment.baseFeeRate);
  const monthlyInterest = baseWithFee * config.installment.monthlyInterestRate;
  const totalInterest = monthlyInterest * selectedMonths;
  const totalPayback = baseWithFee + totalInterest;
  const monthlyCheck = selectedMonths > 0 ? totalPayback / selectedMonths : 0;

  const MAX_MONTHLY_PAYMENT = 15000000;
  const isMonthlyExceeded = monthlyCheck > MAX_MONTHLY_PAYMENT;
  const isInvalidAmount = parsedAmount <= 0;

  // Registry State
  const [liveModels, setLiveModels] = useState(config.registry.models);
  const [selectedSeries, setSelectedSeries] = useState<string>("18");
  const [selectedModelName, setSelectedModelName] = useState<string>("iPhone 18 Pro Max");

  useEffect(() => {
    fetch("https://api.danifon.ir/api/registry-fees")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.fees && Object.keys(data.fees).length > 0) {
          const fees = data.fees;
          setLiveModels((prev) =>
            prev.map((m) => {
              if (fees[m.name]) {
                const total = fees[m.name];
                const pFee = m.passportFee || 28000000;
                return {
                  ...m,
                  customsFee: Math.max(0, total - pFee),
                  passportFee: pFee,
                };
              }
              return m;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  const models = liveModels;

  const filteredModels = useMemo(() => {
    if (selectedSeries === "all") return models;
    const filter = SERIES_FILTERS.find((f) => f.id === selectedSeries);
    if (!filter || !filter.match) return models;
    return models.filter((m) => filter.match!(m.name));
  }, [models, selectedSeries]);

  const currentModel = useMemo(() => {
    return models.find((m) => m.name === selectedModelName) || models[0];
  }, [models, selectedModelName]);

  const passportFee = currentModel.passportFee;
  const totalRegistryFee = currentModel.customsFee + passportFee;

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
    <div className="w-full flex flex-col gap-5" dir="rtl">
      {!hideHeaderTabs && (
        <div className="grid grid-cols-2 gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => handleTabSwitch("installment")}
            className={`min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              currentTab === "installment"
                ? "bg-white text-neutral-950"
                : "text-neutral-300 hover:text-white"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>محاسبه اقساط</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("registry")}
            className={`min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              currentTab === "registry"
                ? "bg-white text-neutral-950"
                : "text-neutral-300 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>محاسبه رجیستری</span>
          </button>
        </div>
      )}

      {/* TAB 1: INSTALLMENT CALCULATOR */}
      {currentTab === "installment" && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
                <Calculator className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className={`text-lg font-normal text-white truncate ${lalezarClassName}`}>
                  محاسبه‌گر اقساط آیفون
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  پرداخت با چک صیادی بنفش با کارمزد شفاف
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-sky-300 whitespace-nowrap shrink-0">
              سقف هر قسط ۱۵ م
            </span>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor={`${uid}-amount`} className="text-xs font-semibold text-neutral-200">
              مبلغ گوشی یا مانده اقساط (تومان)
            </label>

            <div className="relative">
              <input
                id={`${uid}-amount`}
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={parsedAmount > 0 ? parsedAmount.toLocaleString("en-US") : ""}
                onChange={(e) => {
                  const ascii = toAsciiDigits(e.target.value);
                  const raw = ascii.replace(/\D/g, "");
                  setAmountStr(raw);
                }}
                placeholder="50,000,000"
                className={`w-full min-h-[48px] bg-black/50 border rounded-xl py-2.5 pr-4 pl-16 text-white text-base font-bold tabular-nums text-left outline-none transition-colors placeholder:text-neutral-500 placeholder:font-normal placeholder:text-xs ${
                  isInvalidAmount
                    ? "border-amber-500/50 focus:border-amber-400"
                    : isMonthlyExceeded
                    ? "border-rose-500/70 focus:border-rose-400"
                    : "border-white/15 focus:border-sky-400"
                }`}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400 pointer-events-none select-none">
                تومان
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {PRESET_AMOUNTS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setAmountStr(String(p.value))}
                  className={`min-h-[38px] py-1.5 px-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap touch-manipulation border ${
                    parsedAmount === p.value
                      ? "bg-sky-500 text-neutral-950 border-sky-400 font-bold"
                      : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] border-white/[0.08]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {isInvalidAmount && (
              <p className="text-xs text-amber-300 flex items-center gap-1.5 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>لطفاً مبلغ مورد نظر برای اقساط را وارد کنید.</span>
              </p>
            )}
          </div>

          {/* Months Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-neutral-200">
                مدت بازپرداخت (تعداد چک ماهانه)
              </span>
              <span className="text-xs font-bold text-sky-300 tabular-nums">{selectedMonths} ماهه</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {(config.installment.monthsOptions || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMonths(m)}
                  className={`min-h-[40px] py-2 rounded-xl text-xs font-semibold tabular-nums transition-colors cursor-pointer whitespace-nowrap touch-manipulation border ${
                    selectedMonths === m
                      ? "bg-sky-500 text-neutral-950 border-sky-400 font-bold"
                      : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] border-white/[0.08]"
                  }`}
                >
                  {m} ماه
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown (clean hairline dividers instead of nested box clutter) */}
          <div className="border-t border-b border-white/[0.08] py-3.5 flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">مبلغ اولیه درخواستی</span>
              <span className="font-semibold text-white tabular-nums">
                {formatCurrency(parsedAmount)} تومان
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">مجموع بازپرداخت ({selectedMonths} ماه)</span>
              <span className="font-semibold text-sky-300 tabular-nums">
                {formatCurrency(Math.round(totalPayback))} تومان
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
              <span className="font-bold text-white">مبلغ هر چک ماهانه</span>
              <span
                className={`font-extrabold text-base sm:text-lg tabular-nums ${
                  isMonthlyExceeded ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {formatCurrency(Math.round(monthlyCheck))} تومان
              </span>
            </div>
          </div>

          {isMonthlyExceeded && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/35 text-xs text-rose-200 leading-relaxed flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5 text-rose-300">سقف مجاز هر قسط (۱۵ میلیون تومان)</strong>
                مبلغ قسط ماهانه از سقف مجاز بالاتر است. تعداد ماه‌ها را افزایش دهید یا مبلغ اولیه را کاهش دهید.
              </div>
            </div>
          )}

          {isMonthlyExceeded || isInvalidAmount ? (
            <button
              type="button"
              disabled
              className="min-h-[48px] w-full py-3 px-4 bg-white/[0.05] text-neutral-500 font-bold rounded-xl cursor-not-allowed border border-white/[0.08] text-xs text-center"
            >
              {isInvalidAmount
                ? "مبلغ اقساط را وارد کنید"
                : "مبلغ قسط بالای سقف مجاز (۱۵ میلیون) است"}
            </button>
          ) : (
            <a
              href={`${config.installment.telegramUrl}?text=${encodeURIComponent(
                `سلام وقت بخیر، درخواست اقساط دارم.\nمبلغ اولیه: ${parsedAmount.toLocaleString("en-US")} تومان\nتعداد ماه: ${selectedMonths} ماه\nمبلغ هر قسط: ${Math.round(monthlyCheck).toLocaleString("en-US")} تومان`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-neutral-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation text-sm"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>ثبت درخواست اقساط در تلگرام</span>
            </a>
          )}
        </div>
      )}

      {/* TAB 2: REGISTRY CALCULATOR */}
      {currentTab === "registry" && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className={`text-lg font-normal text-white truncate ${lalezarClassName}`}>
                  استعلام هزینه رجیستری آیفون
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  محاسبه دقیق تعرفه گمرک + ثبت قانونی مسافری
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-emerald-300 whitespace-nowrap shrink-0">
              تعرفه رسمی
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-neutral-200">سری آیفون</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SERIES_FILTERS.map((s) => {
                const isSelected = selectedSeries === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSeriesChange(s.id)}
                    className={`min-h-[38px] py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer touch-manipulation border ${
                      isSelected
                        ? "bg-emerald-500 text-neutral-950 border-emerald-400 font-bold"
                        : "bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08]"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${uid}-reg-model`} className="text-xs font-semibold text-neutral-200">
              انتخاب مدل دقیق
            </label>
            <div className="relative">
              <select
                id={`${uid}-reg-model`}
                dir="ltr"
                value={selectedModelName}
                onChange={(e) => setSelectedModelName(e.target.value)}
                className="w-full min-h-[48px] appearance-none bg-black/50 border border-white/15 rounded-xl py-2.5 pl-9 pr-3.5 text-white text-sm font-semibold outline-none focus:border-emerald-400 transition-colors cursor-pointer text-right touch-manipulation"
              >
                {filteredModels.map((m) => (
                  <option key={m.name} value={m.name} className="bg-neutral-900 text-white">
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-t border-b border-white/[0.08] py-3.5 flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">مدل انتخابی</span>
              <span className="font-semibold text-white" dir="ltr">
                {currentModel.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">هزینه گمرکی دستگاه</span>
              <span className="font-semibold text-neutral-200 tabular-nums">
                {formatCurrency(currentModel.customsFee)} تومان
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">ثبت رسمی و حق پاسپورت</span>
              <span className="font-semibold text-amber-300 tabular-nums">
                {formatCurrency(passportFee)} تومان
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
              <span className="font-bold text-white">مجموع کل هزینه رجیستری</span>
              <span className="font-extrabold text-emerald-400 text-base sm:text-lg tabular-nums">
                {formatCurrency(totalRegistryFee)} تومان
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`${config.registry.whatsappUrl}?text=${encodeURIComponent(
                `سلام وقت بخیر، قصد انجام رجیستری دارم.\nمدل دستگاه: ${currentModel.name}\nهزینه گمرک: ${formatCurrency(currentModel.customsFee)} تومان\nمبلغ کل رجیستری: ${formatCurrency(totalRegistryFee)} تومان`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] py-3 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-neutral-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs touch-manipulation"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>پیام در واتساپ</span>
            </a>

            <a
              href={`${config.registry.telegramUrl}?text=${encodeURIComponent(
                `سلام وقت بخیر، قصد انجام رجیستری دارم.\nمدل دستگاه: ${currentModel.name}\nهزینه گمرک: ${formatCurrency(currentModel.customsFee)} تومان\nمبلغ کل رجیستری: ${formatCurrency(totalRegistryFee)} تومان`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] py-3 px-3 bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-neutral-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs touch-manipulation"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>پیام در تلگرام</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

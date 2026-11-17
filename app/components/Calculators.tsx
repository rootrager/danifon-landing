"use client";

import React, { useState, useMemo, useEffect, useId } from "react";
import { Calculator, ShieldCheck, Send, MessageCircle, AlertTriangle, ChevronDown } from "lucide-react";
import config from "../../config.json";
import { formatMillionHelper } from "../inventory/components/inventoryHelpers";

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
  { label: "۳۰ میلیون", value: 30000000 },
  { label: "۵۰ میلیون", value: 50000000 },
  { label: "۷۰ میلیون", value: 70000000 },
  { label: "۱۰۰ میلیون", value: 100000000 },
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
        <div className="grid grid-cols-2 gap-1.5 bg-blue-50/70 dark:bg-[#060913] p-1 rounded-xl border border-blue-100 dark:border-blue-400/15">
          <button
            type="button"
            onClick={() => handleTabSwitch("installment")}
            className={`min-h-[42px] py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              currentTab === "installment"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-[#0a1628] dark:hover:text-white"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>محاسبه اقساط</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("registry")}
            className={`min-h-[42px] py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation ${
              currentTab === "registry"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-[#0a1628] dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>محاسبه رجیستری</span>
          </button>
        </div>
      )}

      {/* TAB 1: INSTALLMENT CALCULATOR */}
      {currentTab === "installment" && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-blue-100 dark:border-blue-400/15">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
                <Calculator className="w-5 h-5" strokeWidth={1.9} />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className={`text-xl font-normal text-[#0a1628] dark:text-white truncate ${lalezarClassName}`}>
                  محاسبه‌گر اقساط آیفون
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                  خرید با چک صیادی بنفش · محاسبه شفاف مبلغ هر قسط
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0">
              سقف هر چک ۱۵ میلیون
            </span>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={`${uid}-amount`} className="text-sm font-semibold text-[#0a1628] dark:text-slate-200">
                مبلغ باقیمانده برای اقساط (تومان)
              </label>
              {parsedAmount > 0 && (
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tabular-nums">
                  {formatMillionHelper(parsedAmount)}
                </span>
              )}
            </div>

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
                className={`w-full min-h-[52px] bg-blue-50/40 dark:bg-[#060913] border rounded-xl py-2.5 pr-4 pl-16 text-[#0a1628] dark:text-white text-lg font-bold tabular-nums text-left outline-none transition-colors placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm ${
                  isInvalidAmount
                    ? "border-amber-500 focus:border-amber-600"
                    : isMonthlyExceeded
                    ? "border-rose-500 focus:border-rose-600"
                    : "border-blue-200 dark:border-blue-400/20 focus:border-blue-600 dark:focus:border-blue-400"
                }`}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400 pointer-events-none select-none">
                تومان
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setAmountStr(String(p.value))}
                  className={`min-h-[42px] py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap touch-manipulation border ${
                    parsedAmount === p.value
                      ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-400 font-bold"
                      : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-300 hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {isInvalidAmount && (
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-1.5 mt-0.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>لطفاً مبلغ مورد نظر برای اقساط را وارد کنید.</span>
              </p>
            )}
          </div>

          {/* Months Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#0a1628] dark:text-slate-200">
                تعداد ماه بازپرداخت
              </span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300 tabular-nums">
                {selectedMonths} ماهه
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {(config.installment.monthsOptions || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMonths(m)}
                  className={`min-h-[42px] py-2 rounded-xl text-xs sm:text-sm font-semibold tabular-nums transition-colors cursor-pointer whitespace-nowrap touch-manipulation border ${
                    selectedMonths === m
                      ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-400 font-bold"
                      : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-300 hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                  }`}
                >
                  {m} ماه
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-t border-b border-blue-100 dark:border-blue-400/15 py-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">مبلغ اولیه درخواستی</span>
              <span className="font-semibold text-[#0a1628] dark:text-white tabular-nums">
                {formatCurrency(parsedAmount)} تومان
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">مجموع کل بازپرداخت ({selectedMonths} ماه)</span>
              <span className="font-semibold text-blue-700 dark:text-blue-300 tabular-nums">
                {formatCurrency(Math.round(totalPayback))} تومان
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-blue-100 dark:border-blue-400/15">
              <span className="font-bold text-[#0a1628] dark:text-white">مبلغ هر چک ماهانه</span>
              <div className="flex flex-col items-end">
                <span
                  className={`font-extrabold text-xl sm:text-2xl tabular-nums ${
                    isMonthlyExceeded
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {formatCurrency(Math.round(monthlyCheck))} تومان
                </span>
                {monthlyCheck > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatMillionHelper(Math.round(monthlyCheck))}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isMonthlyExceeded && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/35 text-sm text-rose-800 dark:text-rose-200 leading-relaxed flex items-start gap-2.5"
            >
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5 text-rose-900 dark:text-rose-300">
                  سقف مجاز هر چک (۱۵ میلیون تومان)
                </strong>
                مبلغ قسط ماهانه از ۱۵ میلیون تومان بیشتر شده است. لطفاً تعداد ماه‌ها را بیشتر کنید یا مبلغ پیش‌پرداخت را افزایش دهید.
              </div>
            </div>
          )}

          {isMonthlyExceeded || isInvalidAmount ? (
            <button
              type="button"
              disabled
              className="min-h-[52px] w-full py-3 px-4 bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 font-bold rounded-xl cursor-not-allowed border border-slate-200 dark:border-white/[0.08] text-sm text-center"
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
              className="min-h-[52px] w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 active:scale-[0.99] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation text-base shadow-[0_6px_20px_rgba(11,99,246,0.20)]"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>ارسال شرایط اقساط به کارشناس</span>
            </a>
          )}
        </div>
      )}

      {/* TAB 2: REGISTRY CALCULATOR */}
      {currentTab === "registry" && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-blue-100 dark:border-blue-400/15">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.9} />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className={`text-xl font-normal text-[#0a1628] dark:text-white truncate ${lalezarClassName}`}>
                  استعلام هزینه رجیستری آیفون
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                  تعرفه رسمی گمرک + ثبت قانونی با پاسپورت
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0">
              به‌روزرسانی روزانه
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#0a1628] dark:text-slate-200">۱. سری آیفون</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SERIES_FILTERS.map((s) => {
                const isSelected = selectedSeries === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSeriesChange(s.id)}
                    className={`min-h-[40px] py-1.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer touch-manipulation border ${
                      isSelected
                        ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-400 font-bold"
                        : "bg-blue-50/60 dark:bg-[#11192e]/80 text-slate-700 dark:text-slate-300 hover:text-[#0a1628] dark:hover:text-white hover:bg-blue-100/70 dark:hover:bg-[#182442] border-blue-100 dark:border-blue-400/15"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${uid}-reg-model`} className="text-sm font-semibold text-[#0a1628] dark:text-slate-200">
              ۲. انتخاب مدل دقیق گوشی
            </label>
            <div className="relative">
              <select
                id={`${uid}-reg-model`}
                dir="ltr"
                value={selectedModelName}
                onChange={(e) => setSelectedModelName(e.target.value)}
                className="w-full min-h-[48px] appearance-none bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 pl-10 pr-3.5 text-[#0a1628] dark:text-white text-sm font-semibold outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors cursor-pointer text-right touch-manipulation"
              >
                {filteredModels.map((m) => (
                  <option key={m.name} value={m.name} className="bg-white dark:bg-[#0b101d] text-[#0a1628] dark:text-white">
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-t border-b border-blue-100 dark:border-blue-400/15 py-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">مدل انتخابی</span>
              <span className="font-semibold text-[#0a1628] dark:text-white" dir="ltr">
                {currentModel.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">هزینه گمرکی دستگاه</span>
              <span className="font-semibold text-[#0a1628] dark:text-slate-200 tabular-nums">
                {formatCurrency(currentModel.customsFee)} تومان
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">ثبت مسافری و حق پاسپورت</span>
              <span className="font-semibold text-blue-700 dark:text-blue-300 tabular-nums">
                {formatCurrency(passportFee)} تومان
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-blue-100 dark:border-blue-400/15">
              <span className="font-bold text-[#0a1628] dark:text-white">مجموع کل هزینه رجیستری</span>
              <div className="flex flex-col items-end">
                <span className="font-extrabold text-blue-700 dark:text-blue-300 text-xl sm:text-2xl tabular-nums">
                  {formatCurrency(totalRegistryFee)} تومان
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatMillionHelper(totalRegistryFee)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`${config.registry.whatsappUrl}?text=${encodeURIComponent(
                `سلام وقت بخیر، قصد انجام رجیستری دارم.\nمدل دستگاه: ${currentModel.name}\nهزینه گمرک: ${formatCurrency(currentModel.customsFee)} تومان\nمبلغ کل رجیستری: ${formatCurrency(totalRegistryFee)} تومان`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[50px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.98] text-white dark:text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm touch-manipulation"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>انجام رجیستری در واتساپ</span>
            </a>

            <a
              href={`${config.registry.telegramUrl}?text=${encodeURIComponent(
                `سلام وقت بخیر، قصد انجام رجیستری دارم.\nمدل دستگاه: ${currentModel.name}\nهزینه گمرک: ${formatCurrency(currentModel.customsFee)} تومان\nمبلغ کل رجیستری: ${formatCurrency(totalRegistryFee)} تومان`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[50px] py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 active:scale-[0.98] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm touch-manipulation"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>انجام رجیستری در تلگرام</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useId } from "react";
import { KeyRound, Lock, Globe, Zap, ShieldCheck, Mail, Send, Copy, Check, AlertCircle } from "lucide-react";
import config from "../../config.json";

interface AppleIdSectionProps {
  lalezarClassName?: string;
}

function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
}

export default function AppleIdSection({ lalezarClassName = "" }: AppleIdSectionProps) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cleanPhone = toAsciiDigits(phone).trim().replace(/\D/g, "");
  const cleanEmail = email.trim();

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("لطفاً یک آدرس جیمیل (Gmail) معتبر وارد کنید.");
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg("لطفاً شماره موبایل معتبر (مثلاً 09121234567) وارد کنید.");
      return;
    }

    setErrorMsg("");

    const messageText = `سلام وقت بخیر، درخواست سفارش اپل آیدی اختصاصی دارم.
━━━━━━━━━━━━━━━━━━━━
جیمیل شخصی: ${cleanEmail}
نام و نام خانوادگی: ${fullName.trim() || "ثبت نشده"}
شماره تماس: ${cleanPhone}
ریجن درخواستی: آمریکا (US)
━━━━━━━━━━━━━━━━━━━━
ثبت شده از وب‌سایت دانیفون`;

    const telegramUrl = `${config.appleId?.telegramUrl || config.contact.telegramExpertUrl}?text=${encodeURIComponent(messageText)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyMessage = () => {
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("لطفاً ابتدا جیمیل خود را وارد کنید.");
      return;
    }

    const messageText = `سلام وقت بخیر، درخواست سفارش اپل آیدی اختصاصی دارم.
جیمیل: ${cleanEmail}
نام: ${fullName.trim() || "ثبت نشده"}
شماره تماس: ${cleanPhone || "ثبت نشده"}`;

    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-5 animate-fadeIn" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/[0.10]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-400/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0">
            <KeyRound className="w-5 h-5" strokeWidth={1.9} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className={`text-xl font-normal text-slate-900 dark:text-white truncate ${lalezarClassName}`}>
              سفارش اپل‌آیدی اختصاصی
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
              ساخت قانونی روی ایمیل شخصی خودتان، بدون خطر قفل شدن
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 whitespace-nowrap shrink-0">
          تحویل زیر ۳۰ دقیقه
        </span>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 py-1">
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-300 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-slate-900 dark:text-white font-semibold">ایمیل ۱۰۰٪ شخصی</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">ثبت مستقیم به نام خودتان، بدون خطر مسدودی</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-300 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-slate-900 dark:text-white font-semibold">کشور معتبر آمریکا</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">دسترسی کامل به تمام برنامه‌های اپ‌استور</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-300 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-slate-900 dark:text-white font-semibold">تحویل سریع</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">آماده‌سازی در کمتر از ۳۰ دقیقه کاری</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-300 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-slate-900 dark:text-white font-semibold">بدون شماره مجازی</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">دائمی همراه با رمز و سوالات امنیتی اختصاصی</span>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handleOrder} className="flex flex-col gap-4 text-sm pt-3 border-t border-slate-200 dark:border-white/[0.08]">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${uid}-email`}
            className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
          >
            <span>آدرس جیمیل شما (جهت ثبت اپل‌آیدی)</span>
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">الزامی</span>
          </label>
          <div className="relative">
            <input
              id={`${uid}-email`}
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full min-h-[48px] bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl py-2.5 pl-10 pr-3.5 text-slate-900 dark:text-white font-semibold outline-none focus:border-indigo-500 transition-colors text-left placeholder:text-slate-400 placeholder:text-sm"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${uid}-fullname`} className="font-medium text-slate-700 dark:text-slate-300">
              نام و نام خانوادگی
            </label>
            <input
              id={`${uid}-fullname`}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: دانیال کمالی"
              className="w-full min-h-[48px] bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl py-2.5 px-3.5 text-slate-900 dark:text-white outline-none focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${uid}-phone`}
              className="font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>شماره تماس</span>
              <span className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">الزامی</span>
            </label>
            <input
              id={`${uid}-phone`}
              type="tel"
              inputMode="numeric"
              dir="ltr"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09121234567"
              className="w-full min-h-[48px] bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/15 rounded-xl py-2.5 px-3.5 text-slate-900 dark:text-white font-semibold tabular-nums outline-none focus:border-indigo-500 text-left placeholder:text-slate-400"
            />
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-sm text-rose-800 dark:text-rose-200 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <button
            type="submit"
            className="min-h-[52px] flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-[0.98] text-white font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>ثبت سفارش در تلگرام</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMessage}
            className="min-h-[52px] sm:w-auto py-3 px-5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200/80 dark:hover:bg-white/[0.12] text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer touch-manipulation whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "کپی شد" : "کپی متن سفارش"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

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
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <KeyRound className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className={`text-lg font-normal text-white truncate ${lalezarClassName}`}>
              سفارش اپل‌آیدی اختصاصی
            </h3>
            <p className="text-xs text-neutral-400 truncate">
              ثبت مستقیم روی جیمیل شخصی شما با امنیت کامل
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-indigo-300 whitespace-nowrap shrink-0">
          تحویل زیر ۳۰ دقیقه
        </span>
      </div>

      {/* Feature Highlights (Clean hairline grid, no nested card clutter) */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-1">
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" strokeWidth={1.8} />
          <div className="flex flex-col">
            <strong className="text-xs text-white font-semibold">ایمیل ۱۰۰٪ شخصی</strong>
            <span className="text-[11px] text-neutral-400">بدون خطر غیرفعال شدن</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" strokeWidth={1.8} />
          <div className="flex flex-col">
            <strong className="text-xs text-white font-semibold">ریجن معتبر آمریکا</strong>
            <span className="text-[11px] text-neutral-400">دسترسی کامل به اپ‌استور</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" strokeWidth={1.8} />
          <div className="flex flex-col">
            <strong className="text-xs text-white font-semibold">تحویل سریع</strong>
            <span className="text-[11px] text-neutral-400">زیر ۳۰ دقیقه کاری</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" strokeWidth={1.8} />
          <div className="flex flex-col">
            <strong className="text-xs text-white font-semibold">بدون شماره مجازی</strong>
            <span className="text-[11px] text-neutral-400">دائمی با سوالات امنیتی</span>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handleOrder} className="flex flex-col gap-3.5 text-xs pt-2 border-t border-white/[0.08]">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${uid}-email`}
            className="font-semibold text-neutral-200 flex items-center justify-between"
          >
            <span>آدرس جیمیل شما (جهت ثبت اپل‌آیدی)</span>
            <span className="text-[11px] text-indigo-300 font-normal">الزامی</span>
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
              className="w-full min-h-[48px] bg-black/50 border border-white/15 rounded-xl py-2.5 pl-10 pr-3.5 text-white font-semibold outline-none focus:border-indigo-400 transition-colors text-left placeholder:text-neutral-500 placeholder:text-xs"
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${uid}-fullname`} className="font-medium text-neutral-300">
              نام و نام خانوادگی
            </label>
            <input
              id={`${uid}-fullname`}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: دانیال کمالی"
              className="w-full min-h-[46px] bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-white outline-none focus:border-indigo-400 placeholder:text-neutral-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${uid}-phone`}
              className="font-medium text-neutral-300 flex items-center justify-between"
            >
              <span>شماره تماس</span>
              <span className="text-[11px] text-indigo-300 font-normal">الزامی</span>
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
              className="w-full min-h-[46px] bg-black/50 border border-white/15 rounded-xl py-2.5 px-3.5 text-white font-semibold tabular-nums outline-none focus:border-indigo-400 text-left placeholder:text-neutral-500"
            />
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
          <button
            type="submit"
            className="min-h-[48px] flex-1 py-3 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:scale-[0.98] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>ثبت سفارش در تلگرام</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMessage}
            className="min-h-[48px] sm:w-auto py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.11] text-neutral-200 hover:text-white font-semibold text-xs transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer touch-manipulation whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "کپی شد" : "کپی متن سفارش"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

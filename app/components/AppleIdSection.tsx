"use client";

import React, { useState } from "react";
import config from "../../config.json";

interface AppleIdSectionProps {
  lalezarClassName?: string;
}

// Convert Persian/Arabic digits to ASCII
function toAsciiDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1776 + 48))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48));
}

const AppleLogoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.78-8.8-10.3-18.79-13.56-29.98-3.26-11.19-4.89-22.14-4.89-32.84 0-14.35 3.84-26.31 11.51-35.88 7.67-9.57 17.15-14.48 28.43-14.73 4.35 0 9.28 1.16 14.79 3.48 5.51 2.32 9.09 3.54 10.74 3.66 1.88 0 5.68-1.28 11.4-3.83 5.72-2.55 10.81-3.76 15.28-3.63 11.08.38 20.31 4.34 27.67 11.89 7.36 7.55 12.01 16.89 13.97 28.02-9.92 5.98-14.76 14.35-14.53 25.1.23 9.46 3.96 17.39 11.19 23.79 3.59 3.16 7.6 5.62 12.03 7.38-2.61 7.63-5.7 15.02-9.27 22.18zM119.22 31.84c0-7.38 2.65-14.18 7.95-20.4 5.3-6.23 11.83-10.15 19.59-11.77.23 1.05.35 2.12.35 3.21 0 7.38-2.73 14.36-8.2 20.93-5.46 6.57-12.05 10.36-19.78 11.38-.11-1.12-.17-2.24-.17-3.35z" />
  </svg>
);

export default function AppleIdSection({ lalezarClassName = "" }: AppleIdSectionProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cleanPhone = toAsciiDigits(phone).trim().replace(/\D/g, "");
  const cleanEmail = email.trim();

  // Validate and generate Telegram URL with pre-filled message
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
📧 جیمیل شخصی: ${cleanEmail}
👤 نام و نام خانوادگی: ${fullName.trim() || "ثبت نشده"}
📞 شماره تماس: ${cleanPhone}
⚡ ریجن درخواستی: آمریکا (US)
━━━━━━━━━━━━━━━━━━━━
📍 ثبت شده از وب‌سایت دانیفون`;

    const telegramUrl = `${config.appleId?.telegramUrl || config.registry?.telegramUrl}?text=${encodeURIComponent(messageText)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyMessage = () => {
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("لطفاً ابتدا جیمیل خود را وارد کنید.");
      return;
    }

    const messageText = `سلام وقت بخیر، درخواست سفارش اپل آیدی اختصاصی دارم.
📧 جیمیل: ${cleanEmail}
👤 نام: ${fullName.trim() || "ثبت نشده"}
📞 شماره تماس: ${cleanPhone || "ثبت نشده"}`;

    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeInSlide" dir="rtl">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
            <AppleLogoIcon className="w-4.5 h-4.5 fill-current text-indigo-300" />
          </div>
          <div className="flex flex-col">
            <h3 className={`text-base font-black text-white ${lalezarClassName}`}>
              سفارش اپل‌آیدی اختصاصی و قانونی
            </h3>
            <span className="text-[10px] text-neutral-300">
              ثبت مستقیم روی جیمیل شخصی شما با امنیت 100%
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
          تحویل زیر 30 دقیقه
        </span>
      </div>

      {/* Feature Highlights Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/30 border border-white/10 rounded-[18px] p-2.5 flex items-start gap-2">
          <span className="text-base shrink-0">🔒</span>
          <div className="flex flex-col">
            <strong className="text-[11px] text-white font-bold">ایمیل 100% شخصی</strong>
            <span className="text-[9.5px] text-neutral-400 leading-tight">بدون خطر دیسیبل شدن</span>
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-[18px] p-2.5 flex items-start gap-2">
          <span className="text-base shrink-0">🇺🇸</span>
          <div className="flex flex-col">
            <strong className="text-[11px] text-white font-bold">ریجن معتبر آمریکا</strong>
            <span className="text-[9.5px] text-neutral-400 leading-tight">دسترسی کامل به اپ‌استور</span>
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-[18px] p-2.5 flex items-start gap-2">
          <span className="text-base shrink-0">⚡</span>
          <div className="flex flex-col">
            <strong className="text-[11px] text-white font-bold">تحویل سریع</strong>
            <span className="text-[9.5px] text-neutral-400 leading-tight">زیر 30 دقیقه کاری</span>
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-[18px] p-2.5 flex items-start gap-2">
          <span className="text-base shrink-0">🛡</span>
          <div className="flex flex-col">
            <strong className="text-[11px] text-white font-bold">بدون شماره مجازی</strong>
            <span className="text-[9.5px] text-neutral-400 leading-tight">دائمی با سوالات امنیتی</span>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <form onSubmit={handleOrder} className="flex flex-col gap-3 text-xs">
        {/* Gmail Input */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-neutral-200 flex items-center justify-between">
            <span>1. آدرس جیمیل شما (جهت ثبت اپل آیدی):</span>
            <span className="text-[10px] text-indigo-300 font-normal">الزامی</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full bg-black/40 border border-white/20 rounded-[16px] py-2.5 px-3.5 text-white font-semibold outline-none focus:border-indigo-400 transition-colors dir-ltr text-left placeholder:text-neutral-500 placeholder:text-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              ✉️
            </span>
          </div>
        </div>

        {/* Full Name & Phone in 2 columns */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-neutral-300 text-[11px]">
              2. نام و نام خانوادگی:
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: دانیال کمالی"
              className="w-full bg-black/40 border border-white/20 rounded-[14px] py-2 px-3 text-white outline-none focus:border-indigo-400 text-xs placeholder:text-neutral-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-neutral-300 text-[11px] flex justify-between">
              <span>3. شماره تماس:</span>
              <span className="text-[9px] text-indigo-300">الزامی</span>
            </label>
            <input
              type="tel"
              inputMode="numeric"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09121234567"
              className="w-full bg-black/40 border border-white/20 rounded-[14px] py-2 px-3 text-white font-bold outline-none focus:border-indigo-400 text-xs dir-ltr text-left placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-[11px] text-rose-200 leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            type="submit"
            className={`w-full py-3.5 px-4 rounded-[18px] bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] text-white font-bold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation ${lalezarClassName}`}
          >
            <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.415-1.21.258-1.91.176-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            <span>ثبت سفارش اپل آیدی در تلگرام</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMessage}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-neutral-300 hover:text-white font-medium text-[11px] transition-colors border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{copied ? "✅ متن کپی شد" : "📋 کپی متن پیام سفارش"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

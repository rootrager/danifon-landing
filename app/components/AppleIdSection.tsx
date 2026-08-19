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
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 text-lg shadow-[0_0_12px_rgba(99,102,241,0.3)]">
            
          </div>
          <div className="flex flex-col">
            <h3 className={`text-base font-black text-white ${lalezarClassName}`}>
              سفارش اپل‌آیدی اختصاصی و قانونی
            </h3>
            <span className="text-[10px] text-neutral-300">
              ثبت مستقیم روی جیمیل شخصی شما با امنیت ۱۰۰٪
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
          تحویل زیر ۳۰ دقیقه
        </span>
      </div>

      {/* Feature Highlights Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/30 border border-white/10 rounded-[18px] p-2.5 flex items-start gap-2">
          <span className="text-base shrink-0">🔒</span>
          <div className="flex flex-col">
            <strong className="text-[11px] text-white font-bold">ایمیل ۱۰۰٪ شخصی</strong>
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
            <span className="text-[9.5px] text-neutral-400 leading-tight">زیر ۳۰ دقیقه کاری</span>
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
            <span>۱. آدرس جیمیل شما (جهت ثبت اپل آیدی):</span>
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
              ۲. نام و نام خانوادگی:
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
              <span>۳. شماره تماس:</span>
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

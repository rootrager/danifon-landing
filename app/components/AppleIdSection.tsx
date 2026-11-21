"use client";

import React, { useState, useId } from "react";
import {
  KeyRound,
  Lock,
  Globe,
  Zap,
  ShieldCheck,
  Mail,
  Send,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
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
  const [preparedMessage, setPreparedMessage] = useState<string | null>(null);

  const cleanPhone = toAsciiDigits(phone).trim().replace(/\D/g, "");
  const cleanEmail = email.trim();

  const buildOrderMessage = () => `سلام وقت بخیر، درخواست سفارش اپل آیدی اختصاصی دارم.
━━━━━━━━━━━━━━━━━━━━
جیمیل شخصی: ${cleanEmail}
نام و نام خانوادگی: ${fullName.trim() || "ثبت نشده"}
شماره تماس: ${cleanPhone || "ثبت نشده"}
ریجن درخواستی: آمریکا (US)
━━━━━━━━━━━━━━━━━━━━
ثبت شده از وب‌سایت دانیفون`;

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
    setPreparedMessage(buildOrderMessage());
  };

  const handleCopyMessage = (customText?: string) => {
    const textToCopy = customText ?? (cleanEmail && cleanEmail.includes("@") ? buildOrderMessage() : "");
    if (!textToCopy) {
      setErrorMsg("لطفاً ابتدا جیمیل خود را وارد کنید.");
      return;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const telegramUrl = preparedMessage
    ? `${config.appleId?.telegramUrl || config.contact.telegramExpertUrl}?text=${encodeURIComponent(preparedMessage)}`
    : config.appleId?.telegramUrl || config.contact.telegramExpertUrl;

  const whatsappUrl = preparedMessage
    ? `${config.contact.whatsappUrl}?text=${encodeURIComponent(preparedMessage)}`
    : config.contact.whatsappUrl;

  return (
    <div className="w-full flex flex-col gap-5 animate-fadeIn" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-blue-100 dark:border-blue-400/15">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
            <KeyRound className="w-5 h-5" strokeWidth={1.9} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className={`text-xl font-normal text-[#0a1628] dark:text-white truncate ${lalezarClassName}`}>
              سفارش اپل‌آیدی اختصاصی
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
              ساخت قانونی روی ایمیل شخصی خودتان، بدون خطر قفل شدن
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0">
          تحویل زیر ۳۰ دقیقه
        </span>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 py-1">
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-[#0a1628] dark:text-white font-semibold">ایمیل ۱۰۰٪ شخصی</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">ثبت مستقیم به نام خودتان، بدون خطر مسدودی</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-[#0a1628] dark:text-white font-semibold">کشور معتبر آمریکا</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">دسترسی کامل به تمام برنامه‌های اپ‌استور</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-[#0a1628] dark:text-white font-semibold">تحویل سریع</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">آماده‌سازی در کمتر از ۳۰ دقیقه کاری</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" strokeWidth={1.9} />
          <div className="flex flex-col">
            <strong className="text-sm text-[#0a1628] dark:text-white font-semibold">بدون شماره مجازی</strong>
            <span className="text-xs text-slate-600 dark:text-slate-400">دائمی همراه با رمز و سوالات امنیتی اختصاصی</span>
          </div>
        </div>
      </div>

      {preparedMessage ? (
        <div className="flex flex-col items-center text-center py-6 px-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-500/35 gap-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 flex items-center justify-center text-blue-700 dark:text-blue-300">
            <KeyRound className="w-5 h-5" strokeWidth={1.9} />
          </div>
          <div className="space-y-1">
            <h4 className={`text-xl text-[#0a1628] dark:text-white ${lalezarClassName}`}>
              سفارش اپل‌آیدی شما آماده ارسال است
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
              از طریق تلگرام یا واتساپ پیام آماده را برای کارشناس دانیفون ارسال کنید تا اپل‌آیدی شما در کمتر از ۳۰ دقیقه ساخته شود.
            </p>
          </div>

          <div className="w-full max-w-sm border-t border-blue-200/70 dark:border-blue-400/15 pt-3 text-sm text-slate-700 dark:text-slate-300 space-y-1.5 text-right">
            <div className="flex justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400">جیمیل شخصی:</span>
              <span className="font-semibold text-[#0a1628] dark:text-white truncate" dir="ltr">
                {cleanEmail}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400">شماره تماس:</span>
              <span className="font-semibold text-[#0a1628] dark:text-white tabular-nums" dir="ltr">
                {cleanPhone}
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm flex flex-col gap-2.5">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 active:scale-[0.98] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>ارسال سفارش در تلگرام</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.98] text-white dark:text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>ارسال سفارش در واتساپ</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopyMessage(preparedMessage)}
              className="min-h-[44px] w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#11192e] hover:bg-blue-50 dark:hover:bg-[#182442] text-[#0a1628] dark:text-slate-100 text-sm font-semibold transition-colors border border-blue-200 dark:border-blue-400/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "متن سفارش کپی شد" : "کپی متن سفارش"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPreparedMessage(null);
                setCopied(false);
              }}
              className="mt-1 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#0a1628] dark:hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازگشت و ویرایش اطلاعات</span>
            </button>
          </div>
        </div>
      ) : (
        /* Order Form */
        <form onSubmit={handleOrder} className="flex flex-col gap-4 text-sm pt-3 border-t border-blue-100 dark:border-blue-400/15">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${uid}-email`}
              className="font-semibold text-[#0a1628] dark:text-slate-200 flex items-center justify-between"
            >
              <span>آدرس جیمیل شما (جهت ثبت اپل‌آیدی)</span>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">الزامی</span>
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
                className="w-full min-h-[48px] bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 pl-10 pr-3.5 text-[#0a1628] dark:text-white font-semibold outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors text-left placeholder:text-slate-400 placeholder:text-sm"
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
                className="w-full min-h-[48px] bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 px-3.5 text-[#0a1628] dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-400 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${uid}-phone`}
                className="font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <span>شماره تماس</span>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">الزامی</span>
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
                className="w-full min-h-[48px] bg-blue-50/40 dark:bg-[#060913] border border-blue-200 dark:border-blue-400/20 rounded-xl py-2.5 px-3.5 text-[#0a1628] dark:text-white font-semibold tabular-nums outline-none focus:border-blue-600 dark:focus:border-blue-400 text-left placeholder:text-slate-400"
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
              className="min-h-[52px] flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 active:scale-[0.98] text-white font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation shadow-[0_6px_20px_rgba(11,99,246,0.20)]"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>آماده‌سازی و ارسال سفارش</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopyMessage()}
              className="min-h-[52px] sm:w-auto py-3 px-5 rounded-xl bg-blue-50/70 dark:bg-[#11192e] hover:bg-blue-100/80 dark:hover:bg-[#182442] text-[#0a1628] dark:text-slate-100 font-semibold text-sm transition-colors border border-blue-200 dark:border-blue-400/20 flex items-center justify-center gap-2 cursor-pointer touch-manipulation whitespace-nowrap"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "کپی شد" : "کپی متن سفارش"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

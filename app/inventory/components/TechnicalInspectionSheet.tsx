"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Check, ShieldCheck, Send, MessageCircle, PhoneCall, Smartphone } from "lucide-react";
import type { InventoryItem } from "../page";
import config from "../../../config.json";
import {
  parseModelAndColor,
  getColorMeta,
  getPartCountry,
  getActivationMeta,
  getRegistryMeta,
  formatPrice,
} from "./inventoryHelpers";

export default function TechnicalInspectionSheet({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const { formatted: priceFormatted, millionHelper } = formatPrice(item.price);
  const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
  const colorMeta = getColorMeta(extractedColor, modelName);
  const partInfo = getPartCountry(item);
  const actMeta = getActivationMeta(item.condition);
  const regMeta = getRegistryMeta(item.registry);

  const prefilledMessage = `سلام دانیفون، درخواست بررسی و رزرو فوری این دستگاه از انبار را دارم:
━━━━━━━━━━━━━━━━━━━━
مدل: ${modelName}
ظرفیت: ${item.capacity ?? "مشخص نشده"}
رنگ: ${colorMeta.shortName}
وضعیت: ${actMeta.label}
پارت‌نامبر: ${partInfo.label} (${item.sim ?? "دو سیم‌کارت"})
رجیستری: ${regMeta.shortLabel}
قیمت درج‌شده: ${priceFormatted}
━━━━━━━━━━━━━━━━━━━━
کد انبار: #${item.item_id}`;

  const encodedMsg = encodeURIComponent(prefilledMessage);
  const tgUrl = `${config.contact.telegramExpertUrl}?text=${encodedMsg}`;
  const waUrl = `${config.contact.whatsappUrl}?text=${encodedMsg}`;
  const callUrl = config.contact.phoneUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-sheet-title"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-sm"
      />

      {/* Bottom Sheet on Mobile -> Split Quick-View Modal on Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 36 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full md:max-w-3xl bg-white dark:bg-[#12141a] border-t md:border border-slate-200 dark:border-white/15 rounded-t-[28px] md:rounded-[28px] shadow-2xl max-h-[90dvh] overflow-y-auto no-scrollbar"
      >
        <div className="p-5 pb-sheet-safe md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-stretch">
          {/* Mobile Pull Handle */}
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-white/20 mx-auto shrink-0 md:hidden" />

          {/* Desktop Large 3:4 Studio Gallery Column */}
          <div className="hidden md:flex md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/12 bg-slate-100 dark:bg-neutral-950 items-center justify-center min-h-[340px]">
            {!imgError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={colorMeta.imageSrc}
                alt={`${modelName} - ${colorMeta.shortName}`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <Smartphone className="w-10 h-10 text-slate-400" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-between text-xs">
              <span className="font-bold text-white">{colorMeta.shortName}</span>
              <span className="font-mono text-slate-200">#{item.item_id}</span>
            </div>
          </div>

          {/* Purchase & Plain-Language Specs Module */}
          <div className="md:col-span-7 flex flex-col justify-between gap-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08] gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Mobile-only thumbnail */}
                <div className="md:hidden relative w-20 h-[106px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-neutral-950 shrink-0 flex items-center justify-center">
                  {!imgError ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={colorMeta.imageSrc}
                      alt={`${modelName} - ${colorMeta.shortName}`}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Smartphone className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={actMeta.isNotActive ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-sky-700 dark:text-sky-300 font-semibold"}>
                      {actMeta.shortLabel}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                    <span className={regMeta.isRegistered ? "text-amber-700 dark:text-amber-300 font-semibold" : "text-slate-600 dark:text-slate-400"}>
                      {regMeta.shortLabel}
                    </span>
                  </div>

                  <h3 id="inspection-sheet-title" className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight truncate" dir="ltr">
                    {modelName}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className="font-mono font-bold tabular-nums">{item.capacity}</span>
                    <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                    <span className="font-medium">{colorMeta.shortName}</span>
                  </div>

                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {partInfo.flag} {partInfo.plainSummary}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-w-[42px] min-h-[42px] rounded-full bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.16] flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0 touch-manipulation"
                aria-label="بستن پنجره مشخصات"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Plain-Language Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm border-b border-slate-200 dark:border-white/[0.08] pb-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">وضعیت دستگاه</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {actMeta.plainSummary}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">پارت‌نامبر و سیم‌کارت</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {partInfo.flag} {partInfo.code} · {partInfo.plainSummary}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">وضعیت رجیستری</span>
                <span className={`font-semibold ${regMeta.isRegistered ? "text-amber-700 dark:text-amber-300" : "text-slate-700 dark:text-slate-300"}`}>
                  {regMeta.plainLabel}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">ضمانت فروشگاه</span>
                <span className="font-semibold text-slate-900 dark:text-white inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>۱۰ روز مهلت تست کتبی</span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                اصالت و پلمپ بودن دستگاه در فاکتور رسمی قید می‌شود · تحویل حضوری یا ارسال فوری در تهران
              </span>
            </div>

            {/* Price Box */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
              <div className="flex flex-col">
                <span className="text-xs text-slate-600 dark:text-slate-400">قیمت نقدی امروز</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {priceFormatted}
                </span>
                {millionHelper && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    {millionHelper}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                موجود · آماده تحویل
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={tgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[50px] py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 active:scale-[0.98] text-white dark:text-slate-950 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>رزرو در تلگرام</span>
                </a>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[50px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-[0.98] text-white dark:text-slate-950 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>رزرو در واتساپ</span>
                </a>
              </div>

              <a
                href={callUrl}
                className="min-h-[48px] py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 touch-manipulation"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="tabular-nums">تماس مستقیم با فروشگاه ({config.contact.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

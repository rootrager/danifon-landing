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

  const { formatted: priceFormatted } = formatPrice(item.price);
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
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Bottom Sheet on Mobile -> Split Quick-View Modal on Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 36 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full md:max-w-3xl bg-neutral-900/95 backdrop-blur-2xl border-t md:border border-white/15 rounded-t-[28px] md:rounded-[28px] shadow-[0_-16px_48px_rgba(0,0,0,0.8)] max-h-[90dvh] overflow-y-auto no-scrollbar"
      >
        <div className="p-5 pb-sheet-safe md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-stretch">
          {/* Mobile Pull Handle */}
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto shrink-0 md:hidden" />

          {/* Desktop Large 3:4 Studio Gallery Column */}
          <div className="hidden md:flex md:col-span-5 relative rounded-2xl overflow-hidden border border-white/12 bg-neutral-950 items-center justify-center min-h-[340px]">
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
              <Smartphone className="w-10 h-10 text-neutral-600" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-between text-xs">
              <span className="font-bold text-white">{colorMeta.shortName}</span>
              <span className="font-mono text-neutral-300">#{item.item_id}</span>
            </div>
          </div>

          {/* Purchase & Specs Module */}
          <div className="md:col-span-7 flex flex-col justify-between gap-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Mobile-only thumbnail */}
                <div className="md:hidden relative w-20 h-[106px] rounded-2xl overflow-hidden border border-white/15 bg-neutral-950 shrink-0 flex items-center justify-center">
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
                    <Smartphone className="w-7 h-7 text-neutral-500" />
                  )}
                </div>

                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={actMeta.isNotActive ? "text-emerald-300 font-semibold" : "text-sky-300 font-semibold"}>
                      {actMeta.shortLabel}
                    </span>
                    <span className="text-neutral-600" aria-hidden="true">·</span>
                    <span className={regMeta.isRegistered ? "text-amber-300 font-semibold" : "text-neutral-400"}>
                      {regMeta.shortLabel}
                    </span>
                  </div>

                  <h3 id="inspection-sheet-title" className="text-lg sm:text-xl font-extrabold text-white leading-tight truncate" dir="ltr">
                    {modelName}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-neutral-200">
                    <span className="font-mono font-bold tabular-nums">{item.capacity}</span>
                    <span className="text-neutral-600" aria-hidden="true">·</span>
                    <span className="font-medium">{colorMeta.shortName}</span>
                  </div>

                  <span className="text-[11px] text-neutral-400">
                    {partInfo.flag} {partInfo.label}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-w-[40px] min-h-[40px] rounded-full bg-white/[0.08] hover:bg-white/[0.16] flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0 touch-manipulation"
                aria-label="بستن پنجره مشخصات"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Technical Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs border-b border-white/[0.08] pb-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-neutral-400">وضعیت پلمپ و اکتیو</span>
                <span className="font-semibold text-emerald-300">{actMeta.shortLabel} شرکتی</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-neutral-400">پارت‌نامبر</span>
                <span className="font-semibold text-white text-right" dir="ltr">
                  {partInfo.flag} {partInfo.code}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-neutral-400">وضعیت رجیستری</span>
                <span className={`font-semibold ${regMeta.isRegistered ? "text-amber-300" : "text-neutral-300"}`}>
                  {regMeta.shortLabel}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-neutral-400">ضمانت و اصالت</span>
                <span className="font-semibold text-white inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>۱۰ روز مهلت تست کتبی</span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-emerald-200/90 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                پلمپ اصلی شرکت اپل · تحویل فوری حضوری در فروشگاه دانیفون یا ارسال با پیک ویژه تهران
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex flex-col">
                <span className="text-[11px] text-neutral-400">قیمت نقدی روز</span>
                <span className="text-xl font-extrabold text-white tabular-nums mt-0.5">{priceFormatted}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-300">موجود · آماده تحویل</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={tgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>رزرو در تلگرام</span>
                </a>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-neutral-950 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>رزرو در واتساپ</span>
                </a>
              </div>

              <a
                href={callUrl}
                className="min-h-[46px] py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-neutral-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 touch-manipulation"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span className="tabular-nums">تماس مستقیم با فروشگاه ({config.contact.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

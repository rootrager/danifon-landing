"use client";

import React, { useState } from "react";
import { ArrowLeft, Smartphone } from "lucide-react";
import type { InventoryItem } from "../page";
import {
  parseModelAndColor,
  getColorMeta,
  getPartCountry,
  getActivationMeta,
  getRegistryMeta,
  formatPrice,
} from "./inventoryHelpers";

export default function InventoryCard({
  item,
  onInspect,
  variant = "row",
}: {
  item: InventoryItem;
  onInspect: (item: InventoryItem) => void;
  variant?: "row" | "card";
}) {
  const [imgError, setImgError] = useState(false);
  const { numOnly, millionHelper, isContact } = formatPrice(item.price);
  const { modelName, extractedColor } = parseModelAndColor(item.model, item.color);
  const colorMeta = getColorMeta(extractedColor, modelName);
  const partInfo = getPartCountry(item);
  const actMeta = getActivationMeta(item.condition);
  const regMeta = getRegistryMeta(item.registry);

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={() => onInspect(item)}
        className="group flex flex-col rounded-2xl bg-white dark:bg-[#0e1526] hover:bg-blue-50/40 dark:hover:bg-[#131d35] border border-blue-100 dark:border-blue-400/15 hover:border-blue-500 dark:hover:border-blue-400/60 hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-150 cursor-pointer text-right overflow-hidden touch-manipulation"
      >
        {/* Studio Product Image Showcase */}
        <div className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-[#060913] border-b border-blue-100/80 dark:border-blue-400/10 overflow-hidden flex items-center justify-center">
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={colorMeta.imageSrc}
              alt={`${modelName} - ${colorMeta.shortName}`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Smartphone className="w-9 h-9 text-slate-400 dark:text-slate-600" />
          )}
        </div>

        {/* Clean Plain-Language Metadata & Price */}
        <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full border border-black/15 dark:border-white/30 shrink-0"
                  style={{ backgroundColor: colorMeta.hex }}
                  aria-hidden="true"
                />
                <span className="text-base font-bold text-[#0a1628] dark:text-white truncate">
                  {colorMeta.compactName}
                </span>
              </div>
              {item.capacity && (
                <span className="text-sm font-mono font-bold text-[#0a1628] dark:text-slate-200 tabular-nums shrink-0">
                  {item.capacity}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span className={actMeta.isNotActive ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-blue-700 dark:text-blue-300 font-semibold"}>
                {actMeta.isNotActive ? "پلمپ کارخانه" : "پلمپ اکتیو"}
              </span>
              <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
              <span>{partInfo.plainSummary}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className={regMeta.isRegistered ? "text-amber-700 dark:text-amber-300 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                {regMeta.plainLabel}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                {partInfo.flag} {partInfo.code}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-100/80 dark:border-blue-400/12 flex items-end justify-between gap-2">
            {isContact ? (
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300">استعلام قیمت</span>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-extrabold text-[#0a1628] dark:text-white tabular-nums tracking-tight">
                    {numOnly}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">تومان</span>
                </div>
                {millionHelper && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                    {millionHelper}
                  </span>
                )}
              </div>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 whitespace-nowrap pb-0.5">
              <span>بررسی و رزرو</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onInspect(item)}
      className="w-full min-h-[84px] group flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0e1526] hover:bg-blue-50/40 dark:hover:bg-[#131d35] border border-blue-100 dark:border-blue-400/15 hover:border-blue-500 active:scale-[0.985] transition-all duration-150 cursor-pointer text-right touch-manipulation"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-16 h-[80px] rounded-xl overflow-hidden border border-blue-100 dark:border-blue-400/20 bg-slate-50 dark:bg-[#060913] shrink-0 flex items-center justify-center">
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={colorMeta.imageSrc}
              alt={`${modelName} - ${colorMeta.shortName}`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <Smartphone className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border border-black/15 dark:border-white/30 shrink-0"
              style={{ backgroundColor: colorMeta.hex }}
              aria-hidden="true"
            />
            <span className="text-sm font-bold text-[#0a1628] dark:text-white truncate">
              {colorMeta.compactName}
            </span>
            {item.capacity && (
              <>
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                <span className="text-xs font-bold text-[#0a1628] dark:text-slate-200 font-mono tabular-nums whitespace-nowrap">
                  {item.capacity}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 truncate">
            <span className={actMeta.isNotActive ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-blue-700 dark:text-blue-300 font-semibold"}>
              {actMeta.isNotActive ? "پلمپ کارخانه" : "پلمپ اکتیو"}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium truncate" dir="ltr">
              {partInfo.flag} {partInfo.code}
            </span>
          </div>

          <div className="text-xs truncate">
            <span className={regMeta.isRegistered ? "text-amber-700 dark:text-amber-300 font-semibold" : "text-slate-500 dark:text-slate-400"}>
              {regMeta.shortLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-1 shrink-0 pl-0.5">
        {isContact ? (
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">استعلام قیمت</span>
        ) : (
          <div className="flex flex-col items-end">
            <span className="text-sm font-extrabold text-[#0a1628] dark:text-white tabular-nums tracking-tight leading-none">
              {numOnly}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {millionHelper || "تومان"}
            </span>
          </div>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap mt-0.5">
          <span>جزئیات</span>
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        </span>
      </div>
    </button>
  );
}

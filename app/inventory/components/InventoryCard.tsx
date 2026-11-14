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
  const { numOnly, isContact } = formatPrice(item.price);
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
        className="group flex flex-col rounded-2xl bg-white/[0.035] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.20] hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-150 cursor-pointer text-right overflow-hidden touch-manipulation"
      >
        {/* Studio Product Image Showcase (3:4 Neutral Backdrop) */}
        <div className="relative w-full aspect-[4/3] bg-neutral-900/90 border-b border-white/[0.06] overflow-hidden flex items-center justify-center">
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
            <Smartphone className="w-8 h-8 text-neutral-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] font-semibold">
            <span className={actMeta.isNotActive ? "text-emerald-300" : "text-sky-300"}>
              {actMeta.shortLabel}
            </span>
            <span className="text-neutral-200 font-mono" dir="ltr">
              {partInfo.flag} {partInfo.code}
            </span>
          </div>
        </div>

        {/* Clean Metadata & Price */}
        <div className="p-3.5 flex flex-col gap-2.5 flex-1 justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                  style={{ backgroundColor: colorMeta.hex }}
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-white truncate">{colorMeta.compactName}</span>
              </div>
              {item.capacity && (
                <span className="text-xs font-mono font-bold text-neutral-200 tabular-nums shrink-0">
                  {item.capacity}
                </span>
              )}
            </div>

            <span className={`text-[11px] ${regMeta.isRegistered ? "text-amber-300 font-medium" : "text-neutral-400"}`}>
              {regMeta.shortLabel}
            </span>
          </div>

          <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
            {isContact ? (
              <span className="text-xs font-bold text-amber-300">استعلام قیمت</span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-[15px] font-extrabold text-white tabular-nums tracking-tight">
                  {numOnly}
                </span>
                <span className="text-[10px] text-neutral-400">تومان</span>
              </div>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 group-hover:text-emerald-200 whitespace-nowrap">
              <span>رزرو</span>
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
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
      className="w-full min-h-[76px] group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.035] hover:bg-white/[0.075] border border-white/[0.07] hover:border-white/[0.18] active:scale-[0.985] transition-all duration-150 cursor-pointer text-right touch-manipulation"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-14 h-[74px] rounded-xl overflow-hidden border border-white/15 bg-neutral-900 shrink-0 flex items-center justify-center">
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
            <Smartphone className="w-5 h-5 text-neutral-500" />
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
              style={{ backgroundColor: colorMeta.hex }}
              aria-hidden="true"
            />
            <span className="text-sm font-bold text-white truncate">{colorMeta.compactName}</span>
            {item.capacity && (
              <>
                <span className="text-neutral-600" aria-hidden="true">·</span>
                <span className="text-xs font-semibold text-neutral-200 font-mono tabular-nums whitespace-nowrap">
                  {item.capacity}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 whitespace-nowrap">
            <span className="text-neutral-300 font-medium" dir="ltr">
              {partInfo.flag} {partInfo.code}
            </span>
            <span aria-hidden="true">·</span>
            <span className={actMeta.isNotActive ? "text-emerald-300 font-medium" : "text-sky-300 font-medium"}>
              {actMeta.shortLabel}
            </span>
          </div>

          <div className="text-[11px]">
            <span className={regMeta.isRegistered ? "text-amber-300 font-medium" : "text-neutral-400"}>
              {regMeta.shortLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-1.5 shrink-0 pl-0.5">
        {isContact ? (
          <span className="text-xs font-bold text-amber-300">استعلام قیمت</span>
        ) : (
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-extrabold text-white tabular-nums tracking-tight leading-none">
              {numOnly}
            </span>
            <span className="text-[10px] text-neutral-400 mt-1">تومان</span>
          </div>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors whitespace-nowrap">
          <span>جزئیات و رزرو</span>
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
        </span>
      </div>
    </button>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";

export default function TopNav() {
  const pathname = usePathname();
  const isInventory = pathname?.startsWith("/inventory");

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#08080a]/75 backdrop-blur-xl sticky top-0 z-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <Link
          href="/"
          className="font-display text-2xl sm:text-[26px] tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          dir="ltr"
        >
          Danifon
        </Link>

        {/* Zone 2: 4 single-line text nav links */}
        <nav
          aria-label="ناوبری اصلی"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300"
        >
          <Link
            href="/"
            className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b ${
              !isInventory
                ? "text-white border-white/70"
                : "border-transparent hover:text-white hover:border-white/30"
            }`}
          >
            صفحه اصلی
          </Link>
          <Link
            href="/inventory"
            className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b ${
              isInventory
                ? "text-white border-emerald-400"
                : "border-transparent hover:text-white hover:border-white/30"
            }`}
          >
            موجودی آکبند
          </Link>
          <Link
            href="/?tab=waitlist#services"
            className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:text-white hover:border-white/30 transition-colors"
          >
            خدمات و محاسبه‌گر
          </Link>
          <Link
            href="/#location"
            className="whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:text-white hover:border-white/30 transition-colors"
          >
            آدرس فروشگاه
          </Link>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          {isInventory ? (
            <Link
              href="/?tab=waitlist#services"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
            >
              <span>رزرو صف VIP</span>
              <ArrowUpLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
            </Link>
          ) : (
            <Link
              href="/inventory"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
            >
              <span>موجودی انبار</span>
              <ArrowUpLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

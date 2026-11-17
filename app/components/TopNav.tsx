"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";

export default function TopNav() {
  const pathname = usePathname();
  const isInventory = pathname?.startsWith("/inventory");

  return (
    <header className="w-full border-b border-slate-200 dark:border-white/[0.10] bg-white/90 dark:bg-[#090a0d]/85 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <Link
          href="/"
          className="font-display text-2xl sm:text-[26px] tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
          dir="ltr"
        >
          Danifon
        </Link>

        {/* Zone 2: 4 single-line text nav links */}
        <nav
          aria-label="ناوبری اصلی"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <Link
            href="/"
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors border-b-2 ${
              !isInventory
                ? "text-slate-900 dark:text-white border-emerald-600 dark:border-emerald-400 font-semibold"
                : "border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30"
            }`}
          >
            صفحه اصلی
          </Link>
          <Link
            href="/inventory"
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors border-b-2 ${
              isInventory
                ? "text-slate-900 dark:text-white border-emerald-600 dark:border-emerald-400 font-semibold"
                : "border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30"
            }`}
          >
            موجودی آکبند
          </Link>
          <Link
            href="/?tab=waitlist#services"
            className="whitespace-nowrap shrink-0 py-1.5 border-b-2 border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30 transition-colors"
          >
            خدمات و محاسبه‌گر
          </Link>
          <Link
            href="/#location"
            className="whitespace-nowrap shrink-0 py-1.5 border-b-2 border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/30 transition-colors"
          >
            آدرس فروشگاه
          </Link>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          {isInventory ? (
            <Link
              href="/?tab=waitlist#services"
              className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-neutral-950 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
            >
              <span>رزرو صف VIP</span>
              <ArrowUpLeft className="w-4 h-4" strokeWidth={2.2} />
            </Link>
          ) : (
            <Link
              href="/inventory"
              className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
            >
              <span>موجودی انبار</span>
              <ArrowUpLeft className="w-4 h-4" strokeWidth={2.2} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

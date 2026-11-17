"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="تغییر حالت نمایش روز و شب"
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.10] shrink-0 ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        className={`min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap touch-manipulation ${
          theme === "light"
            ? "bg-white text-slate-900 shadow-xs border border-slate-200/70"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>حالت روز</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        className={`min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap touch-manipulation ${
          theme === "dark"
            ? "bg-[#1a1d26] text-white border border-white/15"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>حالت شب</span>
      </button>
    </div>
  );
}

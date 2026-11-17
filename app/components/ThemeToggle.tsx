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
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-blue-50/80 dark:bg-[#0b101d] border border-blue-200/80 dark:border-blue-400/20 shrink-0 ${className}`}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        className={`min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap touch-manipulation ${
          theme === "light"
            ? "bg-white text-[#0a1628] shadow-xs border border-blue-200/80"
            : "text-slate-600 dark:text-slate-400 hover:text-[#0a1628] dark:hover:text-white"
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>حالت روز</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        className={`min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap touch-manipulation ${
          theme === "dark"
            ? "bg-blue-600 text-white border border-blue-400/50"
            : "text-slate-600 dark:text-slate-400 hover:text-[#0a1628] dark:hover:text-white"
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-blue-200 shrink-0" />
        <span>حالت شب</span>
      </button>
    </div>
  );
}

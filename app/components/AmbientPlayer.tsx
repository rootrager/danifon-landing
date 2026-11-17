"use client";

import React, { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Pause, Play } from "lucide-react";

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();
  const isInventory = pathname?.startsWith("/inventory");

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.22;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/danifon-ambient.mp3"
        loop
        preload="none"
        playsInline
      />

      <aside
        aria-label="کنترل موسیقی پس‌زمینه"
        className={`fixed left-3 sm:left-5 z-30 select-none transition-transform duration-200 ${
          isInventory ? "bottom-[84px] md:bottom-5" : "bottom-4 sm:bottom-5"
        }`}
      >
        <button
          type="button"
          onClick={togglePlay}
          className={`min-h-[40px] group flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-xl transition-colors duration-200 cursor-pointer active:scale-95 shadow-sm touch-manipulation ${
            isPlaying
              ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-400 text-white"
              : "bg-white/95 dark:bg-[#0b101d]/90 border-blue-200 dark:border-blue-400/20 text-[#0a1628] dark:text-slate-100 hover:border-blue-400 dark:hover:border-blue-400/50"
          }`}
          title={isPlaying ? "توقف موزیک پس‌زمینه" : "پخش موزیک لایت"}
          aria-label={isPlaying ? "توقف موزیک پس‌زمینه" : "پخش موزیک لایت"}
          aria-pressed={isPlaying}
        >
          <span className="flex items-end gap-[2px] h-3.5 w-3.5 shrink-0 justify-center" aria-hidden="true">
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying
                  ? "bg-white animate-eq-1 h-3"
                  : "bg-blue-500 dark:bg-blue-400 h-1"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying
                  ? "bg-sky-200 animate-eq-2 h-3.5"
                  : "bg-blue-500 dark:bg-blue-400 h-1.5"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying
                  ? "bg-white animate-eq-3 h-2.5"
                  : "bg-blue-500 dark:bg-blue-400 h-1"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying
                  ? "bg-sky-200 animate-eq-4 h-3"
                  : "bg-blue-500 dark:bg-blue-400 h-1.5"
              }`}
            />
          </span>

          <span className="text-xs font-medium whitespace-nowrap">
            {isPlaying ? "در حال پخش" : "موزیک لایت"}
          </span>

          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 shrink-0 opacity-90" />
          ) : (
            <Play className="w-3.5 h-3.5 shrink-0 opacity-80" />
          )}
        </button>
      </aside>
    </>
  );
}

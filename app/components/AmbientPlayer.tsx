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
      {/* Load audio on demand (preload="none") to save 6.8MB on initial page load */}
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
          className={`min-h-[40px] group flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-xl transition-colors duration-200 cursor-pointer active:scale-95 shadow-lg touch-manipulation ${
            isPlaying
              ? "bg-neutral-900/90 border-white/25 text-white"
              : "bg-neutral-950/75 border-white/12 text-neutral-300 hover:text-white hover:border-white/25"
          }`}
          title={isPlaying ? "توقف موزیک پس‌زمینه" : "پخش موزیک لایت"}
          aria-label={isPlaying ? "توقف موزیک پس‌زمینه" : "پخش موزیک لایت"}
          aria-pressed={isPlaying}
        >
          {/* Equalizer Bars */}
          <span className="flex items-end gap-[2px] h-3.5 w-3.5 shrink-0 justify-center" aria-hidden="true">
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying ? "bg-emerald-400 animate-eq-1 h-3" : "bg-neutral-400 h-1"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying ? "bg-emerald-300 animate-eq-2 h-3.5" : "bg-neutral-400 h-1.5"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying ? "bg-emerald-400 animate-eq-3 h-2.5" : "bg-neutral-400 h-1"
              }`}
            />
            <span
              className={`w-[2px] rounded-full transition-colors ${
                isPlaying ? "bg-emerald-200 animate-eq-4 h-3" : "bg-neutral-400 h-1.5"
              }`}
            />
          </span>

          <span className="text-[11px] font-medium whitespace-nowrap">
            {isPlaying ? "در حال پخش" : "موزیک لایت"}
          </span>

          {isPlaying ? (
            <Pause className="w-3 h-3 text-neutral-300 shrink-0" />
          ) : (
            <Play className="w-3 h-3 text-neutral-300 shrink-0" />
          )}
        </button>
      </aside>
    </>
  );
}

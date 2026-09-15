"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Target comfortable ambient lounge volume
    audio.volume = 0.22;

    // Attempt direct autoplay
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setIsInteracted(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy -> wait for first interaction
          setIsPlaying(false);
        });
    }

    const handleFirstGesture = () => {
      if (!audioRef.current || isInteracted) return;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsInteracted(true);
          cleanup();
        })
        .catch(() => {});
    };

    const cleanup = () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("click", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("scroll", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true, passive: true });

    return () => {
      cleanup();
    };
  }, [isInteracted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsInteracted(true);
        })
        .catch(() => {});
    }
  };

  return (
    <>
      {/* Hidden Global Audio Element */}
      <audio
        ref={audioRef}
        src="/danifon-ambient.mp3"
        loop
        preload="auto"
        playsInline
      />

      {/* Floating Glassmorphic Ambient Pill */}
      <aside 
        aria-label="کنترل موسیقی امبینت دانیفون"
        className="fixed bottom-20 left-3.5 sm:bottom-5 sm:left-5 z-40 select-none animate-fadeIn"
      >
        <button
          type="button"
          onClick={togglePlay}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-95 shadow-lg ${
            isPlaying
              ? "bg-black/65 border-indigo-400/35 text-white shadow-[0_4px_24px_rgba(99,102,241,0.25)] hover:bg-black/80 hover:border-indigo-400/50"
              : "bg-black/50 border-white/10 text-neutral-400 hover:text-white hover:bg-black/70 hover:border-white/20"
          }`}
          title={isPlaying ? "توقف موزیک لایت" : "پخش موزیک لایت"}
        >
          {/* Animated Equalizer Bars */}
          <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 shrink-0 justify-center">
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "bg-indigo-400 animate-eq-1 h-3"
                  : "bg-neutral-500 h-1"
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "bg-purple-400 animate-eq-2 h-3.5"
                  : "bg-neutral-500 h-1.5"
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "bg-indigo-300 animate-eq-3 h-2.5"
                  : "bg-neutral-500 h-1"
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                isPlaying
                  ? "bg-purple-300 animate-eq-4 h-3"
                  : "bg-neutral-500 h-1.5"
              }`}
            />
          </div>

          {/* Label Text */}
          <div className="flex flex-col text-right pr-0.5">
            <span className="text-[10px] font-bold tracking-tight leading-tight transition-colors">
              {isPlaying ? "موزیک لایت" : "موزیک خاموش"}
            </span>
          </div>

          {/* Minimal Play/Pause indicator icon */}
          <span className="text-[9px] opacity-70 group-hover:opacity-100 transition-opacity">
            {isPlaying ? "⏸" : "▶"}
          </span>
        </button>
      </aside>
    </>
  );
}

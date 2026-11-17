import React from "react";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full flex-1 flex flex-col">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(780px,100vw)] h-[340px] bg-gradient-to-b from-blue-500/[0.08] via-sky-400/[0.04] to-transparent dark:from-blue-600/20 dark:via-sky-500/8 blur-[110px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

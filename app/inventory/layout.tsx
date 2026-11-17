import React from "react";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full flex-1 flex flex-col">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(720px,100vw)] h-[320px] bg-gradient-to-b from-emerald-500/[0.06] via-sky-500/[0.03] to-transparent dark:from-emerald-500/10 dark:via-sky-500/5 blur-[110px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

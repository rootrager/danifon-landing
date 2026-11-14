import React from "react";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full flex-1 flex flex-col">
      {/* Subtle top titanium radial highlight exclusive to inventory catalog */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(680px,100vw)] h-[360px] bg-gradient-to-b from-emerald-500/10 via-sky-500/5 to-transparent blur-[110px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

import React from "react";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Dedicated Fullscreen Wallpaper for Inventory Page */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-10"
        style={{
          backgroundImage: "url('/inventory-bg.jpeg')",
        }}
        aria-hidden="true"
      />
      {/* Ambient dark veil for contrast & Apple glass feel */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-brightness-95 pointer-events-none -z-10"
        aria-hidden="true"
      />
      {children}
    </>
  );
}

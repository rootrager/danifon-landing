import type { Metadata, Viewport } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import "./globals.css";
import config from "../config.json";
import AmbientPlayer from "./components/AmbientPlayer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const lalezar = Lalezar({
  weight: "400",
  subsets: ["arabic", "latin"],
  variable: "--font-lalezar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Danifon - iPhone Store",
  description:
    "Danifon official mobile landing, stock inventory showcase, VIP waitlist, installment calculator, and Apple ID order system.",
  openGraph: {
    title: "Danifon - iPhone Store",
    description:
      "Danifon official mobile landing, stock inventory showcase, VIP waitlist, installment calculator, and Apple ID order system.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${lalezar.variable}`}>
      <body
        className={`${vazirmatn.className} text-white antialiased min-h-dvh bg-[#08080a] relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-white`}
        suppressHydrationWarning
      >
        {/* Single unified ambient background texture */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-45 pointer-events-none -z-20"
          style={{
            backgroundImage: `url('${config.theme.backgroundImage}')`,
          }}
          aria-hidden="true"
        />

        {/* Deep Obsidian atmospheric scrim for crisp WCAG AA legibility */}
        <div
          className="fixed inset-0 bg-gradient-to-b from-[#08080a]/75 via-[#08080a]/65 to-[#08080a]/90 pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Responsive Full-Viewport Container: mobile-first ergonomics + 1440px desktop architecture */}
        <main className="mx-auto w-full max-w-7xl min-h-dvh relative z-10 flex flex-col">
          {children}
        </main>

        {/* Global Ambient Audio Toggle (user-initiated only) */}
        <AmbientPlayer />
      </body>
    </html>
  );
}

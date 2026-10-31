import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import config from "../config.json";
import AmbientPlayer from "./components/AmbientPlayer";

const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "Danifon - iPhone Store",
  description: "Danifon official mobile landing, stock inventory showcase, VIP waitlist, installment calculator, and Apple ID order system.",
  openGraph: {
    title: "Danifon - iPhone Store",
    description: "Danifon official mobile landing, stock inventory showcase, VIP waitlist, installment calculator, and Apple ID order system.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
    <html lang="fa" dir="rtl">
      <body 
        className={`${vazirmatn.className} text-white antialiased min-h-dvh bg-neutral-950 relative overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* Fixed Background Image Layer (prevents iOS background-attachment: fixed lag & hydration warnings) */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none -z-20"
          style={{
            backgroundImage: `url('${config.theme.backgroundImage}')`,
          }}
        />

        {/* Ambient Dark Overlay to guarantee high contrast across diverse backgrounds */}
        <div className="fixed inset-0 bg-black/45 backdrop-brightness-95 pointer-events-none -z-10" />
        
        {/* Responsive mobile-first container with balanced width */}
        <main className="mx-auto w-full max-w-[460px] min-h-dvh relative shadow-2xl overflow-x-hidden z-10 flex flex-col bg-black/15">
          {children}
        </main>

        {/* Global Ambient Background Player */}
        <AmbientPlayer />
      </body>
    </html>
  );
}


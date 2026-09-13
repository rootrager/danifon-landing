import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import config from "../config.json";

const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: `${config.business.nameEn} - ${config.business.tagline}`,
  description: `Order registration and contact for ${config.business.nameEn} retail store.`,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body 
        className={`${vazirmatn.className} text-white antialiased min-h-screen bg-neutral-950 relative`}
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
        <div className="fixed inset-0 bg-black/40 backdrop-brightness-95 pointer-events-none -z-10" />
        
        {/* Responsive mobile-first container with balanced padding */}
        <main className="mx-auto max-w-md min-h-screen relative shadow-2xl overflow-hidden z-10 flex flex-col bg-black/10">
          {children}
        </main>
      </body>
    </html>
  );
}


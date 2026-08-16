import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import config from "../config.json";

const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: `${config.business.nameEn} - ${config.business.tagline}`,
  description: `Order registration and contact for ${config.business.nameEn} retail store.`,
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
        style={{
          backgroundImage: `url('${config.theme.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Ambient Dark Overlay to guarantee high contrast across diverse backgrounds */}
        <div className="fixed inset-0 bg-black/40 backdrop-brightness-95 pointer-events-none z-0" />
        
        {/* Responsive mobile-first container with balanced padding */}
        <main className="mx-auto max-w-md min-h-screen relative shadow-2xl overflow-hidden z-10 flex flex-col bg-black/10">
          {children}
        </main>
      </body>
    </html>
  );
}


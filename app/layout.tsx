import type { Metadata, Viewport } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import "./globals.css";
import AmbientPlayer from "./components/AmbientPlayer";
import { ThemeProvider } from "./components/ThemeProvider";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#090a0d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('danifon-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${lalezar.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${vazirmatn.className} bg-[#f8fafc] dark:bg-[#090a0d] text-slate-900 dark:text-slate-50 antialiased min-h-dvh relative overflow-x-hidden transition-colors duration-200 selection:bg-emerald-500/25 selection:text-emerald-950 dark:selection:text-white`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* Responsive Full-Viewport Container: mobile-first ergonomics + 1440px desktop architecture */}
          <main className="mx-auto w-full max-w-7xl min-h-dvh relative z-10 flex flex-col">
            {children}
          </main>

          {/* Global Ambient Audio Toggle (user-initiated only) */}
          <AmbientPlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}

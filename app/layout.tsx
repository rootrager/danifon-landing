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
    { media: "(prefers-color-scheme: light)", color: "#f8fbff" },
    { media: "(prefers-color-scheme: dark)", color: "#04060c" },
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
        className={`${vazirmatn.className} bg-[#f8fbff] dark:bg-[#04060c] text-[#0a1628] dark:text-slate-50 antialiased min-h-dvh relative overflow-x-hidden transition-colors duration-200 selection:bg-blue-600/20 selection:text-blue-950 dark:selection:text-white`}
        suppressHydrationWarning
      >
        {/* Luminous Cobalt Blue horizon aura (Blue+White in Day / Blue+Black in Night) */}
        <div
          className="fixed top-0 inset-x-0 h-[520px] bg-[radial-gradient(ellipse_85%_60%_at_50%_-10%,rgba(11,99,246,0.16),rgba(96,165,250,0.07)_45%,transparent_75%)] dark:bg-[radial-gradient(ellipse_85%_60%_at_50%_-10%,rgba(37,99,235,0.34),rgba(59,130,246,0.12)_48%,transparent_78%)] pointer-events-none -z-10"
          aria-hidden="true"
        />

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

import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import config from "../config.json";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${config.business.nameEn} — فروشگاه آیفون`,
  description:
    "آیفون آکبند و پلمپ با قیمت شفاف، تحویل فوری و مهلت تست در تهران.",
  openGraph: {
    title: `${config.business.nameEn} — فروشگاه آیفون`,
    description: "آیفون آکبند و پلمپ با قیمت شفاف و مهلت تست.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbfd",
  width: "device-width",
  initialScale: 1,
};

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="دانیفون">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[15px] font-black text-white">
            
          </span>
          <span className="text-[15px] font-extrabold tracking-tight">دانیفون</span>
        </Link>

        <nav className="flex items-center gap-5 text-[12.5px] font-medium text-ink-soft sm:gap-7 sm:text-[13.5px]">
          <Link href="/inventory" className="transition-colors hover:text-ink">
            موجودی
          </Link>
          <a href="/#services" className="hidden transition-colors hover:text-ink sm:inline">
            خدمات
          </a>
          <a href="/#contact" className="transition-colors hover:text-ink">
            تماس
          </a>
        </nav>

        <a
          href={config.contact.telegramChannelUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-bold text-white transition-transform active:scale-[0.97]"
        >
          تلگرام
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer id="contact" className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[15px] font-black text-white">
              
            </span>
            <span className="text-[15px] font-extrabold">دانیفون</span>
          </div>
          <p className="mt-3 max-w-xs text-[13px] leading-6 text-muted">
            فروشگاه تخصصی آیفون — آکبند، پلمپ، با مهلت تست.
          </p>
        </div>

        <div className="text-[13px] leading-7 text-ink-soft">
          <p className="mb-2 text-[12px] font-bold text-muted">دسترسی سریع</p>
          <Link href="/inventory" className="block hover:text-ink">موجودی آکبند</Link>
          <a href="/#services" className="block hover:text-ink">خدمات</a>
          <a href={config.contact.telegramChannelUrl} target="_blank" rel="noreferrer" className="block hover:text-ink">
            کانال تلگرام
          </a>
        </div>

        <div className="text-[13px] leading-7 text-ink-soft">
          <p className="mb-2 text-[12px] font-bold text-muted">تماس</p>
          <a href={config.contact.phoneUrl} className="block tnum hover:text-ink" dir="ltr">
            {config.contact.phone}
          </a>
          <p className="mt-1 max-w-[16rem] text-muted">{config.location?.addressText}</p>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-[11.5px] text-muted">
        © {new Date().getFullYear()} {config.business.nameEn}
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="min-h-screen font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

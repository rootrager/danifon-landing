"use client";

import { useState } from "react";

type Props = {
  models: string[];
  telegramUrl: string;
};

const STORAGE = ["128GB", "256GB", "512GB", "1TB"];
const CONTACT = ["تماس تلفنی", "تلگرام", "واتساپ"];

export default function VipForm({ models, telegramUrl }: Props) {
  const [model, setModel] = useState(models[0] ?? "iPhone 18 Pro Max");
  const [storage, setStorage] = useState("256GB");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState(CONTACT[0]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) {
      setError("شماره موبایل معتبر نیست.");
      setState("error");
      return;
    }
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          storage,
          phone: clean,
          name: name.trim(),
          color: "فرقی ندارد",
          condition: "آکبند (پلمپ)",
          intentLabel: "خرید فوری",
          intentPercent: 100,
          contactMethod,
          trackingCode: `DANI-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "خطا در ثبت درخواست");
      setCode(data.trackingCode ?? "");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای شبکه");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-[24px] border border-line bg-surface p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e9f7ee] text-ok">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 text-[17px] font-extrabold">ثبت شد</h3>
        <p className="mt-1.5 text-[13px] text-muted">درخواست شما در صف اولویت قرار گرفت.</p>
        {code && (
          <p className="mt-4 inline-block rounded-xl bg-canvas px-4 py-2 text-[12px] text-ink-soft">
            کد پیگیری: <span className="font-bold tnum" dir="ltr">{code}</span>
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-bold text-white"
          >
            ادامه در تلگرام
          </a>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="rounded-full border border-line px-5 py-2.5 text-[12.5px] font-bold text-ink-soft"
          >
            درخواست جدید
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[24px] border border-line bg-surface p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-semibold text-muted">مدل</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full appearance-none rounded-xl border border-line bg-surface px-3.5 py-3 text-[13px] font-medium text-ink outline-none transition-colors focus:border-ink"
          >
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-semibold text-muted">ظرفیت</span>
          <select
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            className="w-full appearance-none rounded-xl border border-line bg-surface px-3.5 py-3 text-[13px] font-medium text-ink outline-none transition-colors focus:border-ink"
          >
            {STORAGE.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-semibold text-muted">شماره موبایل</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="۰۹۱۲…"
            dir="ltr"
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-left text-[13px] font-medium tnum outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-semibold text-muted">نام (اختیاری)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام شما"
            className="w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-[13px] font-medium outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {CONTACT.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setContactMethod(c)}
            className={`rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
              contactMethod === c
                ? "border-ink bg-ink text-white"
                : "border-line text-ink-soft hover:border-ink/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {state === "error" && <p className="mt-3 text-[12px] font-medium text-[#c0392b]">{error}</p>}

      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-5 w-full rounded-xl bg-ink py-3.5 text-[13.5px] font-bold text-white transition-transform active:scale-[0.99] disabled:opacity-60"
      >
        {state === "loading" ? "در حال ثبت…" : "ثبت درخواست"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        فقط برای رزرو اولویت؛ پرداختی ندارد.
      </p>
    </form>
  );
}

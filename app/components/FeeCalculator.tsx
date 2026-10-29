"use client";

import { useMemo, useState } from "react";
import config from "../../config.json";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function FeeCalculator() {
  const [tab, setTab] = useState<"install" | "registry">("install");

  return (
    <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-7">
      <div className="mb-6 inline-flex rounded-full bg-canvas p-1">
        {[
          { id: "install" as const, label: "اقساط و چک" },
          { id: "registry" as const, label: "هزینه ریجستری" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors ${
              tab === t.id ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "install" ? <Installment /> : <Registry />}
    </div>
  );
}

function Installment() {
  const [amount, setAmount] = useState(100_000_000);
  const [months, setMonths] = useState(6);

  const { total, monthly, interest } = useMemo(() => {
    const base = amount * (1 + config.installment.baseFeeRate);
    const totalInterest = base * config.installment.monthlyInterestRate * months;
    const payback = base + totalInterest;
    return { total: payback, monthly: payback / months, interest: payback - amount };
  }, [amount, months]);

  return (
    <div className="grid gap-6 sm:grid-cols-[1.1fr_1fr]">
      <div>
        <label className="mb-1.5 block text-[11.5px] font-semibold text-muted">مبلغ چک</label>
        <div className="flex items-center rounded-xl border border-line px-3.5 focus-within:border-ink">
          <input
            value={fmt(amount)}
            onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
            inputMode="numeric"
            dir="ltr"
            className="w-full bg-transparent py-3 text-left text-[14px] font-bold tnum outline-none"
          />
          <span className="pr-2 text-[11px] text-muted">تومان</span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {[50, 100, 200, 300].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setAmount(m * 1_000_000)}
              className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition-colors hover:border-ink/30"
            >
              {m} م
            </button>
          ))}
        </div>

        <p className="mb-1.5 mt-5 text-[11.5px] font-semibold text-muted">مدت</p>
        <div className="flex flex-wrap gap-1.5">
          {config.installment.monthsOptions.map((m: number) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonths(m)}
              className={`h-9 w-9 rounded-full border text-[11.5px] font-bold tnum transition-colors ${
                months === m ? "border-ink bg-ink text-white" : "border-line text-ink-soft hover:border-ink/30"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] bg-canvas p-5">
        <p className="text-[11.5px] font-semibold text-muted">قسط ماهانه</p>
        <p className="mt-1 text-[24px] font-extrabold tracking-tight tnum">
          {fmt(Math.round(monthly))}
          <span className="mr-1 text-[11px] font-medium text-muted">تومان</span>
        </p>
        <div className="mt-4 space-y-2 border-t border-line pt-4 text-[12px]">
          <div className="flex justify-between">
            <span className="text-muted">جمع بازپرداخت</span>
            <span className="font-bold tnum">{fmt(Math.round(total))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">سود و کارمزد</span>
            <span className="font-bold tnum">{fmt(Math.round(interest))}</span>
          </div>
        </div>
        <a
          href={config.installment.telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block rounded-xl bg-ink py-2.5 text-center text-[12px] font-bold text-white"
        >
          مشاوره در تلگرام
        </a>
      </div>
    </div>
  );
}

function Registry() {
  const models = config.registry.models as { name: string; customsFee: number; passportFee: number }[];
  const [name, setName] = useState(models[0]?.name ?? "");
  const current = models.find((m) => m.name === name) ?? models[0];

  if (!current) return null;
  const total = current.customsFee + current.passportFee;

  return (
    <div className="grid gap-6 sm:grid-cols-[1.1fr_1fr]">
      <div>
        <label className="mb-1.5 block text-[11.5px] font-semibold text-muted">مدل دستگاه</label>
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full appearance-none rounded-xl border border-line bg-surface px-3.5 py-3 text-[13px] font-medium outline-none focus:border-ink"
        >
          {models.map((m) => (
            <option key={m.name} value={m.name}>{m.name}</option>
          ))}
        </select>
        <p className="mt-3 text-[11.5px] leading-6 text-muted">
          شامل عوارض گمرکی و هزینه پاسپورت. مبلغ نهایی به نرخ روز همتا بستگی دارد.
        </p>
      </div>

      <div className="rounded-[18px] bg-canvas p-5">
        <p className="text-[11.5px] font-semibold text-muted">هزینه تقریبی ریجستری</p>
        <p className="mt-1 text-[24px] font-extrabold tracking-tight tnum">
          {fmt(total)}
          <span className="mr-1 text-[11px] font-medium text-muted">تومان</span>
        </p>
        <div className="mt-4 space-y-2 border-t border-line pt-4 text-[12px]">
          <div className="flex justify-between">
            <span className="text-muted">عوارض گمرکی</span>
            <span className="font-bold tnum">{fmt(current.customsFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">پاسپورت</span>
            <span className="font-bold tnum">{fmt(current.passportFee)}</span>
          </div>
        </div>
        <a
          href={config.registry.telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block rounded-xl bg-ink py-2.5 text-center text-[12px] font-bold text-white"
        >
          استعلام دقیق
        </a>
      </div>
    </div>
  );
}

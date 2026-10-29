"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PhoneCard from "../components/PhoneCard";
import PhoneImage from "../components/PhoneImage";
import {
  formatPrice,
  isRegistered,
  splitModel,
  type InventoryItem,
} from "../lib/inventory";

type Sort = "new" | "cheap" | "expensive";

export default function InventoryClient({
  items,
  fetchedAt,
}: {
  items: InventoryItem[];
  fetchedAt: string;
}) {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("all");
  const [registry, setRegistry] = useState<"all" | "reg" | "bare">("all");
  const [sort, setSort] = useState<Sort>("new");
  const [selected, setSelected] = useState<InventoryItem | null>(null);

  const seriesList = useMemo(
    () => [...new Set(items.map((i) => i.series).filter(Boolean))].sort((a, b) => Number(b) - Number(a)),
    [items],
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = items.filter((i) => {
      if (series !== "all" && i.series !== series) return false;
      if (registry === "reg" && !isRegistered(i.registry)) return false;
      if (registry === "bare" && isRegistered(i.registry)) return false;
      if (!q) return true;
      return `${i.model} ${i.capacity} ${i.part}`.toLowerCase().includes(q);
    });
    out = [...out].sort((a, b) => {
      if (sort === "cheap") return Number(a.price) - Number(b.price);
      if (sort === "expensive") return Number(b.price) - Number(a.price);
      return Number(b.series) - Number(a.series);
    });
    return out;
  }, [items, query, series, registry, sort]);

  const updated = new Date(fetchedAt).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/" className="text-[11.5px] font-medium text-muted hover:text-ink">
            → خانه
          </Link>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-tight sm:text-[34px]">
            موجودی آکبند
          </h1>
          <p className="mt-1.5 text-[12.5px] text-muted tnum">
            {items.length} دستگاه · به‌روزرسانی {updated}
          </p>
        </div>
      </div>

      {/* toolbar */}
      <div className="sticky top-16 z-30 -mx-5 mt-6 border-b border-line bg-canvas/90 px-5 py-3 backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی مدل، ظرفیت یا پارت…"
                className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-muted/70"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="text-[11px] text-muted">
                  پاک کردن
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="appearance-none rounded-full border border-line bg-surface px-3.5 py-2.5 text-[11.5px] font-semibold outline-none"
            >
              <option value="new">جدیدترین</option>
              <option value="cheap">ارزان‌ترین</option>
              <option value="expensive">گران‌ترین</option>
            </select>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {["all", ...seriesList].map((s) => (
              <button
                key={String(s)}
                type="button"
                onClick={() => setSeries(String(s))}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  series === String(s)
                    ? "bg-ink text-white"
                    : "border border-line bg-surface text-ink-soft"
                }`}
              >
                {s === "all" ? "همه" : `سری ${s}`}
              </button>
            ))}

            <span className="mx-1 h-4 w-px shrink-0 bg-line" />

            {[
              ["all", "همه"],
              ["reg", "کددار"],
              ["bare", "بدون کد"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setRegistry(id as typeof registry)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  registry === id
                    ? "bg-ink text-white"
                    : "border border-line bg-surface text-ink-soft"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((item, i) => (
          <PhoneCard key={item.item_id} item={item} onSelect={setSelected} priority={i < 4} />
        ))}
      </div>

      {!list.length && (
        <p className="rounded-[24px] border border-line bg-surface p-12 text-center text-[13px] text-muted">
          چیزی با این فیلترها پیدا نشد.
        </p>
      )}

      {selected && <DetailSheet item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DetailSheet({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const { name, color } = splitModel(item.model);
  const price = formatPrice(item.price);
  const registered = isRegistered(item.registry);

  const specs: [string, string][] = [
    ["ظرفیت", item.capacity ?? "—"],
    ["پارت", item.part ?? "—"],
    ["سیم‌کارت", item.sim ?? "—"],
    ["ریجستری", registered ? "کددار" : "بدون کد"],
    ["وضعیت", (item.condition ?? "").startsWith("not active") ? "نات‌اکتیو" : (item.condition ?? "").startsWith("active") ? "اکتیو" : "—"],
    ["باتری", item.battery ?? "—"],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-[26px] bg-surface sm:rounded-[26px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 pb-0">
          <div>
            <h2 className="text-[16px] font-extrabold">{name}</h2>
            <p className="mt-0.5 text-[12px] text-muted">
              {color && <>{color} · </>}
              {item.capacity}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-ink-soft"
            aria-label="بستن"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mx-5 mt-4 aspect-[4/3] overflow-hidden rounded-[18px] bg-[#f4f4f7]">
          <PhoneImage item={item} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-5">
          {specs.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-[11.5px] text-muted">{k}</span>
              <span className="text-[12px] font-bold">{v}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
          <div>
            <p className="text-[10.5px] text-muted">قیمت</p>
            <p className="text-[18px] font-extrabold tnum">
              {price ?? "استعلام"}
              {price && <span className="mr-1 text-[10.5px] font-medium text-muted">تومان</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://t.me/danikamali"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-5 py-2.5 text-[12px] font-bold text-white"
            >
              سفارش
            </a>
            <a
              href="https://wa.me/989128404028"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-5 py-2.5 text-[12px] font-bold text-ink-soft"
            >
              واتساپ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import config from "../config.json";
import PhoneCard from "./components/PhoneCard";
import VipForm from "./components/VipForm";
import FeeCalculator from "./components/FeeCalculator";
import { featured, getInventory, splitModel } from "./lib/inventory";
import { photoFor } from "./lib/photos";

export const revalidate = 30;

const SectionTitle = ({ kicker, title, desc }: { kicker?: string; title: string; desc?: string }) => (
  <div className="mb-8 max-w-xl">
    {kicker && <p className="mb-2 text-[11.5px] font-bold text-muted">{kicker}</p>}
    <h2 className="text-[26px] font-extrabold tracking-tight sm:text-[32px]">{title}</h2>
    {desc && <p className="mt-2 text-[13.5px] leading-7 text-muted">{desc}</p>}
  </div>
);

export default async function HomePage() {
  const inventory = await getInventory();
  const picks = featured(inventory, 8);
  const cheapest = Math.min(...inventory.map((i) => Number(i.price) || Infinity));
  const models = [
    ...new Set(
      [...inventory]
        .sort((a, b) => Number(b.series) - Number(a.series))
        .map((i) => splitModel(i.model).name),
    ),
  ].slice(0, 12);
  const heroItem = picks[0] ?? inventory[0];

  return (
    <>
      {/* ───────────────────────── hero ───────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              <span className="text-[11px] font-semibold text-ink-soft">موجودی امروز به‌روز است</span>
            </div>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] tracking-tight sm:text-[52px]">
              آیفون آکبند،
              <br />
              با قیمت شفاف.
            </h1>

            <p className="mt-4 max-w-md text-[14px] leading-7 text-muted">
              {inventory.length} دستگاه پلمپ و نات‌اکتیو، آماده تحویل.
              بدون قیمت پنهان، با مهلت تست.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link
                href="/inventory"
                className="rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-white transition-transform active:scale-[0.98]"
              >
                دیدن موجودی
              </Link>
              <a
                href={config.contact.telegramExpertUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line bg-surface px-6 py-3 text-[13px] font-bold text-ink transition-colors hover:border-ink/25"
              >
                مشاوره در تلگرام
              </a>
            </div>

            <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
              {[
                ["موجودی", `${inventory.length} دستگاه`],
                ["شروع قیمت", cheapest && Number.isFinite(cheapest) ? `${Math.round(cheapest / 1_000_000)} م` : "—"],
                ["تحویل", "حضوری"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] text-muted">{k}</dt>
                  <dd className="mt-0.5 text-[13.5px] font-bold tnum">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise rounded-[28px] border border-line bg-surface p-2.5">
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[20px] bg-[#f4f4f7]">
              <img
                src={photoFor(heroItem) ?? "/phones/17-pro-orange.webp"}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── inventory ─────────────────────── */}
      <section id="inventory" className="mx-auto mt-16 max-w-6xl px-5 sm:mt-24">
        <div className="flex items-end justify-between gap-4">
          <SectionTitle
            kicker="موجودی"
            title="آماده‌ی تحویل"
            desc="قیمت‌ها روزانه از انبار به‌روز می‌شوند."
          />
          <Link
            href="/inventory"
            className="mb-8 shrink-0 text-[12.5px] font-bold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            همه‌ی {inventory.length} دستگاه →
          </Link>
        </div>

        {picks.length ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {picks.map((item, i) => (
              <PhoneCard key={item.item_id} item={item} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="rounded-[24px] border border-line bg-surface p-10 text-center text-[13px] text-muted">
            موجودی در حال به‌روزرسانی است.
          </p>
        )}
      </section>

      {/* ──────────────────────── services ─────────────────────── */}
      <section id="services" className="mx-auto mt-20 max-w-6xl px-5 sm:mt-28">
        <SectionTitle kicker="خدمات" title="چهار کار، ساده" />

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "صف انتظار VIP", desc: "رزرو مدل خاص با اولویت", href: "#vip", external: false },
            { title: "اقساط و چک", desc: "محاسبه‌ی قسط ماهانه", href: "#calc", external: false },
            { title: "ریجستری", desc: "هزینه‌ی گمرک و پاسپورت", href: "#calc", external: false },
            { title: "اپل‌آیدی", desc: "ساخت و تحویل فوری", href: config.appleId.telegramUrl, external: true },
          ].map((s) => {
            return (
              <a
                key={s.title}
                href={s.href}
                {...(s.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex flex-col justify-between rounded-[22px] border border-line bg-surface p-5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div>
                  <h3 className="text-[14px] font-extrabold">{s.title}</h3>
                  <p className="mt-1 text-[12px] text-muted">{s.desc}</p>
                </div>
                <span className="mt-6 text-[12px] font-bold text-ink-soft transition-transform duration-300 group-hover:-translate-x-0.5">
                  ←
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────── VIP ─────────────────────────── */}
      <section id="vip" className="mx-auto mt-20 max-w-6xl px-5 sm:mt-28">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionTitle
            kicker="صف انتظار"
            title="مدل دلخواهت را رزرو کن"
            desc="وقتی موجود شد، اول با تو تماس می‌گیریم. بدون پرداخت."
          />
          <VipForm models={models} telegramUrl={config.contact.telegramExpertUrl} />
        </div>
      </section>

      {/* ─────────────────────── calculator ────────────────────── */}
      <section id="calc" className="mx-auto mt-20 max-w-6xl px-5 sm:mt-28">
        <SectionTitle kicker="محاسبه" title="عدد را ببین، بعد تصمیم بگیر" />
        <FeeCalculator />
      </section>

      {/* ──────────────────────── contact ──────────────────────── */}
      <section id="contact" className="mx-auto mt-20 max-w-6xl px-5 sm:mt-28">
        <div className="grid gap-8 rounded-[28px] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight">حضوری هم می‌بینی</h2>
            <p className="mt-2 max-w-sm text-[13px] leading-7 text-muted">{config.location.addressText}</p>
            <p className="mt-3 text-[12px] text-muted">{config.location.laneNote}</p>

            <a
              href={config.contact.phoneUrl}
              className="mt-6 inline-block text-[18px] font-extrabold tnum"
              dir="ltr"
            >
              {config.contact.phone}
            </a>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                ["گوگل‌مپ", config.location.mapUrl],
                ["نشان", config.location.neshanUrl],
                ["بلد", config.location.baladUrl],
                ["ویز", config.location.wazeUrl],
              ].map(([label, url]) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line px-3.5 py-1.5 text-[11.5px] font-semibold text-ink-soft transition-colors hover:border-ink/25"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 self-start">
            {config.buttons
              .filter((b) => b.isActive)
              .map((b) => (
                <a
                  key={b.id}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[18px] border border-line bg-[#f7f7f9] p-4 transition-colors hover:bg-[#f1f1f5]"
                >
                  <p className="text-[12.5px] font-bold">{b.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{b.subtitle}</p>
                </a>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

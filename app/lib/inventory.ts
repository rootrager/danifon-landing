import fallback from "../data/inventory.json";
import { photoFor } from "./photos";

export type InventoryItem = {
  item_id: string;
  type: string;
  series: string | null;
  model: string | null;
  capacity: string | null;
  part: string | null;
  sim: string | null;
  registry: string | null;
  battery: string | null;
  color?: string | null;
  price: string | null;
  condition: string | null;
  photo_id: string | null;
};

const API_URL =
  process.env.INVENTORY_API_URL || "http://185.206.170.228:5354/api/inventory";
const API_KEY = process.env.INVENTORY_API_KEY || "dani2026inv";

/** Splits "iPhone 18 Pro Max (آبی)" into name + colour. */
export function splitModel(model?: string | null) {
  const raw = (model ?? "").trim();
  const m = raw.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? { name: m[1].trim(), color: m[2].trim() } : { name: raw, color: "" };
}

export const isRegistered = (registry?: string | null) =>
  !!registry && !registry.includes("بدون");

export async function getInventory(): Promise<InventoryItem[]> {
  try {
    const res = await fetch(API_URL, {
      headers: { "x-api-key": API_KEY },
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const list: InventoryItem[] = Array.isArray(data) ? data : (data.inventory ?? []);

    const cleaned = list
      .filter((i) => i.type === "new" || (i.condition ?? "").includes("آکبند"))
      .filter((i) => /\b(1[1-8]|se)\b/i.test(`${i.series ?? ""} ${i.model ?? ""}`))
      .map((i) => ({ ...i, color: i.color || splitModel(i.model).color }));

    if (cleaned.length) return cleaned;
    return fallback as InventoryItem[];
  } catch {
    return fallback as InventoryItem[];
  }
}

/** Picks a visually varied set for the home page. */
export function featured(items: InventoryItem[], n = 8) {
  const withPhoto = items.filter((i) => photoFor(i));
  const pool = withPhoto.length >= 4 ? withPhoto : items;
  const seen = new Set<string>();
  const seenColor = new Set<string>();
  const out: InventoryItem[] = [];

  const sorted = [...pool].sort((a, b) => {
    const ph = Number(!!photoFor(b)) - Number(!!photoFor(a));
    if (ph) return ph;
    return Number(b.series) - Number(a.series);
  });

  // first pass: one per model+colour, second pass fills the rest
  for (const item of sorted) {
    const key = `${item.model}|${item.capacity}`;
    const colourKey = `${item.model}|${item.color}`;
    if (seen.has(key) || seenColor.has(colourKey)) continue;
    seen.add(key);
    seenColor.add(colourKey);
    out.push(item);
    if (out.length >= n) return out;
  }
  for (const item of sorted) {
    const key = `${item.model}|${item.capacity}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length >= n) break;
  }
  return out;
}

export function formatPrice(price?: string | null) {
  if (!price) return null;
  const n = Number(String(price).replace(/\D/g, ""));
  return n ? n.toLocaleString("en-US") : null;
}

import manifest from "../data/photos.json";

const MAP = manifest as Record<string, string>;

/** Persian colour name (as stored by the bot) -> slug used in filenames */
const COLOR_SLUG: Record<string, string> = {
  "آبی": "blue",
  "مشکی": "black",
  "سفید": "white",
  "سبز": "green",
  "نارنجی": "orange",
  "بنفش": "purple",
  "صورتی": "pink",
  "نچرال تیتانیوم": "natural",
  "دیزرت تیتانیوم": "desert",
  "طلایی": "gold",
  "آلبالویی (زرشکی)": "cherry",
  "زرشکی": "cherry",
  "نقره‌ای": "silver",
};

/** Fallback tint used by the placeholder tile */
export const COLOR_HEX: Record<string, string> = {
  blue: "#5B7FA6",
  black: "#2B2B2E",
  white: "#D8D8DE",
  green: "#A9C7A2",
  orange: "#DF8A3D",
  purple: "#B5A7CB",
  pink: "#E2B6C5",
  natural: "#B8B2A7",
  desert: "#C3A883",
  gold: "#D3B382",
  cherry: "#8E3B4A",
  silver: "#C9C9CE",
};

export type PhotoItem = {
  series?: string | null;
  model?: string | null;
  color?: string | null;
  photo_id?: string | null;
};

/** "iPhone 18 Pro Max (آبی)" -> "آبی" */
export function colorFromModel(model?: string | null): string {
  const m = (model ?? "").match(/\((.*)\)\s*$/);
  return m ? m[1].trim() : "";
}

export function colorSlug(color: string): string {
  if (COLOR_SLUG[color]) return COLOR_SLUG[color];
  const hit = Object.keys(COLOR_SLUG).find((k) => color.includes(k));
  return hit ? COLOR_SLUG[hit] : "silver";
}

function variantOf(model: string): string {
  if (/pro\s*max/i.test(model)) return "pro-max";
  if (/pro/i.test(model)) return "pro";
  if (/\bse\b/i.test(model)) return "se";
  return "base";
}

/**
 * Resolves the product photo.
 * 1. explicit photo_id coming from the inventory API (future-proof)
 * 2. generated manifest keyed by series|variant|colour
 * 3. null -> caller renders a neutral placeholder
 */
export function photoFor(item: PhotoItem): string | null {
  const id = (item.photo_id ?? "").trim();
  if (id) return id.startsWith("http") || id.startsWith("/") ? id : `/phones/${id}`;

  const series = String(item.series ?? "").trim();
  const model = item.model ?? "";
  const color = item.color?.trim() || colorFromModel(model);
  if (!series || !color) return null;

  const key = `${series}|${variantOf(model)}|${colorSlug(color)}`;
  return MAP[key] ?? null;
}

export function placeholderTint(item: PhotoItem): string {
  const color = item.color?.trim() || colorFromModel(item.model ?? "");
  return COLOR_HEX[colorSlug(color)] ?? "#C9C9CE";
}

export const photoCount = Object.keys(MAP).length;

import type { InventoryItem } from "../page";

export function parseModelAndColor(modelRaw: string | null, fallbackColor: string | null = null) {
  if (!modelRaw) return { modelName: "iPhone", extractedColor: fallbackColor || "مشخص نشده" };
  const match = modelRaw.match(/^([^(]+)\s*\((.+)\)$/);
  if (match) {
    return {
      modelName: match[1].trim(),
      extractedColor: (fallbackColor || match[2]).trim(),
    };
  }
  return { modelName: modelRaw.trim(), extractedColor: fallbackColor || "مشخص نشده" };
}

export function getModelImageSrc(modelName: string | null, colorName: string | null): string {
  const m = (modelName || "").toLowerCase();
  const c = (colorName || "").toLowerCase();

  if (m.includes("17 air") || m.includes("17air")) {
    if (c.includes("آبی")) return "/models/iphone17air-blue.jpg";
    if (c.includes("طلایی") || c.includes("زرد")) return "/models/iphone17air-gold.jpg";
    return "/models/iphone17air-white.jpg";
  }

  if (m.includes("17e") || m.includes("16e")) {
    if (c.includes("مشکی")) return "/models/iphone17e-black.jpg";
    return "/models/iphone16e-white.jpg";
  }

  if (m.includes("17 pro")) {
    if (c.includes("نارنجی")) return "/models/iphone17pro-orange.jpg";
    if (c.includes("آبی")) return "/models/iphone17pro-blue.jpg";
    return "/models/iphone17pro-white.jpg";
  }

  if (m.includes("16 pro")) {
    if (c.includes("مشکی")) return "/models/iphone16pro-black.jpg";
    if (c.includes("نچرال") || c.includes("خاکستری")) return "/models/iphone16pro-natural.jpg";
    return "/models/iphone16pro-white.jpg";
  }

  if (m.includes("iphone 15")) {
    if (c.includes("زرد") || c.includes("طلایی")) return "/models/iphone15-yellow.jpg";
    if (c.includes("مشکی")) return "/models/iphone15-black.jpg";
    return "/models/iphone15-blue.jpg";
  }

  if (
    m === "iphone 17" ||
    m === "iphone 16" ||
    m.includes("16 plus") ||
    (m.includes("17") && !m.includes("pro") && !m.includes("air") && !m.includes("17e")) ||
    (m.includes("16") && !m.includes("pro") && !m.includes("16e"))
  ) {
    if (c.includes("مشکی")) return "/models/iphone17-black.jpg";
    if (c.includes("سبز")) return "/models/iphone17-green.jpg";
    if (c.includes("آبی")) return "/models/iphone17-blue.jpg";
    if (c.includes("بنفش")) return "/models/iphone17-purple.jpg";
    if (c.includes("صورتی")) return "/models/iphone16-pink.jpg";
    return "/models/iphone17-white.jpg";
  }

  if (c.includes("آلبالویی") || c.includes("زرشکی") || c.includes("قرمز")) {
    return "/models/iphone18-crimson.jpg";
  }
  if (c.includes("آبی")) {
    return "/models/iphone18-blue.jpg";
  }
  if (c.includes("مشکی")) {
    return "/models/iphone18-black.jpg";
  }
  return "/models/iphone18-white.jpg";
}

export function getColorMeta(
  colorName: string | null,
  modelName: string | null = null
): {
  hex: string;
  shortName: string;
  compactName: string;
  imageSrc: string;
} {
  const c = (colorName || "").toLowerCase();
  const imageSrc = getModelImageSrc(modelName, colorName);

  if (c.includes("آلبالویی") || c.includes("زرشکی") || c.includes("قرمز")) {
    return { hex: "#9f1239", shortName: "آلبالویی (زرشکی)", compactName: "آلبالویی", imageSrc };
  }
  if (c.includes("آبی")) {
    return { hex: "#60a5fa", shortName: "آبی", compactName: "آبی", imageSrc };
  }
  if (c.includes("سفید") || c.includes("سیلور") || c.includes("نقره‌ای")) {
    return { hex: "#f1f5f9", shortName: "سفید", compactName: "سفید", imageSrc };
  }
  if (c.includes("مشکی")) {
    return { hex: "#27272a", shortName: "مشکی", compactName: "مشکی", imageSrc };
  }
  if (c.includes("نارنجی")) {
    return { hex: "#fb923c", shortName: "نارنجی", compactName: "نارنجی", imageSrc };
  }
  if (c.includes("سبز")) {
    return { hex: "#34d399", shortName: "سبز", compactName: "سبز", imageSrc };
  }
  if (c.includes("بنفش")) {
    return { hex: "#c084fc", shortName: "بنفش", compactName: "بنفش", imageSrc };
  }
  if (c.includes("صورتی")) {
    return { hex: "#f472b6", shortName: "صورتی", compactName: "صورتی", imageSrc };
  }
  if (c.includes("طلایی") || c.includes("زرد") || c.includes("دیزرت") || c.includes("صحرایی")) {
    return {
      hex: "#facc15",
      shortName: colorName || "طلایی",
      compactName: colorName || "طلایی",
      imageSrc,
    };
  }
  if (c.includes("نچرال") || c.includes("خاکستری")) {
    return { hex: "#a8a29e", shortName: "نچرال", compactName: "نچرال", imageSrc };
  }
  return {
    hex: "#cbd5e1",
    shortName: colorName || "استاندارد",
    compactName: colorName || "استاندارد",
    imageSrc,
  };
}

export function getPartCountry(item: InventoryItem): { flag: string; code: string; label: string } {
  const combined = `${item.part ?? ""} ${item.sim ?? ""}`.toUpperCase();
  if (combined.includes("5L")) {
    return { flag: "🇸🇬", code: "ZA/A (5L)", label: "پارت سنگاپور (ZA/A - 5L)" };
  }
  if (combined.includes("5X")) {
    return { flag: "🇸🇬", code: "ZA/A (5X)", label: "پارت سنگاپور (ZA/A - 5X)" };
  }
  if (combined.includes("ZA/A") || combined.includes("ZA")) {
    return { flag: "🇸🇬", code: "ZA/A", label: "پارت سنگاپور (ZA/A)" };
  }
  if (combined.includes("CH/A") || combined.includes("CH")) {
    return { flag: "🇨🇳", code: "CH/A", label: "پارت چین (CH/A)" };
  }
  if (combined.includes("QN/A") || combined.includes("QN")) {
    return { flag: "🇪🇺", code: "QN/A", label: "پارت اروپا (QN/A)" };
  }
  if (combined.includes("QL/A") || combined.includes("QL")) {
    return { flag: "🇪🇺", code: "QL/A", label: "پارت اروپا (QL/A)" };
  }
  if (combined.includes("AH/A") || combined.includes("AH")) {
    return { flag: "🇦🇪", code: "AH/A", label: "پارت امارات (AH/A)" };
  }
  if (combined.includes("HN/A") || combined.includes("HN")) {
    return { flag: "🇮🇳", code: "HN/A", label: "پارت هند (HN/A)" };
  }
  if (combined.includes("LL/A") || combined.includes("LLA")) {
    return { flag: "🇺🇸", code: "LL/A", label: "پارت آمریکا (LL/A)" };
  }
  if (combined.includes("JA/A") || combined.includes("JA")) {
    return { flag: "🇯🇵", code: "JA/A", label: "پارت ژاپن (JA/A)" };
  }
  if (combined.includes("ZP/A") || combined.includes("ZP")) {
    return { flag: "🇭🇰", code: "ZP/A", label: "پارت هنگ‌کنگ (ZP/A)" };
  }
  return { flag: "🌐", code: item.part || "Global", label: item.part ? `پارت ${item.part}` : "پارت اصلی" };
}

export function getActivationMeta(conditionRaw: string | null): {
  label: string;
  shortLabel: string;
  isNotActive: boolean;
} {
  const c = (conditionRaw || "").toLowerCase();
  if (c.includes("not active") || c.includes("نات")) {
    return { label: "پلمپ نات‌اکتیو (Not Active)", shortLabel: "نات‌اکتیو", isNotActive: true };
  }
  if (c.includes("active")) {
    return { label: "پلمپ اکتیو (Active)", shortLabel: "اکتیو", isNotActive: false };
  }
  return { label: conditionRaw || "آکبند پلمپ", shortLabel: "آکبند", isNotActive: true };
}

export function getRegistryMeta(registryRaw: string | null): {
  isRegistered: boolean;
  shortLabel: string;
  fullLabel: string;
} {
  const r = (registryRaw || "").toLowerCase();
  if (r.includes("بدون") || r.includes("not")) {
    return {
      isRegistered: false,
      shortLabel: "بدون رجیستری",
      fullLabel: "بدون رجیستری (آنتن‌دهی طبق قوانین روز)",
    };
  }
  return {
    isRegistered: true,
    shortLabel: "با رجیستری",
    fullLabel: "با رجیستری رسمی و کد فعال‌سازی همتا",
  };
}

export function formatPrice(price: string | null): {
  formatted: string;
  numOnly: string;
  isContact: boolean;
  rawNum: number;
} {
  if (!price) {
    return { formatted: "استعلام قیمت", numOnly: "استعلام", isContact: true, rawNum: 0 };
  }
  const digits = price.replace(/\D/g, "");
  const n = parseInt(digits, 10);
  if (isNaN(n) || n === 0) {
    return { formatted: price, numOnly: price, isContact: false, rawNum: 0 };
  }
  const numOnly = n.toLocaleString("en-US");
  return { formatted: `${numOnly} تومان`, numOnly, isContact: false, rawNum: n };
}

export function capacityRank(cap: string | null): number {
  const c = (cap || "").toUpperCase();
  if (c.includes("128")) return 1;
  if (c.includes("256")) return 2;
  if (c.includes("512")) return 3;
  if (c.includes("1TB")) return 4;
  if (c.includes("2TB")) return 5;
  return 99;
}

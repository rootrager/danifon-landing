import { Metadata } from "next";
import InventoryClient from "./InventoryClient";
import inventoryJson from "@/app/data/inventory.json";

export const metadata: Metadata = {
  title: "موجودی آیفون‌های آکبند | Danifon",
  description: "لیست کامل آیفون‌های آکبند و پلمپ اصلی آماده تحویل فوری دانیفون",
};

export const revalidate = 30;

export interface InventoryItem {
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
}

const FALLBACK_INVENTORY: InventoryItem[] = inventoryJson as InventoryItem[];

async function fetchInventory(): Promise<InventoryItem[]> {
  const apiUrl = process.env.INVENTORY_API_URL;
  if (!apiUrl) {
    return FALLBACK_INVENTORY;
  }

  const apiKey = process.env.INVENTORY_API_KEY || "dani2026inv";

  try {
    const res = await fetch(apiUrl, {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return FALLBACK_INVENTORY;
    const data = await res.json();
    const list = data.inventory ?? (Array.isArray(data) ? data : []);
    const newItems = list.filter((i: InventoryItem) => {
      const isNew = i.type === "new" || (i.condition && i.condition.includes("آکبند"));
      const isIphone =
        !i.series ||
        ["18", "17", "16", "15", "14", "13", "12", "11"].includes(i.series) ||
        (i.model && i.model.toLowerCase().includes("iphone"));
      return isNew && isIphone;
    });
    return newItems.length > 0 ? newItems : FALLBACK_INVENTORY;
  } catch {
    return FALLBACK_INVENTORY;
  }
}

export default async function InventoryPage() {
  const items = await fetchInventory();
  const fetchedAt = new Date().toISOString();
  return <InventoryClient items={items} fetchedAt={fetchedAt} />;
}

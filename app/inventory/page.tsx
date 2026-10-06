import { Metadata } from "next";
import InventoryClient from "./InventoryClient";

export const metadata: Metadata = {
  title: "موجودی آیفون‌های آکبند | Danifon",
  description: "لیست کامل آیفون‌های آکبند و پلمپ اصلی آماده تحویل فوری دانیفون",
};

export const revalidate = 60;

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

const FALLBACK_INVENTORY: InventoryItem[] = [
  {
    item_id: "DANI-16PM-01",
    type: "new",
    series: "16",
    model: "iPhone 16 Pro Max",
    capacity: "256GB",
    part: "CH/A",
    sim: "دو سیم‌کارت فیزیکی",
    registry: "با رجیستری قانونی",
    battery: "100%",
    price: "74000000",
    condition: "آکبند (پلمپ اصلی)",
    photo_id: null,
  },
  {
    item_id: "DANI-16P-02",
    type: "new",
    series: "16",
    model: "iPhone 16 Pro",
    capacity: "128GB",
    part: "ZA/A",
    sim: "دو سیم‌کارت فیزیکی",
    registry: "با رجیستری قانونی",
    battery: "100%",
    price: "69500000",
    condition: "آکبند (پلمپ اصلی)",
    photo_id: null,
  },
  {
    item_id: "DANI-16-03",
    type: "new",
    series: "16",
    model: "iPhone 16",
    capacity: "128GB",
    part: "CH/A",
    sim: "دو سیم‌کارت فیزیکی",
    registry: "با رجیستری قانونی",
    battery: "100%",
    price: "64000000",
    condition: "آکبند (پلمپ اصلی)",
    photo_id: null,
  },
  {
    item_id: "DANI-16PL-04",
    type: "new",
    series: "16",
    model: "iPhone 16 Plus",
    capacity: "256GB",
    part: "CH/A",
    sim: "دو سیم‌کارت فیزیکی",
    registry: "با رجیستری قانونی",
    battery: "100%",
    price: "68000000",
    condition: "آکبند (پلمپ اصلی)",
    photo_id: null,
  },
  {
    item_id: "DANI-15-05",
    type: "new",
    series: "15",
    model: "iPhone 15",
    capacity: "128GB",
    part: "CH/A",
    sim: "دو سیم‌کارت فیزیکی",
    registry: "با رجیستری قانونی",
    battery: "100%",
    price: "54000000",
    condition: "آکبند (پلمپ اصلی)",
    photo_id: null,
  },
  {
    item_id: "DANI-13-06",
    type: "new",
    series: "13",
    model: "iPhone 13",
    capacity: "128GB",
    part: "CH/A",
    sim: "دو سیم‌کارت فیزیکی",
    registry: "با رجیستری قانونی",
    battery: "100%",
    price: "44500000",
    condition: "آکبند (پلمپ اصلی)",
    photo_id: null,
  },
];

async function fetchInventory(): Promise<InventoryItem[]> {
  const apiUrl = process.env.INVENTORY_API_URL || "http://185.206.170.228:5354/api/inventory";
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
    // Only keep brand new iPhones
    const newItems = list.filter((i: InventoryItem) => {
      const isNew = i.type === "new" || (i.condition && i.condition.includes("آکبند"));
      const isIphone = !i.series || ["17", "16", "15", "14", "13", "12", "11"].includes(i.series) || (i.model && i.model.toLowerCase().includes("iphone"));
      return isNew && isIphone;
    });
    return newItems;
  } catch {
    return FALLBACK_INVENTORY;
  }
}

export default async function InventoryPage() {
  const items = await fetchInventory();
  const fetchedAt = new Date().toISOString();
  return <InventoryClient items={items} fetchedAt={fetchedAt} />;
}

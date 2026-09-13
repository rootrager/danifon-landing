import { Metadata } from "next";
import InventoryClient from "./InventoryClient";

export const metadata: Metadata = {
  title: "موجودی انبار دانیفون | Danifon",
  description: "لیست کامل محصولات آماده تحویل فوری دانیفون",
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
    item_id: "DANI-16-02",
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
    item_id: "DANI-15P-03",
    type: "used",
    series: "15",
    model: "iPhone 15 Pro",
    capacity: "128GB",
    part: "ZA/A",
    sim: "تک سیم + eSIM",
    registry: "با رجیستری قانونی",
    battery: "89%",
    price: "58500000",
    condition: "در حد نو (بدون خط و خش)",
    photo_id: null,
  },
  {
    item_id: "DANI-13-04",
    type: "used",
    series: "13",
    model: "iPhone 13",
    capacity: "128GB",
    part: "CH/A",
    sim: "دو سیم‌کارت فیزیکی",
    registry: "با رجیستری قانونی",
    battery: "85%",
    price: "41000000",
    condition: "در حد نو (سلامت کامل)",
    photo_id: null,
  },
  {
    item_id: "DANI-WU2-05",
    type: "new",
    series: "watch",
    model: "Apple Watch Ultra 2",
    capacity: "49mm",
    part: "LLA",
    sim: "Cellular",
    registry: "بدون نیاز به رجیستری",
    battery: "100%",
    price: "46500000",
    condition: "آکبند (پلمپ اصلی)",
    photo_id: null,
  },
  {
    item_id: "DANI-AP2-06",
    type: "new",
    series: "airpods",
    model: "AirPods Pro 2 (USB-C)",
    capacity: "ANC",
    part: "ZP/A",
    sim: null,
    registry: "بدون نیاز به رجیستری",
    battery: "100%",
    price: "16800000",
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
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return FALLBACK_INVENTORY;
    const data = await res.json();
    const list = data.inventory ?? (Array.isArray(data) ? data : []);
    return list.length > 0 ? list : FALLBACK_INVENTORY;
  } catch {
    return FALLBACK_INVENTORY;
  }
}

export default async function InventoryPage() {
  const items = await fetchInventory();
  const fetchedAt = new Date().toISOString();
  return <InventoryClient items={items} fetchedAt={fetchedAt} />;
}

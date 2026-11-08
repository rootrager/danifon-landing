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
  return FALLBACK_INVENTORY;
}

export default async function InventoryPage() {
  const items = await fetchInventory();
  const fetchedAt = new Date().toISOString();
  return <InventoryClient items={items} fetchedAt={fetchedAt} />;
}

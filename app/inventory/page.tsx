import type { Metadata } from "next";
import InventoryClient from "./InventoryClient";
import { getInventory } from "../lib/inventory";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "موجودی آکبند | دانیفون",
  description: "لیست کامل آیفون‌های آکبند و پلمپ با قیمت روز و وضعیت ریجستری.",
};

export default async function InventoryPage() {
  const items = await getInventory();
  return <InventoryClient items={items} fetchedAt={new Date().toISOString()} />;
}

import type { Metadata } from "next";
import { getCategoriesWithDishes, getSettings } from "@/lib/data";
import { OrderView } from "@/components/order/order-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Online bestellen",
  description:
    "Bestellen Sie authentische Sichuan-Küche zur Abholung oder Lieferung in Düsseldorf – frisch aus dem Wok des China Restaurant Three Kingdoms.",
};

export default async function OrderPage() {
  const [categories, settings] = await Promise.all([
    getCategoriesWithDishes(),
    getSettings(),
  ]);

  return (
    <OrderView
      categories={categories}
      takeawayEnabled={settings.takeawayEnabled}
      deliveryEnabled={settings.deliveryEnabled}
      deliveryFee={settings.deliveryFee}
      minOrderValue={settings.minOrderValue}
    />
  );
}

import type { Metadata } from "next";
import { getCategoriesWithDishes } from "@/lib/data";
import { MenuView } from "@/components/menu/menu-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Speisekarte",
  description:
    "Entdecken Sie unsere authentische Sichuan-Speisekarte: Mapo Tofu, Kung Pao, gegrillter Fisch, Dan Dan Nudeln und mehr. Mit Filtern für Bestseller, scharf, vegetarisch und vegan.",
};

export default async function MenuPage() {
  const categories = await getCategoriesWithDishes();
  return <MenuView categories={categories} />;
}

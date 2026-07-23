import { getCategoriesWithDishes } from "@/lib/data";
import { MenuManager } from "@/components/admin/menu-manager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMenuPage() {
  const categories = await getCategoriesWithDishes();
  return <MenuManager categories={categories} />;
}

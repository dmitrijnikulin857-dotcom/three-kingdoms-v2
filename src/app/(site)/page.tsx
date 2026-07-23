import { getCategoriesWithDishes, getSettings } from "@/lib/data";
import { HomeView } from "@/components/home/home-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [categories, settings] = await Promise.all([
    getCategoriesWithDishes(),
    getSettings(),
  ]);

  const allDishes = categories.flatMap((c) => c.dishes);
  const signatureDishes = allDishes
    .filter((d) => d.isBestseller && d.isAvailable)
    .slice(0, 6);

  return (
    <HomeView
      signatureDishes={signatureDishes}
      openingHours={settings.openingHours}
      specialDates={settings.specialDates}
    />
  );
}

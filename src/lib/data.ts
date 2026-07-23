import { prisma, hasDatabase } from "./prisma";
import {
  getFallbackCategoriesWithDishes,
  DEFAULT_OPENING_HOURS,
  DISHES,
} from "./menu-data";
import type {
  MenuCategoryWithDishes,
  MenuDish,
  OpeningHour,
  SpecialDate,
} from "./types";

export interface RestaurantSettings {
  openingHours: OpeningHour[];
  specialDates: SpecialDate[];
  reservationsEnabled: boolean;
  takeawayEnabled: boolean;
  deliveryEnabled: boolean;
  deliveryFee: number;
  minOrderValue: number;
}

const FALLBACK_SETTINGS: RestaurantSettings = {
  openingHours: DEFAULT_OPENING_HOURS,
  specialDates: [],
  reservationsEnabled: true,
  takeawayEnabled: true,
  deliveryEnabled: true,
  deliveryFee: 3.5,
  minOrderValue: 15.0,
};

/**
 * Returns all categories with their dishes.
 * Fail-safe: if the database is missing or unreachable, the built-in fallback
 * dataset is returned so the public site is NEVER empty.
 */
export async function getCategoriesWithDishes(): Promise<
  MenuCategoryWithDishes[]
> {
  if (!hasDatabase()) return getFallbackCategoriesWithDishes();

  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        dishes: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!categories.length) return getFallbackCategoriesWithDishes();

    return categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      nameDe: cat.nameDe,
      nameEn: cat.nameEn,
      icon: cat.icon,
      sortOrder: cat.sortOrder,
      dishes: cat.dishes.map(mapDish),
    }));
  } catch (error) {
    console.error("[data] getCategoriesWithDishes fell back:", error);
    return getFallbackCategoriesWithDishes();
  }
}

/** Flat list of all dishes (with fallback). */
export async function getAllDishes(): Promise<MenuDish[]> {
  if (!hasDatabase()) return [...DISHES];
  try {
    const dishes = await prisma.dish.findMany({
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
    });
    if (!dishes.length) return [...DISHES];
    return dishes.map(mapDish);
  } catch (error) {
    console.error("[data] getAllDishes fell back:", error);
    return [...DISHES];
  }
}

/** Restaurant settings (opening hours, toggles) with fallback. */
export async function getSettings(): Promise<RestaurantSettings> {
  if (!hasDatabase()) return FALLBACK_SETTINGS;
  try {
    const setting = await prisma.setting.findUnique({
      where: { id: "singleton" },
    });
    if (!setting) return FALLBACK_SETTINGS;
    return {
      openingHours: (setting.openingHours as unknown as OpeningHour[]) ??
        DEFAULT_OPENING_HOURS,
      specialDates: (setting.specialDates as unknown as SpecialDate[]) ?? [],
      reservationsEnabled: setting.reservationsEnabled,
      takeawayEnabled: setting.takeawayEnabled,
      deliveryEnabled: setting.deliveryEnabled,
      deliveryFee: setting.deliveryFee,
      minOrderValue: setting.minOrderValue,
    };
  } catch (error) {
    console.error("[data] getSettings fell back:", error);
    return FALLBACK_SETTINGS;
  }
}

// -- helpers ----------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDish(d: any): MenuDish {
  return {
    id: d.id,
    slug: d.slug,
    nameDe: d.nameDe,
    nameEn: d.nameEn,
    nameZh: d.nameZh,
    descriptionDe: d.descriptionDe,
    descriptionEn: d.descriptionEn,
    price: d.price,
    imageUrl: d.imageUrl,
    spiceLevel: d.spiceLevel,
    isBestseller: d.isBestseller,
    isVegetarian: d.isVegetarian,
    isVegan: d.isVegan,
    isAvailable: d.isAvailable,
    allergens: d.allergens ?? [],
    sortOrder: d.sortOrder,
    categoryId: d.categoryId,
  };
}

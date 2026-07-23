// Shared, framework-agnostic types used by both the Prisma layer and the
// built-in fallback data. Kept as plain interfaces so the public site works
// even when the database is unavailable.

export interface MenuCategory {
  id: string;
  slug: string;
  nameDe: string;
  nameEn: string;
  icon: string;
  sortOrder: number;
}

export interface MenuDish {
  id: string;
  slug: string;
  nameDe: string;
  nameEn: string;
  nameZh: string;
  descriptionDe: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
  spiceLevel: number; // 0..3
  isBestseller: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isAvailable: boolean;
  allergens: string[];
  sortOrder: number;
  categoryId: string;
}

export interface MenuCategoryWithDishes extends MenuCategory {
  dishes: MenuDish[];
}

export type Locale = "de" | "en";

export interface OpeningHour {
  day: number; // 0 = Sunday ... 6 = Saturday
  open: string; // "HH:mm"
  close: string; // "HH:mm"
  closed: boolean;
}

export interface SpecialDate {
  date: string; // YYYY-MM-DD
  label: string;
  closed: boolean;
  open?: string;
  close?: string;
}

export interface OpenStatus {
  isOpen: boolean;
  label: string; // localized "Jetzt geöffnet" / "Geschlossen"
  detail: string; // e.g. "Öffnet um 12:00" / "Schließt um 23:00"
  nextChange: string | null;
}

export interface CartItem {
  dishId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export const ALLERGEN_LABELS: Record<string, { de: string; en: string }> = {
  gluten: { de: "Gluten", en: "Gluten" },
  soja: { de: "Soja", en: "Soy" },
  ei: { de: "Ei", en: "Egg" },
  erdnuss: { de: "Erdnuss", en: "Peanut" },
  schalenfruechte: { de: "Schalenfrüchte", en: "Tree nuts" },
  sesam: { de: "Sesam", en: "Sesame" },
  fisch: { de: "Fisch", en: "Fish" },
  krebstiere: { de: "Krebstiere", en: "Crustaceans" },
  weichtiere: { de: "Weichtiere", en: "Molluscs" },
  milch: { de: "Milch", en: "Milk" },
  sellerie: { de: "Sellerie", en: "Celery" },
  senf: { de: "Senf", en: "Mustard" },
  sulfite: { de: "Sulfite", en: "Sulphites" },
};

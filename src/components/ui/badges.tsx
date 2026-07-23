"use client";

import { Flame, Leaf, Sprout, Star, AlertCircle } from "lucide-react";
import { ALLERGEN_LABELS } from "@/lib/types";
import type { Locale } from "@/lib/types";

export function SpiceIndicator({ level }: { level: number }) {
  if (level <= 0) return null;
  return (
    <span
      className="inline-flex items-center gap-0.5"
      title={`Schärfe ${level}/3`}
      aria-label={`Schärfegrad ${level} von 3`}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          className={
            i < level ? "h-3.5 w-3.5 text-crimson-light" : "h-3.5 w-3.5 text-neutral-700"
          }
          fill={i < level ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

export function BestsellerBadge({ locale }: { locale: Locale }) {
  return (
    <span className="badge bg-gold/15 text-gold-light">
      <Star className="h-3 w-3" fill="currentColor" />
      {locale === "de" ? "Bestseller" : "Bestseller"}
    </span>
  );
}

export function DietBadge({
  type,
  locale,
}: {
  type: "vegetarian" | "vegan";
  locale: Locale;
}) {
  if (type === "vegan") {
    return (
      <span className="badge bg-emerald-500/15 text-emerald-400">
        <Sprout className="h-3 w-3" />
        {locale === "de" ? "Vegan" : "Vegan"}
      </span>
    );
  }
  return (
    <span className="badge bg-green-500/15 text-green-400">
      <Leaf className="h-3 w-3" />
      {locale === "de" ? "Vegetarisch" : "Vegetarian"}
    </span>
  );
}

export function AllergenList({
  allergens,
  locale,
}: {
  allergens: string[];
  locale: Locale;
}) {
  if (!allergens.length) return null;
  const labels = allergens
    .map((a) => ALLERGEN_LABELS[a]?.[locale] ?? a)
    .join(", ");
  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs text-neutral-500">
      <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
      <span>
        {locale === "de" ? "Allergene" : "Allergens"}: {labels}
      </span>
    </p>
  );
}

"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { MenuDish, Locale } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";
import {
  SpiceIndicator,
  BestsellerBadge,
  DietBadge,
  AllergenList,
} from "./badges";

interface DishCardProps {
  dish: MenuDish;
  locale: Locale;
  orderable?: boolean;
}

export function DishCard({ dish, locale, orderable = true }: DishCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const name = locale === "de" ? dish.nameDe : dish.nameEn;
  const description = locale === "de" ? dish.descriptionDe : dish.descriptionEn;

  const handleAdd = () => {
    if (!dish.isAvailable) return;
    addItem({
      dishId: dish.id,
      slug: dish.slug,
      name,
      price: dish.price,
      imageUrl: dish.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="card group relative flex flex-col overflow-hidden transition-all duration-300 hover:border-gold/40 hover:shadow-xl hover:shadow-black/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-soft">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-700">
            🍜
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        {/* top badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {dish.isBestseller && <BestsellerBadge locale={locale} />}
        </div>

        {!dish.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70 backdrop-blur-[2px]">
            <span className="rounded-full border border-crimson/60 bg-crimson/20 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-crimson-light">
              {locale === "de" ? "Ausverkauft" : "Sold out"}
            </span>
          </div>
        )}

        {dish.nameZh && (
          <span className="absolute bottom-2 right-3 font-serif text-lg text-white/70">
            {dish.nameZh}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold leading-tight text-white">
            {name}
          </h3>
          <span className="whitespace-nowrap font-semibold text-gold">
            {formatPrice(dish.price)}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <SpiceIndicator level={dish.spiceLevel} />
          {dish.isVegan ? (
            <DietBadge type="vegan" locale={locale} />
          ) : dish.isVegetarian ? (
            <DietBadge type="vegetarian" locale={locale} />
          ) : null}
        </div>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
            {description}
          </p>
        )}

        <AllergenList allergens={dish.allergens} locale={locale} />

        {orderable && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={!dish.isAvailable}
            className={
              "btn mt-auto w-full " +
              (added
                ? "bg-emerald-600 text-white"
                : "btn-outline") +
              (dish.isAvailable ? "" : " pointer-events-none opacity-40")
            }
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                {locale === "de" ? "Hinzugefügt" : "Added"}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {locale === "de" ? "In den Warenkorb" : "Add to cart"}
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}

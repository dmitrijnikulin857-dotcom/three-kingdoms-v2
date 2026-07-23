"use client";

import { useMemo, useState } from "react";
import { Search, Star, Flame, Leaf, Sprout, X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { DishCard } from "@/components/ui/dish-card";
import type { MenuCategoryWithDishes } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterKey = "bestseller" | "spicy" | "vegetarian" | "vegan";

export function MenuView({
  categories,
}: {
  categories: MenuCategoryWithDishes[];
}) {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filters, setFilters] = useState<Record<FilterKey, boolean>>({
    bestseller: false,
    spicy: false,
    vegetarian: false,
    vegan: false,
  });

  const toggleFilter = (key: FilterKey) =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => activeCategory === "all" || c.id === activeCategory)
      .map((cat) => ({
        ...cat,
        dishes: cat.dishes.filter((dish) => {
          if (filters.bestseller && !dish.isBestseller) return false;
          if (filters.spicy && dish.spiceLevel < 1) return false;
          if (filters.vegetarian && !dish.isVegetarian) return false;
          if (filters.vegan && !dish.isVegan) return false;
          if (q) {
            const haystack = [
              dish.nameDe,
              dish.nameEn,
              dish.nameZh,
              dish.descriptionDe,
              dish.descriptionEn,
            ]
              .join(" ")
              .toLowerCase();
            if (!haystack.includes(q)) return false;
          }
          return true;
        }),
      }))
      .filter((cat) => cat.dishes.length > 0);
  }, [categories, activeCategory, query, filters]);

  const totalResults = filteredCategories.reduce(
    (sum, c) => sum + c.dishes.length,
    0,
  );

  const filterButtons: { key: FilterKey; label: string; icon: React.ReactNode }[] =
    [
      {
        key: "bestseller",
        label: t.common.bestseller,
        icon: <Star className="h-3.5 w-3.5" />,
      },
      {
        key: "spicy",
        label: t.common.spicy,
        icon: <Flame className="h-3.5 w-3.5" />,
      },
      {
        key: "vegetarian",
        label: t.common.vegetarian,
        icon: <Leaf className="h-3.5 w-3.5" />,
      },
      {
        key: "vegan",
        label: t.common.vegan,
        icon: <Sprout className="h-3.5 w-3.5" />,
      },
    ];

  const hasActiveFilters = Object.values(filters).some(Boolean) || query;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="border-b border-ink-border bg-ink-soft py-14">
        <div className="container-tk text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            四川 · Sichuan
          </span>
          <h1 className="section-heading mt-3">{t.menu.title}</h1>
          <p className="mt-3 text-neutral-400">{t.menu.subtitle}</p>
        </div>
      </div>

      {/* Sticky controls */}
      <div className="sticky top-20 z-30 border-b border-ink-border bg-ink/95 backdrop-blur-lg">
        <div className="container-tk py-4">
          {/* Search */}
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="input pl-11"
            />
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {filterButtons.map((f) => (
              <button
                key={f.key}
                onClick={() => toggleFilter(f.key)}
                className={cn(
                  "badge border transition-colors",
                  filters[f.key]
                    ? "border-gold bg-gold/15 text-gold-light"
                    : "border-ink-border bg-ink-soft text-neutral-400 hover:text-white",
                )}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilters({
                    bestseller: false,
                    spicy: false,
                    vegetarian: false,
                    vegan: false,
                  });
                  setQuery("");
                }}
                className="badge border border-crimson/40 bg-crimson/10 text-crimson-light"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            <CategoryChip
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              label={t.menu.allCategories}
            />
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                label={locale === "de" ? cat.nameDe : cat.nameEn}
              />
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-neutral-500">
            {t.menu.resultsCount(totalResults)}
          </p>
        </div>
      </div>

      {/* Dishes */}
      <div className="container-tk pt-12">
        {totalResults === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-neutral-400">{t.menu.noResults}</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredCategories.map((cat) => (
              <section key={cat.id} id={cat.slug} className="scroll-mt-56">
                <div className="mb-6 flex items-end justify-between border-b border-ink-border pb-3">
                  <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                    {locale === "de" ? cat.nameDe : cat.nameEn}
                  </h2>
                  <span className="text-sm text-neutral-500">
                    {cat.dishes.length}
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.dishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} locale={locale} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-gold bg-gold text-ink"
          : "border-ink-border bg-ink-soft text-neutral-300 hover:border-gold/40 hover:text-white",
      )}
    >
      {label}
    </button>
  );
}

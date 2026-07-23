"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Flame,
  Star,
  X,
  Save,
} from "lucide-react";
import type { MenuCategoryWithDishes, MenuDish, MenuCategory } from "@/lib/types";
import { ALLERGEN_LABELS } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";

type EditableDish = Partial<MenuDish> & { categoryId: string };

export function MenuManager({
  categories,
}: {
  categories: MenuCategoryWithDishes[];
}) {
  const categoryOptions: MenuCategory[] = categories.map(
    ({ dishes, ...rest }) => rest,
  );

  const [dishes, setDishes] = useState<MenuDish[]>(
    categories.flatMap((c) => c.dishes),
  );
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editing, setEditing] = useState<EditableDish | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter((d) => {
      if (filterCat !== "all" && d.categoryId !== filterCat) return false;
      if (q && !`${d.nameDe} ${d.nameEn}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [dishes, query, filterCat]);

  const catName = (id: string) =>
    categoryOptions.find((c) => c.id === id)?.nameDe ?? "—";

  function showNotice(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  }

  async function saveDish(data: EditableDish) {
    const isNew = !data.id;
    const url = isNew ? "/api/admin/dishes" : `/api/admin/dishes/${data.id}`;
    const method = isNew ? "POST" : "PATCH";

    const payload = {
      nameDe: data.nameDe ?? "",
      nameEn: data.nameEn ?? "",
      nameZh: data.nameZh ?? "",
      descriptionDe: data.descriptionDe ?? "",
      descriptionEn: data.descriptionEn ?? "",
      price: Number(data.price ?? 0),
      imageUrl: data.imageUrl ?? "",
      spiceLevel: Number(data.spiceLevel ?? 0),
      isBestseller: !!data.isBestseller,
      isVegetarian: !!data.isVegetarian,
      isVegan: !!data.isVegan,
      isAvailable: data.isAvailable ?? true,
      allergens: data.allergens ?? [],
      sortOrder: Number(data.sortOrder ?? 0),
      categoryId: data.categoryId,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      showNotice(result.error ?? "Speichern fehlgeschlagen");
      return;
    }

    if (isNew) {
      const newDish: MenuDish = {
        id: result.dish?.id ?? `local-${Date.now()}`,
        slug: result.dish?.slug ?? "",
        ...payload,
      } as MenuDish;
      setDishes((prev) => [...prev, newDish]);
    } else {
      setDishes((prev) =>
        prev.map((d) => (d.id === data.id ? ({ ...d, ...payload } as MenuDish) : d)),
      );
    }
    if (result.demo) showNotice("Demo-Modus: Änderung nicht dauerhaft gespeichert.");
    else showNotice("Gespeichert.");
    setEditing(null);
  }

  async function deleteDish(id: string) {
    if (!confirm("Dieses Gericht wirklich löschen?")) return;
    const res = await fetch(`/api/admin/dishes/${id}`, { method: "DELETE" });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      showNotice(result.error ?? "Löschen fehlgeschlagen");
      return;
    }
    setDishes((prev) => prev.filter((d) => d.id !== id));
    if (result.demo) showNotice("Demo-Modus: Änderung nicht dauerhaft gespeichert.");
    else showNotice("Gelöscht.");
  }

  async function toggleField(dish: MenuDish, field: "isAvailable" | "isBestseller") {
    const value = !dish[field];
    setDishes((prev) =>
      prev.map((d) => (d.id === dish.id ? { ...d, [field]: value } : d)),
    );
    const res = await fetch(`/api/admin/dishes/${dish.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      // revert
      setDishes((prev) =>
        prev.map((d) => (d.id === dish.id ? { ...d, [field]: !value } : d)),
      );
      showNotice(result.error ?? "Aktualisierung fehlgeschlagen");
    } else if (result.demo) {
      showNotice("Demo-Modus: Änderung nicht dauerhaft gespeichert.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Speisekarte</h1>
          <p className="mt-1 text-neutral-400">
            {dishes.length} Gerichte · Preise, Fotos, Verfügbarkeit verwalten
          </p>
        </div>
        <button
          onClick={() =>
            setEditing({
              categoryId: categoryOptions[0]?.id ?? "",
              isAvailable: true,
              spiceLevel: 0,
              allergens: [],
              price: 0,
            })
          }
          className="btn-gold"
        >
          <Plus className="h-4 w-4" />
          Neues Gericht
        </button>
      </div>

      {notice && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          {notice}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gericht suchen …"
            className="input pl-10"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input max-w-[220px]"
        >
          <option value="all">Alle Kategorien</option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameDe}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink-border bg-ink-soft text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Gericht</th>
                <th className="px-4 py-3">Kategorie</th>
                <th className="px-4 py-3">Preis</th>
                <th className="px-4 py-3">Schärfe</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-border">
              {filtered.map((dish) => (
                <tr key={dish.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-ink-soft">
                        {dish.imageUrl && (
                          <Image
                            src={dish.imageUrl}
                            alt={dish.nameDe}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white">{dish.nameDe}</p>
                        <p className="truncate text-xs text-neutral-500">
                          {dish.nameEn}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {catName(dish.categoryId)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gold">
                    {formatPrice(dish.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-0.5">
                      {dish.spiceLevel > 0 ? (
                        Array.from({ length: dish.spiceLevel }).map((_, i) => (
                          <Flame
                            key={i}
                            className="h-3.5 w-3.5 text-crimson-light"
                            fill="currentColor"
                          />
                        ))
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => toggleField(dish, "isAvailable")}
                        className={cn(
                          "badge border",
                          dish.isAvailable
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-crimson/40 bg-crimson/10 text-crimson-light",
                        )}
                      >
                        {dish.isAvailable ? "Verfügbar" : "Ausverkauft"}
                      </button>
                      <button
                        onClick={() => toggleField(dish, "isBestseller")}
                        className={cn(
                          "badge border",
                          dish.isBestseller
                            ? "border-gold/50 bg-gold/15 text-gold-light"
                            : "border-ink-border bg-ink-soft text-neutral-500",
                        )}
                      >
                        <Star className="h-3 w-3" fill={dish.isBestseller ? "currentColor" : "none"} />
                        Bestseller
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing({ ...dish })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-border text-neutral-300 hover:border-gold/50 hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-border text-neutral-300 hover:border-crimson/50 hover:text-crimson-light"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-neutral-500">
                    Keine Gerichte gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <DishEditorModal
          dish={editing}
          categories={categoryOptions}
          onClose={() => setEditing(null)}
          onSave={saveDish}
        />
      )}
    </div>
  );
}

function DishEditorModal({
  dish,
  categories,
  onClose,
  onSave,
}: {
  dish: EditableDish;
  categories: MenuCategory[];
  onClose: () => void;
  onSave: (d: EditableDish) => void | Promise<void>;
}) {
  const [form, setForm] = useState<EditableDish>({ ...dish });
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof EditableDish>(key: K, value: EditableDish[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAllergen = (key: string) => {
    const current = form.allergens ?? [];
    update(
      "allergens",
      current.includes(key)
        ? current.filter((a) => a !== key)
        : [...current, key],
    );
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="card my-8 w-full max-w-2xl p-6"
      >
        <div className="flex items-center justify-between border-b border-ink-border pb-4">
          <h2 className="font-serif text-xl font-bold text-white">
            {dish.id ? "Gericht bearbeiten" : "Neues Gericht"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-border text-neutral-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Name (DE) *</label>
            <input
              className="input"
              value={form.nameDe ?? ""}
              onChange={(e) => update("nameDe", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Name (EN) *</label>
            <input
              className="input"
              value={form.nameEn ?? ""}
              onChange={(e) => update("nameEn", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Name (中文)</label>
            <input
              className="input"
              value={form.nameZh ?? ""}
              onChange={(e) => update("nameZh", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Kategorie *</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameDe}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Preis (€) *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="input"
              value={form.price ?? 0}
              onChange={(e) => update("price", Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="label">Schärfe (0–3)</label>
            <select
              className="input"
              value={form.spiceLevel ?? 0}
              onChange={(e) => update("spiceLevel", Number(e.target.value))}
            >
              <option value={0}>Nicht scharf</option>
              <option value={1}>Mild</option>
              <option value={2}>Scharf</option>
              <option value={3}>Sehr scharf</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Bild-URL</label>
            <input
              className="input"
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl ?? ""}
              onChange={(e) => update("imageUrl", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Beschreibung (DE)</label>
            <textarea
              rows={2}
              className="input resize-none"
              value={form.descriptionDe ?? ""}
              onChange={(e) => update("descriptionDe", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Beschreibung (EN)</label>
            <textarea
              rows={2}
              className="input resize-none"
              value={form.descriptionEn ?? ""}
              onChange={(e) => update("descriptionEn", e.target.value)}
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Toggle
            label="Verfügbar"
            checked={form.isAvailable ?? true}
            onChange={(v) => update("isAvailable", v)}
          />
          <Toggle
            label="Bestseller"
            checked={!!form.isBestseller}
            onChange={(v) => update("isBestseller", v)}
          />
          <Toggle
            label="Vegetarisch"
            checked={!!form.isVegetarian}
            onChange={(v) => update("isVegetarian", v)}
          />
          <Toggle
            label="Vegan"
            checked={!!form.isVegan}
            onChange={(v) => update("isVegan", v)}
          />
        </div>

        {/* Allergens */}
        <div className="mt-4">
          <label className="label">Allergene</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ALLERGEN_LABELS).map(([key, val]) => {
              const active = (form.allergens ?? []).includes(key);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleAllergen(key)}
                  className={cn(
                    "badge border",
                    active
                      ? "border-gold/50 bg-gold/15 text-gold-light"
                      : "border-ink-border bg-ink-soft text-neutral-500",
                  )}
                >
                  {val.de}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-ink-border pt-4">
          <button type="button" onClick={onClose} className="btn-ghost">
            Abbrechen
          </button>
          <button type="submit" disabled={saving} className="btn-gold">
            <Save className="h-4 w-4" />
            {saving ? "Speichern …" : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
        checked
          ? "border-gold/50 bg-gold/10 text-gold-light"
          : "border-ink-border text-neutral-400",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border",
          checked ? "border-gold bg-gold text-ink" : "border-neutral-600",
        )}
      >
        {checked && "✓"}
      </span>
      {label}
    </button>
  );
}

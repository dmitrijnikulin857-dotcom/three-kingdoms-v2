"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  Bike,
  Store,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useCart } from "@/components/providers/cart-provider";
import { DishCard } from "@/components/ui/dish-card";
import { orderSchema } from "@/lib/validations";
import { formatPrice } from "@/lib/utils";
import { RESTAURANT } from "@/lib/menu-data";
import type { MenuCategoryWithDishes } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  categories: MenuCategoryWithDishes[];
  takeawayEnabled: boolean;
  deliveryEnabled: boolean;
  deliveryFee: number;
  minOrderValue: number;
}

const PICKUP_SLOTS = [
  "ASAP", "12:30", "13:00", "13:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00",
];

export function OrderView({
  categories,
  takeawayEnabled,
  deliveryEnabled,
  deliveryFee,
  minOrderValue,
}: Props) {
  const { locale, t } = useLanguage();
  const { items, updateQuantity, removeItem, subtotal, clear, count } = useCart();

  const [type, setType] = useState<"TAKEAWAY" | "DELIVERY">(
    takeawayEnabled ? "TAKEAWAY" : "DELIVERY",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const orderingDisabled = !takeawayEnabled && !deliveryEnabled;

  const effectiveDeliveryFee = type === "DELIVERY" ? deliveryFee : 0;
  const total = subtotal + effectiveDeliveryFee;
  const belowMin = type === "DELIVERY" && subtotal < minOrderValue;

  const activeCategories = useMemo(
    () => categories.filter((c) => c.dishes.length > 0),
    [categories],
  );

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      customerName: String(formData.get("customerName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      type,
      address: String(formData.get("address") ?? ""),
      pickupTime: String(formData.get("pickupTime") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      items: items.map((i) => ({
        dishId: i.dishId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    };

    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    if (belowMin) {
      setErrors({ address: t.order.minOrder(formatPrice(minOrderValue)) });
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Fehler");
      }
      clear();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Fehler");
    }
  }

  if (status === "success") {
    return (
      <div className="container-tk max-w-lg py-24 text-center">
        <div className="card animate-fade-in p-10">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" />
          <h1 className="mt-6 font-serif text-3xl font-bold text-white">
            {t.order.successTitle}
          </h1>
          <p className="mt-4 text-neutral-400">{t.order.successText}</p>
          <a href={`tel:${RESTAURANT.phoneIntl}`} className="btn-outline mt-8">
            <Phone className="h-4 w-4" />
            {RESTAURANT.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="border-b border-ink-border bg-ink-soft py-14">
        <div className="container-tk text-center">
          <h1 className="section-heading">{t.order.title}</h1>
          <p className="mt-3 text-neutral-400">{t.order.subtitle}</p>
        </div>
      </div>

      {orderingDisabled ? (
        <div className="container-tk max-w-lg py-16 text-center">
          <div className="card p-8">
            <p className="text-neutral-300">{t.order.disabled}</p>
            <a href={`tel:${RESTAURANT.phoneIntl}`} className="btn-gold mt-6">
              <Phone className="h-4 w-4" />
              {RESTAURANT.phone}
            </a>
          </div>
        </div>
      ) : (
        <div className="container-tk grid gap-8 pt-12 lg:grid-cols-[1fr_380px]">
          {/* Menu list */}
          <div className="space-y-14">
            {activeCategories.map((cat) => (
              <section key={cat.id}>
                <h2 className="mb-6 border-b border-ink-border pb-3 font-serif text-2xl font-bold text-white">
                  {locale === "de" ? cat.nameDe : cat.nameEn}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {cat.dishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} locale={locale} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Cart sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-ink-border bg-ink-soft px-5 py-4">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="font-serif text-lg font-semibold text-white">
                  {t.order.cart}
                </h2>
                {count > 0 && (
                  <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-ink">
                    {count}
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-neutral-500">
                  {t.order.emptyCart}
                </p>
              ) : (
                <>
                  <ul className="max-h-[40vh] divide-y divide-ink-border overflow-y-auto">
                    {items.map((item) => (
                      <li key={item.dishId} className="flex gap-3 p-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-soft">
                          {item.imageUrl && (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gold">
                            {formatPrice(item.price)}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <QtyButton
                              onClick={() =>
                                updateQuantity(item.dishId, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </QtyButton>
                            <span className="w-6 text-center text-sm text-white">
                              {item.quantity}
                            </span>
                            <QtyButton
                              onClick={() =>
                                updateQuantity(item.dishId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </QtyButton>
                            <button
                              onClick={() => removeItem(item.dishId)}
                              className="ml-auto text-neutral-500 hover:text-crimson-light"
                              aria-label="remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Type toggle */}
                  <div className="grid grid-cols-2 gap-2 border-t border-ink-border p-4">
                    {takeawayEnabled && (
                      <TypeButton
                        active={type === "TAKEAWAY"}
                        onClick={() => setType("TAKEAWAY")}
                        icon={<Store className="h-4 w-4" />}
                        label={t.order.takeaway}
                      />
                    )}
                    {deliveryEnabled && (
                      <TypeButton
                        active={type === "DELIVERY"}
                        onClick={() => setType("DELIVERY")}
                        icon={<Bike className="h-4 w-4" />}
                        label={t.order.delivery}
                      />
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-t border-ink-border px-5 py-4 text-sm">
                    <div className="flex justify-between text-neutral-400">
                      <span>{t.order.subtotal}</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {type === "DELIVERY" && (
                      <div className="flex justify-between text-neutral-400">
                        <span>{t.order.deliveryFee}</span>
                        <span>{formatPrice(effectiveDeliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-ink-border pt-2 text-base font-semibold text-white">
                      <span>{t.order.total}</span>
                      <span className="text-gold">{formatPrice(total)}</span>
                    </div>
                    {belowMin && (
                      <p className="text-xs text-crimson-light">
                        {t.order.minOrder(formatPrice(minOrderValue))}
                      </p>
                    )}
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => setShowCheckout((v) => !v)}
                      disabled={belowMin}
                      className="btn-gold w-full"
                    >
                      {t.order.checkout}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Checkout form */}
            {showCheckout && items.length > 0 && (
              <form
                onSubmit={handleCheckout}
                className="card mt-4 space-y-4 p-5"
                noValidate
              >
                <div>
                  <label className="label">{t.reservation.name}</label>
                  <input name="customerName" className="input" />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-crimson-light">
                      {errors.customerName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label">{t.reservation.phone}</label>
                  <input name="phone" type="tel" className="input" />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-crimson-light">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="label">{t.reservation.email}</label>
                  <input name="email" type="email" className="input" />
                  {errors.email && (
                    <p className="mt-1 text-xs text-crimson-light">{errors.email}</p>
                  )}
                </div>

                {type === "DELIVERY" ? (
                  <div>
                    <label className="label">
                      {locale === "de" ? "Lieferadresse" : "Delivery address"}
                    </label>
                    <input name="address" className="input" />
                    {errors.address && (
                      <p className="mt-1 text-xs text-crimson-light">
                        {errors.address}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="label">
                      {locale === "de" ? "Abholzeit" : "Pickup time"}
                    </label>
                    <select name="pickupTime" className="input" defaultValue="ASAP">
                      {PICKUP_SLOTS.map((s) => (
                        <option key={s} value={s}>
                          {s === "ASAP"
                            ? locale === "de"
                              ? "So schnell wie möglich"
                              : "As soon as possible"
                            : s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="label">{t.reservation.notes}</label>
                  <textarea name="notes" rows={2} className="input resize-none" />
                </div>

                {serverError && (
                  <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-3 py-2 text-sm text-crimson-light">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || belowMin}
                  className="btn-gold w-full"
                >
                  {status === "loading"
                    ? t.reservation.submitting
                    : `${t.order.placeOrder} · ${formatPrice(total)}`}
                </button>
              </form>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function QtyButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded-md border border-ink-border text-neutral-300 hover:border-gold/50 hover:text-gold"
    >
      {children}
    </button>
  );
}

function TypeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-gold bg-gold/15 text-gold-light"
          : "border-ink-border text-neutral-400 hover:text-white",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

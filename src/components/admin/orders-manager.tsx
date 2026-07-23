"use client";

import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Bike,
  Store,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AdminOrder } from "@/lib/admin-data";
import { formatPrice, formatDateTime, cn } from "@/lib/utils";
import { StatusBadge, ORDER_STATUSES } from "./status-badge";

const FILTERS = ["ALL", ...ORDER_STATUSES] as const;

export function OrdersManager({
  initialOrders,
}: {
  initialOrders: AdminOrder[];
}) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(
    () => (filter === "ALL" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  async function changeStatus(id: string, status: string) {
    const prev = orders;
    setOrders((list) =>
      list.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      setOrders(prev);
      setNotice(result.error ?? "Fehler beim Aktualisieren");
      setTimeout(() => setNotice(""), 3000);
    } else if (result.demo) {
      setNotice("Demo-Modus: Änderung nicht dauerhaft gespeichert.");
      setTimeout(() => setNotice(""), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Bestellungen</h1>
        <p className="mt-1 text-neutral-400">
          {orders.length} Bestellungen · Status in Echtzeit verwalten
        </p>
      </div>

      {notice && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          {notice}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === f
                ? "border-gold bg-gold text-ink"
                : "border-ink-border bg-ink-soft text-neutral-400 hover:text-white",
            )}
          >
            {f === "ALL" ? "Alle" : <StatusLabelInline status={f} />}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-20 text-neutral-600">
          <ShoppingBag className="h-10 w-10" />
          <p>Keine Bestellungen in dieser Ansicht.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const isOpen = expanded === order.id;
            const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <div key={order.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-soft text-gold">
                    {order.type === "DELIVERY" ? (
                      <Bike className="h-5 w-5" />
                    ) : (
                      <Store className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{order.customerName}</p>
                    <p className="text-xs text-neutral-500">
                      {formatDateTime(order.createdAt)} · {itemCount} Artikel ·{" "}
                      {order.type === "DELIVERY" ? "Lieferung" : "Abholung"}
                    </p>
                  </div>
                  <span className="font-semibold text-gold">
                    {formatPrice(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-neutral-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neutral-500" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-ink-border bg-ink-soft/50 p-5">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-3 text-sm font-semibold text-white">
                          Artikel
                        </h3>
                        <ul className="space-y-2 text-sm">
                          {order.items.map((item, i) => (
                            <li key={i} className="flex justify-between text-neutral-300">
                              <span>
                                {item.quantity}× {item.name}
                              </span>
                              <span className="text-neutral-400">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 space-y-1 border-t border-ink-border pt-3 text-sm">
                          <div className="flex justify-between text-neutral-400">
                            <span>Zwischensumme</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          {order.deliveryFee > 0 && (
                            <div className="flex justify-between text-neutral-400">
                              <span>Liefergebühr</span>
                              <span>{formatPrice(order.deliveryFee)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-white">
                            <span>Gesamt</span>
                            <span className="text-gold">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-sm font-semibold text-white">
                          Kontakt & Details
                        </h3>
                        <ul className="space-y-2 text-sm text-neutral-300">
                          <li className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gold" />
                            <a href={`tel:${order.phone}`} className="hover:text-gold">
                              {order.phone}
                            </a>
                          </li>
                          {order.email && (
                            <li className="text-neutral-400">{order.email}</li>
                          )}
                          {order.type === "DELIVERY" && order.address && (
                            <li className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                              {order.address}
                            </li>
                          )}
                          {order.pickupTime && (
                            <li className="text-neutral-400">
                              Abholzeit: {order.pickupTime}
                            </li>
                          )}
                          {order.notes && (
                            <li className="rounded-lg bg-ink-card p-3 text-neutral-400">
                              „{order.notes}"
                            </li>
                          )}
                        </ul>

                        <h3 className="mb-2 mt-5 text-sm font-semibold text-white">
                          Status ändern
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {ORDER_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => changeStatus(order.id, s)}
                              className={cn(
                                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                                order.status === s
                                  ? "border-gold bg-gold/15 text-gold-light"
                                  : "border-ink-border text-neutral-400 hover:text-white",
                              )}
                            >
                              <StatusLabelInline status={s} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusLabelInline({ status }: { status: string }) {
  const labels: Record<string, string> = {
    PENDING: "Ausstehend",
    CONFIRMED: "Bestätigt",
    PREPARING: "Zubereitung",
    READY: "Abholbereit",
    COMPLETED: "Abgeschlossen",
    CANCELLED: "Storniert",
  };
  return <>{labels[status] ?? status}</>;
}

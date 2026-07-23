"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Phone, Users, Clock } from "lucide-react";
import type { AdminReservation } from "@/lib/admin-data";
import { formatDate, cn } from "@/lib/utils";
import { StatusBadge, RESERVATION_STATUSES } from "./status-badge";

const FILTERS = ["ALL", ...RESERVATION_STATUSES] as const;

const STATUS_LABELS: Record<string, string> = {
  ALL: "Alle",
  PENDING: "Ausstehend",
  CONFIRMED: "Bestätigt",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
};

export function ReservationsManager({
  initialReservations,
}: {
  initialReservations: AdminReservation[];
}) {
  const [reservations, setReservations] =
    useState<AdminReservation[]>(initialReservations);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(
    () =>
      filter === "ALL"
        ? reservations
        : reservations.filter((r) => r.status === filter),
    [reservations, filter],
  );

  async function changeStatus(id: string, status: string) {
    const prev = reservations;
    setReservations((list) =>
      list.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    const res = await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      setReservations(prev);
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
        <h1 className="font-serif text-3xl font-bold text-white">Reservierungen</h1>
        <p className="mt-1 text-neutral-400">
          {reservations.length} Reservierungen · Status verwalten
        </p>
      </div>

      {notice && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          {notice}
        </div>
      )}

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
            {STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-20 text-neutral-600">
          <CalendarDays className="h-10 w-10" />
          <p>Keine Reservierungen in dieser Ansicht.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg font-semibold text-white">
                    {r.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {formatDate(r.date)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <span className="flex items-center gap-2 text-neutral-300">
                  <Clock className="h-4 w-4 text-gold" />
                  {r.time} Uhr
                </span>
                <span className="flex items-center gap-2 text-neutral-300">
                  <Users className="h-4 w-4 text-gold" />
                  {r.guests} {r.guests === 1 ? "Gast" : "Gäste"}
                </span>
                <a
                  href={`tel:${r.phone}`}
                  className="col-span-2 flex items-center gap-2 text-neutral-300 hover:text-gold"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  {r.phone}
                </a>
              </div>

              {r.email && (
                <p className="mt-2 text-sm text-neutral-500">{r.email}</p>
              )}
              {r.notes && (
                <p className="mt-3 rounded-lg bg-ink-soft p-3 text-sm text-neutral-400">
                  „{r.notes}"
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-border pt-4">
                {RESERVATION_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(r.id, s)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      r.status === s
                        ? "border-gold bg-gold/15 text-gold-light"
                        : "border-ink-border text-neutral-400 hover:text-white",
                    )}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Save, Clock, Plus, Trash2, ToggleLeft } from "lucide-react";
import type { RestaurantSettings } from "@/lib/data";
import type { OpeningHour, SpecialDate } from "@/lib/types";
import { dayName, orderedHours } from "@/lib/opening-hours";
import { cn } from "@/lib/utils";

export function SettingsManager({
  initialSettings,
}: {
  initialSettings: RestaurantSettings;
}) {
  const [hours, setHours] = useState<OpeningHour[]>(
    orderedHours(initialSettings.openingHours),
  );
  const [special, setSpecial] = useState<SpecialDate[]>(
    initialSettings.specialDates,
  );
  const [reservationsEnabled, setReservationsEnabled] = useState(
    initialSettings.reservationsEnabled,
  );
  const [takeawayEnabled, setTakeawayEnabled] = useState(
    initialSettings.takeawayEnabled,
  );
  const [deliveryEnabled, setDeliveryEnabled] = useState(
    initialSettings.deliveryEnabled,
  );
  const [deliveryFee, setDeliveryFee] = useState(initialSettings.deliveryFee);
  const [minOrderValue, setMinOrderValue] = useState(
    initialSettings.minOrderValue,
  );

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function updateHour(day: number, patch: Partial<OpeningHour>) {
    setHours((prev) =>
      prev.map((h) => (h.day === day ? { ...h, ...patch } : h)),
    );
  }

  async function save() {
    setSaving(true);
    setNotice("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        openingHours: hours,
        specialDates: special,
        reservationsEnabled,
        takeawayEnabled,
        deliveryEnabled,
        deliveryFee,
        minOrderValue,
      }),
    });
    const result = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setNotice(result.error ?? "Speichern fehlgeschlagen");
    } else if (result.demo) {
      setNotice("Demo-Modus: Änderungen nicht dauerhaft gespeichert.");
    } else {
      setNotice("Einstellungen gespeichert.");
    }
    setTimeout(() => setNotice(""), 4000);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Einstellungen</h1>
          <p className="mt-1 text-neutral-400">
            Öffnungszeiten, Bestell-Optionen und Gebühren verwalten
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-gold">
          <Save className="h-4 w-4" />
          {saving ? "Speichern …" : "Speichern"}
        </button>
      </div>

      {notice && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          {notice}
        </div>
      )}

      {/* Opening hours */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-white">
          <Clock className="h-5 w-5 text-gold" />
          Öffnungszeiten
        </h2>
        <div className="mt-5 space-y-3">
          {hours.map((h) => (
            <div
              key={h.day}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-border bg-ink-soft p-3"
            >
              <span className="w-28 font-medium text-white">
                {dayName(h.day, "de")}
              </span>
              <button
                onClick={() => updateHour(h.day, { closed: !h.closed })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium",
                  h.closed
                    ? "border-crimson/40 bg-crimson/10 text-crimson-light"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                )}
              >
                {h.closed ? "Geschlossen" : "Geöffnet"}
              </button>
              {!h.closed && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h.open}
                    onChange={(e) => updateHour(h.day, { open: e.target.value })}
                    className="input w-32 [color-scheme:dark]"
                  />
                  <span className="text-neutral-500">–</span>
                  <input
                    type="time"
                    value={h.close}
                    onChange={(e) => updateHour(h.day, { close: e.target.value })}
                    className="input w-32 [color-scheme:dark]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Special dates */}
      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-white">
            Feiertage & Sondertage
          </h2>
          <button
            onClick={() =>
              setSpecial((prev) => [
                ...prev,
                {
                  date: new Date().toISOString().slice(0, 10),
                  label: "Feiertag",
                  closed: true,
                },
              ])
            }
            className="btn-outline h-9 px-3 py-0 text-xs"
          >
            <Plus className="h-4 w-4" />
            Hinzufügen
          </button>
        </div>
        {special.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            Keine Sondertage eingetragen.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {special.map((s, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-ink-border bg-ink-soft p-3"
              >
                <input
                  type="date"
                  value={s.date}
                  onChange={(e) =>
                    setSpecial((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, date: e.target.value } : x,
                      ),
                    )
                  }
                  className="input w-40 [color-scheme:dark]"
                />
                <input
                  type="text"
                  value={s.label}
                  placeholder="Bezeichnung"
                  onChange={(e) =>
                    setSpecial((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, label: e.target.value } : x,
                      ),
                    )
                  }
                  className="input flex-1 min-w-[140px]"
                />
                <button
                  onClick={() =>
                    setSpecial((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, closed: !x.closed } : x,
                      ),
                    )
                  }
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium",
                    s.closed
                      ? "border-crimson/40 bg-crimson/10 text-crimson-light"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                  )}
                >
                  {s.closed ? "Geschlossen" : "Geöffnet"}
                </button>
                <button
                  onClick={() =>
                    setSpecial((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-border text-neutral-400 hover:border-crimson/50 hover:text-crimson-light"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Toggles & fees */}
      <section className="card p-6">
        <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-white">
          <ToggleLeft className="h-5 w-5 text-gold" />
          Bestell-Optionen
        </h2>
        <div className="mt-5 space-y-4">
          <ToggleRow
            label="Online-Reservierungen"
            description="Gäste können über die Website Tische reservieren."
            checked={reservationsEnabled}
            onChange={setReservationsEnabled}
          />
          <ToggleRow
            label="Abholung (Takeaway)"
            description="Bestellungen zur Selbstabholung aktivieren."
            checked={takeawayEnabled}
            onChange={setTakeawayEnabled}
          />
          <ToggleRow
            label="Lieferung"
            description="Lieferbestellungen aktivieren."
            checked={deliveryEnabled}
            onChange={setDeliveryEnabled}
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Liefergebühr (€)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="label">Mindestbestellwert Lieferung (€)</label>
            <input
              type="number"
              step="1"
              min="0"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(Number(e.target.value))}
              className="input"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ink-border bg-ink-soft p-4">
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-gold" : "bg-ink-border",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "left-6" : "left-1",
          )}
        />
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2, Phone, Users } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { reservationSchema } from "@/lib/validations";
import { RESTAURANT } from "@/lib/menu-data";
import type { OpeningHour } from "@/lib/types";

interface Props {
  enabled: boolean;
  openingHours: OpeningHour[];
}

const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00",
];

export function ReservationForm({ enabled }: Props) {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? ""),
      guests: String(formData.get("guests") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    const parsed = reservationSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Fehler");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Etwas ist schiefgelaufen",
      );
    }
  }

  if (!enabled) {
    return (
      <div className="container-tk max-w-lg text-center">
        <h1 className="section-heading">{t.reservation.title}</h1>
        <div className="card mt-8 p-8">
          <p className="text-neutral-300">{t.reservation.disabled}</p>
          <a href={`tel:${RESTAURANT.phoneIntl}`} className="btn-gold mt-6">
            <Phone className="h-4 w-4" />
            {RESTAURANT.phone}
          </a>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container-tk max-w-lg text-center">
        <div className="card animate-fade-in p-10">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" />
          <h1 className="mt-6 font-serif text-3xl font-bold text-white">
            {t.reservation.successTitle}
          </h1>
          <p className="mt-4 text-neutral-400">{t.reservation.successText}</p>
          <a href={`tel:${RESTAURANT.phoneIntl}`} className="btn-outline mt-8">
            <Phone className="h-4 w-4" />
            {RESTAURANT.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-tk max-w-2xl">
      <div className="text-center">
        <CalendarCheck className="mx-auto h-10 w-10 text-gold" />
        <h1 className="section-heading mt-4">{t.reservation.title}</h1>
        <p className="mt-3 text-neutral-400">{t.reservation.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-10 space-y-5 p-6 sm:p-8" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.reservation.name} error={errors.name}>
            <input name="name" type="text" className="input" autoComplete="name" />
          </Field>
          <Field label={t.reservation.phone} error={errors.phone}>
            <input name="phone" type="tel" className="input" autoComplete="tel" />
          </Field>
        </div>

        <Field label={t.reservation.email} error={errors.email}>
          <input name="email" type="email" className="input" autoComplete="email" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label={t.reservation.date} error={errors.date}>
            <input
              name="date"
              type="date"
              min={today}
              defaultValue={today}
              className="input [color-scheme:dark]"
            />
          </Field>
          <Field label={t.reservation.time} error={errors.time}>
            <select name="time" defaultValue="19:00" className="input">
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.reservation.guests} error={errors.guests}>
            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                name="guests"
                type="number"
                min={1}
                max={20}
                defaultValue={2}
                className="input pl-9"
              />
            </div>
          </Field>
        </div>

        <Field label={t.reservation.notes} error={errors.notes}>
          <textarea name="notes" rows={3} className="input resize-none" />
        </Field>

        {serverError && (
          <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-crimson-light">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-gold w-full"
        >
          {status === "loading" ? t.reservation.submitting : t.reservation.submit}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-crimson-light">{error}</p>}
    </div>
  );
}

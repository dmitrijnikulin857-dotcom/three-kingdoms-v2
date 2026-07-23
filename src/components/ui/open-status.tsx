"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getOpenStatus } from "@/lib/opening-hours";
import type { OpeningHour, SpecialDate, OpenStatus } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

interface Props {
  openingHours: OpeningHour[];
  specialDates?: SpecialDate[];
  compact?: boolean;
}

export function OpenStatusBadge({
  openingHours,
  specialDates = [],
  compact = false,
}: Props) {
  const { locale } = useLanguage();
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () =>
      setStatus(getOpenStatus(openingHours, specialDates, new Date(), locale));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [openingHours, specialDates, locale]);

  if (!status) {
    // Placeholder to avoid layout shift / hydration mismatch.
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-soft px-3 py-1.5 text-sm text-neutral-500">
        <Clock className="h-3.5 w-3.5" />
        …
      </span>
    );
  }

  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium " +
        (status.isOpen
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          : "border-crimson/40 bg-crimson/10 text-crimson-light")
      }
    >
      <span className="relative flex h-2 w-2">
        <span
          className={
            "absolute inline-flex h-full w-full rounded-full opacity-75 " +
            (status.isOpen ? "animate-ping bg-emerald-400" : "bg-crimson")
          }
        />
        <span
          className={
            "relative inline-flex h-2 w-2 rounded-full " +
            (status.isOpen ? "bg-emerald-400" : "bg-crimson")
          }
        />
      </span>
      {status.label}
      {!compact && (
        <span className="text-neutral-400">· {status.detail}</span>
      )}
    </span>
  );
}

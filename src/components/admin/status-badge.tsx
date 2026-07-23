"use client";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Ausstehend",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  },
  CONFIRMED: {
    label: "Bestätigt",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  },
  PREPARING: {
    label: "In Zubereitung",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  },
  READY: {
    label: "Abholbereit",
    className: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300",
  },
  COMPLETED: {
    label: "Abgeschlossen",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  },
  CANCELLED: {
    label: "Storniert",
    className: "border-crimson/40 bg-crimson/10 text-crimson-light",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? {
    label: status,
    className: "border-ink-border bg-ink-soft text-neutral-400",
  };
  return (
    <span className={`badge border ${style.className}`}>{style.label}</span>
  );
}

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;

export const RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

import type { OpeningHour, SpecialDate, OpenStatus, Locale } from "./types";

const DAY_NAMES_DE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const DAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Computes whether the restaurant is currently open, based on the weekly
 * opening hours and any special dates (holidays / altered hours).
 */
export function getOpenStatus(
  hours: OpeningHour[],
  specialDates: SpecialDate[] = [],
  now: Date = new Date(),
  locale: Locale = "de",
): OpenStatus {
  const t = (de: string, en: string) => (locale === "de" ? de : en);

  const todayKey = localDateKey(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const dayOfWeek = now.getDay();

  // Special date overrides today's regular hours.
  const special = specialDates.find((s) => s.date === todayKey);
  let open: string | null = null;
  let close: string | null = null;

  if (special) {
    if (special.closed || !special.open || !special.close) {
      return {
        isOpen: false,
        label: t("Geschlossen", "Closed"),
        detail: special.label || t("Heute geschlossen", "Closed today"),
        nextChange: null,
      };
    }
    open = special.open;
    close = special.close;
  } else {
    const todayHours = hours.find((h) => h.day === dayOfWeek);
    if (!todayHours || todayHours.closed) {
      const next = findNextOpenDay(hours, dayOfWeek);
      return {
        isOpen: false,
        label: t("Geschlossen", "Closed"),
        detail: next
          ? t(
              `Öffnet ${next.dayName} um ${next.open} Uhr`,
              `Opens ${next.dayNameEn} at ${next.open}`,
            )
          : t("Heute geschlossen", "Closed today"),
        nextChange: null,
      };
    }
    open = todayHours.open;
    close = todayHours.close;
  }

  const openMin = toMinutes(open);
  let closeMin = toMinutes(close);
  // Handle past-midnight closing (e.g. 23:30 stays same-day; but 00:30 → +24h).
  if (closeMin <= openMin) closeMin += 24 * 60;

  if (nowMinutes >= openMin && nowMinutes < closeMin) {
    const remaining = closeMin - nowMinutes;
    return {
      isOpen: true,
      label: t("Jetzt geöffnet", "Open now"),
      detail:
        remaining <= 60
          ? t(`Schließt in ${remaining} Min`, `Closes in ${remaining} min`)
          : t(`Schließt um ${close} Uhr`, `Closes at ${close}`),
      nextChange: close,
    };
  }

  if (nowMinutes < openMin) {
    return {
      isOpen: false,
      label: t("Geschlossen", "Closed"),
      detail: t(`Öffnet um ${open} Uhr`, `Opens at ${open}`),
      nextChange: open,
    };
  }

  // After closing today — find next open day.
  const next = findNextOpenDay(hours, dayOfWeek);
  return {
    isOpen: false,
    label: t("Geschlossen", "Closed"),
    detail: next
      ? t(
          `Öffnet ${next.dayName} um ${next.open} Uhr`,
          `Opens ${next.dayNameEn} at ${next.open}`,
        )
      : t("Geschlossen", "Closed"),
    nextChange: null,
  };
}

function findNextOpenDay(hours: OpeningHour[], fromDay: number) {
  for (let i = 1; i <= 7; i++) {
    const day = (fromDay + i) % 7;
    const h = hours.find((x) => x.day === day);
    if (h && !h.closed) {
      return {
        dayName: DAY_NAMES_DE[day],
        dayNameEn: DAY_NAMES_EN[day],
        open: h.open,
      };
    }
  }
  return null;
}

export function dayName(day: number, locale: Locale = "de"): string {
  return locale === "de" ? DAY_NAMES_DE[day] : DAY_NAMES_EN[day];
}

/** Ordered Mon..Sun list for display. */
export function orderedHours(hours: OpeningHour[]): OpeningHour[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order
    .map((d) => hours.find((h) => h.day === d))
    .filter((h): h is OpeningHour => Boolean(h));
}

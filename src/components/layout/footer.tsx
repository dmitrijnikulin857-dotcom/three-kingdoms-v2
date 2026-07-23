"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Star } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { RESTAURANT } from "@/lib/menu-data";
import { orderedHours, dayName } from "@/lib/opening-hours";
import type { OpeningHour } from "@/lib/types";

export function Footer({ openingHours }: { openingHours: OpeningHour[] }) {
  const { locale, t } = useLanguage();
  const hours = orderedHours(openingHours);
  const year = 2024;

  return (
    <footer className="border-t border-ink-border bg-ink-soft">
      <div className="container-tk grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 font-serif text-xl font-bold text-gold">
              三
            </span>
            <span className="font-serif text-lg font-bold text-white">
              Three Kingdoms
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-neutral-400">
            {t.footer.tagline}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-gold">
            <Star className="h-4 w-4" fill="currentColor" />
            <span className="font-semibold">{RESTAURANT.rating}</span>
            <span className="text-neutral-500">
              / 5 · {RESTAURANT.reviewCount} {t.common.reviews}
            </span>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-serif text-lg text-white">{t.footer.contact}</h3>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {RESTAURANT.street}
                <br />
                {RESTAURANT.zip} {RESTAURANT.city}
              </span>
            </li>
            <li>
              <a
                href={`tel:${RESTAURANT.phoneIntl}`}
                className="flex items-center gap-2.5 hover:text-gold"
              >
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {RESTAURANT.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${RESTAURANT.email}`}
                className="flex items-center gap-2.5 hover:text-gold"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {RESTAURANT.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="mb-4 font-serif text-lg text-white">{t.footer.hours}</h3>
          <ul className="space-y-1.5 text-sm text-neutral-400">
            {hours.map((h: OpeningHour) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{dayName(h.day, locale)}</span>
                <span className="text-neutral-300">
                  {h.closed ? t.common.closed : `${h.open} – ${h.close}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal + links */}
        <div>
          <h3 className="mb-4 font-serif text-lg text-white">{t.footer.legal}</h3>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li>
              <Link href="/menu" className="hover:text-gold">
                {t.nav.menu}
              </Link>
            </li>
            <li>
              <Link href="/reservation" className="hover:text-gold">
                {t.nav.reservation}
              </Link>
            </li>
            <li>
              <Link href="/impressum" className="hover:text-gold">
                {t.footer.impressum}
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-gold">
                {t.footer.datenschutz}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-gold">
                {t.nav.admin}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-border">
        <div className="container-tk flex flex-col items-center justify-between gap-2 py-6 text-xs text-neutral-500 sm:flex-row">
          <p>
            © {year} {RESTAURANT.name}. {t.footer.rights}
          </p>
          <p>Stresemannstraße 4 · 40210 Düsseldorf</p>
        </div>
      </div>
    </footer>
  );
}

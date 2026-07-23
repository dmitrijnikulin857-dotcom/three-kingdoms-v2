"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useCart } from "@/components/providers/cart-provider";
import { OpenStatusBadge } from "@/components/ui/open-status";
import { RESTAURANT } from "@/lib/menu-data";
import type { OpeningHour, SpecialDate } from "@/lib/types";
import { cn } from "@/lib/utils";

interface HeaderProps {
  openingHours: OpeningHour[];
  specialDates: SpecialDate[];
}

export function Header({ openingHours, specialDates }: HeaderProps) {
  const { locale, setLocale, t } = useLanguage();
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/menu", label: t.nav.menu },
    { href: "/reservation", label: t.nav.reservation },
    { href: "/order", label: t.nav.order },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink-border/80 bg-ink/90 backdrop-blur-lg">
      <div className="container-tk flex h-20 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 font-serif text-xl font-bold text-gold">
            三
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-lg font-bold text-white">
              Three Kingdoms
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
              Sichuan · Düsseldorf
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-white/5 text-gold"
                  : "text-neutral-300 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden xl:block">
            <OpenStatusBadge
              openingHours={openingHours}
              specialDates={specialDates}
              compact
            />
          </div>

          {/* Language toggle */}
          <div className="flex items-center rounded-full border border-ink-border bg-ink-soft p-0.5 text-xs font-semibold">
            {(["de", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={cn(
                  "rounded-full px-2.5 py-1 uppercase transition-colors",
                  locale === l ? "bg-gold text-ink" : "text-neutral-400 hover:text-white",
                )}
                aria-pressed={locale === l}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Cart */}
          <Link
            href="/order"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink-border text-neutral-300 transition-colors hover:border-gold/50 hover:text-gold"
            aria-label={t.order.cart}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Phone (desktop) */}
          <a
            href={`tel:${RESTAURANT.phoneIntl}`}
            className="btn-gold hidden h-10 px-4 py-0 text-xs md:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {RESTAURANT.phone}
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-border text-white lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="animate-slide-down border-t border-ink-border bg-ink px-4 py-4 lg:hidden">
          <div className="mb-4">
            <OpenStatusBadge openingHours={openingHours} specialDates={specialDates} />
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-white/5 text-gold"
                    : "text-neutral-200 hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${RESTAURANT.phoneIntl}`}
              className="btn-gold mt-2 w-full"
            >
              <Phone className="h-4 w-4" />
              {RESTAURANT.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

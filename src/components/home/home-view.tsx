"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Flame,
  Fish,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { OpenStatusBadge } from "@/components/ui/open-status";
import { DishCard } from "@/components/ui/dish-card";
import { RESTAURANT } from "@/lib/menu-data";
import type { MenuDish, OpeningHour, SpecialDate } from "@/lib/types";

interface Props {
  signatureDishes: MenuDish[];
  openingHours: OpeningHour[];
  specialDates: SpecialDate[];
}

export function HomeView({ signatureDishes, openingHours, specialDates }: Props) {
  const { locale, t } = useLanguage();

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1920&q=80"
          alt="China Restaurant Three Kingdoms"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

        <div className="container-tk relative z-10 py-24">
          <div className="max-w-2xl animate-fade-in">
            <span className="badge border border-gold/40 bg-gold/10 text-gold-light">
              {t.hero.badge}
            </span>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.05] text-white sm:text-6xl md:text-7xl">
              China Restaurant
              <br />
              <span className="gold-text">Three Kingdoms</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-neutral-300">
              {t.hero.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <OpenStatusBadge
                openingHours={openingHours}
                specialDates={specialDates}
              />
              <span className="inline-flex items-center gap-1.5 text-sm text-neutral-300">
                <Star className="h-4 w-4 text-gold" fill="currentColor" />
                <span className="font-semibold text-white">{RESTAURANT.rating}</span>
                <span className="text-neutral-500">
                  · {RESTAURANT.reviewCount} {t.common.reviews}
                </span>
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/reservation" className="btn-gold">
                {t.hero.cta1}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/menu" className="btn-outline">
                {t.hero.cta2}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <section className="container-tk py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink-border">
            <Image
              src="https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1000&q=80"
              alt="Sichuan Küche"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Sichuan · 四川
            </span>
            <h2 className="section-heading mt-3">{t.home.aboutTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-400">
              {t.home.aboutText}
            </p>
            <Link href="/menu" className="btn-ghost mt-6 px-0 hover:bg-transparent hover:text-gold">
              {t.common.viewMenu}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Signature dishes ---------------- */}
      {signatureDishes.length > 0 && (
        <section className="border-y border-ink-border bg-ink-soft py-20 md:py-28">
          <div className="container-tk">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="section-heading">{t.home.signatureTitle}</h2>
              <p className="mt-4 text-neutral-400">{t.home.signatureSubtitle}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {signatureDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} locale={locale} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/menu" className="btn-gold">
                {t.common.viewMenu}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Why us ---------------- */}
      <section className="container-tk py-20 md:py-28">
        <h2 className="section-heading text-center">{t.home.whyTitle}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Feature
            icon={<Flame className="h-7 w-7" />}
            title={t.home.feature1Title}
            text={t.home.feature1Text}
          />
          <Feature
            icon={<Fish className="h-7 w-7" />}
            title={t.home.feature2Title}
            text={t.home.feature2Text}
          />
          <Feature
            icon={<Star className="h-7 w-7" />}
            title={t.home.feature3Title}
            text={t.home.feature3Text}
          />
        </div>
      </section>

      {/* ---------------- CTA + map ---------------- */}
      <section className="border-t border-ink-border bg-ink-soft py-20 md:py-28">
        <div className="container-tk grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <UtensilsCrossed className="h-10 w-10 text-gold" />
            <h2 className="section-heading mt-4">{t.home.ctaTitle}</h2>
            <p className="mt-4 text-lg text-neutral-400">{t.home.ctaText}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/reservation" className="btn-gold">
                {t.common.reserveTable}
              </Link>
              <a href={`tel:${RESTAURANT.phoneIntl}`} className="btn-outline">
                <Phone className="h-4 w-4" />
                {RESTAURANT.phone}
              </a>
            </div>

            <div className="mt-8 flex items-start gap-3 text-neutral-300">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-medium text-white">{RESTAURANT.name}</p>
                <p className="text-sm text-neutral-400">
                  {RESTAURANT.street}, {RESTAURANT.zip} {RESTAURANT.city}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-ink-border">
            <iframe
              title={t.home.findUs}
              src="https://www.google.com/maps?q=Stresemannstra%C3%9Fe%204%2C%2040210%20D%C3%BCsseldorf&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="min-h-[360px] w-full grayscale-[0.3]"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card flex flex-col items-start gap-4 p-8 transition-colors hover:border-gold/40">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold">
        {icon}
      </span>
      <h3 className="font-serif text-xl font-semibold text-white">{title}</h3>
      <p className="text-neutral-400">{text}</p>
    </div>
  );
}

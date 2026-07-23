# China Restaurant Three Kingdoms — Website & CMS

Production-ready website and admin panel for **China Restaurant Three Kingdoms**, an authentic Sichuan restaurant in Düsseldorf.

- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Prisma (PostgreSQL) · JWT auth (jose + bcrypt)
- **Languages:** German 🇩🇪 & English 🇬🇧 (client-side toggle)
- **Design:** premium dark theme (`#0D0D0E`) with gold & crimson accents

---

## ✨ Features

### Public site (DE / EN)
- Cinematic hero with live **"Jetzt geöffnet / Geschlossen"** status widget
- Digital menu — **12 categories, 36+ dishes** with search, filters (Bestseller / Spicy / Vegetarian / Vegan), spice & allergen badges
- Table **reservation** form with Zod validation
- **Online ordering** (takeaway / delivery) with persistent cart, delivery fee & minimum-order logic
- Legal pages: **Impressum**, **Datenschutz**, and a **Cookie Consent** banner
- SEO: Schema.org `Restaurant` JSON-LD, OpenGraph, `sitemap.xml`, `robots.txt`, PWA manifest

### Admin panel (`/admin`)
- Secure login with hashed passwords (bcrypt) and signed JWT sessions
- **Dashboard** — daily orders / revenue / reservations + revenue & status charts (Recharts)
- **Menu CMS** — full CRUD, price edits, Sold-Out & Bestseller toggles, images, spice, allergens
- **Order & Reservation managers** — live status changes
- **Settings** — opening hours, special dates, ordering toggles, fees
- **QR-Code generator** — downloadable QR codes linking to the menu (per table)

### Fail-safe by design
Every data-fetch is wrapped in try/catch with a built-in fallback dataset. **If `DATABASE_URL` is empty or unreachable, the site still serves the full menu** — it never shows an empty screen. The admin panel runs in a clearly-labeled "Demo mode" without a database.

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The site works immediately using built-in fallback data — **no database required for development**.

**Admin:** <http://localhost:3000/admin> · `owner@three-kingdoms.de` / `ChangeMe!2024`

## 🗄️ Enabling the database (optional)

1. Set a real `DATABASE_URL` (Vercel Postgres / Neon / Supabase) in `.env`.
2. Push the schema and seed data:
   ```bash
   npm run db:push
   npm run db:seed
   ```

Environment variables — see [`.env.example`](./.env.example):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (empty ⇒ fallback mode) |
| `AUTH_SECRET` | Secret for signing admin session JWTs |
| `NEXT_PUBLIC_SITE_URL` | Public base URL (SEO, sitemap, QR codes) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Super-admin credentials created by the seed |

## 🏗️ Build

```bash
npm run build   # runs `prisma generate` then `next build`
```

## ▲ Deploy on Vercel

1. Import the repo into Vercel.
2. Add the environment variables above (Project → Settings → Environment Variables).
3. Deploy. Dynamic routes use `export const dynamic = "force-dynamic"` so the CMS always reflects live data.

---

© 2024 China Restaurant Three Kingdoms · Stresemannstraße 4, 40210 Düsseldorf

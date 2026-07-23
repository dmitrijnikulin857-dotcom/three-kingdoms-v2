import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { RESTAURANT } from "@/lib/menu-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://three-kingdoms.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "China Restaurant Three Kingdoms · Authentische Sichuan-Küche Düsseldorf",
    template: "%s · Three Kingdoms Düsseldorf",
  },
  description:
    "Authentische Sichuan-Küche im Herzen von Düsseldorf. Gegrillter Fisch, Mapo Tofu, Dan Dan Nudeln & mehr. ★ 4,4 (786 Bewertungen). Jetzt reservieren oder online bestellen.",
  keywords: [
    "China Restaurant Düsseldorf",
    "Sichuan Küche Düsseldorf",
    "chinesisches Restaurant Düsseldorf",
    "Three Kingdoms",
    "gegrillter Fisch",
    "Mapo Tofu",
    "authentisch chinesisch",
    "Stresemannstraße",
  ],
  authors: [{ name: RESTAURANT.name }],
  creator: RESTAURANT.name,
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: RESTAURANT.name,
    title: "China Restaurant Three Kingdoms · Sichuan-Küche Düsseldorf",
    description:
      "Authentische Sichuan-Küche im Herzen von Düsseldorf. ★ 4,4 (786 Bewertungen).",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "China Restaurant Three Kingdoms Düsseldorf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "China Restaurant Three Kingdoms · Sichuan Düsseldorf",
    description: "Authentische Sichuan-Küche im Herzen von Düsseldorf.",
    images: [
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT.name,
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1200&q=80",
    "@id": siteUrl,
    url: siteUrl,
    telephone: RESTAURANT.phoneIntl,
    priceRange: "€€",
    servesCuisine: ["Sichuan", "Chinese"],
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT.street,
      addressLocality: RESTAURANT.city,
      postalCode: RESTAURANT.zip,
      addressCountry: RESTAURANT.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: RESTAURANT.latitude,
      longitude: RESTAURANT.longitude,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: RESTAURANT.rating,
      reviewCount: RESTAURANT.reviewCount,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "12:00",
        closes: "23:00",
      },
    ],
    acceptsReservations: "True",
  };

  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

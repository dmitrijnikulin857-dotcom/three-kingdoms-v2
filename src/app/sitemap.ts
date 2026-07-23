import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://three-kingdoms.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/menu", "/reservation", "/order", "/impressum", "/datenschutz"];
  const lastModified = new Date("2024-01-01");

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/menu" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/menu" ? 0.9 : 0.6,
  }));
}

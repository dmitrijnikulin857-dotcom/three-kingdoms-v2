import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "China Restaurant Three Kingdoms",
    short_name: "Three Kingdoms",
    description: "Authentische Sichuan-Küche in Düsseldorf",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0E",
    theme_color: "#0D0D0E",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

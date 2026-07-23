import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0D0D0E",
          soft: "#141416",
          card: "#1A1A1D",
          border: "#2A2A2E",
        },
        gold: {
          DEFAULT: "#C8A24B",
          light: "#E4C97A",
          dark: "#9A7B32",
        },
        crimson: {
          DEFAULT: "#B01E28",
          light: "#D64550",
          dark: "#7E141C",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E4C97A 0%, #C8A24B 50%, #9A7B32 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

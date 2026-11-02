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
        brand: {
          red: "#C92232",
          "red-dark": "#A91D2A",
          "red-deep": "#8B1621",
          stone: "#F1EEE8",
          sand: "#E5E0D8",
          rose: "#F2E4E2",
          charcoal: "#272524",
          concrete: "#D5D0C8",
          forest: "#49665A",
          ochre: "#A87936",
        },
        metro: {
          red: "#C92232",
          "red-dark": "#A91D2A",
          "red-deep": "#8B1621",
          "red-soft": "#F2E4E2",
          "red-light": "#F2E4E2",
          "red-subtle": "#FFF5F5",
          "red-hover": "#A91D2A",
          white: "#FFFFFF",
          charcoal: "#272524",
          "warm-white": "#F1EEE8",
          stone: "#E5E0D8",
          "grey-muted": "#78716C",
          "grey-deep": "#44403C",
          green: "#49665A",
          "green-light": "#EAF1EE",
          amber: "#A87936",
          "amber-light": "#FAF4EB",
          slate: "#334155",
          gray: "#F8FAFC",
        },
      },
      fontFamily: {
        bengali: [
          "'Anek Bangla'",
          "'Hind Siliguri'",
          "'Noto Sans Bengali'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        sans: [
          "'Manrope'",
          "'Inter'",
          "'Hind Siliguri'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: [
          "'Manrope'",
          "'Anek Bangla'",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        transit: '0 4px 20px -2px rgba(201, 34, 50, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        'transit-lg': '0 10px 30px -4px rgba(201, 34, 50, 0.18), 0 4px 10px -2px rgba(0, 0, 0, 0.08)',
        card: '0 8px 30px rgba(39, 37, 36, 0.06)',
        'card-hover': '0 16px 40px rgba(201, 34, 50, 0.12)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;

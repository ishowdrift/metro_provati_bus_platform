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
        metro: {
          red: "#D52B35",
          "red-dark": "#B91C1C",
          "red-deep": "#991B1B",
          "red-light": "#FEE2E2",
          "red-subtle": "#FEF2F2",
          "red-hover": "#C5222C",
          white: "#FFFFFF",
          charcoal: "#282828",
          "warm-white": "#F5F3F0",
          green: "#23866C",
          "green-light": "#E8F5E9",
          amber: "#E6A23C",
          "amber-light": "#FEF3C7",
          slate: "#334155",
          gray: "#F8FAFC",
        },
      },
      fontFamily: {
        bengali: [
          "'Hind Siliguri'",
          "'Noto Sans Bengali'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        sans: [
          "'Hind Siliguri'",
          "'Inter'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        'transit': '0 4px 20px -2px rgba(213, 43, 53, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        'transit-lg': '0 10px 30px -4px rgba(213, 43, 53, 0.18), 0 4px 10px -2px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;

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
          red: "#d32f2f",
          "red-dark": "#b71c1c",
          "red-light": "#fee2e2",
          "red-hover": "#c62828",
          navy: "#0f172a",
          "navy-light": "#1e293b",
          "navy-card": "#182234",
          teal: "#0d9488",
          "teal-light": "#ccfbf1",
          emerald: "#10b981",
          amber: "#d97706",
          slate: "#334155",
          gray: "#f8fafc",
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
    },
  },
  plugins: [],
};

export default config;

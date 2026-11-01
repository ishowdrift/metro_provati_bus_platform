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
          red: "#C92232",
          "red-dark": "#A91D2A",
          "red-deep": "#8B1621",
          "red-soft": "#FCEBEC",
          "red-light": "#FCEBEC",
          "red-subtle": "#FFF7F6",
          "red-hover": "#A91D2A",
          white: "#FFFFFF",
          charcoal: "#211F1F",
          "warm-white": "#FAF9F7",
          stone: "#E7E5E4",
          "grey-muted": "#78716C",
          "grey-deep": "#44403C",
          green: "#24775F",
          "green-light": "#E6F4F0",
          amber: "#B7791F",
          "amber-light": "#FEF7EC",
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
        transit: '0 4px 20px -2px rgba(201, 34, 50, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        'transit-lg': '0 10px 30px -4px rgba(201, 34, 50, 0.18), 0 4px 10px -2px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;

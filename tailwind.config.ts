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
        forest: {
          50: "#f0f7f4",
          100: "#dcf0e7",
          200: "#b9e2d1",
          300: "#8acdb4",
          400: "#57b293",
          500: "#349677",
          600: "#24775e",
          700: "#1e604d",
          800: "#1b4d3f",
          900: "#174035",
          950: "#0b241e",
        },
        sage: {
          50: "#f6f8f5",
          100: "#eaeee7",
          200: "#d6ded2",
          300: "#b7c5b0",
          400: "#94a88b",
          500: "#758d6b",
          600: "#5c7153",
          700: "#495942",
          800: "#3c4837",
          900: "#323d2f",
        },
        charcoal: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#0f172a",
        },
        cream: {
          50: "#fdfdfc",
          100: "#fbfbfa",
          200: "#f6f6f4",
          300: "#ededeb",
          400: "#dfded9",
          500: "#cfcdc6",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;

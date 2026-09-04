import type { Config } from "tailwindcss";

const config: Config = {
  // Only process files that actually use Tailwind classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom scrollbar styling and subtle color tokens can be added here
      colors: {
        surface: {
          DEFAULT: "#0f1117",   // Page background — deepest dark
          raised: "#1a1d27",    // Card / message bubble surface
          border: "#2a2d3a",    // Subtle border lines
        },
        brand: {
          DEFAULT: "#6366f1",   // Indigo-500 — primary accent
          hover: "#4f46e5",     // Indigo-600 — hover state
        },
      },
      animation: {
        "pulse-dot": "pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

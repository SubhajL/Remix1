import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        background: "#000000",
        surface: "#111111",
        border: "#333333",
        text: {
          DEFAULT: "#ffffff",
          secondary: "#a3a3a3",
        }
      },
    },
  },
  plugins: [],
}

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // Ganti font lama kamu dengan ini
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        bg: "#05050C",
        surface: "#0C0C1A",
        card: "#10101F",
        "card-hover": "#161628",
        accent: {
          DEFAULT: "#7C6BFF",
          light: "#9F91FF",
        },
        cta: {
          DEFAULT: "#F59E0B",
          hover: "#FBBF24",
        },
        "text-muted": "#7070A0",
        "text-dim": "#4A4A70",
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #7C6BFF, #B794F4)",
        "gradient-cta": "linear-gradient(135deg, #F59E0B, #FBBF24)",
      },
    },
  },
  plugins: [],
};

export default config;

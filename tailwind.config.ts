import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        card: "var(--card)",
        "card-hover": "var(--hover-bg)",
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
        },
        cta: {
          DEFAULT: "var(--cta)",
          hover: "var(--cta-hover)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
        },
        "text-muted": "var(--text-muted)",
        "text-dim": "var(--text-dim)",
        border: "var(--border)",
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, var(--accent), #A855F7)",
        "gradient-cta": "linear-gradient(135deg, var(--cta), var(--cta-hover))",
      },
    },
  },
  plugins: [],
};

export default config;

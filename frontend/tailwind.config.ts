import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      colors: {
        ink:    "#0d0d14",
        slate:  "#1a1a2e",
        muted:  "#2a2a45",
        accent: "#4f8ef7",
        glow:   "#7b5ea7",
        lime:   "#a3e635",
        fog:    "#8b8ba7",
      },
      animation: {
        "fade-in":   "fadeIn 0.6s ease forwards",
        "slide-up":  "slideUp 0.5s ease forwards",
        "pulse-glow":"pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(20px)" },
                     to:   { opacity: "1", transform: "translateY(0)" } },
        pulseGlow: { "0%,100%": { boxShadow: "0 0 8px #4f8ef744" },
                     "50%":     { boxShadow: "0 0 24px #4f8ef7aa" } },
      },
    },
  },
  plugins: [],
};
export default config;

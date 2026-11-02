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
        background: "#000000",
        foreground: "#f4f4f5",
        gold: {
          50: "#fdfbf7",
          100: "#fbf6ec",
          200: "#f5e8cf",
          300: "#edd4a7",
          400: "#e3bc77",
          500: "#D4AF37", // Metallic Royal Gold
          600: "#b89228",
          700: "#947120",
          800: "#795a20",
          900: "#654a1f",
          DEFAULT: "#D4AF37",
        },
        amber: {
          gold: "#f59e0b",
        },
        zinc: {
          950: "#09090b",
          900: "#121215",
          850: "#18181b",
          800: "#27272a",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.3)",
        "gold-glow-lg": "0 0 45px -8px rgba(212, 175, 55, 0.45)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #fce09b 0%, #D4AF37 50%, #aa820a 100%)",
        "gold-gradient-soft": "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(24, 24, 27, 0.8) 0%, rgba(9, 9, 11, 0.95) 100%)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s infinite",
        pulseGlow: "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

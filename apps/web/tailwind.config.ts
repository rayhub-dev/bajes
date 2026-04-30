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
        bajes: {
          bg: "#FAF8F5",
          yellow: "#E5FF00",
          pink: "#FF80DF",
          blue: "#0044FF",
          green: "#00FF66",
          red: "#FF3333",
          black: "#000000",
          white: "#FFFFFF",
          dark: "#0A0A0A",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "Inter", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(0,0,0,1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
        "brutal-lg": "6px 6px 0px 0px rgba(0,0,0,1)",
        "brutal-hover": "2px 2px 0px 0px rgba(0,0,0,1)",
        "brutal-yellow": "4px 4px 0px 0px #E5FF00",
        "brutal-pink": "4px 4px 0px 0px #FF80DF",
        none: "none",
      },
      borderRadius: {
        brutal: "12px",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slide-down 0.2s ease-in",
        "fade-in": "fade-in 0.2s ease-out",
        "bounce-in": "bounce-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "progress-fill": "progress-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        wiggle: "wiggle 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;

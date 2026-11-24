import type { Config } from "tailwindcss";

// Paleta do style guide do Figma (docs/figma/style_guide/Brand Colors.png)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        principal: {
          70: "#EDEFF2",
          80: "#444466",
          90: "#222244",
          100: "#111133",
        },
        secondary: {
          60: "#FFEECC",
          70: "#FFCC99",
          80: "#FFAA66",
          90: "#FF8833",
          100: "#FF5522",
          110: "#CC4400",
          120: "#993300",
          130: "#662200",
        },
        neutral: {
          60: "#FCFDFF",
          70: "#E6E9F2",
          80: "#C2C4CC",
          90: "#A1A3AA",
          100: "#818388",
          110: "#515255",
          120: "#303133",
          130: "#0B0C0D",
        },
        success: {
          60: "#EEFFBB",
          70: "#BBEE88",
          80: "#88CC66",
          90: "#55BB44",
          100: "#229922",
          110: "#118822",
          120: "#006622",
          130: "#004422",
        },
        error: {
          60: "#FFDDCC",
          70: "#FFAA99",
          80: "#FF7766",
          90: "#FF4433",
          100: "#DD0000",
          110: "#BB0000",
          120: "#880000",
          130: "#660000",
        },
        info: {
          60: "#ADCBFA",
          70: "#82A9F0",
          80: "#608AE1",
          90: "#315FCE",
          100: "#2348B1",
          110: "#183594",
          120: "#0F2477",
          130: "#091862",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "fade-in-up": "fadeInUp 400ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

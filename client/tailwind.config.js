/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#080C10",
          900: "#0D1117",
          800: "#161B22",
          700: "#21262D",
          600: "#30363D",
        },
        jade: {
          400: "#3DDC84",
          500: "#2ECC71",
          600: "#27AE60",
        },
        amber: {
          400: "#F59E0B",
          500: "#F39C12",
        },
        rose: {
          400: "#F87171",
          500: "#EF4444",
        },
        electric: {
          400: "#60EFFF",
          500: "#00D4FF",
          600: "#0099CC",
        },
      },
      animation: {
        "slide-up": "slideUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-slow": "pulse 3s infinite",
        "scan": "scan 2s linear infinite",
      },
      keyframes: {
        slideUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F5F2",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#171A1F",
          muted: "#5C6470",
          faint: "#8A9099",
        },
        line: "#DFE1E4",
        ledger: {
          navy: "#1F3A5F",
          "navy-hover": "#16304F",
          "navy-light": "#2C4E7C",
        },
        positive: {
          DEFAULT: "#1E7A5E",
          bg: "#E7F3EE",
        },
        negative: {
          DEFAULT: "#AA3A34",
          bg: "#F7EAE9",
        },
      },
      fontFamily: {
        display: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 26, 31, 0.04), 0 1px 8px rgba(23, 26, 31, 0.03)",
      },
    },
  },
  plugins: [],
};

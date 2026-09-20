/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        night: "#0A0A0C",
        coal2: "#141417",
        panel2: "#1B1B1F",
        line2: "#26262B",
        acid: "#C8FF3E",
        blood: "#FF3D2E",
        bone2: "#EDEDF0",
        muted2: "#9C9CA3",
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        body: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        acidglow: "0 0 0 1px rgba(200,255,62,.25), 0 16px 50px -16px rgba(200,255,62,.35)",
        cardglow2: "0 28px 60px -25px rgba(0,0,0,.95)",
      },
    },
  },
  plugins: [],
}
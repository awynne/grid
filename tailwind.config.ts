import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
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
        // GridPulse fuel colors
        fuel: {
          solar: "hsl(var(--fuel-solar))",
          wind: "hsl(var(--fuel-wind))",
          gas: "hsl(var(--fuel-gas))",
          coal: "hsl(var(--fuel-coal))",
          nuclear: "hsl(var(--fuel-nuclear))",
          hydro: "hsl(var(--fuel-hydro))",
          other: "hsl(var(--fuel-other))",
        },
        // Grid status colors
        status: {
          clean: "hsl(var(--status-clean))",
          dirty: "hsl(var(--status-dirty))",
          estimated: "hsl(var(--status-estimated))",
          missing: "hsl(var(--status-missing))",
          fresh: "hsl(var(--status-fresh))",
          stale: "hsl(var(--status-stale))",
          "very-stale": "hsl(var(--status-very-stale))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "dashboard-gap": "var(--dashboard-gap)",
      },
      maxWidth: {
        "container": "var(--container-max-width)",
      },
      height: {
        "chart-sm": "var(--chart-height-sm)",
        "chart-md": "var(--chart-height-md)",
        "chart-lg": "var(--chart-height-lg)",
      },
    },
  },
  plugins: [],
} satisfies Config;
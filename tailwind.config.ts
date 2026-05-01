import type { Config } from "tailwindcss";

/**
 * Design System inspired by Lovable
 * - Warm parchment background (cream)
 * - Opacity-driven color system (all grays from #1c1c1c)
 * - Border-based containment (no heavy shadows except inset on dark buttons)
 * - Inter as humanist fallback for Camera Plain Variable (proprietary)
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary palette
        cream: "#f7f4ed",
        "off-white": "#fcfbf8",
        charcoal: {
          DEFAULT: "#1c1c1c",
          83: "rgba(28,28,28,0.83)",
          82: "rgba(28,28,28,0.82)",
          40: "rgba(28,28,28,0.4)",
          4: "rgba(28,28,28,0.04)",
          3: "rgba(28,28,28,0.03)",
        },
        muted: "#5f5f5d",
        "border-soft": "#eceae4",
        "border-strong": "rgba(28,28,28,0.4)",
        // accent kids-friendly (soft coral/peach), usar com leveza
        coral: {
          DEFAULT: "#E8826A",
          soft: "#FBE8E1",
        },
        sage: {
          DEFAULT: "#8AA37B",
          soft: "#E8EFE3",
        },
        sky: {
          DEFAULT: "#7BA0BD",
          soft: "#E1ECF4",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Inter Tight"', '"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // editorial scale
        "display-xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.045em", fontWeight: "600" }],
        "display": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" }],
        "display-sm": ["2.25rem", { lineHeight: "1.10", letterSpacing: "-0.025em", fontWeight: "600" }],
        "title": ["1.25rem", { lineHeight: "1.25", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.40", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.50", fontWeight: "400" }],
        "label": ["0.875rem", { lineHeight: "1.40", fontWeight: "500" }],
        "caption": ["0.75rem", { lineHeight: "1.40", fontWeight: "400" }],
      },
      borderRadius: {
        micro: "4px",
        sm: "6px",
        md: "8px",
        DEFAULT: "12px",
        lg: "16px",
        pill: "9999px",
      },
      boxShadow: {
        // Inset signature
        "inset-dark":
          "rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px",
        "focus-warm": "rgba(0,0,0,0.1) 0px 4px 12px",
      },
      spacing: {
        // editorial section spacing
        "section": "5rem",     // 80px
        "section-lg": "8rem",   // 128px
        "section-xl": "11rem",  // 176px
      },
    },
  },
  plugins: [],
};
export default config;

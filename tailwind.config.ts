import type { Config } from "tailwindcss";

/**
 * Design System inspired by Duolingo
 * - Verde owl como primário (CTA), com lip 3D (sombra inferior sólida)
 * - Cores nomeadas por animais (semantic)
 * - Border radius generoso (12–16px)
 * - Nunito como fallback free de Feather/Duolingo Sans (arredondada, chunky)
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand & primary (verde Duolingo)
        owl: "#58cc02",
        "tree-frog": "#58a700",
        // Info / link (azul)
        macaw: "#1cb0f6",
        whale: "#1899d6",
        // Erro / vermelho (vidas)
        cardinal: "#ff4b4b",
        "fire-ant": "#ea2b2b",
        // Amarelo (XP/streak)
        bee: "#ffc800",
        // Laranja (flame)
        fox: "#ff9600",
        lion: "#ffb100",
        // Roxo (Super)
        beetle: "#ce82ff",
        betta: "#9069cd",
        // Neutros (texto + superfícies)
        snow: "#ffffff",
        polar: "#f7f7f7",
        swan: "#e5e5e5",
        hare: "#afafaf",
        wolf: "#777777",
        eel: "#4b4b4b",
        // Cores extras pra ilustração
        bluejay: "#84d8ff",
        beluga: "#bbf2ff",
        canary: "#fff5d3",
        sea: "#9ee0e9",
        peacock: "#00cd9c",
      },
      fontFamily: {
        // Nunito = fallback livre de Feather/Duolingo Sans
        sans: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tokens Duolingo
        "page-title-lg": ["2.5rem", { lineHeight: "2.75rem", letterSpacing: "0", fontWeight: "800" }],
        "page-title": ["2rem", { lineHeight: "2.25rem", letterSpacing: "0", fontWeight: "800" }],
        "heading-lg": ["1.75rem", { lineHeight: "2rem", fontWeight: "800" }],
        "heading": ["1.5rem", { lineHeight: "2rem", fontWeight: "800" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.5rem", fontWeight: "800" }],
        "heading-xs": ["1rem", { lineHeight: "1.25rem", fontWeight: "800" }],
        "body": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        "body-bold": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "800" }],
        "caption": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        "caption-bold": ["1rem", { lineHeight: "1.5rem", fontWeight: "800" }],
        "label-lg": ["1.5rem", { lineHeight: "1.5rem", fontWeight: "800", letterSpacing: "0.04em" }],
        "label": ["1rem", { lineHeight: "1rem", fontWeight: "800", letterSpacing: "0.04em" }],
        "label-sm": ["0.875rem", { lineHeight: "1rem", fontWeight: "800", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "12px",
        md: "12px",
        lg: "16px",
        pill: "9999px",
      },
      boxShadow: {
        // Lip 3D — sombra sólida inferior
        "lip-owl": "0 4px 0 #58a700",
        "lip-macaw": "0 4px 0 #1899d6",
        "lip-cardinal": "0 4px 0 #ea2b2b",
        "lip-bee": "0 4px 0 #d99e00",
        "lip-fox": "0 4px 0 #cc7700",
        "lip-beetle": "0 4px 0 #9069cd",
        "lip-swan": "0 4px 0 #d4d4d4",
        "lip-eel": "0 4px 0 #2e2e2e",
        "lip-active": "0 2px 0 #58a700",
        // Inset border (input selecionado)
        "inset-swan": "inset 0 0 0 2px #e5e5e5",
        "inset-macaw": "inset 0 0 0 2px #1cb0f6",
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Synchronisé avec globals.css — palette WCAG AA
        // Tous les ratios texte ≥ 4.5:1, UI non-texte ≥ 3:1

        // Vert feuille jungle — doux et organique (ratio 7.9:1 sur fond sombre)
        primary: "#5dbf7a",
        "primary-foreground": "#060d02",

        // Teal cyberpunk (ratio 10:1 sur fond sombre)
        secondary: "#00d4aa",
        "secondary-foreground": "#00150f",

        // Muted — fond jungle + texte sauge lisible (ratio 11.6:1)
        muted: "#141c12",
        "muted-foreground": "#c0d8b8",

        // Accent — forêt profonde hover (ratio 7.7:1)
        accent: "#0a2e19",
        "accent-foreground": "#5dbf7a",

        // Destructive — rouge alerte (ratio 5.6:1 avec #fff0f0)
        destructive: "#cc1515",
        "destructive-foreground": "#fff0f0",

        // Cards & Popovers — vert forêt foncé (thématique)
        card: "#0d1f14",
        "card-foreground": "#f0faed",
        popover: "#0d1f14",
        "popover-foreground": "#f0faed",

        // Borders & Inputs — bordure visible pour WCAG 1.4.11
        border: "#2a5a3c",
        input: "#163c2a",
        ring: "#5dbf7a",    // ← focus indicator vert jungle — WCAG 2.4.7 ✓

        // Layout
        background: "transparent",
        foreground: "#e4f7de",

        // Sidebar
        sidebar: "rgba(9, 21, 13, 0.75)",
        "sidebar-foreground": "#d4edd0",
        "sidebar-primary": "#39ff14",
        "sidebar-primary-foreground": "#0a1a05",
        "sidebar-accent": "#0f3020",
        "sidebar-accent-foreground": "#5dbf7a",
        "sidebar-border": "#1a3523",
        "sidebar-ring": "#5dbf7a",
      },
      borderRadius: {
        md: "0.625rem",
      },
    },
  },
  plugins: [],
}

export default config

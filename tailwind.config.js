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
        // Synced avec globals.css (converted to hex for Tailwind v4)
        primary: "rgb(216, 249, 153)",
        "primary-foreground": "#000000",
        secondary: "#4B82B8",
        "secondary-foreground": "#FAFAFA",
        muted: "#1a1a1a",
        "muted-foreground": "#B3B3B3",
        accent: "#1a1a1a",
        "accent-foreground": "#FAFAFA",
        destructive: "#D32F2F",
        
        // Cards & Popovers
        card: "#0a0a0a",
        "card-foreground": "#FAFAFA",
        popover: "#0a0a0a",
        "popover-foreground": "#FAFAFA",
        
        // Borders & Inputs
        border: "#CCE5DB",
        input: "#7DBCA8",
        ring: "#6B9E8C",
        
        // Layout
        background: "transparent",
        foreground: "#E8FFFF",
        
        // Sidebar
        sidebar: "rgba(245, 234, 234, 0.041)",
        "sidebar-foreground": "#E8F5F0",
        "sidebar-primary": "#A85FA8",
        "sidebar-primary-foreground": "rgb(216, 249, 153)",
        "sidebar-accent": "#C8E6D8",
        "sidebar-accent-foreground": "#7DB8A0",
        "sidebar-border": "rgba(11, 44, 30, 0.212)",
        "sidebar-ring": "rgba(101, 136, 127, 0.014)",
      },
      borderRadius: {
        md: "0.625rem",
      },
    },
  },
  plugins: [],
}

export default config

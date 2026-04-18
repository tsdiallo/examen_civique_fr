/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // Bleu France (DSFR) — primary "Marianne"
        france: {
          50:  "#F5F5FE",
          100: "#ECECFE",
          200: "#CACAFB",
          300: "#9A9AF8",
          400: "#6A6AF4",
          500: "#3737E0",
          600: "#1212A8",
          700: "#000091",  // Bleu France officiel
          800: "#00007A",
          900: "#000063",
          950: "#00004A",
        },
        // Rouge Marianne (DSFR)
        marianne: {
          50:  "#FEF4F4",
          100: "#FEE9E9",
          200: "#FCBFBF",
          300: "#F95C5E",
          400: "#E1000F",  // Rouge Marianne officiel
          500: "#C9191E",
          600: "#9C1A1B",
          700: "#6E0E11",
        },
        // Off-white "Galt White" (DSFR background)
        paper: {
          50:  "#F6F6F6",  // page bg
          100: "#F1F1F1",
          200: "#E5E5E5",
          300: "#DDDDDD",  // divider
          400: "#CECECE",
        },
        // Warm-cool ink for body
        ink: {
          950: "#0A0A1F",
          900: "#161629",  // primary text
          800: "#21213B",
          700: "#3A3A4D",  // body
          600: "#535363",
          500: "#666679",  // muted
          400: "#929292",
          300: "#BBBBC0",
          200: "#DDDDE0",
          100: "#EDEDF0",
          50:  "#F6F6F8",
        },
        // DSFR system signal colours
        success: { 50: "#EDFBED", 100: "#B8FEC9", 600: "#18753C", 700: "#13693B" },
        warning: { 50: "#FFF5E6", 100: "#FEEBC2", 600: "#B34000", 700: "#7A2B00" },
        danger:  { 50: "#FEF4F4", 100: "#FEE9E9", 600: "#CE0500", 700: "#8C0500" },
        info:    { 50: "#E8EDFF", 100: "#DCE4FF", 600: "#0063CB", 700: "#004B9A" },

        // Aliases so existing components keep compiling
        brand: {
          50: "#F5F5FE", 100: "#ECECFE", 200: "#CACAFB", 300: "#9A9AF8",
          400: "#6A6AF4", 500: "#3737E0", 600: "#1212A8", 700: "#000091",
          800: "#00007A", 900: "#000063", 950: "#00004A",
        },
        accent: {
          50:  "#FEF4F4", 100: "#FEE9E9", 200: "#FCBFBF", 300: "#F95C5E",
          400: "#E1000F", 500: "#C9191E", 600: "#9C1A1B", 700: "#6E0E11",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        display: ["'Instrument Serif'", "'Cormorant Garamond'", "Georgia", "serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Fluid display sizes — fit mobile without overflow
        "display-sm": ["clamp(1.875rem, 6vw, 2.5rem)",  { lineHeight: "1.1",  letterSpacing: "-0.015em" }],
        "display":    ["clamp(2.25rem,  7vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.75rem,  9vw, 4.5rem)",  { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-xl": ["clamp(3.25rem, 11vw, 5.5rem)",  { lineHeight: "1.0",  letterSpacing: "-0.03em" }],
      },
      maxWidth: { prose: "68ch" },
      borderRadius: {
        xl2: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft:  "0 1px 0 rgba(0,0,145,0.04), 0 1px 3px rgba(0,0,145,0.04)",
        lift:  "0 1px 0 rgba(0,0,145,0.04), 0 14px 28px -16px rgba(0,0,145,0.18)",
        glow:  "0 12px 32px -16px rgba(0,0,145,0.45)",
        marianne: "0 12px 28px -16px rgba(225,0,15,0.45)",
      },
      backgroundImage: {
        "tricolore":
          "linear-gradient(90deg, #000091 0 33.33%, #FFFFFF 33.33% 66.66%, #E1000F 66.66% 100%)",
        "warm-mesh":
          "radial-gradient(900px 500px at 8% -10%, rgba(0,0,145,0.10), transparent 60%), radial-gradient(700px 400px at 100% 0%, rgba(225,0,15,0.06), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

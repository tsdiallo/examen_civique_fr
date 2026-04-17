/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,ts,tsx,js,jsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dae6ff",
          200: "#b7ceff",
          300: "#8db0ff",
          500: "#1e4fd6",
          600: "#1740b8",
          700: "#123396",
          900: "#0a1d5e",
        },
        ink: {
          900: "#0f172a",
          700: "#334155",
          500: "#64748b",
          300: "#cbd5e1",
          100: "#f1f5f9",
          50: "#f8fafc",
        },
        success: { 600: "#15803d", 100: "#dcfce7" },
        warning: { 600: "#b45309", 100: "#fef3c7" },
        danger:  { 600: "#b91c1c", 100: "#fee2e2" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      maxWidth: { prose: "68ch" },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [],
};

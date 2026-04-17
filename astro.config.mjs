import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://examen-civique-fr.netlify.app",
  output: "static",
  integrations: [tailwind({ applyBaseStyles: false })],
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
  server: { port: 4321, host: true },
});

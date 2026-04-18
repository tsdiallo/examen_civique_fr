import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// On Netlify, the deploy URL is exposed as process.env.URL.
// Locally, fallback to the production Netlify subdomain.
const SITE_URL = process.env.URL || "https://examen-civique-fr.netlify.app";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes("/mentions-legales"),
    }),
  ],
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
  server: { port: 4321, host: true },
});

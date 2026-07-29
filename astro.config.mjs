import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

const SITE_URL =
  process.env.PUBLIC_SITE_URL ||
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  "https://examen-civique-fr.netlify.app";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes("/mentions-legales") && !page.includes("/admin") && !page.includes("/connexion") && !page.includes("/mon-espace"),
    }),
  ],
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
  server: { port: 4321, host: true },
});

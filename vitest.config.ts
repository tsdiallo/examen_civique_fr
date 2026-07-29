import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json-summary"],
      include: ["src/lib/**/*.ts", "netlify/functions/_shared/**/*.ts"],
    },
  },
});

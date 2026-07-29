import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

describe("preproduction frontend redesign", () => {
  it("uses the redesigned authentication shell", () => {
    expect(read("src/pages/connexion.astro")).toContain('data-ui="auth-shell-v2"');
  });

  it("uses the redesigned personal dashboard", () => {
    expect(read("src/pages/mon-espace.astro")).toContain('data-ui="account-dashboard-v2"');
  });

  it("uses the redesigned path picker", () => {
    expect(read("src/pages/parcours/index.astro")).toContain('data-ui="path-picker-v2"');
  });

  it("uses the redesigned global header", () => {
    expect(read("src/components/layout/Header.astro")).toContain('data-ui="header-v2"');
  });
});

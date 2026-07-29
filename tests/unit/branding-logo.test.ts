import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

const header = read("src/components/layout/Header.astro");
const footer = read("src/components/layout/Footer.astro");
const layout = read("src/layouts/BaseLayout.astro");

describe("PrepaexamCivique branding", () => {
  it("uses the complete logo on desktop and the mark on mobile", () => {
    expect(header).toContain("/branding/prepaexam-civique-logo.svg");
    expect(header).toContain("/branding/prepaexam-civique-mark.svg");
    expect(header).toContain('alt="PrepaexamCivique"');
  });

  it("uses the logo in the footer", () => {
    expect(footer).toContain("/branding/prepaexam-civique-logo.svg");
  });

  it("uses the brand mark for browser icons", () => {
    expect(layout).toContain("/branding/prepaexam-civique-mark.svg");
    expect(layout).toContain('type="image/svg+xml"');
  });
});

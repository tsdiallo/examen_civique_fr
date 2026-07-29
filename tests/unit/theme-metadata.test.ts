import { describe, expect, it } from "vitest";
import { THEME_METADATA, getThemeMetadata } from "../../src/data/theme-metadata";

const expectedSlugs = [
  "valeurs-republique",
  "symboles-republique",
  "laicite",
  "droits-devoirs",
  "institutions",
  "ue-international",
  "histoire",
  "geographie-culture",
  "vivre-en-societe",
  "egalite-situations",
];

describe("theme learning metadata", () => {
  it("covers every learning theme", () => {
    expect(Object.keys(THEME_METADATA).sort()).toEqual(expectedSlugs.sort());
  });

  it("provides takeaways, flashcards and verified official sources", () => {
    for (const slug of expectedSlugs) {
      const metadata = getThemeMetadata(slug);
      expect(metadata.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(metadata.flashcards.length).toBeGreaterThanOrEqual(2);
      expect(metadata.sources.length).toBeGreaterThanOrEqual(1);
      expect(metadata.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
      expect(metadata.sources.every((source) => /^\d{4}-\d{2}-\d{2}$/.test(source.verifiedAt))).toBe(true);
    }
  });
});

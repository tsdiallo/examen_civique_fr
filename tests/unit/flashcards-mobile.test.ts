import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("../../src/components/fiche/Flashcards.astro", import.meta.url),
  "utf8",
);

describe("mobile flashcards", () => {
  it("uses a responsive flashcard shell", () => {
    expect(source).toContain('data-ui="flashcards-mobile-v2"');
    expect(source).toContain("grid-cols-1");
    expect(source).toContain("overflow-hidden");
    expect(source).toContain("break-words");
  });

  it("keeps labels separate from the icons", () => {
    expect(source).toContain("data-reveal-all-label");
    expect(source).toContain("data-flashcard-action-label");
    expect(source).toContain('data-icon="flashcards"');
    expect(source).toContain('data-icon="eye"');
  });

  it("makes the reveal-all action full width on mobile", () => {
    expect(source).toContain("w-full sm:w-auto");
  });
});

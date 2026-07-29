import { describe, expect, it } from "vitest";
import { computeMastery, nextReviewDate } from "../../src/lib/progress/mastery";

describe("computeMastery", () => {
  it("reste borné entre 0 et 100", () => {
    expect(computeMastery(0, 10, 0)).toBe(0);
    expect(computeMastery(10, 10, 100)).toBe(100);
  });

  it("lisse le score courant avec la maîtrise précédente", () => {
    expect(computeMastery(8, 10, 40)).toBe(68);
  });
});

describe("nextReviewDate", () => {
  const from = new Date("2026-07-29T10:00:00.000Z");

  it.each([
    [20, "2026-07-30T10:00:00.000Z"],
    [50, "2026-08-01T10:00:00.000Z"],
    [75, "2026-08-05T10:00:00.000Z"],
    [95, "2026-08-12T10:00:00.000Z"],
  ])("planifie la prochaine révision selon la maîtrise %s", (mastery, expected) => {
    expect(nextReviewDate(mastery, from).toISOString()).toBe(expected);
  });
});

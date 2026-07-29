import { describe, expect, it } from "vitest";
import { DEFAULT_EXAM_PATH, parseExamPath, pathHome } from "../../src/lib/learning/paths";

describe("exam paths", () => {
  it("accepts the three supported paths", () => {
    expect(parseExamPath("csp")).toBe("csp");
    expect(parseExamPath("resident")).toBe("resident");
    expect(parseExamPath("naturalisation")).toBe("naturalisation");
  });

  it("falls back safely for unknown values", () => {
    expect(parseExamPath("admin")).toBe(DEFAULT_EXAM_PATH);
    expect(parseExamPath(null)).toBe(DEFAULT_EXAM_PATH);
  });

  it("builds a local path without allowing an open redirect", () => {
    expect(pathHome("naturalisation")).toBe("/parcours/naturalisation");
  });
});

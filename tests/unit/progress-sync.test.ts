import { describe, expect, it } from "vitest";
import { buildProgressUpsert } from "../../src/lib/progress/cloud";

describe("cloud progress payload", () => {
  it("stores mastery, wrong concepts and review date for the current path", () => {
    const payload = buildProgressUpsert({
      userId: "user-1",
      pathSlug: "naturalisation",
      moduleSlug: "valeurs-republique",
      correct: 6,
      total: 8,
      wrongConcepts: ["vr-02", "vr-07"],
      now: new Date("2026-07-29T12:00:00.000Z"),
    });

    expect(payload.user_id).toBe("user-1");
    expect(payload.path_slug).toBe("naturalisation");
    expect(payload.mastery).toBe(75);
    expect(payload.wrong_concepts).toEqual(["vr-02", "vr-07"]);
    expect(payload.last_attempt_at).toBe("2026-07-29T12:00:00.000Z");
    expect(payload.next_review_at).toBe("2026-08-05T12:00:00.000Z");
  });
});

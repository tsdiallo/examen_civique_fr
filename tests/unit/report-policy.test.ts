import { describe, expect, it } from "vitest";
import { parseReportMutation } from "../../netlify/functions/_shared/report-policy";

describe("report moderation policy", () => {
  it("accepts resolved and dismissed states for a UUID", () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";
    expect(parseReportMutation({ id, status: "resolved" })).toEqual({ id, status: "resolved" });
    expect(parseReportMutation({ id, status: "dismissed" })).toEqual({ id, status: "dismissed" });
  });

  it("rejects unsafe identifiers and arbitrary states", () => {
    expect(parseReportMutation({ id: "1&status=eq.open", status: "resolved" })).toBeNull();
    expect(parseReportMutation({ id: "123e4567-e89b-12d3-a456-426614174000", status: "deleted" })).toBeNull();
    expect(parseReportMutation(null)).toBeNull();
  });
});

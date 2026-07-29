import { describe, expect, it } from "vitest";
import { isAdminEmail, parseAdminEmails } from "../../netlify/functions/_shared/admin-policy";

describe("parseAdminEmails", () => {
  it("normalise, déduplique et ignore les valeurs vides", () => {
    expect(parseAdminEmails(" Admin@Example.com,admin@example.com, second@example.com , ")).toEqual([
      "admin@example.com",
      "second@example.com",
    ]);
  });
});

describe("isAdminEmail", () => {
  it("exige une correspondance exacte et insensible à la casse", () => {
    const allowlist = parseAdminEmails("owner@example.com");

    expect(isAdminEmail("OWNER@example.com", allowlist)).toBe(true);
    expect(isAdminEmail("owner@example.com.attacker.tld", allowlist)).toBe(false);
    expect(isAdminEmail("other@example.com", allowlist)).toBe(false);
  });
});

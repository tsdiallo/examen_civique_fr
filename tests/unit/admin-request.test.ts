import { describe, expect, it, vi } from "vitest";
import { extractBearerToken, verifySupabaseUser } from "../../netlify/functions/_shared/supabase-auth";

describe("admin request authentication", () => {
  it("extracts only a Bearer token", () => {
    expect(extractBearerToken("Bearer abc.def")).toBe("abc.def");
    expect(extractBearerToken("Basic abc")).toBeNull();
    expect(extractBearerToken(null)).toBeNull();
  });

  it("rejects a token when Supabase does not validate it", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ message: "invalid" }), { status: 401 }));

    const user = await verifySupabaseUser({
      token: "bad-token",
      supabaseUrl: "https://example.supabase.co",
      publishableKey: "publishable-key",
      fetchFn,
    });

    expect(user).toBeNull();
    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it("returns only the trusted user identity returned by Supabase", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: "user-1", email: "Admin@Example.com" }), { status: 200 }));

    const user = await verifySupabaseUser({
      token: "valid-token",
      supabaseUrl: "https://example.supabase.co/",
      publishableKey: "publishable-key",
      fetchFn,
    });

    expect(user).toEqual({ id: "user-1", email: "admin@example.com" });
  });
});

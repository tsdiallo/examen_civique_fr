export interface TrustedUser {
  id: string;
  email: string;
}

interface VerifyOptions {
  token: string;
  supabaseUrl: string;
  publishableKey: string;
  fetchFn?: typeof fetch;
}

export function extractBearerToken(header: string | null): string | null {
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function verifySupabaseUser({
  token,
  supabaseUrl,
  publishableKey,
  fetchFn = fetch,
}: VerifyOptions): Promise<TrustedUser | null> {
  if (!token || !supabaseUrl || !publishableKey) return null;

  const response = await fetchFn(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as { id?: unknown; email?: unknown };
  if (typeof payload.id !== "string" || typeof payload.email !== "string") return null;

  return {
    id: payload.id,
    email: payload.email.trim().toLowerCase(),
  };
}

import type { Config, Context } from "@netlify/functions";
import { isAdminEmail, parseAdminEmails } from "./_shared/admin-policy";
import { extractBearerToken, verifySupabaseUser } from "./_shared/supabase-auth";

interface CountResult {
  count: number;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function parseCount(response: Response): number {
  const range = response.headers.get("content-range");
  if (!range) return 0;
  const match = range.match(/\/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

async function countRows(
  supabaseUrl: string,
  serviceRoleKey: string,
  table: string,
  filter = "",
): Promise<CountResult> {
  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?select=id&limit=1${filter}`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase count failed for ${table}: ${response.status}`);
  }

  return { count: parseCount(response) };
}

export default async function handler(request: Request, _context: Context): Promise<Response> {
  if (request.method !== "GET") return json({ error: "Méthode non autorisée." }, 405);

  const supabaseUrl = Netlify.env.get("SUPABASE_URL") ?? Netlify.env.get("PUBLIC_SUPABASE_URL") ?? "";
  const publishableKey = Netlify.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Netlify.env.get("PUBLIC_SUPABASE_PUBLISHABLE_KEY") ?? "";
  const serviceRoleKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminEmails = parseAdminEmails(Netlify.env.get("ADMIN_EMAILS"));
  const token = extractBearerToken(request.headers.get("authorization"));

  if (!token || !supabaseUrl || !publishableKey) {
    return json({ error: "Authentification requise." }, 401);
  }

  const user = await verifySupabaseUser({ token, supabaseUrl, publishableKey });
  if (!user) return json({ error: "Session invalide ou expirée." }, 401);
  if (!isAdminEmail(user.email, adminEmails)) return json({ error: "Accès administrateur refusé." }, 403);
  if (!serviceRoleKey) return json({ error: "Administration non configurée sur cet environnement." }, 503);

  try {
    const [users, attempts, openReports] = await Promise.all([
      countRows(supabaseUrl, serviceRoleKey, "profiles"),
      countRows(supabaseUrl, serviceRoleKey, "exam_attempts"),
      countRows(supabaseUrl, serviceRoleKey, "content_reports", "&status=eq.open"),
    ]);

    return json({
      admin: { id: user.id, email: user.email },
      metrics: {
        users: users.count,
        examAttempts: attempts.count,
        openReports: openReports.count,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("admin-overview", error);
    return json({ error: "Impossible de charger les statistiques administrateur." }, 502);
  }
}

export const config: Config = {
  path: "/api/admin/overview",
};

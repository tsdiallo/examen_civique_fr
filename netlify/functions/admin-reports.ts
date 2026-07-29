import type { Config, Context } from "@netlify/functions";
import { isAdminEmail, parseAdminEmails } from "./_shared/admin-policy";
import { extractBearerToken, verifySupabaseUser } from "./_shared/supabase-auth";
import { parseReportMutation } from "./_shared/report-policy";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

interface AdminContext {
  supabaseUrl: string;
  serviceRoleKey: string;
  email: string;
}

async function authorize(request: Request): Promise<AdminContext | Response> {
  const supabaseUrl = Netlify.env.get("SUPABASE_URL") ?? Netlify.env.get("PUBLIC_SUPABASE_URL") ?? "";
  const publishableKey = Netlify.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Netlify.env.get("PUBLIC_SUPABASE_PUBLISHABLE_KEY") ?? "";
  const serviceRoleKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminEmails = parseAdminEmails(Netlify.env.get("ADMIN_EMAILS"));
  const token = extractBearerToken(request.headers.get("authorization"));

  if (!token || !supabaseUrl || !publishableKey) return json({ error: "Authentification requise." }, 401);
  const user = await verifySupabaseUser({ token, supabaseUrl, publishableKey });
  if (!user) return json({ error: "Session invalide ou expirée." }, 401);
  if (!isAdminEmail(user.email, adminEmails)) return json({ error: "Accès administrateur refusé." }, 403);
  if (!serviceRoleKey) return json({ error: "Administration non configurée." }, 503);

  return { supabaseUrl: supabaseUrl.replace(/\/$/, ""), serviceRoleKey, email: user.email };
}

async function listReports(context: AdminContext): Promise<Response> {
  const response = await fetch(
    `${context.supabaseUrl}/rest/v1/content_reports?select=id,user_id,page_path,message,status,created_at,resolved_at&order=created_at.desc&limit=100`,
    {
      headers: {
        apikey: context.serviceRoleKey,
        Authorization: `Bearer ${context.serviceRoleKey}`,
      },
    },
  );

  if (!response.ok) return json({ error: "Impossible de charger les signalements." }, 502);
  const reports = await response.json();
  return json({ reports });
}

async function moderateReport(request: Request, context: AdminContext): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Corps JSON invalide." }, 400);
  }

  const mutation = parseReportMutation(body);
  if (!mutation) return json({ error: "Action de modération invalide." }, 400);

  const response = await fetch(
    `${context.supabaseUrl}/rest/v1/content_reports?id=eq.${mutation.id}`,
    {
      method: "PATCH",
      headers: {
        apikey: context.serviceRoleKey,
        Authorization: `Bearer ${context.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: mutation.status,
        resolved_at: new Date().toISOString(),
      }),
    },
  );

  if (!response.ok) return json({ error: "Impossible de modifier le signalement." }, 502);
  const rows = await response.json() as unknown[];
  if (!rows.length) return json({ error: "Signalement introuvable." }, 404);

  return json({ report: rows[0] });
}

export default async function handler(request: Request, _context: Context): Promise<Response> {
  const admin = await authorize(request);
  if (admin instanceof Response) return admin;

  if (request.method === "GET") return listReports(admin);
  if (request.method === "PATCH") return moderateReport(request, admin);
  return json({ error: "Méthode non autorisée." }, 405);
}

export const config: Config = {
  path: "/api/admin/reports",
};

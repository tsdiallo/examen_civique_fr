import type { ExamMention } from "../types";
import { parseExamPath } from "../learning/paths";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../supabase/client";
import { getCurrentSession } from "../supabase/session";
import { computeMastery, nextReviewDate } from "./mastery";

interface BuildProgressOptions {
  userId: string;
  pathSlug: ExamMention;
  moduleSlug: string;
  correct: number;
  total: number;
  wrongConcepts: string[];
  previousMastery?: number | null;
  now?: Date;
}

export function buildProgressUpsert({
  userId,
  pathSlug,
  moduleSlug,
  correct,
  total,
  wrongConcepts,
  previousMastery = null,
  now = new Date(),
}: BuildProgressOptions) {
  const firstScore = total > 0 ? Math.round((correct / total) * 100) : 0;
  const mastery = previousMastery == null
    ? Math.max(0, Math.min(100, firstScore))
    : computeMastery(correct, total, previousMastery);

  return {
    user_id: userId,
    path_slug: pathSlug,
    module_slug: moduleSlug,
    mastery,
    wrong_concepts: Array.from(new Set(wrongConcepts)),
    next_review_at: nextReviewDate(mastery, now).toISOString(),
    last_attempt_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
}

interface SyncThemeOptions {
  moduleSlug: string;
  correct: number;
  total: number;
  wrongConcepts: string[];
}

export async function syncThemeProgress({
  moduleSlug,
  correct,
  total,
  wrongConcepts,
}: SyncThemeOptions): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const session = await getCurrentSession();
  if (!session) return;

  const client = getSupabaseBrowserClient();
  const pathSlug = parseExamPath(window.localStorage.getItem("ecfr.selectedPath"));
  const { data: previous, error: previousError } = await client
    .from("learning_progress")
    .select("mastery")
    .eq("user_id", session.user.id)
    .eq("path_slug", pathSlug)
    .eq("module_slug", moduleSlug)
    .maybeSingle();

  if (previousError) throw previousError;

  const payload = buildProgressUpsert({
    userId: session.user.id,
    pathSlug,
    moduleSlug,
    correct,
    total,
    wrongConcepts,
    previousMastery: previous?.mastery ?? null,
  });

  const { error } = await client
    .from("learning_progress")
    .upsert(payload, { onConflict: "user_id,path_slug,module_slug" });

  if (error) throw error;
}

import type { Quiz, ExamPayload } from "./types";

const quizModules = import.meta.glob<Quiz>("../data/quizzes/*.json", {
  eager: true,
  import: "default",
});

export function getQuizBySlug(slug: string): Quiz | null {
  for (const [path, quiz] of Object.entries(quizModules)) {
    if (path.endsWith(`/${slug}.json`)) return quiz;
  }
  return null;
}

export function listQuizSlugs(): string[] {
  return Object.keys(quizModules).map((p) => {
    const m = p.match(/\/([^/]+)\.json$/);
    return m ? m[1] : "";
  }).filter(Boolean);
}

let examCache: ExamPayload | null | undefined;
export async function getExam(): Promise<ExamPayload | null> {
  if (examCache !== undefined) return examCache;
  try {
    const mod = await import("../data/exam-final.json");
    examCache = (mod.default ?? mod) as ExamPayload;
  } catch {
    examCache = null;
  }
  return examCache;
}

import type { Quiz, ExamPayload, Question } from "./types";

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
    const [baseModule, extraModule] = await Promise.all([
      import("../data/exam-final.json"),
      import("../data/exam-extra-situations.json"),
    ]);
    const base = (baseModule.default ?? baseModule) as ExamPayload;
    const extra = (extraModule.default ?? extraModule) as { questions: Question[] };
    examCache = {
      ...base,
      total: 40,
      durationSec: 2700,
      passingScore: 32,
      questions: [...base.questions, ...extra.questions],
    };
  } catch (error) {
    console.error("Unable to load exam bank", error);
    examCache = null;
  }
  return examCache;
}

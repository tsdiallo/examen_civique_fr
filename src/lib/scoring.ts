import type { Question, ChoiceId } from "./types";

export interface Answer {
  questionId: string;
  selected: ChoiceId | null;
}

export interface ScoreResult {
  correct: number;
  total: number;
  ratio: number;
  passed: boolean;
  byTheme: Record<string, { correct: number; total: number }>;
}

export function computeScore(
  questions: Question[],
  answers: Answer[],
  passingScore: number
): ScoreResult {
  const map = new Map(answers.map((a) => [a.questionId, a.selected]));
  const byTheme: ScoreResult["byTheme"] = {};
  let correct = 0;
  for (const q of questions) {
    const bucket = (byTheme[q.themeSlug ?? "_"] ||= { correct: 0, total: 0 });
    bucket.total += 1;
    if (map.get(q.id) === q.answer) {
      correct += 1;
      bucket.correct += 1;
    }
  }
  return {
    correct,
    total: questions.length,
    ratio: questions.length ? correct / questions.length : 0,
    passed: correct >= passingScore,
    byTheme,
  };
}

export function weakThemes(result: ScoreResult, threshold = 0.7): string[] {
  return Object.entries(result.byTheme)
    .filter(([, v]) => v.total > 0 && v.correct / v.total < threshold)
    .map(([slug]) => slug);
}

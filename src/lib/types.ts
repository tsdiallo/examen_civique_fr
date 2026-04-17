export type ChoiceId = "a" | "b" | "c" | "d";

export interface Choice {
  id: ChoiceId;
  text: string;
}

export interface Question {
  id: string;
  type: "qcm" | "situation";
  themeSlug?: string;
  prompt: string;
  choices: Choice[];
  answer: ChoiceId;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface Quiz {
  themeSlug: string;
  questions: Question[];
}

export interface ExamPayload {
  durationSec: number;
  passingScore: number;
  total: number;
  questions: Question[];
}

export interface ThemeProgress {
  attempts: number;
  bestScore: number;
  lastAt: string;
}

export interface ExamProgress {
  attempts: number;
  bestScore: number;
  lastAt: string;
}

export interface ProgressState {
  themes: Record<string, ThemeProgress>;
  exam: ExamProgress | null;
  weakThemes: string[];
}

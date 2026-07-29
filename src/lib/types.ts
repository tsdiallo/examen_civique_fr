export type ChoiceId = "a" | "b" | "c" | "d";

export type ExamMention = "csp" | "resident" | "naturalisation";

export type OfficialTheme =
  | "principes-valeurs"
  | "institutions"
  | "droits-devoirs"
  | "histoire-geographie"
  | "vie-societe";

export type QuestionType = "knowledge" | "situation";

export interface Choice {
  id: ChoiceId;
  text: string;
}

export interface QuestionSource {
  title: string;
  url: string;
  verifiedAt: string;
}

export interface Question {
  id: string;
  type: "qcm" | "situation";
  questionType?: QuestionType;
  themeSlug?: string;
  officialTheme?: OfficialTheme;
  examMentions?: ExamMention[];
  prompt: string;
  choices: Choice[];
  answer: ChoiceId;
  explanation: string;
  difficulty: 1 | 2 | 3;
  source?: QuestionSource;
  concepts?: string[];
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

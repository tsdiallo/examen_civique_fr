import type { ExamMention } from "../types";

export const DEFAULT_EXAM_PATH: ExamMention = "naturalisation";

export const EXAM_PATHS: ReadonlyArray<{
  slug: ExamMention;
  title: string;
  shortTitle: string;
  description: string;
  level: string;
}> = [
  {
    slug: "csp",
    title: "Carte de séjour pluriannuelle",
    shortTitle: "CSP",
    description: "Réviser les connaissances civiques utiles à une demande de carte de séjour pluriannuelle.",
    level: "Parcours adapté",
  },
  {
    slug: "resident",
    title: "Carte de résident",
    shortTitle: "Carte de résident",
    description: "Préparer un parcours plus exigeant sur les institutions, les droits, les devoirs et la vie en France.",
    level: "Parcours approfondi",
  },
  {
    slug: "naturalisation",
    title: "Naturalisation française",
    shortTitle: "Naturalisation",
    description: "S'entraîner aux connaissances et mises en situation attendues dans le cadre de la naturalisation.",
    level: "Parcours complet",
  },
] as const;

export function parseExamPath(value: string | null | undefined): ExamMention {
  return EXAM_PATHS.some((path) => path.slug === value)
    ? (value as ExamMention)
    : DEFAULT_EXAM_PATH;
}

export function pathHome(path: ExamMention): string {
  return `/parcours/${path}`;
}

export function getExamPath(path: ExamMention) {
  return EXAM_PATHS.find((item) => item.slug === path) ?? EXAM_PATHS[2];
}

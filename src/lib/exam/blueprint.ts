import type {
  ExamMention,
  OfficialTheme,
  Question,
  QuestionType,
} from "../types";

export const OFFICIAL_EXAM_BLUEPRINT = {
  total: 40,
  knowledge: 28,
  situations: 12,
  durationSec: 2700,
  passingScore: 32,
} as const;

export interface ValidationIssue {
  code:
    | "missing_id"
    | "choice_count"
    | "duplicate_choice"
    | "invalid_answer"
    | "missing_prompt"
    | "missing_explanation"
    | "missing_source"
    | "missing_mention"
    | "missing_official_theme";
  message: string;
}

const ALL_MENTIONS: ExamMention[] = ["csp", "resident", "naturalisation"];
const ALL_OFFICIAL_THEMES: OfficialTheme[] = [
  "principes-valeurs",
  "institutions",
  "droits-devoirs",
  "histoire-geographie",
  "vie-societe",
];

export type RandomFn = () => number;

export function inferQuestionType(question: Question): QuestionType {
  return question.questionType ?? (question.type === "situation" ? "situation" : "knowledge");
}

export function inferOfficialTheme(question: Question): OfficialTheme {
  if (question.officialTheme) return question.officialTheme;

  const slug = question.themeSlug ?? "";
  if (/institution|union-europeenne|europe/.test(slug)) return "institutions";
  if (/droit|devoir|egalite-femmes|egalite/.test(slug)) return "droits-devoirs";
  if (/histoire|geographie|culture/.test(slug)) return "histoire-geographie";
  if (/vivre|societe|quotidien/.test(slug)) return "vie-societe";
  return "principes-valeurs";
}

function appliesToMention(question: Question, mention: ExamMention): boolean {
  const mentions = question.examMentions?.length ? question.examMentions : ALL_MENTIONS;
  return mentions.includes(mention);
}

function shuffle<T>(items: T[], random: RandomFn): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function pickBalanced(
  questions: Question[],
  count: number,
  random: RandomFn,
): Question[] {
  if (questions.length < count) {
    throw new Error(`Banque de questions insuffisante : ${questions.length}/${count}.`);
  }

  const groups = new Map<OfficialTheme, Question[]>(
    ALL_OFFICIAL_THEMES.map((theme) => [theme, []]),
  );

  for (const question of questions) {
    groups.get(inferOfficialTheme(question))?.push(question);
  }

  const queues = ALL_OFFICIAL_THEMES.map((theme) =>
    shuffle(groups.get(theme) ?? [], random),
  );
  const selected: Question[] = [];

  while (selected.length < count) {
    let pickedThisRound = false;
    for (const queue of queues) {
      const next = queue.shift();
      if (!next) continue;
      selected.push(next);
      pickedThisRound = true;
      if (selected.length === count) break;
    }
    if (!pickedThisRound) break;
  }

  if (selected.length !== count) {
    throw new Error(`Banque de questions insuffisante : ${selected.length}/${count}.`);
  }

  return selected;
}

export function buildExam(
  questions: Question[],
  mention: ExamMention,
  random: RandomFn = Math.random,
): Question[] {
  const eligible = questions.filter((question) => appliesToMention(question, mention));
  const knowledge = eligible.filter((question) => inferQuestionType(question) === "knowledge");
  const situations = eligible.filter((question) => inferQuestionType(question) === "situation");

  const selected = [
    ...pickBalanced(knowledge, OFFICIAL_EXAM_BLUEPRINT.knowledge, random),
    ...pickBalanced(situations, OFFICIAL_EXAM_BLUEPRINT.situations, random),
  ];

  const representedThemes = new Set(selected.map(inferOfficialTheme));
  if (representedThemes.size !== ALL_OFFICIAL_THEMES.length) {
    throw new Error("Banque de questions insuffisante pour couvrir les cinq thèmes officiels.");
  }

  return shuffle(selected, random).map((question) => ({
    ...question,
    questionType: inferQuestionType(question),
    officialTheme: inferOfficialTheme(question),
    examMentions: question.examMentions?.length ? question.examMentions : ALL_MENTIONS,
  }));
}

export function validateQuestion(question: Question): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const choiceIds = question.choices.map((choice) => choice.id);

  if (!question.id.trim()) issues.push({ code: "missing_id", message: "Identifiant manquant." });
  if (!question.prompt.trim()) issues.push({ code: "missing_prompt", message: "Question manquante." });
  if (!question.explanation.trim()) {
    issues.push({ code: "missing_explanation", message: "Explication manquante." });
  }
  if (question.choices.length !== 4) {
    issues.push({ code: "choice_count", message: "Une question doit contenir quatre choix." });
  }
  if (new Set(choiceIds).size !== choiceIds.length) {
    issues.push({ code: "duplicate_choice", message: "Les identifiants de choix doivent être uniques." });
  }
  if (!choiceIds.includes(question.answer)) {
    issues.push({ code: "invalid_answer", message: "La réponse correcte ne correspond à aucun choix." });
  }
  if (!question.source?.title || !question.source.url || !question.source.verifiedAt) {
    issues.push({ code: "missing_source", message: "Une source vérifiée est obligatoire." });
  }
  if (!question.examMentions?.length) {
    issues.push({ code: "missing_mention", message: "Au moins un parcours doit être renseigné." });
  }
  if (!question.officialTheme) {
    issues.push({ code: "missing_official_theme", message: "Le thème officiel doit être renseigné." });
  }

  return issues;
}

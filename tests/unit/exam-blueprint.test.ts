import { describe, expect, it } from "vitest";
import { buildExam, validateQuestion } from "../../src/lib/exam/blueprint";
import type { Question } from "../../src/lib/types";

const officialThemes = [
  "principes-valeurs",
  "institutions",
  "droits-devoirs",
  "histoire-geographie",
  "vie-societe",
] as const;

function makeQuestion(index: number, type: "knowledge" | "situation"): Question {
  return {
    id: `${type}-${index}`,
    type: type === "knowledge" ? "qcm" : "situation",
    questionType: type,
    themeSlug: `module-${index % 10}`,
    officialTheme: officialThemes[index % officialThemes.length],
    examMentions: ["csp", "resident", "naturalisation"],
    prompt: `Question ${index}`,
    choices: [
      { id: "a", text: "Réponse A" },
      { id: "b", text: "Réponse B" },
      { id: "c", text: "Réponse C" },
      { id: "d", text: "Réponse D" },
    ],
    answer: "a",
    explanation: "Explication vérifiable.",
    difficulty: 1,
    source: {
      title: "Source officielle",
      url: "https://www.interieur.gouv.fr/",
      verifiedAt: "2026-07-29",
    },
  };
}

describe("buildExam", () => {
  it("construit exactement 40 questions avec une répartition 28 connaissances / 12 situations", () => {
    const questions = [
      ...Array.from({ length: 50 }, (_, index) => makeQuestion(index, "knowledge")),
      ...Array.from({ length: 30 }, (_, index) => makeQuestion(index + 100, "situation")),
    ];

    const exam = buildExam(questions, "naturalisation", () => 0.5);

    expect(exam).toHaveLength(40);
    expect(exam.filter((question) => question.questionType === "knowledge")).toHaveLength(28);
    expect(exam.filter((question) => question.questionType === "situation")).toHaveLength(12);
    expect(new Set(exam.map((question) => question.officialTheme)).size).toBe(5);
  });

  it("refuse une banque insuffisante au lieu de produire un faux examen conforme", () => {
    const questions = Array.from({ length: 20 }, (_, index) => makeQuestion(index, "knowledge"));

    expect(() => buildExam(questions, "csp", () => 0.5)).toThrow(/insuffisante/i);
  });
});

describe("validateQuestion", () => {
  it("signale les choix incomplets, la réponse invalide et la source absente", () => {
    const invalid = makeQuestion(1, "knowledge");
    invalid.choices = invalid.choices.slice(0, 3);
    invalid.answer = "d";
    invalid.source = undefined;

    const issues = validateQuestion(invalid);

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["choice_count", "invalid_answer", "missing_source"]),
    );
  });
});

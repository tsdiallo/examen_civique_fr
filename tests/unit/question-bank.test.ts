import { describe, expect, it } from "vitest";
import baseExam from "../../src/data/exam-final.json";
import extraExam from "../../src/data/exam-extra-situations.json";
import { normalizeQuestion, validateQuestion } from "../../src/lib/exam/blueprint";
import type { Question } from "../../src/lib/types";

const quizModules = import.meta.glob<{ default: { questions: Question[] } }>(
  "../../src/data/quizzes/*.json",
  { eager: true },
);

const allQuestions: Question[] = [
  ...(baseExam.questions as Question[]),
  ...(extraExam.questions as Question[]),
  ...Object.values(quizModules).flatMap((module) => module.default.questions),
];

describe("question bank quality", () => {
  it("uses unique question identifiers", () => {
    const ids = allQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("normalizes every question into a complete publishable record", () => {
    for (const question of allQuestions) {
      const normalized = normalizeQuestion(question);
      expect(validateQuestion(normalized), question.id).toEqual([]);
    }
  });

  it("contains enough material for the official 28/12 blueprint", () => {
    const normalized = allQuestions.map(normalizeQuestion);
    expect(normalized.filter((question) => question.questionType === "knowledge").length).toBeGreaterThanOrEqual(28);
    expect(normalized.filter((question) => question.questionType === "situation").length).toBeGreaterThanOrEqual(12);
  });
});

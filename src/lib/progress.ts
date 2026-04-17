import type { ProgressState } from "./types";
import { readJSON, writeJSON } from "./storage";

const DEFAULT: ProgressState = { themes: {}, exam: null, weakThemes: [] };

export function getProgress(): ProgressState {
  return readJSON<ProgressState>(DEFAULT);
}

export function saveThemeAttempt(slug: string, score: number): void {
  const state = getProgress();
  const prev = state.themes[slug];
  state.themes[slug] = {
    attempts: (prev?.attempts ?? 0) + 1,
    bestScore: Math.max(prev?.bestScore ?? 0, score),
    lastAt: new Date().toISOString(),
  };
  writeJSON(state);
}

export function saveExamAttempt(score: number, weak: string[]): void {
  const state = getProgress();
  state.exam = {
    attempts: (state.exam?.attempts ?? 0) + 1,
    bestScore: Math.max(state.exam?.bestScore ?? 0, score),
    lastAt: new Date().toISOString(),
  };
  state.weakThemes = weak;
  writeJSON(state);
}

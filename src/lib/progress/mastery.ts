const DAY_MS = 24 * 60 * 60 * 1000;

export function computeMastery(
  correct: number,
  total: number,
  previousMastery: number,
): number {
  if (total <= 0) return Math.max(0, Math.min(100, Math.round(previousMastery)));

  const currentScore = (correct / total) * 100;
  const smoothed = currentScore * 0.7 + previousMastery * 0.3;
  return Math.max(0, Math.min(100, Math.round(smoothed)));
}

export function nextReviewDate(mastery: number, from = new Date()): Date {
  const normalized = Math.max(0, Math.min(100, mastery));
  const days = normalized < 40 ? 1 : normalized < 70 ? 3 : normalized < 90 ? 7 : 14;
  return new Date(from.getTime() + days * DAY_MS);
}

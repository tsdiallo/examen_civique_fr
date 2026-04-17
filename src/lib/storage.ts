const KEY = "ecfr.progress.v1";

export function readJSON<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* quota or unavailable : noop */
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

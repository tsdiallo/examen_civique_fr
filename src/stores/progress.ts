import { persistentAtom } from "@nanostores/persistent";
import type { ProgressState } from "../lib/types";

const DEFAULT: ProgressState = { themes: {}, exam: null, weakThemes: [] };

export const $progress = persistentAtom<ProgressState>(
  "ecfr.progress.v1",
  DEFAULT,
  {
    encode: JSON.stringify,
    decode: (v) => {
      try { return JSON.parse(v) as ProgressState; } catch { return DEFAULT; }
    },
  }
);

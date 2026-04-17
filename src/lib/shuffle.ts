export function shuffle<T>(input: readonly T[], seed?: number): T[] {
  const arr = [...input];
  let s = seed ?? Math.floor(Math.random() * 1e9);
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

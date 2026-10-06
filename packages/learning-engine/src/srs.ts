/** FSRS-4.5 (algorithme libre de répétition espacée), poids par défaut. Notes : 1 oublié, 2 difficile, 3 bien, 4 facile. */
const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755] as const;
const w = (i: number) => W[i]!;
const DECAY = -0.5, FACTOR = 19 / 81, DAY = 864e5;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export type Rating = 1 | 2 | 3 | 4;
export interface CardState { stability: number; difficulty: number; lapses: number; reps: number; lastReviewAt: Date | null }

export const retrievability = (days: number, s: number) => Math.pow(1 + (FACTOR * days) / s, DECAY);
/** Intervalle (jours) pour atteindre la rétention visée (90 % par défaut). */
export const intervalDays = (s: number, r = 0.9) => (s / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);

export function schedule(c: CardState, g: Rating, now = new Date()): CardState & { dueAt: Date } {
  let s: number, d: number, lapses = c.lapses;
  if (c.reps === 0 || !c.lastReviewAt) {
    s = w(g - 1); d = clamp(w(4) - w(5) * (g - 3), 1, 10);
    if (g === 1) lapses++;
  } else {
    const r = retrievability(Math.max(0, (now.getTime() - c.lastReviewAt.getTime()) / DAY), c.stability);
    const D = c.difficulty, S = c.stability;
    d = clamp(w(7) * w(4) + (1 - w(7)) * (D - w(6) * (g - 3)), 1, 10);
    if (g === 1) {
      s = Math.min(S, w(11) * Math.pow(D, -w(12)) * (Math.pow(S + 1, w(13)) - 1) * Math.exp((1 - r) * w(14)));
      lapses++;
    } else {
      s = S * (1 + Math.exp(w(8)) * (11 - D) * Math.pow(S, -w(9)) * (Math.exp((1 - r) * w(10)) - 1) * (g === 2 ? w(15) : 1) * (g === 4 ? w(16) : 1));
    }
  }
  const dueAt = g === 1 ? new Date(now.getTime() + 10 * 60e3) : new Date(now.getTime() + Math.max(1, Math.round(intervalDays(s))) * DAY);
  return { stability: s, difficulty: d, lapses, reps: c.reps + 1, lastReviewAt: now, dueAt };
}

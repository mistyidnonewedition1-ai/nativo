import type { CefrLevel, PlacementResult, Skill, SkillState } from "@nativo/shared";
import { BANK, DIFFICULTY, type BankItem } from "./items.js";

export const PLACEMENT_SKILLS: Skill[] = ["READING", "VOCABULARY", "GRAMMAR", "LISTENING"];
export const PER_SKILL = 4;
const START = 0.35;

export interface PlacementState {
  theta: Record<string, number>;               // estimation 0..1 par compétence
  n: Record<string, number>;                   // nb de réponses par compétence
  answers: { itemId: string; correct: boolean; ms: number }[];
  current: string | null;
}

export const newState = (): PlacementState => ({
  theta: Object.fromEntries(PLACEMENT_SKILLS.map((s) => [s, START])),
  n: Object.fromEntries(PLACEMENT_SKILLS.map((s) => [s, 0])),
  answers: [], current: null,
});

/** Compétence la moins évaluée, puis question la plus proche de l'estimation actuelle (≈ 50-70 % de réussite). */
export function nextItem(st: PlacementState): BankItem | null {
  const skill = PLACEMENT_SKILLS.filter((s) => (st.n[s] ?? 0) < PER_SKILL)
    .sort((a, b) => (st.n[a] ?? 0) - (st.n[b] ?? 0))[0];
  if (!skill) return null;
  const seen = new Set(st.answers.map((a) => a.itemId));
  const t = st.theta[skill] ?? START;
  return BANK.filter((i) => i.skill === skill && !seen.has(i.id))
    .sort((a, b) => Math.abs(DIFFICULTY[a.level] - t) - Math.abs(DIFFICULTY[b.level] - t))[0] ?? null;
}

/** Mise à jour de type Elo, avec plancher de 25 % (QCM à 4 choix : le hasard donne 1 bonne réponse sur 4). */
export function applyAnswer(st: PlacementState, item: BankItem, correct: boolean, ms: number) {
  const t = st.theta[item.skill] ?? START;
  const n = st.n[item.skill] ?? 0;
  const p = 0.25 + 0.75 / (1 + Math.exp(-(t - DIFFICULTY[item.level]) * 6));
  const k = 0.5 / (1 + 0.5 * n);
  st.theta[item.skill] = Math.min(1, Math.max(0, t + k * ((correct ? 1 : 0) - p)));
  st.n[item.skill] = n + 1;
  st.answers.push({ itemId: item.id, correct, ms });
}

/** Le test ne contient pas d'items C2 : le niveau est plafonné à C1. */
export function thetaToLevel(t: number): CefrLevel {
  return t < 0.19 ? "A1" : t < 0.37 ? "A2" : t < 0.535 ? "B1" : t < 0.71 ? "B2" : "C1";
}
export const meanLevel = (scores: number[]): CefrLevel =>
  thetaToLevel(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length));

export function buildResult(st: PlacementState): PlacementResult {
  const skills: SkillState[] = PLACEMENT_SKILLS.map((skill) => ({
    skill, score: st.theta[skill] ?? START, level: thetaToLevel(st.theta[skill] ?? START),
    confidence: Math.min(1, (st.n[skill] ?? 0) / PER_SKILL) * 0.8, // 4 questions : fiabilité limitée
  }));
  const mean = skills.reduce((a, s) => a + s.score, 0) / skills.length;
  return {
    overall: thetaToLevel(mean), skills,
    strengths: skills.filter((s) => s.score >= mean + 0.08).map((s) => s.skill),
    weaknesses: skills.filter((s) => s.score <= mean - 0.08).map((s) => s.skill),
  };
}

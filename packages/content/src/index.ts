import type { VocabEntry } from "@nativo/shared";
import { A1_LESSONS } from "./a1.js";
import type { Ex, Lesson } from "./types.js";

export type { Ex, Lesson };
export const LESSONS: Lesson[] = [...A1_LESSONS];

export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);

/** Tous les exercices d'une leçon avec leur identifiant stable (e0.. puis q0..). */
export const exercisesOf = (l: Lesson): { id: string; ex: Ex }[] => [
  ...l.exercises.map((ex, i) => ({ id: `${l.id}:e${i}`, ex })),
  ...l.quiz.map((ex, i) => ({ id: `${l.id}:q${i}`, ex })),
];
export const findExercise = (id: string) => {
  const l = findLesson(id.split(":")[0] ?? "");
  const hit = l && exercisesOf(l).find((e) => e.id === id);
  return hit ? { lesson: l, ...hit } : null;
};
export const findVocab = (vocabId: string): VocabEntry | undefined =>
  LESSONS.flatMap((l) => l.vocab).find((v) => v.id === vocabId);

import { z } from "zod";

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export const SKILLS = [
  "LISTENING", "SPEAKING", "PRONUNCIATION", "VOCABULARY", "GRAMMAR",
  "READING", "WRITING", "FLUENCY", "NATIVE_COMPREHENSION",
] as const;
export type Skill = (typeof SKILLS)[number];

export const GOALS = [
  "travel", "live_abroad", "work", "friends", "partner",
  "series_films", "songs", "conversational", "bilingual",
] as const;
export type Goal = (typeof GOALS)[number];

export const DAILY_MINUTES = [5, 10, 15, 30, 60] as const;

export const signupInput = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(10, "10 caractères minimum").max(128),
});
export const loginInput = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(128),
});

export const a11yPrefs = z.object({
  textScale: z.number().min(0.85).max(1.5).default(1),
  highContrast: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
});
export type A11yPrefs = z.infer<typeof a11yPrefs>;

export const profileInput = z.object({
  goal: z.enum(GOALS),
  dailyMinutes: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(30), z.literal(60)]),
  targetRegion: z.string().max(40).optional(),
  uiLanguage: z.enum(["fr", "es"]).default("fr"),
  a11y: a11yPrefs.optional(),
});
export type ProfileInput = z.infer<typeof profileInput>;

export const SKILL_LABELS: Record<Skill, string> = {
  LISTENING: "Compréhension orale", SPEAKING: "Expression orale", PRONUNCIATION: "Prononciation",
  VOCABULARY: "Vocabulaire", GRAMMAR: "Grammaire", READING: "Compréhension écrite",
  WRITING: "Expression écrite", FLUENCY: "Fluidité", NATIVE_COMPREHENSION: "Compréhension des natifs",
};
export const GOAL_LABELS: Record<Goal, string> = {
  travel: "Voyager", live_abroad: "Vivre dans un pays hispanophone", work: "Travailler",
  friends: "Parler avec des amis", partner: "Parler avec mon/ma partenaire",
  series_films: "Comprendre films et séries", songs: "Comprendre des chansons",
  conversational: "Tenir une conversation", bilingual: "Devenir bilingue",
};

export interface SkillState { skill: Skill; level: CefrLevel; score: number; confidence: number }

export interface MeResponse {
  id: string;
  email: string;
  plan: "FREE" | "PREMIUM";
  profile: (ProfileInput & { immersionMode: boolean }) | null;
  skills: SkillState[];
  overall: CefrLevel | null;
}

// --- Test de niveau ---
export interface PlacementItem {
  id: string; skill: Skill; level: CefrLevel;
  prompt: string; audioText?: string; options: string[]; // options déjà mélangées ; la bonne réponse n'est jamais envoyée
}
export interface PlacementProgress { done: number; total: number }
export interface PlacementResult {
  overall: CefrLevel; skills: SkillState[]; strengths: Skill[]; weaknesses: Skill[];
}
export interface PlacementStep { progress: PlacementProgress; item: PlacementItem | null; result: PlacementResult | null }
export const placementAnswerInput = z.object({
  sessionId: z.string().min(1), itemId: z.string().min(1),
  choice: z.string().max(300).nullable(), ms: z.number().int().min(0).max(600000),
});

// --- Leçons, exercices, vocabulaire ---
export interface DialogueLine { speaker: string; es: string; fr: string }
export interface Sentence { es: string; fr: string }
export interface VocabEntry { id: string; es: string; fr: string; contexts: Sentence[] }
export interface ExplainBlock { title: string; example: Sentence; observation: string; rule: string }
export interface ExercisePublic {
  id: string; kind: "mcq" | "fill" | "listen"; skill: Skill;
  prompt: string; audioText?: string; options: string[]; // la bonne réponse n'est jamais envoyée
}
export interface LessonPublic {
  id: string; title: string; level: CefrLevel; objectives: string[]; intro: string;
  dialogue: DialogueLine[]; vocab: VocabEntry[]; explain: ExplainBlock;
  exercises: ExercisePublic[]; quiz: ExercisePublic[];
}
export interface LessonSummary {
  id: string; title: string; level: CefrLevel; objectives: string[];
  status: "done" | "open" | "locked"; score?: number;
}
export const answerInput = z.object({
  exerciseId: z.string().min(1), choice: z.string().max(300).nullable(), ms: z.number().int().min(0).max(600000),
});
export interface AnswerFeedback { correct: boolean; answer: string; tip?: string }
export interface CompleteResponse { score: number; newCards: number }
export interface DueCard { vocabId: string; es: string; fr: string; context: Sentence; isNew: boolean }
export interface DueResponse { cards: DueCard[]; dueCount: number; total: number }
export const reviewInput = z.object({ rating: z.number().int().min(1).max(4) });

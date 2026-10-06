import type { CefrLevel, DialogueLine, ExplainBlock, Skill, VocabEntry } from "@nativo/shared";

/** options[0] = bonne réponse (mélangée à l'envoi, jamais exposée). */
export interface Ex {
  kind: "mcq" | "fill" | "listen"; skill: Skill; prompt: string; audioText?: string;
  options: [string, string, string, string]; errorTag?: string; tip?: string;
}
export interface Lesson {
  id: string; title: string; level: CefrLevel; objectives: string[]; intro: string;
  dialogue: DialogueLine[]; vocab: VocabEntry[]; explain: ExplainBlock; exercises: Ex[]; quiz: Ex[];
}
type O = Ex["options"];
export const listen = (audioText: string, prompt: string, options: O, tip?: string): Ex =>
  ({ kind: "listen", skill: "LISTENING", prompt, audioText, options, tip });
export const fill = (sentence: string, options: O, errorTag: string, tip: string): Ex =>
  ({ kind: "fill", skill: "GRAMMAR", prompt: `Complète : ${sentence}`, options, errorTag, tip });
export const mcq = (prompt: string, options: O): Ex => ({ kind: "mcq", skill: "VOCABULARY", prompt, options });
export const vocab = (id: string, es: string, fr: string, contexts: [string, string][]): VocabEntry =>
  ({ id, es, fr, contexts: contexts.map(([e, f]) => ({ es: e, fr: f })) });

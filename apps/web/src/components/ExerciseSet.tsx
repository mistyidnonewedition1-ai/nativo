"use client";
import { useRef, useState } from "react";
import type { AnswerFeedback, ExercisePublic } from "@nativo/shared";
import { api } from "@/lib/api";
import { SpeakButton } from "./SpeakButton";

export function ExerciseSet({ lessonId, items, onFinish }: { lessonId: string; items: ExercisePublic[]; onFinish: () => void }) {
  const [i, setI] = useState(0);
  const [fb, setFb] = useState<AnswerFeedback | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const shownAt = useRef(Date.now());
  const ex = items[i]!;

  async function pick(choice: string | null) {
    if (busy || fb) return;
    setBusy(true); setError(false); setPicked(choice);
    try { setFb(await api.answer(lessonId, { exerciseId: ex.id, choice, ms: Date.now() - shownAt.current })); }
    catch { setError(true); setPicked(null); }
    finally { setBusy(false); }
  }
  function next() {
    if (i + 1 >= items.length) return onFinish();
    setI(i + 1); setFb(null); setPicked(null); shownAt.current = Date.now();
  }
  const style = (o: string) =>
    !fb ? "btn-ghost justify-start py-3 text-left"
      : o === fb.answer ? "btn justify-start border-2 border-accent py-3 text-left font-bold"
      : o === picked ? "btn justify-start border border-danger py-3 text-left text-danger" : "btn-ghost justify-start py-3 text-left opacity-60";

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">Exercice {i + 1} sur {items.length}</p>
      {ex.audioText && <SpeakButton text={ex.audioText} label="🔊 Écouter la phrase" />}
      <h2 className="text-xl font-bold">{ex.prompt}</h2>
      <div className="flex flex-col gap-3">
        {ex.options.map((o) => <button key={o} className={style(o)} disabled={busy || !!fb} onClick={() => pick(o)}>{o}</button>)}
        {!fb && <button className="py-2 text-sm text-muted underline" disabled={busy} onClick={() => pick(null)}>Je ne sais pas</button>}
      </div>
      {fb && (
        <div role="status" className="rounded-xl border border-line bg-surface p-4">
          <p className="font-bold">{fb.correct ? "Correct !" : `Réponse : ${fb.answer}`}</p>
          {fb.tip && <p className="mt-1 text-sm text-muted">{fb.tip}</p>}
          {ex.audioText && !fb.correct && <p className="mt-1 text-sm text-muted">Phrase entendue : « {ex.audioText} »</p>}
          <button className="btn-primary mt-3" onClick={next}>{i + 1 >= items.length ? "Continuer" : "Suivant"}</button>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-danger">Réponse non enregistrée. Réessaie.</p>}
    </div>
  );
}

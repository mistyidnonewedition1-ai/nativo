"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PlacementItem, PlacementProgress, PlacementResult } from "@nativo/shared";
import { api } from "@/lib/api";
import { speakSpanish, type SpeakStatus } from "@/lib/speech";

export function Placement({ onDone }: { onDone: (r: PlacementResult) => void }) {
  const [sessionId, setSessionId] = useState("");
  const [item, setItem] = useState<PlacementItem | null>(null);
  const [progress, setProgress] = useState<PlacementProgress>({ done: 0, total: 16 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [voice, setVoice] = useState<SpeakStatus | null>(null);
  const shownAt = useRef(Date.now());
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    api
      .placementStart()
      .then((r) => {
        setSessionId(r.sessionId);
        setItem(r.item);
        setProgress(r.progress);
        shownAt.current = Date.now();
      })
      .catch(() => setError(true));
  }, []);

  const answer = useCallback(
    async (choice: string | null) => {
      if (!item || busy) return;
      setBusy(true);
      setError(false);
      try {
        const r = await api.placementAnswer({
          sessionId,
          itemId: item.id,
          choice,
          ms: Date.now() - shownAt.current,
        });
        setProgress(r.progress);
        setVoice(null);
        if (r.result) onDone(r.result);
        else {
          setItem(r.item);
          shownAt.current = Date.now();
        }
      } catch {
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [item, busy, sessionId, onDone],
  );

  if (error && !item) return <p role="alert" className="text-danger">Impossible de charger le test. Recharge la page.</p>;
  if (!item) return <p role="status" className="text-muted">Préparation du test…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted">Question {progress.done + 1} sur {progress.total}</p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.done}
          aria-label="Avancement du test"
        >
          <div className="h-full bg-accent" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
        </div>
      </div>

      {item.audioText && (
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={async () => setVoice(await speakSpanish(item.audioText!, false))}>
              🔊 Écouter la phrase
            </button>
            <button className="btn-ghost" onClick={async () => setVoice(await speakSpanish(item.audioText!, true))}>
              🐢 Plus lentement
            </button>
          </div>
          {voice === "ok" || voice === null ? (
            <p className="text-xs text-muted">
              Voix de synthèse de ton navigateur : tu peux réécouter autant de fois que tu veux.
            </p>
          ) : (
            <p role="alert" className="text-sm text-danger">
              Aucune voix espagnole détectée sur cet appareil. Ouvre le site dans Microsoft Edge (voix naturelles
              incluses), ou ajoute l'espagnol dans Paramètres Windows › Heure et langue › Langue et région. Sinon,
              réponds « Je ne sais pas ».
            </p>
          )}
        </div>
      )}

      <h2 className="whitespace-pre-line text-xl font-bold">{item.prompt}</h2>

      <div className="flex flex-col gap-3">
        {item.options.map((o) => (
          <button key={o} className="btn-ghost justify-start py-3 text-left" disabled={busy} onClick={() => answer(o)}>
            {o}
          </button>
        ))}
        <button className="py-2 text-sm text-muted underline" disabled={busy} onClick={() => answer(null)}>
          Je ne sais pas
        </button>
      </div>

      {error && <p role="alert" className="text-sm text-danger">Réponse non enregistrée. Réessaie.</p>}
    </div>
  );
}
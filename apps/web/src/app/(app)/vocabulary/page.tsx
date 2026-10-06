"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DueResponse } from "@nativo/shared";
import { api } from "@/lib/api";
import { SpeakButton } from "@/components/SpeakButton";

const RATINGS = [[1, "Oublié"], [2, "Difficile"], [3, "Bien"], [4, "Facile"]] as const;

export default function Vocabulary() {
  const [data, setData] = useState<DueResponse | null>(null);
  const [i, setI] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.vocabDue().then(setData).catch(() => setData({ cards: [], dueCount: 0, total: 0 })); }, []);
  if (!data) return <p role="status" className="text-muted">Chargement…</p>;

  const card = data.cards[i];
  async function rate(r: number) {
    if (!card || busy) return;
    setBusy(true);
    try { await api.vocabReview(card.vocabId, r); setI(i + 1); setReveal(false); } finally { setBusy(false); }
  }
  return (
    <section className="flex flex-col gap-5">
      <h1 className="text-3xl font-extrabold tracking-tight">Vocabulaire</h1>
      {!card ? (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="font-bold">{data.total === 0 ? "Aucune carte pour l'instant." : "Rien à réviser maintenant. 🎉"}</p>
          <p className="mt-1 text-muted">{data.total === 0 ? "Termine une leçon : ses mots arrivent ici automatiquement." : "Les prochaines révisions sont planifiées selon ce que tu retiens."}</p>
          <Link href="/learn" className="btn-primary mt-4">Aller aux leçons</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6">
          <p className="text-sm text-muted">Carte {i + 1} sur {data.cards.length}{card.isNew ? " · nouvelle" : ""}</p>
          <p className="text-2xl font-bold">{card.context.es}</p>
          <SpeakButton text={card.context.es} />
          <p className="text-sm text-muted">Mot à retenir : <strong className="text-ink">{card.es}</strong></p>
          {!reveal ? (
            <button className="btn-primary" onClick={() => setReveal(true)}>Montrer la traduction</button>
          ) : (<>
            <p className="text-lg">{card.context.fr}</p>
            <p className="text-sm text-muted">{card.es} = {card.fr}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {RATINGS.map(([r, label]) => <button key={r} className="btn-ghost" disabled={busy} onClick={() => rate(r)}>{label}</button>)}
            </div>
          </>)}
        </div>
      )}
    </section>
  );
}

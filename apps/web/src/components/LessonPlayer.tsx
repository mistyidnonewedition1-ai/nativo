"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CompleteResponse, LessonPublic } from "@nativo/shared";
import { api } from "@/lib/api";
import { ExerciseSet } from "./ExerciseSet";
import { SpeakButton } from "./SpeakButton";

const STAGES = [
  ["discover", "Découverte"], ["listen", "Écoute"], ["vocab", "Vocabulaire"],
  ["explain", "Explication"], ["exercise", "Exercices"], ["quiz", "Mini-évaluation"],
] as const;
type Stage = (typeof STAGES)[number][0] | "done";

export function LessonPlayer({ id }: { id: string }) {
  const [lesson, setLesson] = useState<LessonPublic | null>(null);
  const [stage, setStage] = useState<Stage>("discover");
  const [showFr, setShowFr] = useState(false);
  const [result, setResult] = useState<CompleteResponse | null>(null);
  const [error, setError] = useState(false);
  const completing = useRef(false);

  useEffect(() => { api.lesson(id).then(setLesson).catch(() => setError(true)); }, [id]);
  useEffect(() => {
    if (stage !== "done" || completing.current) return;
    completing.current = true;
    api.complete(id).then(setResult).catch(() => setError(true));
  }, [stage, id]);

  if (error) return <p role="alert" className="text-danger">Impossible de charger la leçon.</p>;
  if (!lesson) return <p role="status" className="text-muted">Chargement…</p>;

  const idx = STAGES.findIndex(([k]) => k === stage);
  const next = () => { const n = STAGES[idx + 1]; setStage(n ? n[0] : "done"); };
  const listening = lesson.exercises.filter((e) => e.kind === "listen");
  const others = lesson.exercises.filter((e) => e.kind !== "listen");
  const nextBtn = <button className="btn-primary self-start" onClick={next}>Continuer</button>;

  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted">{lesson.level} · {stage === "done" ? "Terminé" : STAGES[idx]![1]}</p>
        <h1 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h1>
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {STAGES.map(([k], n) => <span key={k} className={`h-1.5 flex-1 rounded-full ${n <= idx || stage === "done" ? "bg-accent" : "bg-line"}`} />)}
        </div>
      </div>

      {stage === "discover" && (<>
        <p className="text-muted">{lesson.intro}</p>
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
          {lesson.dialogue.map((l, n) => (
            <div key={n} className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase text-muted">{l.speaker}</span>
              <p className="text-lg font-medium">{l.es}</p>
              {showFr && <p className="text-sm text-muted">{l.fr}</p>}
              <SpeakButton text={l.es} />
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4" checked={showFr} onChange={(e) => setShowFr(e.target.checked)} />Afficher la traduction</label>
        <ul className="list-disc pl-5 text-sm text-muted">{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
        {nextBtn}
      </>)}

      {stage === "listen" && (listening.length
        ? <ExerciseSet lessonId={id} items={listening} onFinish={next} />
        : <>{nextBtn}</>)}

      {stage === "vocab" && (<>
        <div className="flex flex-col gap-4">
          {lesson.vocab.map((v) => (
            <div key={v.id} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-lg font-bold">{v.es} <span className="font-normal text-muted">— {v.fr}</span></p>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {v.contexts.map((c) => <li key={c.es}>{c.es} <span className="text-muted">({c.fr})</span></li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">Ces mots sont ajoutés à tes cartes de révision à la fin de la leçon.</p>
        {nextBtn}
      </>)}

      {stage === "explain" && (<>
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm font-semibold text-muted">Exemple</p>
          <p className="text-xl font-bold">{lesson.explain.example.es}</p>
          <p className="text-sm text-muted">{lesson.explain.example.fr}</p>
          <p className="text-sm font-semibold text-muted">Observation</p>
          <p>{lesson.explain.observation}</p>
          <h2 className="text-lg font-bold">{lesson.explain.title}</h2>
          <p>{lesson.explain.rule}</p>
        </div>
        {nextBtn}
      </>)}

      {stage === "exercise" && <ExerciseSet lessonId={id} items={others} onFinish={next} />}
      {stage === "quiz" && <ExerciseSet lessonId={id} items={lesson.quiz} onFinish={next} />}

      {stage === "done" && (
        <div className="flex flex-col gap-4">
          {result ? (<>
            <p className="text-2xl font-extrabold">Leçon terminée : {Math.round(result.score * 100)} % de réussite</p>
            <p className="text-muted">{result.newCards > 0 ? `${result.newCards} nouvelles cartes ajoutées à ta révision.` : "Tes cartes de cette leçon sont déjà dans ta révision."}</p>
            <p className="text-sm text-muted">La conversation avec l'IA et la prononciation, prévues dans la structure des leçons, arrivent aux étapes 4 et 5.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/vocabulary" className="btn-primary">Réviser mes cartes</Link>
              <Link href="/learn" className="btn-ghost">Retour au parcours</Link>
            </div>
          </>) : <p role="status" className="text-muted">Enregistrement…</p>}
        </div>
      )}
    </section>
  );
}

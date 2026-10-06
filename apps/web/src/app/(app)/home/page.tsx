"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SKILLS, SKILL_LABELS, type DueResponse, type LessonSummary } from "@nativo/shared";
import { api } from "@/lib/api";
import { SkillBar } from "@/components/SkillBar";
import { useMe } from "@/lib/me";

export default function Home() {
  const me = useMe();
  const [path, setPath] = useState<LessonSummary[]>([]);
  const [due, setDue] = useState<DueResponse | null>(null);
  useEffect(() => {
    api.path().then(setPath).catch(() => {});
    api.vocabDue().then(setDue).catch(() => {});
  }, []);
  if (!me) return null;
  const byKey = new Map(me.skills.map((s) => [s.skill, s]));
  const nextLesson = path.find((l) => l.status === "open");
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Bonjour 👋</h1>
        <p className="mt-1 text-muted">Objectif du jour : {me.profile?.dailyMinutes} minutes d'espagnol</p>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-lg font-bold">Aujourd'hui pour toi</h2>
        {nextLesson ? (
          <Link href={`/learn/${nextLesson.id}`} className="btn-primary self-start">Continuer : {nextLesson.title}</Link>
        ) : path.length > 0 ? <p className="text-muted">Tu as terminé toutes les leçons disponibles. D'autres arrivent.</p> : null}
        {due && due.dueCount > 0
          ? <Link href="/vocabulary" className="btn-ghost self-start">Réviser {due.dueCount} carte{due.dueCount > 1 ? "s" : ""}</Link>
          : <p className="text-sm text-muted">Aucune carte à réviser pour le moment.</p>}
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm text-muted">Niveau général estimé</p>
        <p className="text-4xl font-extrabold">{me.overall}</p>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-lg font-bold">Tes compétences</h2>
        {SKILLS.map((k) => <SkillBar key={k} label={SKILL_LABELS[k]} level={byKey.get(k)?.level} score={byKey.get(k)?.score} />)}
      </div>
    </section>
  );
}

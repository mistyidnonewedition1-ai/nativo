"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { LessonSummary } from "@nativo/shared";
import { api } from "@/lib/api";

export default function Learn() {
  const [path, setPath] = useState<LessonSummary[] | null>(null);
  useEffect(() => { api.path().then(setPath).catch(() => setPath([])); }, []);
  if (!path) return <p role="status" className="text-muted">Chargement…</p>;
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight">Apprendre</h1>
      <p className="text-muted">Parcours A1 : espagnol du quotidien.</p>
      {path.map((l, n) => {
        const body = (<>
          <p className="text-sm text-muted">Leçon {n + 1} · {l.status === "done" ? `Terminée (${Math.round((l.score ?? 0) * 100)} %)` : l.status === "open" ? "À faire" : "Verrouillée"}</p>
          <h2 className="text-xl font-bold">{l.title}</h2>
          <p className="text-sm text-muted">{l.objectives.join(" · ")}</p>
        </>);
        const cls = "flex flex-col gap-1 rounded-2xl border border-line bg-surface p-5";
        return l.status === "locked"
          ? <div key={l.id} className={`${cls} opacity-60`} aria-disabled>{body}</div>
          : <Link key={l.id} href={`/learn/${l.id}`} className={`${cls} hover:border-accent`}>{body}</Link>;
      })}
    </section>
  );
}

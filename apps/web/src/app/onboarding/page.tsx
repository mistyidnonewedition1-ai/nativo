"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DAILY_MINUTES, GOALS, GOAL_LABELS, SKILL_LABELS, type Goal, type PlacementResult } from "@nativo/shared";
import { api } from "@/lib/api";
import { Placement } from "@/components/Placement";
import { SkillBar } from "@/components/SkillBar";

type Step = "goal" | "minutes" | "intro" | "test" | "result";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.me().then((m) => { if (m.profile && m.skills.length) router.replace("/home"); })
      .catch(() => router.replace("/login"));
  }, [router]);

  async function chooseMinutes(m: (typeof DAILY_MINUTES)[number]) {
    try { await api.saveProfile({ goal: goal!, dailyMinutes: m, uiLanguage: "fr" }); setStep("intro"); }
    catch { setError(true); }
  }

  const card = "btn-ghost justify-start py-3 text-left";
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 px-6 py-10">
      {step === "goal" && (<>
        <h1 className="text-3xl font-extrabold tracking-tight">Pourquoi veux-tu apprendre l'espagnol ?</h1>
        <div className="flex flex-col gap-3">
          {GOALS.map((g) => <button key={g} className={card} onClick={() => { setGoal(g); setStep("minutes"); }}>{GOAL_LABELS[g]}</button>)}
        </div>
      </>)}
      {step === "minutes" && (<>
        <h1 className="text-3xl font-extrabold tracking-tight">Combien de temps par jour ?</h1>
        <div className="flex flex-col gap-3">
          {DAILY_MINUTES.map((m) => <button key={m} className={card} onClick={() => chooseMinutes(m)}>{m === 60 ? "1 h ou plus" : `${m} minutes`}</button>)}
        </div>
        {error && <p role="alert" className="text-danger">Enregistrement impossible. Réessaie.</p>}
      </>)}
      {step === "intro" && (<>
        <h1 className="text-3xl font-extrabold tracking-tight">Un test pour partir du bon niveau</h1>
        <p className="text-muted">16 questions, environ 5 minutes. Elles s'adaptent à tes réponses : si tu réponds bien, elles se compliquent.
          Réponds « Je ne sais pas » plutôt que de deviner. Le test couvre la lecture, le vocabulaire, la grammaire et l'écoute.
          L'oral et la production écrite seront évalués plus tard, avec la conversation.</p>
        <button className="btn-primary" onClick={() => setStep("test")}>Commencer le test</button>
      </>)}
      {step === "test" && <Placement onDone={(r) => { setResult(r); setStep("result"); }} />}
      {step === "result" && result && (<>
        <h1 className="text-3xl font-extrabold tracking-tight">Ton espagnol est proche du niveau {result.overall}.</h1>
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
          {result.skills.map((s) => <SkillBar key={s.skill} label={SKILL_LABELS[s.skill]} level={s.level} score={s.score} />)}
        </div>
        {result.strengths.length > 0 && <p><strong>Points forts :</strong> {result.strengths.map((s) => SKILL_LABELS[s]).join(", ")}.</p>}
        {result.weaknesses.length > 0 && <p><strong>À travailler :</strong> {result.weaknesses.map((s) => SKILL_LABELS[s]).join(", ")}.</p>}
        <p className="text-sm text-muted">Estimation basée sur 4 questions par compétence : elle s'affinera au fil de tes leçons.</p>
        <button className="btn-primary" onClick={() => router.replace("/home")}>Voir ma première mission</button>
      </>)}
    </main>
  );
}

import { notFound } from "next/navigation";

const SECTIONS: Record<string, { title: string; step: number }> = {
  learn: { title: "Apprendre", step: 3 },
  immersion: { title: "Immersion", step: 6 },
  conversation: { title: "Conversation", step: 4 },
  pronunciation: { title: "Prononciation", step: 5 },
  vocabulary: { title: "Vocabulaire", step: 3 },
  progress: { title: "Progression", step: 8 },
};

export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  const s = SECTIONS[(await params).section];
  if (!s) notFound();
  return (
    <section>
      <h1 className="text-3xl font-extrabold tracking-tight">{s.title}</h1>
      <p className="mt-3 text-muted">Cette section est prévue à l'étape {s.step} du plan.</p>
    </section>
  );
}

"use client";
import { useState } from "react";
import { speakSpanish, type SpeakStatus } from "@/lib/speech";

export function SpeakButton({ text, label = "🔊 Écouter" }: { text: string; label?: string }) {
  const [status, setStatus] = useState<SpeakStatus | null>(null);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" className="btn-ghost min-h-9 px-3 text-sm" onClick={async () => setStatus(await speakSpanish(text, false))}>{label}</button>
      <button type="button" className="btn-ghost min-h-9 px-3 text-sm" aria-label="Écouter plus lentement" onClick={async () => setStatus(await speakSpanish(text, true))}>🐢</button>
      {status && status !== "ok" && <span role="alert" className="text-xs text-danger">Aucune voix espagnole sur cet appareil (essaie Microsoft Edge).</span>}
    </span>
  );
}

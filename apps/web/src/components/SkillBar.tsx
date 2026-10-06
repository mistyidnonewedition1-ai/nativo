import type { CefrLevel } from "@nativo/shared";

export function SkillBar({ label, level, score }: { label: string; level?: CefrLevel; score?: number }) {
  const pct = score === undefined ? 0 : Math.round(score * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-muted">{level ? `${level} · ${pct} %` : "À évaluer"}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={label}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

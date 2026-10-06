"use client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { usePrefs } from "@/lib/prefs";

export default function Settings() {
  const { prefs, set } = usePrefs();
  const router = useRouter();
  const row = "flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4";
  return (
    <section className="flex flex-col gap-3">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Réglages</h1>
      <label className={row}>Mode sombre
        <input type="checkbox" className="size-5" checked={prefs.theme === "dark"}
          onChange={(e) => set({ theme: e.target.checked ? "dark" : "light" })} />
      </label>
      <label className={row}>Contraste élevé
        <input type="checkbox" className="size-5" checked={prefs.highContrast}
          onChange={(e) => set({ highContrast: e.target.checked })} />
      </label>
      <label className={row}>Sans animation
        <input type="checkbox" className="size-5" checked={prefs.reduceMotion}
          onChange={(e) => set({ reduceMotion: e.target.checked })} />
      </label>
      <label className={row}>Taille du texte ({Math.round(prefs.textScale * 100)} %)
        <input type="range" min={0.85} max={1.5} step={0.05} value={prefs.textScale}
          onChange={(e) => set({ textScale: Number(e.target.value) })} />
      </label>
      <button className="btn-ghost mt-4" onClick={async () => { await api.logout(); router.replace("/login"); }}>
        Se déconnecter
      </button>
    </section>
  );
}

"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Prefs { theme: "light" | "dark"; textScale: number; highContrast: boolean; reduceMotion: boolean }
const DEFAULTS: Prefs = { theme: "light", textScale: 1, highContrast: false, reduceMotion: false };
const KEY = "nativo:prefs";

const Ctx = createContext<{ prefs: Prefs; set: (p: Partial<Prefs>) => void }>({ prefs: DEFAULTS, set: () => {} });
export const usePrefs = () => useContext(Ctx);

function apply(p: Prefs) {
  const el = document.documentElement;
  el.dataset.theme = p.theme;
  el.dataset.contrast = p.highContrast ? "high" : "normal";
  el.dataset.motion = p.reduceMotion ? "reduce" : "normal";
  el.style.setProperty("--scale", String(p.textScale));
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<Prefs> | null;
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const next = { ...DEFAULTS, theme: dark ? "dark" : "light", ...saved } as Prefs;
      setPrefs(next); apply(next);
    } catch { apply(DEFAULTS); }
  }, []);
  const set = (p: Partial<Prefs>) => {
    const next = { ...prefs, ...p };
    setPrefs(next); apply(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  return <Ctx.Provider value={{ prefs, set }}>{children}</Ctx.Provider>;
}

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";

const MESSAGES: Record<string, string> = {
  email_taken: "Un compte existe déjà avec cet e-mail.",
  invalid_credentials: "E-mail ou mot de passe incorrect.",
  validation: "Vérifie ton e-mail et choisis un mot de passe d'au moins 10 caractères.",
};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { email: String(f.get("email")), password: String(f.get("password")) };
    setBusy(true); setError(null);
    try {
      await (isSignup ? api.signup(body) : api.login(body));
      router.push("/home");
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "network";
      setError(MESSAGES[code] ?? "Impossible de joindre le serveur. Réessaie dans un instant.");
    } finally { setBusy(false); }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-6 py-12">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Nativo</h1>
        <p className="mt-2 text-muted">Aprende español. Habla como un nativo.</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          E-mail
          <input className="field" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Mot de passe
          <input className="field" name="password" type="password" required minLength={isSignup ? 10 : 1}
            autoComplete={isSignup ? "new-password" : "current-password"} />
        </label>
        {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
        <button className="btn-primary" disabled={busy}>
          {busy ? "Un instant…" : isSignup ? "Créer mon compte" : "Me connecter"}
        </button>
      </form>
      <p className="text-sm text-muted">
        {isSignup ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
        <Link className="font-semibold text-accent underline" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Se connecter" : "Créer un compte"}
        </Link>
      </p>
    </main>
  );
}

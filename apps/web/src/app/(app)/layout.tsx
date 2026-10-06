"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { MeResponse } from "@nativo/shared";
import { api } from "@/lib/api";
import { MeCtx } from "@/lib/me";
import { Nav } from "@/components/Nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    api
      .me()
      .then((m) => (!m.profile || m.skills.length === 0 ? router.replace("/onboarding") : setMe(m)))
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!me) return <p className="p-8 text-muted" role="status">Chargement…</p>;
  return (
    <MeCtx.Provider value={me}>
      <div className="flex min-h-dvh">
        <Nav />
        <main className="mx-auto w-full max-w-3xl px-5 pb-28 pt-8 md:pb-10">{children}</main>
        {/* Bouton permanent « Habla conmigo » : branché sur l'IA à l'étape 4. */}
        <Link href="/conversation" className="btn-primary fixed bottom-20 right-4 z-20 shadow-lg md:bottom-6 md:right-6">
          Habla conmigo
        </Link>
      </div>
    </MeCtx.Provider>
  );
}
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { href: "/home", label: "Accueil", mobile: true },
  { href: "/learn", label: "Apprendre", mobile: true },
  { href: "/immersion", label: "Immersion", mobile: true },
  { href: "/conversation", label: "Conversation", mobile: true },
  { href: "/pronunciation", label: "Prononciation", mobile: false },
  { href: "/vocabulary", label: "Vocabulaire", mobile: true },
  { href: "/progress", label: "Progression", mobile: false },
] as const;

export function Nav() {
  const path = usePathname();
  const link = (n: (typeof NAV)[number], cls: string) => (
    <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined} className={cls}>
      {n.label}
    </Link>
  );
  const side = "rounded-lg px-3 py-2 font-medium aria-[current=page]:bg-accent aria-[current=page]:text-accent-ink hover:bg-line/40";
  const tab = "flex-1 py-3 text-center text-xs font-semibold aria-[current=page]:text-accent";
  return (
    <>
      <nav aria-label="Navigation principale" className="hidden w-60 shrink-0 flex-col gap-1 border-r border-line p-4 md:flex">
        <span className="mb-6 px-3 text-2xl font-extrabold">Nativo</span>
        {NAV.map((n) => link(n, side))}
        <Link href="/settings" className={`${side} mt-auto`}>Réglages</Link>
      </nav>
      <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-10 flex border-t border-line bg-surface md:hidden">
        {NAV.filter((n) => n.mobile).map((n) => link(n, tab))}
      </nav>
    </>
  );
}

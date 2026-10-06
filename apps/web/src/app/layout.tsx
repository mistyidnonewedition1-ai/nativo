import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import type { ReactNode } from "react";
import { PrefsProvider } from "@/lib/prefs";
import "./globals.css";

const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "Nativo", description: "Aprende español. Habla como un nativo." };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={sans.variable}>
      <body><PrefsProvider>{children}</PrefsProvider></body>
    </html>
  );
}

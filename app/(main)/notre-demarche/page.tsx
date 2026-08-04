import type { Metadata } from "next";

import { EditorialHero, ManifestoQuote, ValuesGrid } from "@/components/features/NotreDemarche";

export const metadata: Metadata = {
  title: "Notre démarche - Mandibula",
  description:
    "Élever plutôt que prélever : découvrez la démarche responsable de Mandibula pour l'élevage d'invertébrés.",
};

export default function NotreDemarchePage() {
  return (
    <main>
      <EditorialHero />
      <ValuesGrid />
      <ManifestoQuote />
    </main>
  );
}

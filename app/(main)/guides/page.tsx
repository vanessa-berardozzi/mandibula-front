import type { Metadata } from "next"

import { GuidesPage } from "@/components/features/Guides"

export const metadata: Metadata = {
	title: "Guides et tutoriels - Mandibula",
	description:
		"Retrouvez les guides Mandibula, les tutoriels d’élevage et les fiches espèces pour construire un élevage cohérent.",
}

export default function GuidesRoutePage() {
	return <GuidesPage />
}
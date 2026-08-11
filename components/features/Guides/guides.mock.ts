export interface GuidesHeroStat {
	label: string
	value: string
}

export interface GuidesHeroContent {
	kicker: string
	titleLines: [string, string]
	description: string
	stats: GuidesHeroStat[]
}

export function buildGuidesHeroContent(speciesCount: number): GuidesHeroContent {
	return {
		kicker: "Mandibula Academy",
		titleLines: ["Mieux comprendre", "pour mieux élever."],
		description:
			"Des tutoriels pratiques et des fiches construites sur notre expérience d’élevage, sans recettes magiques ni raccourcis.",
		stats: [
			{ value: "08", label: "guides complets" },
			{ value: String(speciesCount), label: "fiches espèces" },
			{ value: "03", label: "niveaux" },
		],
	}
}

export const guidesHeroContent: GuidesHeroContent = buildGuidesHeroContent(0)
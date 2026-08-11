import { buildGuidesHeroContent } from "./guides.mock"
import { GuidesHero } from "./GuidesHero"
import { getSpeciesOverview } from "./guidesSpecies.mock"
import { GuidesSpeciesSection } from "./GuidesSpeciesSection"
import { GuidesTutorialsSection } from "./GuidesTutorialsSection"

export async function GuidesPage() {
	const speciesOverview = await getSpeciesOverview()
	const heroContent = buildGuidesHeroContent(speciesOverview.totalSpeciesCount)

	return (
		<main className="min-h-screen w-full bg-background text-foreground">
			<GuidesHero content={heroContent} />
			<GuidesTutorialsSection />
			<GuidesSpeciesSection groups={speciesOverview.groups} />
		</main>
	)
}
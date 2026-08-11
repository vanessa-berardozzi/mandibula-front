import styles from "./GuidesHero.module.css"
import { guidesHeroContent, type GuidesHeroContent } from "./guides.mock"

interface GuidesHeroProps {
	content?: GuidesHeroContent
}

export function GuidesHero({ content = guidesHeroContent }: GuidesHeroProps) {
	return (
		<section className={styles.hero} aria-labelledby="guides-hero-title">
			<div className={styles.content}>
				<p className="eyebrow">{content.kicker}</p>
				<h1 className={styles.title} id="guides-hero-title">
					{content.titleLines[0]}
					<br />
					{content.titleLines[1]}
				</h1>
				<p className={styles.description}>{content.description}</p>
				<div className={styles.stats} aria-label="Repères éditoriaux">
					{content.stats.map((stat) => (
						<span className={styles.stat} key={`${stat.value}-${stat.label}`}>
							<strong className={styles.statValue}>{stat.value}</strong>
							{stat.label}
						</span>
					))}
				</div>
			</div>
		</section>
	)
}
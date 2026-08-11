import Link from "next/link"

import styles from "./GuidesSpeciesSection.module.css"
import { getSpeciesGroups, type SpeciesGroup } from "./guidesSpecies.mock"

interface GuidesSpeciesSectionProps {
	groups?: SpeciesGroup[]
}

export async function GuidesSpeciesSection({ groups }: GuidesSpeciesSectionProps) {
	const speciesGroups = groups ?? (await getSpeciesGroups())

	return (
		<section className={styles.section} aria-labelledby="guides-species-title">
			<div className={styles.heading}>
				<div>
					<p className="eyebrow">Fiches d’élevage</p>
					<h2 id="guides-species-title">Explorer par groupe</h2>
				</div>
				<p>Température, humidité, alimentation, difficulté et variantes disponibles.</p>
			</div>

			<div className={styles.groups}>
				{speciesGroups.map((group) => (
					<article className={styles.groupCard} key={group.title}>
						<header className={styles.groupHeader}>
							<h3>{group.title}</h3>
							<span className={styles.groupCount}>{group.countLabel}</span>
						</header>

						{group.items.length ? (
							<div className={styles.groupGrid}>
								{group.items.map((item) => (
									<Link className={styles.sheetCard} href={item.href} key={item.id}>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={item.image} alt="" loading="lazy" />
										<span>{item.name}</span>
									</Link>
								))}
							</div>
						) : (
							<p className={styles.groupEmpty}>Aucune fiche disponible actuellement.</p>
						)}

						<Link className={styles.groupLink} href={group.groupHref}>
							Voir toutes les fiches →
						</Link>
					</article>
				))}
			</div>
		</section>
	)
}
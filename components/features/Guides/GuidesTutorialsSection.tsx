"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import styles from "./GuidesTutorialsSection.module.css"
import { tutorialCards, tutorialCategories } from "./guidesTutorials.mock"

export function GuidesTutorialsSection() {
	const [selectedCategory, setSelectedCategory] = useState<(typeof tutorialCategories)[number]>("Tous")
	const [query, setQuery] = useState("")

	const filteredTutorials = useMemo(() => {
		const normalizedQuery = query.toLocaleLowerCase("fr").trim()

		return tutorialCards.filter((tutorial) => {
			const matchesCategory = selectedCategory === "Tous" || tutorial.category === selectedCategory
			if (!matchesCategory) {
				return false
			}

			if (!normalizedQuery) {
				return true
			}

			const searchable = `${tutorial.title} ${tutorial.summary} ${tutorial.category}`.toLocaleLowerCase("fr")
			return searchable.includes(normalizedQuery)
		})
	}, [query, selectedCategory])

	return (
		<>
			<section className={styles.intro} aria-labelledby="guides-tutorials-title">
				<p className={`eyebrow ${styles.introEyebrow}`}>Apprendre avec Mandibula</p>
				<h2 id="guides-tutorials-title">Du premier bac au milieu bioactif.</h2>
				<p>
					Commencez par les bases ou cherchez directement la réponse à votre problème. Chaque guide sépare les
					principes généraux des besoins propres à chaque espèce.
				</p>
			</section>

			<section className={styles.library} aria-label="Bibliothèque de tutoriels">
				<div className={styles.toolbar}>
					<div className={styles.tabs} role="tablist" aria-label="Filtrer les tutoriels par catégorie">
						{tutorialCategories.map((category) => {
							const isActive = selectedCategory === category
							return (
								<button
									className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
									type="button"
									role="tab"
									aria-selected={isActive}
									onClick={() => setSelectedCategory(category)}
									key={category}
								>
									{category}
								</button>
							)
						})}
					</div>

					<label>
						<span className="sr-only">Rechercher un tutoriel</span>
						<input
							className={styles.search}
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Rechercher un tutoriel…"
						/>
					</label>
				</div>

				{filteredTutorials.length ? (
					<div className={styles.grid}>
						{filteredTutorials.map((tutorial, index) => (
							<Link className={styles.card} href={`/guides/${tutorial.slug}`} key={tutorial.slug}>
								<span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
								<div>
									<p className={styles.category}>{tutorial.category}</p>
									<h2>{tutorial.title}</h2>
									<div className={styles.summary}>{tutorial.summary}</div>
								</div>
								<div className={styles.cardFooter}>
									<span>{tutorial.level}</span>
									<span>{tutorial.readingTime}</span>
									<strong className={styles.cta}>Lire le guide</strong>
								</div>
							</Link>
						))}
					</div>
				) : (
					<p className={styles.empty}>Aucun tutoriel ne correspond à cette recherche pour le moment.</p>
				)}
			</section>
		</>
	)
}
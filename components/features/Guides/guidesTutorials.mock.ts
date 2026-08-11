export type TutorialCategory = "Bien débuter" | "Techniques d’élevage" | "Milieux & bioactivité"
export type TutorialLevel = "Débutant" | "Intermédiaire" | "Avancé"

export interface TutorialCardItem {
	slug: string
	category: TutorialCategory
	title: string
	summary: string
	readingTime: string
	level: TutorialLevel
}

export const tutorialCategories: Array<"Tous" | TutorialCategory> = [
	"Tous",
	"Bien débuter",
	"Techniques d’élevage",
	"Milieux & bioactivité",
]

export const tutorialCards: TutorialCardItem[] = [
	{
		slug: "demarrer-elevage-isopodes",
		category: "Bien débuter",
		title: "Démarrer un élevage d’isopodes",
		summary: "Installer une première colonie sur des bases stables et durables.",
		readingTime: "9 min",
		level: "Débutant",
	},
	{
		slug: "gradient-humidite-isopodes",
		category: "Techniques d’élevage",
		title: "Comprendre le gradient d’humidité",
		summary: "Lire un bac via l’équilibre humidité, ventilation et condensation.",
		readingTime: "7 min",
		level: "Débutant",
	},
	{
		slug: "substrat-isopodes",
		category: "Milieux & bioactivité",
		title: "Construire un substrat vivant et durable",
		summary: "Bois, feuilles, minéraux et biochar pour un milieu stable.",
		readingTime: "10 min",
		level: "Intermédiaire",
	},
	{
		slug: "nourrir-isopodes",
		category: "Bien débuter",
		title: "Nourrir sans surcharger",
		summary: "Construire la base alimentaire et doser les compléments correctement.",
		readingTime: "8 min",
		level: "Débutant",
	},
	{
		slug: "proteger-elevages-canicule",
		category: "Techniques d’élevage",
		title: "Protéger ses élevages de la chaleur",
		summary: "Prévenir la surchauffe et refroidir progressivement sans stress.",
		readingTime: "8 min",
		level: "Débutant",
	},
	{
		slug: "terrarium-bioactif",
		category: "Milieux & bioactivité",
		title: "Créer un terrarium bioactif équilibré",
		summary: "Structurer, ensemencer et entretenir un milieu vivant cohérent.",
		readingTime: "11 min",
		level: "Intermédiaire",
	},
	{
		slug: "debuter-myriapodes",
		category: "Bien débuter",
		title: "Débuter avec les myriapodes",
		summary: "Choix de l’espèce, substrat profond et gestes à éviter.",
		readingTime: "9 min",
		level: "Débutant",
	},
	{
		slug: "collemboles-culture-entretien",
		category: "Milieux & bioactivité",
		title: "Maintenir une culture de collemboles",
		summary: "Mettre en place une culture de secours simple et fiable.",
		readingTime: "6 min",
		level: "Débutant",
	},
]
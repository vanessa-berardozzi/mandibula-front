const backendUrl =
	process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "https://mandibula-back.onrender.com"

const MAX_DISPLAYED_SHEETS = 6

interface ApiProduct {
	id: string
	name: string
	images: string[]
	category?: { id: string; name: string; slug: string; parentId: string | null }
}

interface CategoryResponse {
	data: ApiProduct[]
	total: number
}

interface ApiCategoryNode {
	id: string
	name: string
	slug: string
	children?: ApiCategoryNode[]
}

interface SpeciesGroupDefinition {
	title: string
	categoryNames: string[]
}

export interface SpeciesSheetItem {
	id: string
	name: string
	href: string
	image: string
}

export interface SpeciesGroup {
	title: string
	count: number
	countLabel: string
	items: SpeciesSheetItem[]
	primaryCategoryName: string
	groupHref: string
}

const SPECIES_GROUP_DEFINITIONS: SpeciesGroupDefinition[] = [
	{
		title: "Isopodes",
		categoryNames: ["Cubaris", "Ardentiella", "Laureola", "Porcellio", "Troglodillo", "Autres isopodes"],
	},
	{
		title: "Myriapodes",
		categoryNames: ["Myriapodes"],
	},
	{
		title: "Collemboles",
		categoryNames: ["Collemboles"],
	},
	{
		title: "Autres invertébrés",
		categoryNames: ["Blattes", "Coléoptères", "Araignées", "Mantes"],
	},
]

function normalizeLabel(value: string): string {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

async function fetchCategoriesTree(): Promise<ApiCategoryNode[]> {
	try {
		const response = await fetch(`${backendUrl}/api/products/categories/all`, {
			cache: "no-store",
		})

		if (!response.ok) {
			return []
		}

		return (await response.json()) as ApiCategoryNode[]
	} catch {
		return []
	}
}

function flattenCategories(tree: ApiCategoryNode[]): ApiCategoryNode[] {
	const flat: ApiCategoryNode[] = []

	for (const node of tree) {
		flat.push(node)
		for (const child of node.children ?? []) {
			flat.push(child)
		}
	}

	return flat
}

async function fetchProductsByCategorySlug(slug: string): Promise<ApiProduct[]> {
	try {
		const response = await fetch(`${backendUrl}/api/products/category/${slug}`, {
			cache: "no-store",
		})

		if (!response.ok) {
			return []
		}

		const payload = (await response.json()) as CategoryResponse
		return payload.data ?? []
	} catch {
		return []
	}
}

function toSheetItem(product: ApiProduct): SpeciesSheetItem | null {
	const image = product.images?.[0]
	if (!image) {
		return null
	}

	return {
		id: product.id,
		name: product.name,
		href: `/product/${product.id}`,
		image,
	}
}

function dedupeProducts(products: ApiProduct[]): ApiProduct[] {
	const seen = new Set<string>()
	const unique: ApiProduct[] = []

	for (const product of products) {
		if (seen.has(product.id)) {
			continue
		}
		seen.add(product.id)
		unique.push(product)
	}

	return unique
}


export interface SpeciesOverview {
	groups: SpeciesGroup[]
	totalSpeciesCount: number
}

function buildGroupHref(primaryCategoryName: string): string {
	return `/shop?categorie=${encodeURIComponent(primaryCategoryName)}`
}

// Cette fonction garde le même comportement que la maquette:
// - regroupement par noms de catégories
// - affichage limité à 6 cartes
// - compteur sur le total réel du groupe
export async function getSpeciesOverview(): Promise<SpeciesOverview> {
	const categoriesTree = await fetchCategoriesTree()
	const categoriesByName = new Map<string, ApiCategoryNode>()

	for (const category of flattenCategories(categoriesTree)) {
		categoriesByName.set(normalizeLabel(category.name), category)
	}

	const groups = await Promise.all(
		SPECIES_GROUP_DEFINITIONS.map(async (group) => {
			const groupCategories = group.categoryNames
				.map((categoryName) => categoriesByName.get(normalizeLabel(categoryName)))
				.filter((category): category is ApiCategoryNode => Boolean(category))

			const productsByCategory = await Promise.all(
				groupCategories.map((category) => fetchProductsByCategorySlug(category.slug)),
			)
			const mergedProducts = dedupeProducts(productsByCategory.flat())
			const allSheetItems = mergedProducts
				.map(toSheetItem)
				.filter((item): item is SpeciesSheetItem => item !== null)
			const items = allSheetItems.slice(0, MAX_DISPLAYED_SHEETS)

			const primaryCategoryName = group.categoryNames[0]
			const count = allSheetItems.length

			return {
				title: group.title,
				count,
				countLabel: `${count} fiches`,
				items,
				primaryCategoryName,
				groupHref: buildGroupHref(primaryCategoryName),
			}
		}),
	)

	const totalSpeciesCount = groups.reduce((total, group) => total + group.count, 0)

	return {
		groups,
		totalSpeciesCount,
	}
}

export async function getSpeciesGroups(): Promise<SpeciesGroup[]> {
	const overview = await getSpeciesOverview()
	return overview.groups
}
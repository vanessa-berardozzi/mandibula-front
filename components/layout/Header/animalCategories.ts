export interface AnimalCategory {
  label: string;
  slug: string;
}

export interface AnimalCategoryGroup {
  title: string;
  categories: AnimalCategory[];
}

// TODO(categories-dynamiques): ces groupes sont mockés en dur pour coller au rendu de la
// maquette (Mandibula-maquette/app/components/CatalogNavigation.tsx). À terme, remplacer par
// un fetch vers GET /api/products/categories/all (Mandibula-back, voir src/routes/products.ts)
// qui renvoie l'arborescence réelle `{ id, name, slug, children: [{ id, name, slug }] }`.
// Idéalement via un hook (ex: useAnimalCategories()) appelé côté serveur dans Header.tsx ou
// via SWR/React Query côté client, afin de garder Navbar/MobileMenu purement présentationnels.
export const ANIMAL_CATEGORY_GROUPS: AnimalCategoryGroup[] = [
  {
    title: '01 / Isopodes',
    categories: [
      { label: 'Ardentiella', slug: 'ardentiella' },
      { label: 'Cubaris', slug: 'cubaris' },
      { label: 'Laureola', slug: 'laureola' },
      { label: 'Porcellio', slug: 'porcellio' },
      { label: 'Troglodillo', slug: 'troglodillo' },
      { label: 'Autres isopodes', slug: 'autres-isopodes' },
    ],
  },
  {
    title: '02 / Autres espèces',
    categories: [
      { label: 'Myriapodes', slug: 'myriapodes' },
      { label: 'Coléoptères', slug: 'coleopteres' },
      { label: 'Blattes', slug: 'blattes' },
      { label: 'Collemboles', slug: 'collemboles' },
    ],
  },
];

export function animalCategoryHref(slug: string) {
  return `/categories/${slug}`;
}

export interface AnimalCategory {
  label: string;
  slug: string;
}

export interface AnimalCategoryGroup {
  title: string;
  categories: AnimalCategory[];
}

// TODO(categories-dynamiques): ces groupes sont mockés en dur pour coller au rendu de la

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

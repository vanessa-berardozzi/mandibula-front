// MOCK — Catégories mises en avant sur la page d'accueil.
// Données statiques pour le moment : à remplacer par un fetch des catégories réelles
// quand l'API exposera les métadonnées nécessaires (description, image...).
// Pour ajouter/modifier une catégorie affichée en accueil, éditer uniquement ce tableau.
export interface HomeCategory {
  name: string;
  description: string;
  href: string;
  code: string;
}

export const defaultHomeCategories: HomeCategory[] = [
  {
    name: "Isopodes",
    description: "Cloportes d'élevage, variétés et morphs sélectionnés.",
    href: "/categories?categorie=isopodes",
    code: "C-01",
  },
  {
    name: "Myriapodes",
    description: "Mille-pattes et diplopodes pour terrariums tropicaux.",
    href: "/categories?categorie=myriapodes",
    code: "C-02",
  },
  {
    name: "Substrats",
    description: "Mélanges techniques adaptés à chaque espèce.",
    href: "/categories?categorie=substrats",
    code: "C-03",
  },
  {
    name: "Nutrition",
    description: "Compléments et proies vivantes pour un élevage sain.",
    href: "/categories?categorie=nutrition",
    code: "C-04",
  },
];

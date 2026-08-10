export interface NavLink {
  label: string;
  href: string;
}

// Liens de navigation principaux, calqués sur la maquette (CatalogNavigation.tsx) :
// Accueil + catégories. Source unique utilisée par la navbar desktop et le menu mobile.
// "Animaux" est rendu via AnimalsDropdown/MobileAnimalsTree (le href sert de repère uniquement).
// Slugs "accessoires"/"nourriture"/"packs-kits" vérifiés dans Mandibula-back/prisma/seed/seed.ts.
// TODO(categories-back): "bijoux" et "substrats" n'existent pas encore comme catégories en base,
// ces liens pointent vers /categories en attendant leur création côté back.
export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Animaux", href: "/categories/animaux-vivants" },
  { label: "Accessoires", href: "/categories/accessoires" },
  { label: "Bijoux", href: "/categories/bijoux" },
  { label: "Nourriture", href: "/categories/nourriture" },
  { label: "Packs d’élevage", href: "/categories/packs-kits" },
  { label: "Substrats", href: "/categories/substrats" },
];

// Liens secondaires (pages éditoriales) — affichés en mobile uniquement, comme dans la maquette
// (mobile-nav-secondary de CatalogNavigation.tsx), plus tard aussi dans un footer si besoin.
export const SECONDARY_LINKS: NavLink[] = [
  { label: "Guides & tutoriels", href: "/guides" },
  { label: "Notre démarche", href: "/notre-demarche" },
];

'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { ANIMAL_CATEGORY_GROUPS, animalCategoryHref } from './animalCategories'

/**
 * Menu "Animaux" avec panneau flottant listant les catégories, calqué visuellement
 * sur la maquette (Mandibula-maquette/app/components/CatalogNavigation.tsx).
 * Catégories mockées : voir TODO dans ./animalCategories.ts.
 */
export function AnimalsDropdown({ active = false }: { active?: boolean }) {
  return (
    <div className="group relative">
      <button type="button" aria-haspopup="true" className={`nav-link flex items-center gap-1.5${active ? ' active' : ''}`}>
        <span>Animaux</span>
        <ChevronDown className="w-3 h-3 text-primary transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>

      {/* Panneau flottant — masqué par défaut, révélé au survol/focus du groupe (cf. .nav-dropdown-panel) */}
      <div className="nav-dropdown-panel">
        <div className="scan-lines pointer-events-none absolute inset-0 opacity-40" />

        <header className="relative mb-4 flex items-end justify-between border-b border-primary/20 pb-3">
          <div>
            <span className="block font-mono text-[7px] tracking-[.14em] text-muted-foreground">
              BIOSPECIES / INDEX
            </span>
            <strong className="font-mono text-lg font-black tracking-tight text-foreground uppercase">
              Arborescence animale
            </strong>
          </div>
          <small className="font-mono text-[7px] tracking-[.14em] text-primary">
            10 catégories actives
          </small>
        </header>

        <div className="relative grid grid-cols-[1.2fr_.8fr] gap-5">
          {ANIMAL_CATEGORY_GROUPS.map((group) => (
            <section key={group.title}>
              <span className="mb-2.5 block font-mono text-[7px] font-extrabold tracking-[.12em] text-primary uppercase">
                {group.title}
              </span>
              <div className="grid gap-px">
                {group.categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={animalCategoryHref(category.slug)}
                    className="flex min-h-8 items-center border-l border-primary/15 px-2 font-mono text-[8px] font-bold tracking-wide text-muted-foreground uppercase transition-colors hover:border-l-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <span className="mr-2 text-primary/40">├</span>
                    {category.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Link
          href="/categories/animaux-vivants"
          className="relative mt-4 flex min-h-9 items-center justify-between border border-primary/30 px-3 font-mono text-[8px] font-bold tracking-wide text-primary uppercase transition-colors hover:bg-primary/10"
        >
          Voir tous les animaux <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}

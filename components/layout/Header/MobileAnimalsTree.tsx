'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { ANIMAL_CATEGORY_GROUPS, animalCategoryHref } from './animalCategories'

interface MobileAnimalsTreeProps {
  onNavigate: () => void
}

/**
 * Version mobile du menu "Animaux" (accordéon), calquée sur la maquette
 * (Mandibula-maquette/app/components/CatalogNavigation.tsx — MobileCatalogNavigation).
 * Catégories mockées : voir TODO dans ./animalCategories.ts.
 */
export function MobileAnimalsTree({ onNavigate }: MobileAnimalsTreeProps) {
  return (
    <details className="group rounded-lg border border-primary/20 bg-black/30 open:bg-black/40">
      <summary className="flex min-h-12 list-none cursor-pointer items-center justify-between gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="text-foreground font-medium text-sm tracking-wide transition-colors group-open:text-primary">
          Animaux
        </span>
        <ChevronDown className="w-4 h-4 text-primary transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="space-y-4 border-t border-primary/10 px-4 py-3">
        {ANIMAL_CATEGORY_GROUPS.map((group) => (
          <div key={group.title}>
            <span className="mb-1.5 block font-mono text-[9px] tracking-widest text-primary/80 uppercase">
              {group.title}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {group.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={animalCategoryHref(category.slug)}
                  onClick={onNavigate}
                  className="rounded border border-primary/15 px-2 py-2 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <Link
          href="/categories/animaux-vivants"
          onClick={onNavigate}
          className="flex items-center justify-between rounded border border-primary/30 px-3 py-2 text-xs font-medium text-primary"
        >
          Voir tous les animaux <span aria-hidden="true">→</span>
        </Link>
      </div>
    </details>
  )
}

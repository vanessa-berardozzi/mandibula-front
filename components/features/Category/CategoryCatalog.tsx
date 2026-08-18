'use client';

import { SimpleProductCard } from '@/components/features/SimpleProductCard';
import { ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface Variant {
  id: string;
  name: string;
  lotSize: number;
  price: string;
  stock: number;
  reservedStock: number;
  isActive: boolean;
}

export interface CatalogProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  variants: Variant[];
}

type SortKey = 'featured' | 'name' | 'price-up' | 'price-down';

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Sélection Mandibula' },
  { value: 'name', label: 'Nom A–Z' },
  { value: 'price-up', label: 'Prix croissant' },
  { value: 'price-down', label: 'Prix décroissant' },
];

function productPrice(product: CatalogProduct) {
  const variant = product.variants[0];
  return parseFloat(variant ? variant.price : product.price) || 0;
}

export function CategoryCatalog({
  products,
  categoryName,
}: {
  products: CatalogProduct[];
  categoryName: string;
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fr');
    const result = products.filter((product) =>
      product.name.toLocaleLowerCase('fr').includes(normalized)
    );

    if (sort === 'name') return [...result].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    if (sort === 'price-up') return [...result].sort((a, b) => productPrice(a) - productPrice(b));
    if (sort === 'price-down') return [...result].sort((a, b) => productPrice(b) - productPrice(a));
    return result;
  }, [products, query, sort]);

  return (
    <div>
      {/* ── Outils : recherche + tri ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une espèce ou un produit…"
            aria-label={`Rechercher dans la catégorie ${categoryName}`}
            className="w-full pl-11 pr-4 py-3 bg-card/15 backdrop-blur-md border border-primary/40 text-sm text-foreground placeholder:text-primary/60 focus:border-primary/30 focus:outline-none transition-colors"
          />
        </div>
        <div className="relative w-full sm:w-56">
          <button
            type="button"
            onClick={() => setIsSortOpen((isOpen) => !isOpen)}
            aria-expanded={isSortOpen}
            aria-haspopup="listbox"
            className="flex w-full items-center justify-between px-4 py-3 bg-card/15 backdrop-blur-md border border-primary/40 text-sm font-mono text-foreground hover:border-primary/70 focus:border-primary/70 focus:outline-none transition-colors"
          >
            {sortOptions.find((option) => option.value === sort)?.label}
            <ChevronDown className={`h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSortOpen && (
            <div
              role="listbox"
              aria-label="Trier les produits"
              className="absolute z-20 mt-1 w-full overflow-hidden border border-primary/40 bg-card shadow-xl"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={sort === option.value}
                  onClick={() => {
                    setSort(option.value);
                    setIsSortOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-mono text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] font-mono text-primary/40 uppercase tracking-widest mb-6">
        {filtered.length} référence{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* ── Grille produits ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="font-mono text-primary/30 text-xs uppercase tracking-widest">
            [ AUCUN SPÉCIMEN TROUVÉ ]
          </p>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="font-mono text-xs text-primary/50 hover:text-primary underline underline-offset-4 transition-colors"
            >
              Réinitialiser la recherche
            </button>
          ) : (
            <Link
              href="/"
              className="font-mono text-xs text-primary/50 hover:text-primary underline underline-offset-4 transition-colors"
            >
              ← Retour à l&rsquo;accueil
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((product, index) => {
            const defaultVariant = product.variants[0];
            return (
              <div
                key={product.id}
                style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.04}s backwards` }}
              >
                <SimpleProductCard
                  title={product.name}
                  price={defaultVariant ? parseFloat(defaultVariant.price) : parseFloat(product.price)}
                  stock={defaultVariant ? defaultVariant.stock - (defaultVariant.reservedStock ?? 0) : 0}
                  imageUrl={product.images[0]}
                  href={`/product/${product.id}`}
                  variantId={defaultVariant?.id}
                  productId={product.id}
                  priority={index === 0}
                  categoryName={categoryName}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

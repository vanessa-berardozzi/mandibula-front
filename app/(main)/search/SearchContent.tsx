'use client';

import { SimpleProductCard } from "@/components/features/SimpleProductCard";
import { toPrice } from "@/lib/priceUtils";
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Variant {
  id: string;
  name: string;
  lotSize: number;
  price: string;
  availableStock: number;
  isActive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  variants: Variant[];
  availableStock: number;
  category?: { id: string; name: string; slug: string; parentId: string | null };
}

interface ProductsResponse {
  data: ApiProduct[];
  total: number;
  page: number;
  pages: number;
}

export function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [searchInput, setSearchInput] = useState(query);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchInput);
    }
  };

  const handleSearchSubmit = () => {
    handleSearch(searchInput);
  };

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setTotalResults(0);
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=12`,
          { signal: abortController.signal }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as ProductsResponse;

        if (isMounted) {
          setProducts(data.data);
          setTotalResults(data.total);
          setError(null);
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    fetchProducts();

    setSearchInput(query);

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [query]);

  return (
    <main className="min-h-screen pb-12 pt-24">
      {/* Bannière de recherche */}
      <div className="px-4 md:px-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-primary/30 hover:bg-primary/10 transition-all"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-wider">
            Résultats de recherche
          </h1>
        </div>

        {/* Barre de recherche affichant la requête actuelle */}
        <div className="relative max-w-2xl flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-primary/30 rounded-lg text-foreground placeholder:text-primary/40 focus:border-primary/60 focus:ring-primary/20 focus:ring-1 transition-all"
              placeholder="Rechercher..."
              aria-label="Barre de recherche modifiable"
            />
          </div>
          <button
            onClick={handleSearchSubmit}
            disabled={!searchInput.trim()}
            aria-label="Valider la nouvelle recherche"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-primary/30 hover:bg-primary/10 hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Search className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Nombre de résultats */}
      {query && (
        <div className="px-4 md:px-8 mb-6">
          <p className="text-primary/70 text-sm">
            {isLoading ? (
              'Recherche en cours...'
            ) : totalResults === 0 ? (
              `Aucun résultat pour &quot;${query}&quot;`
            ) : (
              `${totalResults} résultat${totalResults > 1 ? 's' : ''} pour &quot;${query}&quot;`
            )}
          </p>
        </div>
      )}

      {/* État de chargement */}
      {isLoading && (
        <div className="px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-black/40 rounded-lg border border-primary/20 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="px-4 md:px-8">
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <p className="text-red-400 text-sm">
              Erreur lors de la recherche: {error}
            </p>
          </div>
        </div>
      )}

      {/* Résultats vides */}
      {!isLoading && !error && products.length === 0 && query && (
        <div className="px-4 md:px-8">
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-primary/70 mb-4">
              Aucun produit ne correspond à &quot;{query}&quot;
            </p>
            <Link
              href="/categories"
              className="inline-block px-6 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg text-primary transition-all"
            >
              Voir toutes les catégories
            </Link>
          </div>
        </div>
      )}

      {/* Grille de produits */}
      {!isLoading && !error && products.length > 0 && (
        <div className="px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <SimpleProductCard
                key={product.id}
                productId={product.id}
                title={product.name}
                imageUrl={product.images[0] || '/placeholder.jpg'}
                price={toPrice(product.price)}
                stock={product.availableStock ?? 0}
                variantId={product.variants[0]?.id}
                categoryName={product.category?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message si aucune requête */}
      {!query && !isLoading && (
        <div className="px-4 md:px-8">
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-primary/70 mb-4">
              Entrez un terme de recherche pour trouver des produits
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg text-primary transition-all"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

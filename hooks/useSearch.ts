import { useEffect, useState } from 'react';

export interface SearchProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  category?: { id: string; name: string; slug: string };
}

export interface SearchResult {
  products: SearchProduct[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook pour effectuer une recherche de produits
 * @param query - Terme de recherche
 * @param limit - Nombre de résultats à retourner
 * @returns Résultats de recherche, état de chargement et erreurs
 */
export function useSearch(query: string, limit: number = 12): SearchResult {
  const normalizedQuery = query.trim();
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!normalizedQuery) {
      setProducts([]);
      setTotal(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const performSearch = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`/api/products?search=${encodeURIComponent(normalizedQuery)}&limit=${limit}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setProducts(data.data || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    performSearch();

    return () => {
      cancelled = true;
    };
  }, [normalizedQuery, limit]);

  if (!normalizedQuery) {
    return { products: [], total: 0, isLoading: false, error: null };
  }

  return { products, total, isLoading, error };
}

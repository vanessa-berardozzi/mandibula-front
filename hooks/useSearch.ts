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
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setTotal(0);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/products?search=${encodeURIComponent(query)}&limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data.data || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        setError(err.message || 'Erreur lors de la recherche');
        setProducts([]);
      })
      .finally(() => setIsLoading(false));
  }, [query, limit]);

  return { products, total, isLoading, error };
}

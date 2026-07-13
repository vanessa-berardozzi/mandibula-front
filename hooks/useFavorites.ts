'use client';

import { useSession } from '@/lib/auth.client';
import { useCallback, useEffect, useState } from 'react';

export interface WishlistProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  category: { name: string; slug: string };
  variants: { id: string; stock: number; reservedStock: number }[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: WishlistProduct;
}

/**
 * Hook pour gérer les favoris de l'utilisateur connecté.
 * Synchronise avec l'API /api/wishlist.
 */
export function useFavorites() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!session?.user;

  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/wishlist`, { credentials: 'include' });
      if (res.ok) setItems(await res.json());
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isFavorite = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const toggle = useCallback(
    async (productId: string) => {
      if (!isLoggedIn) return;

      const alreadyFav = isFavorite(productId);

      // Optimistic update
      if (alreadyFav) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      }

      const method = alreadyFav ? 'DELETE' : 'POST';
      const res = await fetch(`/api/wishlist/${productId}`, {
        method,
        credentials: 'include',
      });

      if (res.ok && !alreadyFav) {
        // Récupère la liste complète pour obtenir les données produit
        fetchWishlist();
      } else if (!res.ok) {
        // Rollback en cas d'erreur
        fetchWishlist();
      }
    },
    [isLoggedIn, isFavorite, fetchWishlist]
  );

  return { items, isLoading, isFavorite, toggle, isLoggedIn };
}

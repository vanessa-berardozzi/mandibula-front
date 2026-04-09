'use client';

import { useSession } from '@/lib/auth.client';
import type { CartResponse, CartValidationResponse } from '@/types/cart';
import { useCallback, useEffect, useState } from 'react';

export interface LocalCartItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface CartState {
  items: LocalCartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isSyncing: boolean;
}

/**
 * Hook principal pour gérer le panier
 * Logique hybride : localStorage pour UX rapide + API sync en background
 */
export function useCart() {
  const [state, setState] = useState<CartState>({
    items: [],
    subtotal: 0,
    itemCount: 0,
    isLoading: false,
    isSyncing: false,
  });

  const { data: session } = useSession();

  const STORAGE_KEY = 'mandibula_cart';
  const API_BASE = '/api/cart';

  /**
   * Calcule subtotal et item count
   */
  const calculateTotals = useCallback((items: LocalCartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemCount };
  }, []);

  /**
   * Charge le panier depuis localStorage au démarrage
   */
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as LocalCartItem[];
        const totals = calculateTotals(items);
        setState((prev) => ({
          ...prev,
          items,
          ...totals,
        }));
        return items;
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  }, [calculateTotals]);

  /**
   * Sauvegarde le panier dans localStorage
   */
  const saveToLocalStorage = useCallback((items: LocalCartItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, []);

  /**
   * Récupère le panier depuis le serveur (restauration après login)
   */
  const fetchCartFromServer = useCallback(async () => {
    if (!session?.user) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const cart = (await response.json()) as CartResponse;
      const items = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const totals = calculateTotals(items);
      setState((prev) => ({
        ...prev,
        items,
        ...totals,
        isLoading: false,
      }));
      saveToLocalStorage(items);
    } catch (error) {
      console.error('Error fetching cart from server:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [session?.user, calculateTotals, saveToLocalStorage]);

  /**
   * Ajoute un produit au panier (local + sync serveur)
   * UX rapide: localStorage immédiate, API en background
   */
  const addItem = useCallback(
    async (productId: string, quantity: number = 1, price?: number) => {
      setState((prev) => {
        const existing = prev.items.find((i) => i.productId === productId);
        const newItems = existing
          ? prev.items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
            )
          : [...prev.items, { productId, quantity, price }];

        const totals = calculateTotals(newItems);
        saveToLocalStorage(newItems);

        return {
          ...prev,
          items: newItems,
          ...totals,
        };
      });

      // Sync serveur en background (non-bloquant)
      if (session?.user) {
        setState((prev) => ({ ...prev, isSyncing: true }));
        try {
          const response = await fetch(`${API_BASE}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
            credentials: 'include',
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
          console.error('Error syncing add to server:', error);
        } finally {
          setState((prev) => ({ ...prev, isSyncing: false }));
        }
      }
    },
    [session?.user, calculateTotals, saveToLocalStorage]
  );

  /**
   * Supprime un produit du panier
   */
  const removeItem = useCallback(
    async (productId: string) => {
      setState((prev) => {
        const newItems = prev.items.filter((i) => i.productId !== productId);
        const totals = calculateTotals(newItems);
        saveToLocalStorage(newItems);

        return {
          ...prev,
          items: newItems,
          ...totals,
        };
      });

      // Sync serveur
      if (session?.user) {
        setState((prev) => ({ ...prev, isSyncing: true }));
        try {
          const response = await fetch(`${API_BASE}/items/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
          console.error('Error syncing delete to server:', error);
        } finally {
          setState((prev) => ({ ...prev, isSyncing: false }));
        }
      }
    },
    [session?.user, calculateTotals, saveToLocalStorage]
  );

  /**
   * Met à jour la quantité d'un produit
   * Défini après removeItem pour éviter la dépendance circulaire
   */
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity === 0) {
        // Inline la logique de suppression pour éviter la référence circulaire
        setState((prev) => {
          const newItems = prev.items.filter((i) => i.productId !== productId);
          const totals = calculateTotals(newItems);
          saveToLocalStorage(newItems);
          return { ...prev, items: newItems, ...totals };
        });

        if (session?.user) {
          setState((prev) => ({ ...prev, isSyncing: true }));
          try {
            const response = await fetch(`${API_BASE}/items/${productId}`, {
              method: 'DELETE',
              credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
          } catch (error) {
            console.error('Error syncing delete to server:', error);
          } finally {
            setState((prev) => ({ ...prev, isSyncing: false }));
          }
        }
        return;
      }

      setState((prev) => {
        const newItems = prev.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        const totals = calculateTotals(newItems);
        saveToLocalStorage(newItems);
        return { ...prev, items: newItems, ...totals };
      });

      // Sync serveur
      if (session?.user) {
        setState((prev) => ({ ...prev, isSyncing: true }));
        try {
          const response = await fetch(`${API_BASE}/items/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
            credentials: 'include',
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
          console.error('Error syncing update to server:', error);
        } finally {
          setState((prev) => ({ ...prev, isSyncing: false }));
        }
      }
    },
    [session?.user, calculateTotals, saveToLocalStorage]
  );

  /**
   * Vide le panier complètement
   */
  const clearCart = useCallback(async () => {
    setState((prev) => {
      const newItems: LocalCartItem[] = [];
      saveToLocalStorage(newItems);
      return {
        ...prev,
        items: newItems,
        subtotal: 0,
        itemCount: 0,
      };
    });

    // Sync serveur
    if (session?.user) {
      try {
        const response = await fetch(API_BASE, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.error('Error syncing clear to server:', error);
      }
    }
  }, [session?.user, saveToLocalStorage]);

  /**
   * CRITIQUE: Valide le panier avant checkout
   * Invoke le serveur qui recalcule TOUS les prix, taxes, stocks
   */
  const validateCart = useCallback(async (): Promise<CartValidationResponse | null> => {
    if (!session?.user) {
      throw new Error('Utilisateur non authentifié');
    }

    try {
      const response = await fetch(`${API_BASE}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      const { validation } = await response.json();
      return validation;
    } catch (error) {
      console.error('Error validating cart:', error);
      throw error;
    }
  }, [session?.user]);

  /**
   * Initialise le panier au démarrage
   */
  useEffect(() => {
    // Charger depuis localStorage
    loadFromLocalStorage();

    // Si connecté, récupérer depuis serveur (pour restauration cross-devices)
    if (session?.user) {
      fetchCartFromServer();
    }
  }, [session?.user, loadFromLocalStorage, fetchCartFromServer]);

  return {
    // State
    items: state.items,
    subtotal: state.subtotal,
    itemCount: state.itemCount,
    isLoading: state.isLoading,
    isSyncing: state.isSyncing,

    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    validateCart,
    refetch: fetchCartFromServer,
  };
}

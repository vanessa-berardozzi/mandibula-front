'use client';

import { useSession } from '@/lib/auth.client';
import type { CartResponse, CartValidationResponse, PromoValidationResponse } from '@/types/cart';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface LocalCartItem {
  variantId: string;
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

const STORAGE_KEY = 'mandibula_cart';
const GUEST_TOKEN_KEY = 'mandibula_guest_token';
const API_BASE = '/api/cart';

/**
 * Génère ou récupère le token anonyme (UUID v4 simplifié)
 * Stocké en localStorage pour identifier le panier guest en DB
 */
function getOrCreateGuestToken(): string {
  try {
    const existing = localStorage.getItem(GUEST_TOKEN_KEY);
    if (existing) return existing;
    const token = crypto.randomUUID();
    localStorage.setItem(GUEST_TOKEN_KEY, token);
    return token;
  } catch {
    return '';
  }
}

/**
 * Hook principal pour gérer le panier
 * Logique hybride : localStorage pour UX rapide + API sync en background
 * Les utilisateurs non connectés ont un panier en DB identifié par guestToken
 */
export function useCart() {
  const [state, setState] = useState<CartState>({
    items: [],
    subtotal: 0,
    itemCount: 0,
    isLoading: false,
    isSyncing: false,
  });

  const [promoResult, setPromoResult] = useState<PromoValidationResponse | null>(null);

  const { data: session } = useSession();
  const guestTokenRef = useRef<string>('');

  // Initialise le guestToken côté client seulement
  useEffect(() => {
    guestTokenRef.current = getOrCreateGuestToken();
  }, []);

  /**
   * Retourne les headers appropriés selon l'état de connexion
   */
  const getHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (!session?.user && guestTokenRef.current) {
      headers['X-Guest-Token'] = guestTokenRef.current;
    }
    return headers;
  }, [session?.user]);

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
        const parsed = JSON.parse(stored) as LocalCartItem[];
        const items = parsed.filter((item) => !!item.variantId);
        const totals = calculateTotals(items);
        setState((prev) => ({ ...prev, items, ...totals }));
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
   * Récupère le panier depuis le serveur
   */
  const fetchCartFromServer = useCallback(async () => {
    const isGuest = !session?.user;
    const guestToken = guestTokenRef.current;

    if (isGuest && !guestToken) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isGuest && guestToken) headers['X-Guest-Token'] = guestToken;

      const response = await fetch(API_BASE, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const cart = (await response.json()) as CartResponse;
      const items = cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      }));

      const totals = calculateTotals(items);
      setState((prev) => ({ ...prev, items, ...totals, isLoading: false }));
      saveToLocalStorage(items);
    } catch (error) {
      console.error('Error fetching cart from server:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [session?.user, calculateTotals, saveToLocalStorage]);

  /**
   * Fusionne le panier guest dans le panier utilisateur après connexion
   */
  const mergeGuestCartOnLogin = useCallback(async (guestToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestToken }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const { cart } = await response.json() as { cart: CartResponse };
      const items = cart.items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      }));
      const totals = calculateTotals(items);
      setState((prev) => ({ ...prev, items, ...totals }));
      saveToLocalStorage(items);

      // Supprimer le guestToken après fusion réussie
      localStorage.removeItem(GUEST_TOKEN_KEY);
      guestTokenRef.current = '';
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  }, [calculateTotals, saveToLocalStorage]);

  /**
   * Ajoute un produit au panier (local immédiat + sync serveur en background)
   */
  const addItem = useCallback(
    async (variantId: string, quantity: number = 1, price?: number): Promise<{ error?: string }> => {
      let previousItems: LocalCartItem[] = [];

      // Optimistic update
      setState((prev) => {
        previousItems = prev.items;
        const existing = prev.items.find((i) => i.variantId === variantId);
        const newItems = existing
          ? prev.items.map((i) =>
              i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i
            )
          : [...prev.items, { variantId, quantity, price }];
        const totals = calculateTotals(newItems);
        saveToLocalStorage(newItems);
        return { ...prev, items: newItems, ...totals };
      });

      setState((prev) => ({ ...prev, isSyncing: true }));
      try {
        const response = await fetch(`${API_BASE}/items`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ variantId, quantity }),
          credentials: 'include',
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          const errorMsg = data.error || `Erreur ${response.status}`;
          // Annuler l'optimistic update
          setState((prev) => {
            const totals = calculateTotals(previousItems);
            saveToLocalStorage(previousItems);
            return { ...prev, items: previousItems, ...totals };
          });
          return { error: errorMsg };
        }
        return {};
      } catch (error) {
        console.error('Error syncing add to server:', error);
        return { error: 'Erreur réseau' };
      } finally {
        setState((prev) => ({ ...prev, isSyncing: false }));
      }
    },
    [calculateTotals, saveToLocalStorage, getHeaders]
  );

  /**
   * Supprime un produit du panier
   */
  const removeItem = useCallback(
    async (variantId: string) => {
      setState((prev) => {
        const newItems = prev.items.filter((i) => i.variantId !== variantId);
        const totals = calculateTotals(newItems);
        saveToLocalStorage(newItems);
        return { ...prev, items: newItems, ...totals };
      });

      setState((prev) => ({ ...prev, isSyncing: true }));
      try {
        const response = await fetch(`${API_BASE}/items/${variantId}`, {
          method: 'DELETE',
          headers: getHeaders(),
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.error('Error syncing delete to server:', error);
      } finally {
        setState((prev) => ({ ...prev, isSyncing: false }));
      }
    },
    [calculateTotals, saveToLocalStorage, getHeaders]
  );

  /**
   * Met à jour la quantité d'un produit
   */
  const updateQuantity = useCallback(
    async (variantId: string, quantity: number): Promise<{ error?: string }> => {
      if (quantity === 0) {
        await removeItem(variantId);
        return {};
      }

      let previousItems: LocalCartItem[] = [];

      setState((prev) => {
        previousItems = prev.items;
        const newItems = prev.items.map((i) =>
          i.variantId === variantId ? { ...i, quantity } : i
        );
        const totals = calculateTotals(newItems);
        saveToLocalStorage(newItems);
        return { ...prev, items: newItems, ...totals };
      });

      setState((prev) => ({ ...prev, isSyncing: true }));
      try {
        const response = await fetch(`${API_BASE}/items/${variantId}`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ quantity }),
          credentials: 'include',
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          const errorMsg = data.error || `Erreur ${response.status}`;
          // Annuler l'optimistic update
          setState((prev) => {
            const totals = calculateTotals(previousItems);
            saveToLocalStorage(previousItems);
            return { ...prev, items: previousItems, ...totals };
          });
          return { error: errorMsg };
        }
        return {};
      } catch (error) {
        console.error('Error syncing update to server:', error);
        return { error: 'Erreur réseau' };
      } finally {
        setState((prev) => ({ ...prev, isSyncing: false }));
      }
    },
    [calculateTotals, saveToLocalStorage, getHeaders, removeItem]
  );

  /**
   * Vide le panier complètement
   */
  const clearCart = useCallback(async () => {
    setState((prev) => {
      saveToLocalStorage([]);
      return { ...prev, items: [], subtotal: 0, itemCount: 0 };
    });

    try {
      const response = await fetch(API_BASE, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error('Error syncing clear to server:', error);
    }
  }, [saveToLocalStorage, getHeaders]);

  /**
   * CRITIQUE: Valide le panier avant checkout (requiert auth)
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
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  /**
   * Détecte connexion/déconnexion pour merger ou vider le panier
   */
  const prevUserIdRef = React.useRef<string | undefined>(undefined);
  useEffect(() => {
    const currentUserId = session?.user?.id;

    if (!prevUserIdRef.current && currentUserId) {
      // L'utilisateur vient de se connecter — merger le panier guest si existant
      const guestToken = guestTokenRef.current || localStorage.getItem(GUEST_TOKEN_KEY) || '';
      if (guestToken) {
        mergeGuestCartOnLogin(guestToken);
      } else {
        fetchCartFromServer();
      }
    } else if (prevUserIdRef.current && !currentUserId) {
      // L'utilisateur vient de se déconnecter — réinitialiser
      localStorage.removeItem(STORAGE_KEY);
      // Générer un nouveau guestToken pour la prochaine session anonyme
      const newToken = crypto.randomUUID();
      localStorage.setItem(GUEST_TOKEN_KEY, newToken);
      guestTokenRef.current = newToken;
      setState((prev) => ({ ...prev, items: [], subtotal: 0, itemCount: 0 }));
    }

    prevUserIdRef.current = currentUserId;
  }, [session?.user?.id, fetchCartFromServer, mergeGuestCartOnLogin]);

  return {
    items: state.items,
    subtotal: state.subtotal,
    itemCount: state.itemCount,
    isLoading: state.isLoading,
    isSyncing: state.isSyncing,
    promoResult,
    discount: (() => {
      if (!promoResult?.valid) return 0;
      if (promoResult.discountType === 'percent') {
        return Math.round(state.subtotal * (promoResult.discountValue ?? 0) / 100 * 100) / 100;
      }
      if (promoResult.discountType === 'fixed') {
        return Math.min(promoResult.discountValue ?? 0, state.subtotal);
      }
      return promoResult.discountAmount ?? 0;
    })(),
    applyPromo: async (code: string) => {
      const res = await fetch('/api/cart/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, subtotal: state.subtotal }),
      });
      const result: PromoValidationResponse = await res.json();
      setPromoResult(result);
      return result;
    },
    removePromo: () => setPromoResult(null),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    validateCart,
    refetch: fetchCartFromServer,
  };
}

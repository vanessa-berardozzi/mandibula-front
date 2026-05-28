'use client';

import type { LocalCartItem } from '@/hooks/useCart';
import { useCart } from '@/hooks/useCart';
import type { CartValidationResponse, PromoValidationResponse } from '@/types/cart';
import { createContext, ReactNode, useContext } from 'react';

interface CartContextType {
  items: LocalCartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isSyncing: boolean;
  promoResult: PromoValidationResponse | null;
  discount: number;
  applyPromo: (code: string) => Promise<PromoValidationResponse>;
  removePromo: () => void;
  addItem: (variantId: string, quantity?: number, price?: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  validateCart: () => Promise<CartValidationResponse | null>;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

/**
 * Hook pour accéder au contexte panier partout dans l'app
 * Usage: const { items, addItem } = useCartContext()
 */
export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}

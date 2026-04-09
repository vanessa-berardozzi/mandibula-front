'use client';

import type { LocalCartItem } from '@/hooks/useCart';
import { useCart } from '@/hooks/useCart';
import type { CartValidationResponse } from '@/types/cart';
import { createContext, ReactNode, useContext } from 'react';

interface CartContextType {
  items: LocalCartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (productId: string, quantity?: number, price?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
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

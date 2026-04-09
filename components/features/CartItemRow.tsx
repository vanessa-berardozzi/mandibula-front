'use client';

import { useCartContext } from '@/context/CartContext';
import type { LocalCartItem } from '@/hooks/useCart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import NextImage from 'next/image';
import { useState } from 'react';

interface CartItemRowProps {
  item: LocalCartItem;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

/**
 * Ligne d'article du panier avec quantité ±, prix et supprimer
 * Design: Neon glow, gaming HUD style
 */
export function CartItemRow({ item, product }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!product) return null;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1 || newQty > 100) return;
    setIsUpdating(true);
    try {
      await updateQuantity(item.productId, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await removeItem(item.productId);
    } finally {
      setIsDeleting(false);
    }
  };

  const unitPrice = item.price ?? 0;

  return (
    <div
      className={`
        group relative mb-3 flex items-center gap-4 overflow-hidden rounded-lg 
        border border-primary/40 bg-linear-to-r from-black/60 via-black/40 to-black/60
        p-4 backdrop-blur-sm
        transition-all duration-300
        hover:border-primary/80 hover:shadow-[0_0_20px_rgba(216,249,153,0.2)] 
        hover:scale-[1.02]
        ${isDeleting ? 'animate-pulse' : ''}
      `}
    >
      {/* Corner brackets (HUD style) */}
      <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-primary/60" />
      <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-primary/60" />

      {/* Product Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-primary/30">
        {product.image ? (
          <NextImage
            src={product.image}
            alt={product.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/20 to-primary/5" />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-black uppercase tracking-wider text-foreground text-sm">
          {product.name}
        </h3>
        <p className="font-mono text-xs text-primary/80">ID: {item.productId.slice(0, 8)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 rounded border border-primary/30 bg-black/40 px-2 py-1">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="hover:text-primary disabled:opacity-40 transition-colors"
          title="Diminuer"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-mono font-bold text-primary">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= 100}
          className="hover:text-primary disabled:opacity-40 transition-colors"
          title="Augmenter"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end gap-1 min-w-20">
        <p className="font-mono text-sm text-primary font-bold">
          {(unitPrice * item.quantity).toFixed(2)}€
        </p>
        <p className="font-mono text-xs text-primary/50">{unitPrice.toFixed(2)}€ c/u</p>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleRemove}
        disabled={isDeleting}
        className={`
          ml-2 rounded p-2 transition-all
          hover:bg-destructive/20 hover:text-destructive
          disabled:opacity-50
          ${isDeleting ? 'animate-pulse' : ''}
        `}
        title="Supprimer"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

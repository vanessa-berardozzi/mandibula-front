'use client';

import { useCartContext } from '@/context/CartContext';
import type { LocalCartItem } from '@/hooks/useCart';
import { Minus, Plus, X } from 'lucide-react';
import NextImage from 'next/image';
import { useState } from 'react';

interface CartItemRowProps {
  item: LocalCartItem;
  product?: {
    id: string;
    name: string;
    variantName?: string;
    price: number;
    image?: string;
    availableStock?: number;
  };
  slotIndex?: number;
}

export function CartItemRow({ item, product, slotIndex = 1 }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!product) return null;

  const maxQty = product.availableStock ?? 100;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1 || newQty > maxQty) return;
    setIsUpdating(true);
    try {
      await updateQuantity(item.variantId, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      await removeItem(item.variantId);
    } finally {
      setIsDeleting(false);
    }
  };

  const unitPrice = item.price ?? 0;
  const totalPrice = unitPrice * item.quantity;
  const slotLabel = String(slotIndex).padStart(2, '0');

  return (
    <div
      className={`
        group relative flex items-center gap-3 overflow-hidden
        border border-primary/50 bg-black/70 backdrop-blur-sm
        transition-all duration-200
        hover:border-primary hover:bg-black/80
        hover:shadow-[0_0_16px_rgba(57,255,20,0.2)]
        ${isDeleting ? 'opacity-40 scale-95 pointer-events-none' : ''}
      `}
      style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
    >
      {/* Scan line hover effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-[0.03] transition-opacity"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(216,249,153,1) 0px, rgba(216,249,153,1) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Slot number */}
      <div className="shrink-0 w-10 h-full flex items-center justify-center self-stretch bg-primary/10 border-r border-primary/40">
        <span className="font-mono text-sm font-bold text-primary/75" style={{ writingMode: 'vertical-rl', letterSpacing: '0.1em' }}>
          {slotLabel}
        </span>
      </div>

      {/* Image */}
      <div
        className="relative shrink-0 w-14 h-14 border border-primary/50 bg-primary/10 overflow-hidden my-3"
        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
      >
        {product.image ? (
          <NextImage src={product.image} alt={product.name} width={56} height={56} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 border border-primary/30" />
          </div>
        )}
        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary/60" />
      </div>

      {/* Info produit */}
      <div className="flex-1 min-w-0 py-3">
        <p className="font-black uppercase tracking-wider text-foreground text-base truncate leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </p>
        {product.variantName && (
          <p className="font-mono text-xs text-primary/80 mt-0.5 uppercase tracking-wide">
            {product.variantName}
          </p>
        )}
        <p className="font-mono text-sm text-primary/70 mt-0.5">
          {unitPrice.toFixed(2)}€ / unité
        </p>
      </div>

      {/* Contrôle quantité */}
      <div
        className="shrink-0 flex items-center border border-primary/60 bg-black/80"
        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
      >
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-all"
        >
          <Minus size={12} />
        </button>
        <span className={`w-10 text-center font-mono font-bold text-base text-primary ${isUpdating ? 'animate-pulse' : ''}`}>
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || item.quantity >= maxQty}
          className="w-8 h-8 flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-all"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Prix total */}
      <div className="shrink-0 w-24 text-right font-mono font-black text-primary text-base pr-2">
        {totalPrice.toFixed(2)}€
      </div>

      {/* Supprimer */}
      <button
        onClick={handleRemove}
        disabled={isDeleting}
        className="shrink-0 mr-3 w-7 h-7 flex items-center justify-center border border-destructive/55 text-destructive/75 hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-30"
        style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}
        title="Retirer du chargement"
      >
        <X size={12} />
      </button>
    </div>
  );
}

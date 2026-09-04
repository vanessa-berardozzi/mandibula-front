'use client';

import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface QuantitySelectorProps {
  maxStock: number;
  onQuantityChange: (quantity: number) => void;
  initialQuantity?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

/**
 * Sélecteur de quantité réutilisable
 * Permet à l'utilisateur de choisir la quantité avant d'ajouter au panier
 */
export function QuantitySelector({
  maxStock,
  onQuantityChange,
  initialQuantity = 1,
  disabled = false,
  size = 'md',
  compact = false,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(Math.max(1, Math.min(initialQuantity, maxStock)));

  // Le sélecteur peut être rendu dans un lien : on neutralise la navigation.
  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDecrement = (e: React.MouseEvent) => {
    stop(e);
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(newQty);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    stop(e);
    if (quantity < maxStock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onQuantityChange(newQty);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val)) {
      const clamped = Math.max(1, Math.min(val, maxStock));
      setQuantity(clamped);
      onQuantityChange(clamped);
    }
  };

  const sizeClasses = {
    sm: 'h-7 w-20',
    md: 'h-8 w-24',
    lg: 'h-10 w-28',
  };

  const buttonClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || quantity <= 1}
          className="p-1 text-primary/80 hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-all"
          title="Diminuer"
        >
          <Minus className={iconClasses[size]} />
        </button>
        <input
          type="number"
          min="1"
          max={maxStock}
          value={quantity}
          onChange={handleInputChange}
          onClick={stop}
          disabled={disabled}
          className="w-12 text-center font-mono font-bold text-sm text-primary bg-transparent border-none focus:outline-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || quantity >= maxStock}
          className="p-1 text-primary/80 hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-all"
          title="Augmenter"
        >
          <Plus className={iconClasses[size]} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between border border-primary/60 bg-black/80 ${sizeClasses[size]}`}
      style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className={`${buttonClasses[size]} flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-all`}
        title="Diminuer"
      >
        <Minus className={iconClasses[size]} />
      </button>
      <input
        type="number"
        min="1"
        max={maxStock}
        value={quantity}
        onChange={handleInputChange}
        onClick={stop}
        disabled={disabled}
        className="flex-1 text-center font-mono font-bold text-primary bg-transparent border-none focus:outline-none"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= maxStock}
        className={`${buttonClasses[size]} flex items-center justify-center text-primary/80 hover:text-primary hover:bg-primary/10 disabled:opacity-30 transition-all`}
        title="Augmenter"
      >
        <Plus className={iconClasses[size]} />
      </button>
    </div>
  );
}

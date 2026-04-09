'use client';

import type { CartValidationResponse } from '@/types/cart';

interface CartSummaryProps {
  subtotal: number;
  validation?: CartValidationResponse;
  isValidating?: boolean;
  onCheckout?: () => void;
  isCheckoutDisabled?: boolean;
}

/**
 * Récapitulatif du panier avec totaux
 * Design: HUD style avec corner brackets et gradient beam dividers
 */
export function CartSummary({
  subtotal,
  validation,
  isValidating,
  onCheckout,
  isCheckoutDisabled,
}: CartSummaryProps) {
  // Calcul simple si pas de validation serveur
  const TAX_RATE = 0.2;
  const SHIPPING_COST = 5.99;

  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax + SHIPPING_COST;

  // Override avec validation serveur si disponible
  const finalTax = validation?.tax ?? tax;
  const finalShipping = validation?.shippingCost ?? SHIPPING_COST;
  const finalTotal = validation?.total ?? total;

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border border-primary/50 
        bg-linear-to-b from-black/80 via-black/60 to-black/80 p-6
        backdrop-blur-md
        transition-all duration-300
        ${isValidating ? 'animate-pulse' : ''}
      `}
    >
      {/* Corner brackets (HUD style) */}
      <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-primary" />
      <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-0 left-0 h-4 w-4 border-l-2 border-b-2 border-primary" />
      <div className="absolute bottom-0 right-0 h-4 w-4 border-r-2 border-b-2 border-primary" />

      {/* Gradient beam divider top */}
      <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />

      <h2 className="mb-6 uppercase font-black tracking-widest text-lg text-primary glow-text">
        📊 Résumé Commande
      </h2>

      {/* Summary lines */}
      <div className="space-y-3 mb-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center font-mono text-sm">
          <span className="text-foreground/80">Sous-total:</span>
          <span className="text-primary font-bold">{subtotal.toFixed(2)}€</span>
        </div>

        {/* Gradient divider */}
        <div className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        {/* Tax */}
        <div className="flex justify-between items-center font-mono text-sm">
          <span className="text-foreground/80">TVA (20%):</span>
          <span className="text-primary/80">{finalTax.toFixed(2)}€</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center font-mono text-sm">
          <span className="text-foreground/80">Frais de port:</span>
          <span className="text-primary/80">{finalShipping.toFixed(2)}€</span>
        </div>

        {/* Gradient divider */}
        <div className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        {/* Total - BIG and NEON */}
        <div className="flex justify-between items-center pt-2">
          <span className="font-black uppercase tracking-wider text-foreground">Total:</span>
          <span className="text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(216,249,153,0.4)]">
            {finalTotal.toFixed(2)}€
          </span>
        </div>
      </div>

      {/* Validation errors */}
      {validation && !validation.valid && validation.errors && (
        <div className="mb-4 rounded border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-xs font-bold text-destructive uppercase mb-1">⚠️ Problèmes:</p>
          <ul className="text-xs text-destructive/80 space-y-1">
            {validation.errors.map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled || isValidating}
        className={`
          w-full mt-6 py-3 px-4 font-black uppercase tracking-wider rounded
          transition-all duration-300
          ${
            isCheckoutDisabled || isValidating
              ? 'bg-primary/20 text-primary/50 cursor-not-allowed'
              : `
                bg-linear-to-r from-primary via-primary to-primary/80
                text-black
                hover:shadow-[0_0_20px_rgba(216,249,153,0.5)]
                hover:scale-105
                active:scale-95
              `
          }
        `}
      >
        {isValidating ? '⏳ Validation...' : '→ Valider le Panier'}
      </button>

      {/* Info text */}
      <p className="text-xs text-primary/50 mt-4 text-center font-mono">
        Validation sécurisée au moment du paiement
      </p>
    </div>
  );
}

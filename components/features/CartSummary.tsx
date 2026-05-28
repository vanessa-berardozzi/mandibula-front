'use client';

import type { CartValidationResponse, PromoValidationResponse } from '@/types/cart';
import { Check, Tag, X, Zap } from 'lucide-react';
import { useState } from 'react';

interface CartSummaryProps {
  subtotal: number;
  validation?: CartValidationResponse;
  isValidating?: boolean;
  onCheckout?: () => void;
  isCheckoutDisabled?: boolean;
}

async function fetchPromoValidation(code: string, subtotal: number): Promise<PromoValidationResponse> {
  const res = await fetch('/api/cart/promo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code, subtotal }),
  });
  return res.json();
}

export function CartSummary({
  subtotal,
  validation,
  isValidating,
  onCheckout,
  isCheckoutDisabled,
}: CartSummaryProps) {
  const SHIPPING_COST = 5.99;

  // ── Promo state ──
  const [promoInput, setPromoInput] = useState('');
  const [promoResult, setPromoResult] = useState<PromoValidationResponse | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const result = await fetchPromoValidation(promoInput.trim(), subtotal);
      setPromoResult(result);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoResult(null);
    setPromoInput('');
  };

  // ── Calculs ──
  // Les prix sont TTC : la TVA est déjà incluse dans le sous-total
  // Le discount est recalculé en live sur le subtotal courant si un code promo est actif
  const discount = validation?.discount ?? (() => {
    if (!promoResult?.valid) return 0;
    if (promoResult.discountType === 'percent') {
      return Math.round(subtotal * (promoResult.discountValue ?? 0) / 100 * 100) / 100;
    }
    if (promoResult.discountType === 'fixed') {
      return Math.min(promoResult.discountValue ?? 0, subtotal);
    }
    return promoResult.discountAmount ?? 0;
  })();
  const discountedSubtotal = subtotal - discount;
  const finalShipping = validation?.shippingCost ?? SHIPPING_COST;
  // Total = sous-total remisé (TTC) + livraison
  const finalTotal = validation?.total ?? (discountedSubtotal + finalShipping);

  const appliedPromo = validation?.promoCode ?? (promoResult?.valid ? promoResult.code : undefined);

  return (
    <div
      className={`relative overflow-hidden border border-primary/40 bg-black/80 backdrop-blur-md transition-all duration-300 ${isValidating ? 'animate-pulse' : ''}`}
      style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
    >
      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(216,249,153,1) 0px, rgba(216,249,153,1) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Corner brackets */}
      <div className="absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-primary/80" />
      <div className="absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-primary/80" />
      <div className="absolute bottom-0 left-0 h-5 w-5 border-l-2 border-b-2 border-primary/80" />
      <div className="absolute bottom-0 right-0 h-5 w-5 border-r-2 border-b-2 border-primary/80" />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />

      <div className="relative p-5 space-y-4">

        {/* Header terminal */}
        <div className="border-b border-primary/40 pb-3">
          <p className="font-mono text-sm text-primary/70 tracking-[0.25em] uppercase mb-1">
            mission :: coût_total
          </p>
          <h2 className="font-black uppercase tracking-widest text-lg text-foreground">
            Récapitulatif
          </h2>
        </div>

        {/* Lignes de coût */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm text-foreground/75 tracking-widest">SOUS-TOTAL</span>
            <span className="font-mono text-sm text-primary font-bold">{subtotal.toFixed(2)}€</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-primary tracking-widest flex items-center gap-1">
                <Tag size={10} />
                {appliedPromo ?? 'PROMO'}
              </span>
              <span className="font-mono text-sm text-primary font-bold">-{discount.toFixed(2)}€</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm text-foreground/75 tracking-widest">LIVRAISON</span>
            <span className="font-mono text-sm text-primary font-bold">{finalShipping.toFixed(2)}€</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />

        {/* Total */}
        <div className="flex justify-between items-end">
          <span className="font-mono text-sm tracking-[0.2em] uppercase text-foreground/85">Total</span>
          <span className="font-black text-3xl text-primary drop-shadow-[0_0_8px_rgba(216,249,153,0.4)]">
            {finalTotal.toFixed(2)}€
          </span>
        </div>

        {/* ── BLOC CODE PROMO ── */}
        <div className="border-t border-primary/40 pt-4 space-y-2">
          <p className="font-mono text-sm text-primary/70 tracking-[0.2em] uppercase">Code promo</p>

          {/* Code appliqué avec succès */}
          {promoResult?.valid ? (
            <div
              className="flex items-center justify-between gap-2 px-3 py-2 border border-primary/50 bg-primary/10"
              style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Check size={12} className="text-primary shrink-0" />
                <span className="font-mono text-sm font-bold text-primary truncate">{promoResult.code}</span>
                <span className="font-mono text-sm text-primary/90 truncate hidden sm:block">— {promoResult.description}</span>
              </div>
              <button
                onClick={handleRemovePromo}
                className="shrink-0 w-5 h-5 flex items-center justify-center border border-destructive/70 text-destructive hover:border-destructive hover:bg-destructive/10 transition-all"
                title="Retirer le code"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            /* Input + bouton */
            <div className="flex gap-2">
              <label htmlFor="promo-code-input" className="sr-only">Code promo</label>
              <div
                className="flex-1 border border-primary/60 bg-black/75 overflow-hidden"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                <input
                  id="promo-code-input"
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    if (promoResult) setPromoResult(null);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromo(); }}
                  placeholder="MANDIBULA10"
                  maxLength={30}
                  className="w-full px-3 py-2 bg-transparent font-mono text-sm text-primary placeholder:text-primary/45 focus:outline-none tracking-widest uppercase"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                disabled={promoLoading || !promoInput.trim()}
                className="shrink-0 px-3 py-2 font-mono text-sm font-bold uppercase tracking-widest border border-primary/60 text-primary hover:border-primary hover:bg-primary/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              >
                {promoLoading ? (
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                ) : 'OK'}
              </button>
            </div>
          )}

          {/* Message d'erreur promo */}
          {promoResult && !promoResult.valid && (
            <p className="font-mono text-sm text-destructive/80 tracking-widest">
              ▸ {promoResult.error}
            </p>
          )}
        </div>

        {/* Erreurs de validation panier */}
        {validation && !validation.valid && validation.errors && (
          <div
            className="border border-destructive/80 bg-destructive/15 p-3 space-y-1"
            style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            <p className="font-mono text-sm font-bold text-destructive uppercase tracking-widest">⚠ anomalies détectées</p>
            {validation.errors.map((error, idx) => (
              <p key={idx} className="font-mono text-sm text-destructive">▸ {error}</p>
            ))}
          </div>
        )}

        {/* Bouton checkout */}
        <button
          onClick={onCheckout}
          disabled={isCheckoutDisabled || isValidating}
          className={`
            relative w-full py-4 px-4 font-black uppercase tracking-[0.15em] text-base
            transition-all duration-200 overflow-hidden group
            ${isCheckoutDisabled || isValidating
              ? 'border-2 border-primary/40 text-primary/50 cursor-not-allowed bg-black/60'
              : 'bg-primary text-black hover:shadow-[0_0_25px_rgba(216,249,153,0.45)] hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
          style={{ clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)' }}
        >
          {!(isCheckoutDisabled || isValidating) && (
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          )}
          <span className="relative flex items-center justify-center gap-2">
            {isValidating ? (
              <>
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                Validation...
              </>
            ) : (
              <>
                <Zap size={14} />
                Déployer la cargaison
              </>
            )}
          </span>
        </button>

        <p className="font-mono text-sm text-primary/55 text-center tracking-widest">
          Paiement sécurisé · Prix recalculés à l&apos;envoi
        </p>
      </div>
    </div>
  );
}

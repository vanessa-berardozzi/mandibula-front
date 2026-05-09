"use client";

import { useCartContext } from "@/context/CartContext";
import { useSession } from "@/lib/auth.client";
import { AlertTriangle, CreditCard, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type PaymentMethod = "SUM_UP" | "PAYPAL" | "BANK_TRANSFER";

function CheckoutContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, subtotal } = useCartContext();

  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("SUM_UP");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = 0;
  const total = subtotal + shippingCost;

  // Éviter l'erreur d'hydration SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePayment = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Créer la commande
      const orderResponse = await fetch('/api/orders', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map(item => ({ variantId: item.variantId, quantity: item.quantity })),
          paymentMethod,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Erreur lors de la création de la commande");
      }

      const { orderId } = await orderResponse.json();

      // 2. Créer le checkout SumUp
      const checkoutResponse = await fetch('/api/checkout', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, paymentMethod }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || "Erreur lors de la création du checkout");
      }

      const { checkoutUrl } = await checkoutResponse.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Erreur checkout:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsProcessing(false);
    }
  };

  // Skeleton pendant le SSR pour éviter l'hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/60 animate-spin" />
            <Lock className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <p className="font-mono text-xs text-primary/60 tracking-widest uppercase animate-pulse">
            Vérification sécurisée...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 pb-12">
      
      {/* ── HUD HEADER ── */}
      <div className="mb-6 relative overflow-hidden border-b border-primary/50 pb-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-sm text-primary/65 tracking-[0.3em] uppercase mb-1">
              payment_gateway :: v3.14.2
            </p>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_12px_rgba(216,249,153,0.35)]">
              Sécurisation Paiement
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary/80 uppercase tracking-wider">Connexion sécurisée</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      {/* ── RÉCAPITULATIF COMMANDE ── */}
      <div className="max-w-4xl mx-auto space-y-6">
          <div
            className="relative border border-primary/30 bg-black/80 backdrop-blur-md overflow-hidden"
            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(146,204,10,1) 0px, rgba(146,204,10,1) 1px, transparent 1px, transparent 4px)' }}
            />
            <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <span className="ml-2 font-mono text-xs text-primary/60 tracking-widest uppercase">
                CART :: RÉCAPITULATIF
              </span>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-lg font-black uppercase tracking-wider text-primary/90 mb-4">
                Récapitulatif Transaction
              </h2>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-start gap-3 pb-2 border-b border-primary/10 hover:bg-primary/5 px-2 py-1 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-primary/60 font-mono mt-1">
                        {item.variantId.slice(0, 8)}…
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        QTY: {item.quantity} × {item.price ? Number(item.price).toFixed(2) : '—'} €
                      </p>
                    </div>
                    <div className="font-bold text-sm text-primary tabular-nums">
                      {item.price ? (Number(item.price) * item.quantity).toFixed(2) : '—'} €
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-primary/30">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground uppercase tracking-wide">Sous-total</span>
                  <span className="text-foreground tabular-nums">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground uppercase tracking-wide">Frais de port</span>
                  <span className="text-foreground tabular-nums">{shippingCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-3 border-t border-primary/50">
                  <span className="uppercase tracking-wider text-primary">Total</span>
                  <span className="text-primary tabular-nums drop-shadow-[0_0_8px_rgba(146,204,10,0.6)]">
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        <div
          className="relative border border-primary/30 bg-black/80 backdrop-blur-md overflow-hidden"
          style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
        >
          {/* Scan line overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(146,204,10,1) 0px, rgba(146,204,10,1) 1px, transparent 1px, transparent 4px)',
            }}
          />
          
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="ml-2 font-mono text-xs text-primary/60 tracking-widest uppercase">
              PAYMENT_METHOD :: SELECT
            </span>
          </div>

          <div className="p-6 space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-primary/90 mb-4">
              Mode de Paiement
            </h2>

            {/* SumUp - Actif */}
            <label
              className={`group relative flex items-center p-4 border-2 cursor-pointer transition-all ${
                paymentMethod === "SUM_UP"
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(146,204,10,0.2)]"
                  : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              }`}
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="SUM_UP"
                checked={paymentMethod === "SUM_UP"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="sr-only"
              />
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === "SUM_UP"
                      ? "border-primary bg-primary"
                      : "border-primary/40 bg-transparent"
                  }`}
                >
                  {paymentMethod === "SUM_UP" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                    Carte Bancaire (SumUp)
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    Paiement sécurisé • Visa, Mastercard, Amex
                  </div>
                </div>
                <Lock className="w-5 h-5 text-primary/60" />
              </div>
            </label>

            {/* PayPal - Désactivé */}
            <div
              className="relative flex items-center p-4 border-2 border-primary/10 bg-black/40 opacity-40"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-5 h-5 rounded-full border-2 border-primary/20 bg-transparent" />
                <div className="flex-1">
                  <div className="font-bold text-muted-foreground">PayPal</div>
                  <div className="text-xs text-muted-foreground/60 font-mono mt-1">
                    Bientôt disponible
                  </div>
                </div>
              </div>
            </div>

            {/* Virement bancaire - Désactivé */}
            <div
              className="relative flex items-center p-4 border-2 border-primary/10 bg-black/40 opacity-40"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-5 h-5 rounded-full border-2 border-primary/20 bg-transparent" />
                <div className="flex-1">
                  <div className="font-bold text-muted-foreground">Virement Bancaire</div>
                  <div className="text-xs text-muted-foreground/60 font-mono mt-1">
                    Bientôt disponible
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MESSAGE ERREUR ── */}
        {error && (
          <div
            className="relative border-2 border-destructive bg-destructive/10 backdrop-blur-sm overflow-hidden"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-destructive uppercase tracking-wide text-sm mb-1">Erreur Paiement</p>
                <p className="text-sm text-destructive/90 font-mono">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex-1 px-8 py-3 font-black uppercase tracking-wider text-sm border-2 border-primary/60 text-primary hover:bg-primary/10 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            disabled={isProcessing}
          >
            ← Retour
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 px-8 py-3 font-black uppercase tracking-wider text-sm bg-primary text-black hover:shadow-[0_0_20px_rgba(216,249,153,0.5)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Procéder au paiement
              </>
            )}
          </button>
        </div>

        {/* ── NOTICE SÉCURITÉ ── */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <Lock className="w-3 h-3 text-primary/60" />
            <p className="text-xs font-mono text-primary/70 tracking-wide">
              Connexion SSL • Données cryptées • PCI-DSS Compliant
            </p>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
            Aucune donnée bancaire n'est stockée sur nos serveurs
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant wrapper avec Suspense boundary
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-primary/60 animate-spin" />
              <Lock className="absolute inset-0 m-auto w-6 h-6 text-primary" />
            </div>
            <p className="font-mono text-xs text-primary/60 tracking-widest uppercase animate-pulse">
              Initialisation sécurisée...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

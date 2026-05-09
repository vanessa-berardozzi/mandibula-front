'use client';

import { CartItemRow } from '@/components/features/CartItemRow';
import { CartSummary } from '@/components/features/CartSummary';
import { useCartContext } from '@/context/CartContext';
import { useSession } from '@/lib/auth.client';
import type { CartValidationResponse } from '@/types/cart';
import { Package, ShoppingBag, Skull } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductData {
  [key: string]: {
    id: string;
    name: string;
    variantName: string;
    price: number;
    image?: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, itemCount, isLoading, clearCart, validateCart } =
    useCartContext();

  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<CartValidationResponse>();
  const [products, setProducts] = useState<ProductData>({});
  const [clearConfirm, setClearConfirm] = useState(false);

  useEffect(() => {
    const variantIds = items.filter((item) => item.variantId).map((item) => item.variantId);
    if (variantIds.length === 0) {
      setProducts({});
      return;
    }
    fetch(`/api/products/variants/batch?ids=${variantIds.join(',')}`)
      .then((r) => r.json())
      .then((variants: { id: string; name: string; price: number; product: { id: string; name: string; images: string[] } }[]) => {
        const dict: ProductData = {};
        for (const v of variants) {
          dict[v.id] = {
            id: v.product.id,
            name: v.product.name,
            variantName: v.name,
            price: v.price,
            image: v.product.images?.[0],
          };
        }
        setProducts(dict);
      })
      .catch(() => {
        // Fallback : afficher l'id tronqué si l'API échoue
        const fallback: ProductData = {};
        items.filter((item) => item.variantId).forEach((item) => {
          fallback[item.variantId] = {
            id: item.variantId,
            name: `Produit ${item.variantId.slice(0, 8).toUpperCase()}`,
            variantName: '',
            price: item.price || 0,
          };
        });
        setProducts(fallback);
      });
  }, [items]);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    if (items.length === 0) return;

    setIsValidating(true);
    try {
      // 1. Créer la commande côté backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          paymentMethod: 'SUM_UP', // Méthode par défaut, peut être changée sur la page checkout
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la commande');
      }

      const data = await response.json();
      
      // 2. Rediriger vers la page de paiement avec l'orderId
      router.push(`/cart/checkout?orderId=${data.orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Une erreur est survenue'));
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearCart = async () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      return;
    }
    setClearConfirm(false);
    await clearCart();
  };

  /* ── LOADING ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/60 animate-spin" />
            <ShoppingBag className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <p className="font-mono text-xs text-primary/60 tracking-widest uppercase animate-pulse">
            Chargement inventaire...
          </p>
        </div>
      </div>
    );
  }

  /* ── PANIER VIDE ── */
  if (items.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-16">
        {/* Terminal vide */}
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
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            <span className="ml-2 font-mono text-xs text-primary/40 tracking-widest">INVENTORY_SYS :: SLOT_CHECK</span>
          </div>

          <div className="p-12 text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-sm animate-spin" style={{ animationDuration: '20s' }} />
              <Skull className="absolute inset-0 m-auto w-10 h-10 text-primary/30" />
            </div>
            <div>
              <p className="font-mono text-xs text-primary/40 tracking-widest mb-2">[ ERREUR_INVENTAIRE_001 ]</p>
              <h1 className="text-3xl font-black uppercase tracking-widest text-primary/80 mb-2">Inventaire Vide</h1>
              <p className="text-sm font-mono text-foreground/40">Aucun spécimen capturé. Retournez en mission.</p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap pt-4">
              <Link
                href="/"
                className="px-8 py-3 font-black uppercase tracking-wider text-sm bg-primary text-black hover:shadow-[0_0_20px_rgba(216,249,153,0.5)] hover:scale-105 transition-all"
                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
              >
                ▶ Reprendre la chasse
              </Link>
              <Link
                href="/categories/isopodes"
                className="px-8 py-3 font-black uppercase tracking-wider text-sm border-2 border-primary/60 text-primary hover:bg-primary/10 hover:scale-105 transition-all"
                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
              >
                Isopodes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── PANIER REMPLI ── */
  return (
    <div className="w-full px-4 md:px-8 pb-12">

      {/* ── HUD HEADER ── */}
      <div className="mb-6 relative overflow-hidden border-b border-primary/50 pb-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-sm text-primary/65 tracking-[0.3em] uppercase mb-1">
              cargo_manifest :: v2.48.2
            </p>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_12px_rgba(216,249,153,0.35)]">
              Inventaire
            </h1>
          </div>
          <div className="flex items-center gap-6 font-mono text-sm text-primary/80">
            <span className="flex items-center gap-2">
              <Package size={14} className="text-primary" />
              <span><span className="text-primary font-bold">{itemCount}</span> article{itemCount > 1 ? 's' : ''}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary/70">ACTIF</span>
            </span>
          </div>
        </div>
        {/* Ligne de progression décorative */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-primary/60 via-primary/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── COLONNE INVENTAIRE ── */}
        <div className="lg:col-span-2 space-y-3">

          {/* Slots d'inventaire */}
          <div className="space-y-2">
            {items.map((item, index) => (
              <CartItemRow
                key={item.variantId}
                item={item}
                product={products[item.variantId]}
                slotIndex={index + 1}
              />
            ))}
          </div>

          {/* Bouton vider le panier */}
          <div className="pt-2">
            <button
              onClick={handleClearCart}
              className={`
                group flex items-center gap-2 px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest
                border-2 transition-all duration-200
                ${clearConfirm
                  ? 'border-destructive bg-destructive/20 text-white shadow-[0_0_20px_rgba(204,21,21,0.5)] scale-[1.02]'
                  : 'border-destructive bg-black/70 text-destructive hover:bg-destructive/15 hover:shadow-[0_0_12px_rgba(204,21,21,0.4)]'
                }
              `}
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <Skull size={16} className={`shrink-0 ${clearConfirm ? 'animate-bounce' : ''}`} />
              <span>{clearConfirm ? '⚠ Confirmer — tout supprimer ?' : "Vider l'inventaire"}</span>
            </button>
          </div>
        </div>

        {/* ── COLONNE TERMINAL MISSION ── */}
        <div className="lg:col-span-1 space-y-4">
          <CartSummary
            subtotal={subtotal}
            validation={validation}
            isValidating={isValidating}
            onCheckout={handleCheckout}
            isCheckoutDisabled={!session?.user || items.length === 0}
          />

          {!session?.user && (
            <div
              className="relative border border-primary/25 bg-black/60 backdrop-blur-sm overflow-hidden"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
              <div className="p-4 space-y-3">
                <p className="font-mono text-sm text-primary/50 tracking-widest uppercase">
                  ⚠ Authentification requise
                </p>
                <p className="font-mono text-sm text-foreground/40">
                  Connectez-vous pour déployer votre cargaison.
                </p>
                <Link
                  href="/login"
                  className="block w-full py-2.5 px-4 text-center font-black text-sm uppercase tracking-wider bg-primary text-black hover:shadow-[0_0_15px_rgba(216,249,153,0.4)] hover:scale-[1.02] transition-all"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                  Se connecter
                </Link>
              </div>
            </div>
          )}

          {/* Lien retour */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="font-mono text-sm text-primary/65 hover:text-primary tracking-widest uppercase transition-colors"
            >
              ← Retour en mission
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

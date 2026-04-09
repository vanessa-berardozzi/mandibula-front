'use client';

import { CartItemRow } from '@/components/features/CartItemRow';
import { CartSummary } from '@/components/features/CartSummary';
import { useCartContext } from '@/context/CartContext';
import { useSession } from '@/lib/auth.client';
import type { CartValidationResponse } from '@/types/cart';
import { AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductData {
  [key: string]: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

/**
 * Page Panier
 * Design: Jungle apocalyptique futuriste avec UI gaming neon
 */
export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, itemCount, isLoading, clearCart, validateCart } =
    useCartContext();

  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<CartValidationResponse>();
  const [products, setProducts] = useState<ProductData>({});

  // Construit un dictionnaire produits depuis les items du panier
  useEffect(() => {
    const productsDict: ProductData = {};
    items.forEach((item) => {
      productsDict[item.productId] = {
        id: item.productId,
        name: `Produit ${item.productId.slice(0, 8)}...`,
        price: item.price || 0,
      };
    });

    setProducts(productsDict);
  }, [items]);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      alert('Le panier est vide');
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateCart();
      setValidation(result ?? undefined);

      if (result?.valid) {
        // Rediriger vers checkout avec les données validées
        router.push('/checkout');
      } else {
        // Afficher les erreurs
        alert('Panier invalide: ' + (result?.errors?.[0] || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('Erreur lors de la validation: ' + (error instanceof Error ? error.message : ''));
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Vider complètement le panier ?')) {
      await clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 animate-bounce" />
          <p className="font-mono">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  // Panier vide
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-black/95 to-black p-6">
        <div
          className={`
            max-w-2xl mx-auto mt-12 rounded-lg border-2 border-dashed border-primary/30
            bg-linear-to-b from-black/60 to-black/40 p-12 backdrop-blur-sm
            text-center
          `}
        >
          <ShoppingBag size={64} className="mx-auto mb-6 text-primary/40" />

          <h1 className="text-3xl font-black uppercase tracking-widest text-primary mb-4">
            Panier Vide
          </h1>

          <p className="text-foreground/60 mb-8 font-mono">
            Votre panier ne contient aucun article. Explorez nos créatures exotiques!
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className={`
                px-8 py-3 font-black uppercase tracking-wider rounded
                bg-primary text-black
                hover:shadow-[0_0_20px_rgba(216,249,153,0.5)]
                hover:scale-105 transition-all
              `}
            >
              Continuer le Shopping
            </Link>

            <Link
              href="/categories/isopodes"
              className={`
                px-8 py-3 font-black uppercase tracking-wider rounded
                border-2 border-primary text-primary
                hover:bg-primary/10 transition-all
              `}
            >
              Voir les Isopodes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-black/98 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header HUD Style */}
        <div className="mb-8 relative">
          <div
            className={`
              p-6 rounded-lg border-2 border-primary/60
              bg-linear-to-r from-primary/5 via-black to-black
              backdrop-blur-sm
              before:absolute before:inset-0 before:rounded-lg
              before:bg-linear-to-r before:from-transparent before:via-primary/10 before:to-transparent
              before:animate-pulse before:pointer-events-none
            `}
          >
            <div className="relative z-10">
              <p className="text-xs font-mono text-primary/60 tracking-widest uppercase mb-2">
                [CARGO_MANIFEST_V2.48]
              </p>
              <h1 className="text-4xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_10px_rgba(216,249,153,0.4)]">
                🛒 Mon Panier
              </h1>
              <p className="text-sm text-primary/70 font-mono mt-2">
                {itemCount} article{itemCount > 1 ? 's' : ''} • {items.length} produit
                {items.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article List */}
          <div className="lg:col-span-2">
            <div
              className={`
                rounded-lg border border-primary/30 bg-black/40 p-6 backdrop-blur-sm
                space-y-2
              `}
            >
              {/* Info badge */}
              <div className="mb-6 flex items-start gap-3 p-3 rounded border border-primary/20 bg-primary/5">
                <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 font-mono">
                  Les prix sont recalculés et validés au moment du paiement pour garantir votre sécurité.
                </p>
              </div>

              {/* Articles */}
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  product={products[item.productId]}
                />
              ))}

              {/* Clear cart button */}
              <button
                onClick={handleClearCart}
                className={`
                  w-full mt-6 py-2 px-4 font-mono text-sm
                  border border-destructive/50 text-destructive/70
                  hover:bg-destructive/10 rounded
                  transition-all
                `}
              >
                🗑️ Vider le Panier
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              validation={validation}
              isValidating={isValidating}
              onCheckout={handleCheckout}
              isCheckoutDisabled={!session?.user || items.length === 0}
            />

            {/* Auth prompt if not logged in */}
            {!session?.user && (
              <div className="mt-6 p-4 rounded border border-primary/30 bg-primary/5">
                <p className="text-xs text-primary/70 font-mono mb-3">
                  Connectez-vous pour valider votre commande
                </p>
                <Link
                  href="/login"
                  className={`
                    block w-full py-2 px-4 text-center font-bold text-sm
                    bg-primary text-black rounded
                    hover:scale-105 transition-all
                  `}
                >
                  Se Connecter
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Continue shopping link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-primary/60 hover:text-primary font-mono text-sm transition-colors"
          >
            ← Continuer le shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

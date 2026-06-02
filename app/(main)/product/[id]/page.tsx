'use client';

import { TradingProductCard } from '@/components/features/TradingProductCard';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/context/CartContext';
import { useSession } from '@/lib/auth.client';
import { Check, ShoppingCart } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// ── Types API ────────────────────────────────────────────────────────────────

interface ProductVariant {
  id: string;
  name: string;
  lotSize: number;
  price: string;
  stock: number;
  reservedStock: number;
  isActive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  price: string;
  images: string[];
  attributes: Record<string, unknown> | null;
  category: { id: string; name: string; slug: string } | null;
  variants: ProductVariant[];
}

// ── Composants utilitaires ───────────────────────────────────────────────────

function Section({
  title,
  children,
  variant = 'default',
}: {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'premium';
}) {
  return (
    <div
      className={`p-3 backdrop-blur-sm border rounded-sm ${
        variant === 'premium'
          ? 'bg-card/30 border-primary/60 shadow-[0_0_20px_rgba(202,226,197,0.3)]'
          : 'bg-card/20 border-primary/40'
      }`}
      style={{
        clipPath: `polygon(${variant === 'premium' ? '20px' : '15px'} 0, 100% 0, 100% calc(100% - ${variant === 'premium' ? '20px' : '15px'}), calc(100% - ${variant === 'premium' ? '20px' : '15px'}) 100%, 0 100%, 0 ${variant === 'premium' ? '20px' : '15px'})`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-sm md:text-base font-bold text-foreground uppercase tracking-tight flex items-center gap-2 flex-1">
          <span className="w-1 h-3.5 bg-primary" />
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

// ── Page principale ──────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartContext();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ApiProduct>;
      })
      .then((data) => {
        if (data) {
          setProduct(data);
          setSelectedVariant(data.variants[0] ?? null);
        }
      })
      .catch((err) => console.error('Erreur chargement produit:', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!session?.user) { router.push('/login'); return; }
    const availableStock = selectedVariant ? selectedVariant.stock - (selectedVariant.reservedStock ?? 0) : 0;
    if (!selectedVariant || availableStock === 0) return;

    setIsAdding(true);
    setStockError(null);
    const result = await addItem(selectedVariant.id, quantity, parseFloat(selectedVariant.price));
    if (result?.error) {
      setStockError(result.error);
      setTimeout(() => setStockError(null), 3000);
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
    setIsAdding(false);
  };

  // ── États de chargement ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-mono text-primary/60 text-xs tracking-widest animate-pulse uppercase">
          Chargement du spécimen...
        </p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-mono text-destructive text-sm tracking-widest uppercase">Produit introuvable</p>
        <Button variant="outline" onClick={() => router.push('/')}>← Retour à l&rsquo;accueil</Button>
      </div>
    );
  }

  const attrs = product.attributes as {
    type?: string;
    temperature?: string;
    humidite?: string;
    substrat?: string;
    alimentation?: string;
    origine?: string;
    niveau?: string;
    niveauScore?: number;
    wc?: boolean;
    conseils?: string[];
    compatible?: string;
    utilisation?: string;
    contenance?: string;
    [key: string]: unknown;
  } | null;
  const isAnimal = attrs?.type === 'animal';
  const price = selectedVariant ? parseFloat(selectedVariant.price) : parseFloat(product.price);
  const stock = selectedVariant ? selectedVariant.stock - (selectedVariant.reservedStock ?? 0) : 0;

  return (
    <main className="min-h-screen pb-8">
      <div className="w-full px-4 md:px-8 pt-4 space-y-6">

        {/* ── LIGNE HAUTE : Visuel (gauche) + Panier & Conditionnement (droite) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start max-w-4xl mx-auto">

          {/* ── GAUCHE : Visuel produit avec panneau décoratif ── */}
          <div 
            className="relative w-full p-6 md:p-8 border border-primary/40 overflow-hidden"
            style={{ 
              clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)',
              background: 'linear-gradient(135deg, rgba(12, 20, 15, 0.85) 0%, rgba(8, 15, 12, 0.90) 50%, rgba(5, 12, 10, 0.85) 100%)',
            }}
          >
            {/* Image de fond : fougères tropicales */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'url(/v2_watermarked-bd8c3858-1193-4765-8f08-eedc315b524e-removebg-preview.png)',
                backgroundSize: '150%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />

            {/* Vignette douce */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.4)',
              }}
            />
            
            {/* Indicateurs top */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(146,204,10,0.6)]" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
            </div>
            
            <div className="absolute top-3 right-3 font-mono text-xs text-primary/70 uppercase tracking-widest z-10">
              ID: {product.id.slice(0, 8)}
            </div>

            {/* Ligne décorative avec effet néon */}
            <div className="absolute top-10 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_4px_rgba(146,204,10,0.4)]" />

            {/* Carte centrée */}
            <div className="relative flex items-center justify-center pt-8 z-10">
              <div className="w-full max-w-70 mx-auto">
                <TradingProductCard
                  title={product.name}
                  price={price}
                  stock={stock}
                  imageUrl={product.images[0] ?? '/boite.png'}
                  href={`/product/${product.id}`}
                  variantId={selectedVariant?.id}
                  categorySlug={product.category?.slug}
                  priority
                />
              </div>
            </div>

            {/* Label catégorie en bas */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="font-mono text-xs text-primary/50 uppercase tracking-wider">
                {product.category?.name ?? 'Spécimen'}
              </span>
              <span className="font-mono text-xs text-primary/70 uppercase tracking-wider">
                {stock > 0 ? `${stock} en stock` : 'Épuisé'}
              </span>
            </div>
          </div>

          {/* ── DROITE : Titre + Prix + Conditionnement + Panier ── */}
          <div className="flex flex-col gap-3">
            {/* Titre & Prix */}
            <div>
              <p className="text-xs font-mono text-primary/50 uppercase tracking-widest mb-1">
                {product.category?.name ?? 'Produit'}
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-black text-primary font-mono mt-1">
                {price.toFixed(2)}€
              </p>
            </div>

            {/* Dropdown conditionnement */}
            {product.variants.length > 1 && (
              <Section title="Conditionnement">
                <div className="relative">
                  <select
                    value={selectedVariant?.id ?? ''}
                    onChange={(e) => {
                      const v = product.variants.find((v) => v.id === e.target.value);
                      if (v) { setSelectedVariant(v); setQuantity(1); }
                    }}
                    className="w-full appearance-none bg-card/40 border border-primary/40 text-foreground text-xs font-mono uppercase tracking-wider px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(202,226,197,0.3)] transition-all cursor-pointer"
                  >
                    {product.variants.map((v) => {
                      const vAvailableStock = v.stock - (v.reservedStock ?? 0);
                      return (
                        <option
                          key={v.id}
                          value={v.id}
                          disabled={vAvailableStock === 0}
                          className="bg-card text-foreground"
                        >
                          {v.name} — {parseFloat(v.price).toFixed(2)}€{vAvailableStock === 0 ? ' (épuisé)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  {/* Icône chevron */}
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <svg className="w-3 h-3 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </Section>
            )}

            {/* Bloc panier */}
            <div
              className="p-3 backdrop-blur-sm border bg-card/30 border-primary/60 shadow-[0_0_20px_rgba(202,226,197,0.3)]"
              style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
            >
              {/* Quantité */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Qté</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline" size="icon"
                    className="h-7! w-7! border-primary/50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </Button>
                  <span className="w-8 text-center font-bold text-primary text-sm font-mono">{quantity}</span>
                  <Button
                    variant="outline" size="icon"
                    className="h-7! w-7! border-primary/50"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
                <span className={`ml-auto text-xs font-mono ${stock > 0 ? 'text-primary/60' : 'text-destructive/70'}`}>
                  {stock > 0 ? `${stock} dispo` : 'Épuisé'}
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAdding || stock === 0}
                className={`w-full py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  added
                    ? 'bg-primary/30 text-primary shadow-[0_0_25px_rgba(202,226,197,0.6)]'
                    : stock === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'shadow-[0_0_15px_rgba(202,226,197,0.4)] hover:shadow-[0_0_30px_rgba(202,226,197,0.6)]'
                }`}
              >
                {isAdding ? (
                  <><div className="w-3 h-3 mr-2 animate-spin border border-current border-t-transparent rounded-full" />Ajout...</>
                ) : added ? (
                  <><Check className="w-3 h-3 mr-2" />Ajouté !</>
                ) : stock === 0 ? 'Épuisé' : (
                  <><ShoppingCart className="w-3 h-3 mr-2" />Ajouter au panier</>
                )}
              </Button>

              {stockError && (
                <p className="text-xs text-red-400 font-mono text-center animate-pulse">{stockError}</p>
              )}

              <div className="pt-2 mt-2 border-t border-primary/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                <span className="font-black text-primary font-mono">{(price * quantity).toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── LIGNE BASSE : Description & Attributs (pleine largeur) ── */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Description */}
          {product.description && (
            <Section title="À propos">
              <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
            </Section>
          )}

          {/* Attributs animaux */}
          {isAnimal && (
            <>
              <Section title="Conditions d'élevage" variant="premium">
                <div className="grid grid-cols-2 gap-2 text-base">
                  {attrs?.temperature && (
                    <div className="flex flex-col gap-0.5 p-2 bg-primary/5 border border-primary/15 rounded-sm">
                      <span className="text-xs font-mono text-primary/50 uppercase tracking-wider">Température</span>
                      <span className="text-foreground">{String(attrs.temperature)}</span>
                    </div>
                  )}
                  {attrs?.humidite && (
                    <div className="flex flex-col gap-0.5 p-2 bg-primary/5 border border-primary/15 rounded-sm">
                      <span className="text-xs font-mono text-primary/50 uppercase tracking-wider">Humidité</span>
                      <span className="text-foreground">{String(attrs.humidite)}</span>
                    </div>
                  )}
                  {attrs?.substrat && (
                    <div className="col-span-2 flex flex-col gap-0.5 p-2 bg-primary/5 border border-primary/15 rounded-sm">
                      <span className="text-xs font-mono text-primary/50 uppercase tracking-wider">Substrat</span>
                      <span className="text-foreground">{String(attrs.substrat)}</span>
                    </div>
                  )}
                  {attrs?.alimentation && (
                    <div className="col-span-2 flex flex-col gap-0.5 p-2 bg-primary/5 border border-primary/15 rounded-sm">
                      <span className="text-xs font-mono text-primary/50 uppercase tracking-wider">Alimentation</span>
                      <span className="text-foreground">{String(attrs.alimentation)}</span>
                    </div>
                  )}
                  {attrs?.origine && (
                    <div className="flex flex-col gap-0.5 p-2 bg-primary/5 border border-primary/15 rounded-sm">
                      <span className="text-xs font-mono text-primary/50 uppercase tracking-wider">Origine</span>
                      <span className="text-foreground">{String(attrs.origine)}</span>
                    </div>
                  )}
                  {attrs?.wc && (
                    <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-sm">
                      <span className="text-xs text-amber-400 font-mono uppercase">Wild-Caught</span>
                    </div>
                  )}
                </div>
              </Section>

              {Array.isArray(attrs?.conseils) && (attrs.conseils as string[]).length > 0 && (
                <Section title="💡 Conseils d'élevage">
                  <ul className="space-y-2">
                    {(attrs.conseils as string[]).map((tip, i) => (
                      <li key={i} className="flex gap-2 text-base text-muted-foreground p-2 bg-primary/5 border border-primary/15 rounded-sm leading-relaxed">
                        <span className="text-primary/70 shrink-0 mt-0.5">▸</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </>
          )}

          {/* Attributs accessoires */}
          {!isAnimal && attrs && (
            <>
              {Array.isArray(attrs.caracteristiques) && (
                <Section title="Caractéristiques" variant="premium">
                  <ul className="space-y-2">
                    {(attrs.caracteristiques as string[]).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-muted-foreground leading-relaxed">
                        <span className="text-primary mt-0.5">▸</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
              {Array.isArray(attrs.contenu) && (attrs.contenu as string[]).length > 0 && (
                <Section title="Contenu du kit">
                  <ul className="space-y-1">
                    {(attrs.contenu as string[]).map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-base text-muted-foreground">
                        <span className="text-primary/70">▸</span><span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </>
          )}
        </div>

      </div>
    </main>
  );
}

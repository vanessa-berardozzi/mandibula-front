'use client';

import { ProductCard } from '@/components/features/ProductCard';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Variant {
  id: string;
  name: string;
  lotSize: number;
  price: string;
  stock: number;
  isActive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  variants: Variant[];
}

interface CategoryResponse {
  category: { id: string; name: string; slug: string; parentId: string | null };
  data: ApiProduct[];
  total: number;
}

export default function CategoryPage() {
  const params = useParams<{ slug: string[] }>();
  const router = useRouter();

  // On utilise toujours le dernier segment du chemin comme slug de catégorie
  const slugSegments = Array.isArray(params.slug) ? params.slug : [params.slug];
  const categorySlug = slugSegments[slugSegments.length - 1];

  const [category, setCategory] = useState<CategoryResponse['category'] | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!categorySlug) return;
    setIsLoading(true);
    setNotFound(false);

    fetch(`/api/products/category/${categorySlug}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<CategoryResponse>;
      })
      .then((data) => {
        if (data) {
          setCategory(data.category);
          setProducts(data.data);
        }
      })
      .catch((err) => console.error('Erreur chargement catégorie:', err))
      .finally(() => setIsLoading(false));
  }, [categorySlug]);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-mono text-primary/60 text-xs tracking-widest animate-pulse uppercase">
          Scan en cours...
        </p>
      </div>
    );
  }

  // ── 404 ──
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-mono text-destructive text-sm uppercase tracking-widest">
          Catégorie introuvable
        </p>
        <button
          onClick={() => router.push('/')}
          className="font-mono text-xs text-primary/60 hover:text-primary underline underline-offset-4 transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-12">
      <div className="w-full px-4 md:px-8">
        {/* ── En-tête catégorie ── */}
        <div
          className="relative mb-8 p-6 md:p-8 bg-card/15 backdrop-blur-md border border-primary/40"
          style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
        >
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          <p className="text-[10px] font-mono text-primary/40 uppercase tracking-widest mb-1">
            catalogue / {slugSegments.join(' / ')}
          </p>
          <h1 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tight">
            {category?.name ?? categorySlug}
          </h1>
          <p className="text-sm font-mono text-primary/50 mt-1">
            {products.length} spécimen{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Grille produits ── */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="font-mono text-primary/30 text-xs uppercase tracking-widest">
              [ AUCUN SPÉCIMEN EN STOCK ]
            </p>
            <button
              onClick={() => router.push('/')}
              className="font-mono text-xs text-primary/50 hover:text-primary underline underline-offset-4 transition-colors"
            >
              ← Retour à l'accueil
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((product, index) => {
              const defaultVariant = product.variants[0];
              return (
                <div
                  key={product.id}
                  style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.04}s backwards` }}
                >
                  <ProductCard
                    title={product.name}
                    price={defaultVariant ? parseFloat(defaultVariant.price) : parseFloat(product.price)}
                    stock={defaultVariant?.stock ?? 0}
                    imageUrl={product.images[0]}
                    href={`/product/${product.id}`}
                    variantId={defaultVariant?.id}
                    priority={index === 0}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

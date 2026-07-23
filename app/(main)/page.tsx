"use client";

import { HeroSection } from "@/components/features/HeroSection";
import { SimpleProductCard } from "@/components/features/SimpleProductCard";
import { useEffect, useState } from "react";

interface Variant {
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
  price: string;
  images: string[];
  variants: Variant[];
  category?: { id: string; name: string; slug: string; parentId: string | null };
}

interface ProductsResponse {
  data: ApiProduct[];
  total: number;
  page: number;
  pages: number;
}

export default function LandingPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products?limit=6")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ProductsResponse>;
      })
      .then((data) => setProducts(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen w-full">
      <HeroSection />

      {/* ============================================
          PRODUCTS SECTION
          ============================================ */}
      <section className="w-full px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <p className="text-center font-mono text-primary/60 text-sm tracking-widest animate-pulse">
              CHARGEMENT DES SPÉCIMENS...
            </p>
          )}
          {error && (
            <p className="text-center text-destructive font-mono text-sm">
              Erreur : {error}
            </p>
          )}
          {!isLoading && !error && products.length === 0 && (
            <p className="text-center font-mono text-primary/40 text-sm">
              Aucun produit disponible.
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {products.map((product, index) => {
              const defaultVariant = product.variants[0];
              return (
                <div
                  key={product.id}
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.05}s backwards` }}
                >
                  <SimpleProductCard
                    title={product.name}
                    price={defaultVariant ? parseFloat(defaultVariant.price) : parseFloat(product.price)}
                    stock={defaultVariant ? defaultVariant.stock - (defaultVariant.reservedStock ?? 0) : 0}
                    imageUrl={product.images[0]}
                    href={`/product/${product.id}`}
                    variantId={defaultVariant?.id}
                    productId={product.id}
                    priority={index < 3}
                    categoryName={product.category?.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </main>
  );
}

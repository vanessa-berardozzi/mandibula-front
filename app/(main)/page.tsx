"use client";

import { ProductCard } from "@/components/features/ProductCard";
import { useEffect, useState } from "react";

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
    <main className="min-h-screen pb-12">
      {/* Header hero avec cadre néon */}
      <div className="w-full px-4 md:px-8 pb-8">
        <div className="relative mb-8">
          <div
            className="relative p-8 md:p-12 bg-card/15 backdrop-blur-md border-2 border-primary/60 rounded-sm shadow-[0_0_30px_rgba(202,226,197,0.4)]"
            style={{
              clipPath: "polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)",
            }}
          >
            {/* Coins décoratifs */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />

            {/* Lignes d'accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-70" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-70" />

            <div className="relative">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-3 uppercase tracking-tight">
                Mandibula{" "}
                <span className="text-primary drop-shadow-[0_0_10px_rgba(202,226,197,0.6)]">
                  Shop
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
                Boutique spécialisée en isopodes, blattes et invertébrés pour terrariums !
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section produits */}
      <div className="w-full px-4 md:px-8">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {products.map((product, index) => {
            const defaultVariant = product.variants[0];
            return (
              <div
                key={product.id}
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.05}s backwards` }}
              >
                <ProductCard
                  title={product.name}
                  price={defaultVariant ? parseFloat(defaultVariant.price) : parseFloat(product.price)}
                  stock={defaultVariant?.stock ?? 0}
                  imageUrl={product.images[0]}
                  href={`/product/${product.id}`}
                  variantId={defaultVariant?.id}
                  priority={index < 3}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FeaturedProductCard } from "./FeaturedProductCard";
import styles from "./FeaturedSelection.module.css";

interface Variant {
  id: string;
  name: string;
  price: string;
  stock: number;
  reservedStock: number;
}

interface ApiProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  variants: Variant[];
  category?: { id: string; name: string; slug: string };
}

interface ProductsResponse {
  data: ApiProduct[];
}

// Section "Sélection du moment" — met en avant 4 espèces disponibles (thème clair, fidèle à la maquette).
export function FeaturedSelection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=4")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ProductsResponse>;
      })
      .then((data) => setProducts(data.data))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className={styles["featured-selection"]}>
      <Image
        src="/cyber-fern.png"
        alt=""
        aria-hidden="true"
        width={220}
        height={220}
        className={styles["featured-selection__leaf"]}
      />

      <div className={styles["featured-selection__heading"]}>
        <div>
          <p className="eyebrow">MODULE U-02 / Catalogue 2026</p>
          <h2>Sélection du moment</h2>
          <p>Quatre espèces emblématiques, disponibles dès maintenant dans notre élevage.</p>
        </div>
        <Link href="/categories">
          Voir tous les animaux <span>→</span>
        </Link>
      </div>

      {!isLoading && products.length === 0 && (
        <p className={styles["featured-selection__empty"]}>Aucun spécimen disponible pour le moment.</p>
      )}

      <div className={styles["featured-selection__grid"]}>
        {products.map((product, index) => {
          const defaultVariant = product.variants[0];
          return (
            <FeaturedProductCard
              key={product.id}
              index={index}
              title={product.name}
              price={defaultVariant ? parseFloat(defaultVariant.price) : parseFloat(product.price)}
              stock={defaultVariant ? defaultVariant.stock - (defaultVariant.reservedStock ?? 0) : 0}
              imageUrl={product.images[0]}
              href={`/product/${product.id}`}
              variantId={defaultVariant?.id}
              productId={product.id}
              priority={index < 2}
              categoryName={product.category?.name}
            />
          );
        })}
      </div>
    </section>
  );
}

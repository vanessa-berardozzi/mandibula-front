"use client";

import { toPrice } from "@/lib/priceUtils";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FeaturedProductCard } from "./FeaturedProductCard";
import styles from "./FeaturedSelection.module.css";

interface Variant {
  id: string;
  name: string;
  price: string;
}

interface ApiProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  variants: Variant[];
  availableStock: number;
  category?: { id: string; name: string; slug: string };
}

interface ProductsResponse {
  data: ApiProduct[];
}


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
    <section id="selection" className={styles["featured-selection"]}>
      <div className={styles["featured-selection__heading"]}>
        <div className={styles["featured-selection__heading-content"]}>
          <p className={`${styles["featured-selection__eyebrow"]} eyebrow`}>MODULE U-02 / CATALOGUE 2026</p>
          <h2>Sélection du moment</h2>
          <div className={styles["featured-selection__subline"]}>
            <p>Quatre animaux choisis dans nos élevages. La sélection évolue chaque heure.</p>
          </div>
        </div>
        <Link href="/categories" className={styles["featured-selection__cta"]}>
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
              price={toPrice(defaultVariant ? defaultVariant.price : product.price)}
              stock={product.availableStock ?? 0}
              imageUrl={product.images[0] ?? "/boite.png"}
              href={`/product/${product.id}`}
              productId={product.id}
              variantId={defaultVariant?.id}
              priority={index < 2}
              categoryName={product.category?.name}
            />
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useCartContext } from "@/context/CartContext";
import { Check, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./FeaturedProductCard.module.css";

interface FeaturedProductCardProps {
  index: number;
  title: string;
  price: number;
  stock: number;
  imageUrl?: string;
  href: string;
  variantId?: string;
  priority?: boolean;
  categoryName?: string;
}

export function FeaturedProductCard({
  index,
  title,
  price,
  stock,
  imageUrl,
  href,
  variantId,
  priority = false,
  categoryName,
}: FeaturedProductCardProps) {
  const isInStock = stock > 0;
  const { addItem } = useCartContext();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || !isInStock || isAdding) return;

    setIsAdding(true);
    const result = await addItem(variantId, 1, price);
    if (!result?.error) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
    setIsAdding(false);
  };

  return (
    <article className={styles["product-card"]}>
      <span className={styles["product-category-chip"]}>
        <i />
        {categoryName ?? "Specimen"}
      </span>
      <span className={styles["product-card-node"]} aria-hidden="true">◇</span>

      <Link href={href} className={styles["product-image"]} aria-label={title}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 22vw"
            className="object-cover"
            priority={priority}
          />
        )}
      </Link>

      <div className={styles["product-info"]}>
        <p>U-{String(index + 1).padStart(2, "0")} / {categoryName ?? "Specimen"}</p>
        <h3>
          <Link href={href}>{title}</Link>
        </h3>
        <div className={styles["product-bottom"]}>
          <span>
            <small>DÈS</small>
            {price.toFixed(2)} €
          </span>
          {variantId && (
            <button
              onClick={handleAddToCart}
              disabled={!isInStock || isAdding}
              className={styles["product-add"]}
              data-state={added ? "added" : isInStock ? "idle" : "disabled"}
              aria-label={isInStock ? "Ajouter au panier" : "Rupture de stock"}
            >
              {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

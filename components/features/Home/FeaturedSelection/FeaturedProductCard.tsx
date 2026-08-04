"use client";

import { useCartContext } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Check, Heart, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./FeaturedSelection.module.css";

interface FeaturedProductCardProps {
  index: number;
  title: string;
  price: number;
  stock: number;
  imageUrl?: string;
  href: string;
  variantId?: string;
  productId?: string;
  priority?: boolean;
  categoryName?: string;
}

// Carte produit thème clair, fidèle à la maquette (fond blanc, prix + ajout panier).
export function FeaturedProductCard({
  index,
  title,
  price,
  stock,
  imageUrl,
  href,
  variantId,
  productId,
  priority = false,
  categoryName,
}: FeaturedProductCardProps) {
  const isInStock = stock > 0;
  const { addItem } = useCartContext();
  const { isFavorite, toggle } = useFavorites();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const wishlisted = productId ? isFavorite(productId) : false;

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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (productId) toggle(productId);
  };

  return (
    <Link href={href} className={styles["product-card"]}>
      <span className={styles["product-category-chip"]}>
        <i />
        {categoryName ?? "Espèce"}
      </span>
      <button
        onClick={handleWishlist}
        className={styles["product-card-node"]}
        data-active={wishlisted}
        aria-label={wishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
      >
        <Heart className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} />
      </button>

      <div className={styles["product-image"]}>
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
      </div>

      <div className={styles["product-info"]}>
        <p>U-{String(index + 1).padStart(2, "0")} / {categoryName ?? "Espèce"}</p>
        <h3>{title}</h3>
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
    </Link>
  );
}

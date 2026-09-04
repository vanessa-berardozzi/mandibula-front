"use client";

import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { useCartContext } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { formatPrice } from "@/lib/priceUtils";
import { Check, Heart, Plus } from "lucide-react";
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
  productId?: string;
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
  productId,
  variantId,
  priority = false,
  categoryName,
}: FeaturedProductCardProps) {
  const isInStock = stock > 0;
  const { addItem } = useCartContext();
  const { isFavorite, toggle } = useFavorites();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  
  const wishlisted = productId ? isFavorite(productId) : false;

  const handleQuantitySelect = (quantity: number) => {
    setSelectedQuantity(quantity);
  };

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!variantId || !isInStock || isAdding) return;

    setIsAdding(true);
    const result = await addItem(variantId, selectedQuantity, price);
    if (!result?.error) {
      setAdded(true);
      setShowQuantitySelector(false);
      setSelectedQuantity(1);
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
    <article className={styles["product-card"]}>
      <span className={styles["product-category-chip"]}>
        <i />
        {categoryName ?? "Specimen"}
      </span>
      <button
        type="button"
        onClick={handleWishlist}
        className={styles["product-card-node"]}
        data-active={wishlisted}
        aria-label={wishlisted ? "Retirer de la wishlist" : "Ajouter a la wishlist"}
      >
        <Heart className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} />
      </button>

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
            {formatPrice(price)} €
          </span>
          {variantId && (
            <div className="flex items-center gap-2">
              {showQuantitySelector ? (
                <>
                  <QuantitySelector
                    maxStock={stock}
                    onQuantityChange={handleQuantitySelect}
                    initialQuantity={selectedQuantity}
                    disabled={isAdding}
                    size="sm"
                    compact
                  />
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAdding}
                    className={styles["product-add"]}
                    data-state={added ? "added" : isInStock ? "idle" : "disabled"}
                    aria-label="Confirmer l'ajout au panier"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowQuantitySelector(true);
                  }}
                  disabled={!isInStock || isAdding}
                  className={styles["product-add"]}
                  data-state={added ? "added" : isInStock ? "idle" : "disabled"}
                  aria-label={isInStock ? "Ajouter au panier" : "Rupture de stock"}
                >
                  {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

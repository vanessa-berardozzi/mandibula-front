"use client";

import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { useCartContext } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { formatPrice } from "@/lib/priceUtils";
import { Check, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./SimpleProductCard.module.css";

interface SimpleProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl?: string;
  href?: string;
  variantId?: string;
  productId?: string;
  priority?: boolean;
  categoryName?: string;
  categorySlug?: string;
  pricingCategoryName?: string;
  vatCategory?: "STANDARD_GOODS" | "LIVE_ANIMALS";
}

export function SimpleProductCard({
  title,
  price,
  originalPrice,
  stock,
  imageUrl,
  href = "/product",
  variantId,
  productId,
  priority = false,
  categoryName,
  categorySlug,
  pricingCategoryName,
  vatCategory,
}: SimpleProductCardProps) {
  const isInStock = stock > 0;
  const categoryIdentifier = `${categoryName ?? ""} ${categorySlug ?? ""} ${pricingCategoryName ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
  const displaysStartingPrice =
    vatCategory === "LIVE_ANIMALS" ||
    categoryIdentifier.includes("animaux") ||
    categoryIdentifier.includes("substrat") ||
    categoryIdentifier.includes("pack");
  const { addItem } = useCartContext();
  const { isFavorite, toggle } = useFavorites();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
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
    if (!variantId || !isInStock) return;

    setIsAdding(true);
    setStockError(null);
    const result = await addItem(variantId, selectedQuantity, price);
    if (result?.error) {
      setStockError(result.error);
      setTimeout(() => setStockError(null), 3000);
    } else {
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
      <div className={styles["product-card__meta"]}>
        <span className={styles["product-card__chip"]}>
          <span className={styles["product-card__chip-dot"]} />
          {categoryName ?? "Produit"}
        </span>

        <button
          type="button"
          onClick={handleWishlist}
          className={styles["product-card__node"]}
          data-active={wishlisted}
          aria-label={wishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
        >
          <Heart className="h-3.5 w-3.5" fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <Link href={href} className={styles["product-card__image-link"]} aria-label={title}>
        <span
          className={styles["product-card__availability"]}
          data-available={isInStock}
        >
          <span aria-hidden="true" />
          {isInStock ? "Disponible" : "Indisponible"}
        </span>
        <div className={styles["product-card__image-frame"]}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={styles["product-card__image"]}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
                <svg className="h-8 w-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className={styles["product-card__footer"]}>
        <h3 className={styles["product-card__title"]}>
          <Link href={href}>{title}</Link>
        </h3>

        <div className={styles["product-card__buy"]}>
          <div className={styles["product-card__price-row"]}>
            {displaysStartingPrice && (
              <span className={styles["product-card__price-prefix"]}>À partir de</span>
            )}
            <span className={styles["product-card__prices"]}>
              {originalPrice !== undefined && originalPrice > price && (
                <span className={styles["product-card__price--original"]}>{formatPrice(originalPrice)}€</span>
              )}
              <span className={styles["product-card__price"]}>{formatPrice(price)}</span>
              <span className={styles["product-card__currency"]}>€</span>
            </span>
          </div>

          {variantId && (
            <div className={styles["product-card__actions"]}>
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
                    className={styles["product-card__add"]}
                    data-state={added ? "added" : isInStock ? "idle" : "disabled"}
                    aria-label="Confirmer l'ajout au panier"
                  >
                    {isAdding ? (
                      <span className={styles["product-card__spinner"]} />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQuantitySelector(true)}
                  disabled={!isInStock || isAdding}
                  className={styles["product-card__choose"]}
                  data-state={added ? "added" : isInStock ? "idle" : "disabled"}
                >
                  {added ? "Ajouté" : "Choisir"}
                </button>
              )}
            </div>
          )}
        </div>

        {isInStock && stock <= 3 && (
          <p className={styles["product-card__notice"]}>Stock limité</p>
        )}
        {stockError && (
          <p className={`${styles["product-card__notice"]} ${styles["product-card__notice--error"]}`}>
            {stockError}
          </p>
        )}
      </div>
    </article>
  );
}


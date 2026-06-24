"use client";

import { useCartContext } from "@/context/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Check, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface SimpleProductCardProps {
  title: string;
  price: number;
  stock: number;
  imageUrl?: string;
  href?: string;
  variantId?: string;
  productId?: string;
  priority?: boolean;
  categoryName?: string;
}

export function SimpleProductCard({
  title,
  price,
  stock,
  imageUrl,
  href = "/product",
  variantId,
  productId,
  priority = false,
  categoryName,
}: SimpleProductCardProps) {
  const isInStock = stock > 0;
  const { addItem } = useCartContext();
  const { isFavorite, toggle } = useFavorites();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const wishlisted = productId ? isFavorite(productId) : false;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || !isInStock) return;

    setIsAdding(true);
    setStockError(null);
    const result = await addItem(variantId, 1, price);
    if (result?.error) {
      setStockError(result.error);
      setTimeout(() => setStockError(null), 3000);
    } else {
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
    <Link
      href={href}
      className="group block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        className="relative w-full h-full overflow-hidden transition-all duration-300"
        style={{
          aspectRatio: "3 / 4",
          clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Fond avec glassmorphism */}
        <div className="absolute inset-0 bg-linear-to-b from-card/80 via-card/60 to-card/90 backdrop-blur-md" />

        {/* Bordure animée */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            padding: "1.5px",
            background: isHovered
              ? "linear-gradient(135deg, #92cc0a 0%, #00d4aa 50%, #92cc0a 100%)"
              : "linear-gradient(135deg, #2a5a3c 0%, #163c2a 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow: isHovered
              ? "0 0 20px rgba(146, 204, 10, 0.4), 0 8px 25px rgba(0, 0, 0, 0.6)"
              : "0 0 8px rgba(42, 90, 60, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
        />

        {/* Corners décoratifs */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary z-20 opacity-80" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary z-20 opacity-80" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary z-20 opacity-80" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary z-20 opacity-80" />

        {/* Scan lines subtiles */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(146, 204, 10, 0.1) 0px, rgba(146, 204, 10, 0.1) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Contenu */}
        <div className="relative h-full flex flex-col z-10">
          {/* En-tête avec catégorie */}
          {categoryName && (
            <div className="absolute top-2 left-2 z-30">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-black/70 backdrop-blur-sm border border-primary/50 rounded-sm">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-[9px] font-black uppercase tracking-widest">
                  {categoryName}
                </span>
              </div>
            </div>
          )}

          {/* Bouton favoris */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 z-30 w-7 h-7 flex items-center justify-center transition-all duration-200"
            style={{
              background: wishlisted ? "rgba(255, 77, 109, 0.15)" : "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: "50%",
              border: `1.5px solid ${wishlisted ? "#ff4d6d" : "rgba(146, 204, 10, 0.3)"}`,
              boxShadow: wishlisted ? "0 0 12px rgba(255, 77, 109, 0.6)" : "0 0 6px rgba(0, 0, 0, 0.3)",
            }}
            aria-label={wishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
          >
            <Heart
              className="w-3.5 h-3.5 transition-all duration-200"
              style={{
                color: wishlisted ? "#ff4d6d" : "rgba(146, 204, 10, 0.7)",
                fill: wishlisted ? "#ff4d6d" : "transparent",
                filter: wishlisted ? "drop-shadow(0 0 4px #ff4d6d)" : "none",
              }}
            />
          </button>

          {/* Zone image (occupe la majorité de l'espace) */}
          <div className="relative flex-1 overflow-hidden">
            {imageUrl ? (
              <>
                {/* Halo lumineux au sol */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-xl rounded-full z-10"
                  style={{ opacity: isHovered ? 0.4 : 0.25 }}
                />
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-contain p-4 transition-transform duration-500"
                  style={{
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                    filter: isHovered
                      ? "drop-shadow(0 0 25px rgba(146, 204, 10, 0.5))"
                      : "drop-shadow(0 0 15px rgba(146, 204, 10, 0.25))",
                  }}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  priority={priority}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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

          {/* Barre inférieure avec nom, prix et actions */}
          <div
            className="relative px-2.5 pt-2 pb-2.5 bg-linear-to-t from-black/90 via-black/80 to-transparent backdrop-blur-sm border-t border-primary/20"
            style={{
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Ligne décorative */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

            {/* Nom du produit */}
            <h3 className="text-sm font-bold text-foreground uppercase tracking-tight line-clamp-1 mb-1.5 leading-tight">
              {title}
            </h3>

            {/* Prix et bouton panier */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-primary font-mono tabular-nums leading-none">
                  {price.toFixed(2)}
                </span>
                <span className="text-xs text-primary/70 font-bold">€</span>
              </div>

              {variantId && (
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-200 rounded-sm"
                  style={{
                    background: added
                      ? "rgba(146, 204, 10, 0.2)"
                      : isInStock
                      ? "rgba(146, 204, 10, 0.1)"
                      : "rgba(100, 100, 100, 0.1)",
                    border: `1.5px solid ${
                      added ? "#92cc0a" : isInStock ? "rgba(146, 204, 10, 0.4)" : "rgba(100, 100, 100, 0.3)"
                    }`,
                    color: added ? "#92cc0a" : isInStock ? "#e4f7de" : "#666",
                    boxShadow: added
                      ? "0 0 12px rgba(146, 204, 10, 0.5)"
                      : isHovered && isInStock
                      ? "0 0 8px rgba(146, 204, 10, 0.3)"
                      : "none",
                    cursor: isInStock ? "pointer" : "not-allowed",
                    opacity: isInStock ? 1 : 0.4,
                  }}
                  aria-label={isInStock ? "Ajouter au panier" : "Rupture de stock"}
                >
                  {isAdding ? (
                    <div className="w-3 h-3 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  ) : added ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <ShoppingCart className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {added ? "Ajouté" : isInStock ? "Panier" : "Épuisé"}
                  </span>
                </button>
              )}
            </div>

            {/* Indicateur de stock faible */}
            {isInStock && stock <= 3 && (
              <div className="mt-1.5 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-[10px] text-orange-400/90 font-mono uppercase tracking-wider">
                  Stock limité
                </span>
              </div>
            )}
            {stockError && (
              <div className="mt-1.5 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[10px] text-red-400 font-mono uppercase tracking-wider">
                  {stockError}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Effet shine au survol */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              animation: "shine 1.2s ease-in-out",
              background:
                "linear-gradient(105deg, transparent 40%, rgba(146, 204, 10, 0.08) 50%, transparent 60%)",
            }}
          />
        )}

        {/* Glow extérieur */}
        <div
          className="absolute inset-0 -z-10 blur-xl transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(146, 204, 10, 0.15), transparent 70%)",
            opacity: isHovered ? 1 : 0.3,
          }}
        />
      </article>

      {/* Keyframe pour l'animation shine */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Link>
  );
}

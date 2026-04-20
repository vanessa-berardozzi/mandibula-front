"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { useSession } from "@/lib/auth.client";
import { Check, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  title: string;
  price: number;
  stock: number;
  imageUrl?: string;
  href?: string;
  variantId?: string;
  priority?: boolean;
}

export function ProductCard({ title, price, stock, imageUrl, href = "/product", variantId, priority = false }: ProductCardProps) {
  const isInStock = stock > 0;
  const availabilityLabel = isInStock ? `${stock} en stock` : "Epuisé";
  
  const { data: session } = useSession();
  const { addItem } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variantId || !session?.user) {
      if (!session?.user) {
        window.location.href = "/login";
      }
      return;
    }

    if (!isInStock) return;

    setIsAdding(true);
    try {
      await addItem(variantId, 1, price);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const cardContent = (
    <div
      className="relative bg-card/20 backdrop-blur-md border border-primary/60 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(146,204,10,0.2)] group-hover:shadow-[0_0_30px_rgba(146,204,10,0.45)] transition-all duration-500 group-hover:-translate-y-1"
      style={{
        clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)"
      }}
    >
      {/* Coins décoratifs néon */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary z-10" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary z-10" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary z-10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary z-10" />

      {/* Ligne d'accent néon en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-90 z-10" />

      {/* === ZONE IMAGE === */}
      <div className="relative w-full aspect-square overflow-hidden bg-accent/30">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Scan lines gaming overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, rgba(146,204,10,0.06) 0px, rgba(146,204,10,0.06) 1px, transparent 1px, transparent 4px)"
          }}
        />

        {/* Gradient fade bas de l'image vers la card */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card/90 to-transparent" />

        {/* Badge stock superposé sur l'image */}
        {!isInStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="font-mono font-black text-destructive tracking-[0.2em] uppercase text-sm bg-black px-3 py-1 shadow-[0_0_14px_rgba(204,21,21,0.8)]">
              Épuisé
            </span>
          </div>
        )}

        {/* Badge stock dispo en haut à droite */}
        {isInStock && (
          <div className="absolute top-2 right-2 z-10">
            <span className="font-mono text-[10px] font-bold text-primary bg-card/80 backdrop-blur-sm border border-primary/40 px-1.5 py-0.5 tracking-widest">
              {stock} EN STOCK
            </span>
          </div>
        )}
      </div>

      {/* === INFOS PRODUIT === */}
      <div className="p-2 flex flex-col gap-1.5">
        {/* Séparateur néon */}
        <div className="h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        <h3 className="text-xs font-bold text-foreground uppercase tracking-tight line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Prix + bouton panier */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-black text-primary tracking-tight font-mono leading-none drop-shadow-[0_0_6px_rgba(146,204,10,0.6)]">
              {price.toFixed(2)}
            </span>
            <span className="text-sm text-primary/70 font-bold">€</span>
          </div>

          {variantId ? (
            <Button
              onClick={handleAddToCart}
              disabled={!isInStock || isAdding}
              size="icon"
              className={`shrink-0 transition-all ${
                added
                  ? "bg-primary/30 text-primary shadow-[0_0_15px_rgba(146,204,10,0.5)]"
                  : "shadow-[0_0_8px_rgba(146,204,10,0.3)] hover:shadow-[0_0_18px_rgba(146,204,10,0.6)]"
              } ${!isInStock ? "opacity-40 cursor-not-allowed" : ""}`}
              title={isInStock ? "Ajouter au panier" : "Produit épuisé"}
            >
              {isAdding ? (
                <div className="w-4 h-4 animate-spin border border-current border-t-transparent rounded-full" />
              ) : added ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <Button
              asChild
              size="icon"
              className="shrink-0 shadow-[0_0_8px_rgba(146,204,10,0.3)] hover:shadow-[0_0_18px_rgba(146,204,10,0.6)]"
            >
              <span aria-hidden="true" tabIndex={-1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Ligne décorative néon en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-90" />
    </div>
  );

  if (!href) {
    return <div className="group relative">{cardContent}</div>;
  }

  return (
    <Link
      href={href}
      className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Voir la fiche produit de ${title}`}
    >
      {cardContent}
    </Link>
  );
}

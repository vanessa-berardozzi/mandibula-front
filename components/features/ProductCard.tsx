"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  title: string;
  price: number;
  stock: number;
  imageUrl?: string;
  href?: string;
}

export function ProductCard({ title, price, stock, imageUrl, href = "/product" }: ProductCardProps) {
  const isInStock = stock > 0;
  const availabilityLabel = isInStock ? `${stock} en stock` : "Epuisé";

  const cardContent = (
    <div
      className="relative bg-card/20 backdrop-blur-md border border-primary/80 rounded-sm overflow-hidden shadow-[0_0_15px_rgba(202,226,197,0.3)] group-hover:shadow-[0_0_25px_rgba(202,226,197,0.5)] transition-all duration-300"
      style={{
        clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
      }}
    >
      {/* Coins décoratifs néon */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary" />
      
      {/* Ligne d'accent néon en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-90" />
      
      {/* Contenu de la card - Layout horizontal compact */}
      <div className="flex items-center gap-3 p-3">
        {/* Zone image produit - Petite à gauche */}
        <div className="relative shrink-0 w-20 h-20">
          <div className="absolute inset-0 bg-accent/30 backdrop-blur-sm rounded border border-primary/40 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt={title}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg 
                className="w-8 h-8 text-primary/40" 
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
            )}
          </div>
        </div>

        {/* Informations produit - À droite */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground leading-tight uppercase tracking-tight line-clamp-1">
              {title}
            </h3>
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${isInStock ? "text-primary/75" : "text-muted-foreground"}`}>
              {availabilityLabel}
            </p>
          </div>

          {/* Prix et bouton */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-primary tracking-tight font-mono">
                {price.toFixed(2)}
              </span>
              <span className="text-sm text-primary/70 font-bold">€</span>
            </div>
            
            <Button 
              asChild
              size="icon"
              className="shrink-0 shadow-[0_0_10px_rgba(202,226,197,0.3)] hover:shadow-[0_0_15px_rgba(202,226,197,0.5)]" 
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
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </span>
            </Button>
          </div>
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

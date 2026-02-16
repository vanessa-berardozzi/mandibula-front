"use client";

import { ProductCard } from "@/components/features/ProductCard";

const PRODUCTS = [
  {
    title: "Module de Survie BioLux",
    price: 149.99,
    stock: 12,
  },
  {
    title: "Scanner Radiologique NeonX",
    price: 299.99,
    stock: 3,
  },
  {
    title: "Armure Végétale Renforcée",
    price: 499.99,
    stock: 8,
  },
  {
    title: "Générateur BioÉnergie Compact",
    price: 399.99,
    stock: 0,
  },
  {
    title: "Kit de Purification H2O-Tech",
    price: 199.99,
    stock: 15,
  },
  {
    title: "Drone d'Exploration Jungle",
    price: 599.99,
    stock: 5,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-12">
      {/* Header hero avec cadre néon */}
      <div className="container mx-auto px-4 pb-8">
        <div className="relative mb-8">
          <div 
            className="relative p-8 md:p-12 bg-card/15 backdrop-blur-md border-2 border-primary/60 rounded-sm shadow-[0_0_30px_rgba(202,226,197,0.4)]"
            style={{
              clipPath: "polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)"
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
                Mandibula <span className="text-primary drop-shadow-[0_0_10px_rgba(202,226,197,0.6)]">Shop</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
                Boutique spécialisée en isopodes, blattes et invertébrés pour terrariums
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section produits - Grille de 3 colonnes */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, index) => (
            <div 
              key={index}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

"use client";

import { HologramDisplay } from "@/components/features/HologramDisplay";
import { InvertebreCard } from "@/components/features/InvertebreCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Type de produit
type ProductType = "invertebré" | "matériel";

// Données de démo - à remplacer par des vraies données
const PRODUCT_DEMO = {
  id: "1",
  name: "Isopode Armadillidium Vulgare",
  price: 12.99,
  type: "invertebré" as ProductType, // Changez en "matériel" pour voir l'hologramme
  imageUrl: "/boite.png",
  description: "Espèce robuste et facile d'entretien, idéale pour débuter. Ces isopodes sont parfaits pour maintenir l'humidité dans les terrariums et aider à la décomposition.",
  details: [
    "Taille adulte : 10-15mm",
    "Température : 18-24°C",
    "Humidité : 60-80%",
    "Reproduction : Très facile",
    "Origine : Europe",
  ],
  // Stats pour InvertebreCard
  difficulty: "Facile",
  difficultyLevel: 1,
  origin: "Europe",
  breedingConditions: {
    temperature: "18-24°C",
    humidity: "60-80%",
    substrate: "Terre/coco fiber + feuilles mortes",
    feeding: "Feuilles mortes, légumes",
  },
  stock: 25,
  category: "Isopodes",
};

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const product = PRODUCT_DEMO;

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Colonne gauche - Affichage selon le type de produit */}
          <div className="relative flex justify-center">
            {product.type === "invertebré" ? (
              <InvertebreCard
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
                category={product.category}
                origin={product.origin}
                difficulty={product.difficulty}
                difficultyLevel={product.difficultyLevel}
                breedingConditions={product.breedingConditions}
              />
            ) : (
              <HologramDisplay 
                imageUrl={product.imageUrl}
                productName={product.name}
                autoRotate={true}
              />
            )}
          </div>

          {/* Colonne droite - Informations produit */}
          <div className="space-y-6">
            {/* En-tête produit */}
            <div 
              className="p-6 bg-card/30 backdrop-blur-md border border-primary/60 rounded-sm shadow-[0_0_20px_rgba(202,226,197,0.3)]"
              style={{
                clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
              }}
            >
              {/* Coins décoratifs */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary" />
              
              <div className="relative space-y-4">
                {/* Catégorie */}
                <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/50 text-primary text-xs font-bold uppercase tracking-wider rounded">
                  {product.category}
                </span>

                {/* Nom du produit */}
                <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">
                  {product.name}
                </h1>

                {/* Prix */}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-primary font-mono tracking-tight">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-2xl text-primary/70 font-bold">€</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div 
              className="p-6 bg-card/20 backdrop-blur-sm border border-primary/40 rounded-sm"
              style={{
                clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)"
              }}
            >
              <h2 className="text-xl font-bold text-foreground uppercase tracking-tight mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary" />
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Caractéristiques */}
            <div 
              className="p-6 bg-card/20 backdrop-blur-sm border border-primary/40 rounded-sm"
              style={{
                clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)"
              }}
            >
              <h2 className="text-xl font-bold text-foreground uppercase tracking-tight mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary" />
                Caractéristiques
              </h2>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-primary mt-1">▸</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantité et Achat */}
            <div 
              className="p-6 bg-card/30 backdrop-blur-md border-2 border-primary/60 rounded-sm shadow-[0_0_25px_rgba(202,226,197,0.4)]"
              style={{
                clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
              }}
            >
              <div className="space-y-4">
                {/* Sélecteur de quantité */}
                <div>
                  <label className="block text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="border-primary/50 hover:bg-primary/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </Button>
                    
                    <span className="text-2xl font-bold text-primary font-mono w-12 text-center">
                      {quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="border-primary/50 hover:bg-primary/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>

                    <span className="ml-auto text-sm text-muted-foreground">
                      {product.stock} disponibles
                    </span>
                  </div>
                </div>

                {/* Bouton Ajouter au panier */}
                <Button 
                  className="w-full py-6 text-lg font-black uppercase tracking-widest shadow-[0_0_25px_rgba(202,226,197,0.5)] hover:shadow-[0_0_40px_rgba(202,226,197,0.7)]"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-5 h-5 mr-2"
                  >
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Ajouter au panier
                </Button>

                {/* Total */}
                <div className="pt-4 border-t border-primary/30 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-3xl font-black text-primary font-mono">
                    {(product.price * quantity).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info pour tester */}
        <div className="mt-12 p-4 bg-primary/10 border border-primary/30 rounded text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-primary">Type de produit :</strong> {product.type} 
            <span className="mx-2">•</span>
            Changez <code className="px-2 py-1 bg-card/50 text-primary rounded">type</code> dans le code pour tester l&#39;autre affichage
          </p>
        </div>
      </div>
    </main>
  );
}

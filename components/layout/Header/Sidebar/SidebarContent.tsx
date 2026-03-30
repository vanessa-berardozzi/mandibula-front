"use client";

import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth.client";
import { Bug, ChevronDown, ChevronRight, Home, Package, Search, ShoppingBag, User, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Configuration des sections de navigation
const navigationItems = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: ShoppingBag, label: "Boutique", href: "/shop" },
  { icon: Package, label: "Nouveautés", href: "/nouveautes" },
];

const accountItems = [
  { icon: User, label: "Mon Profil", href: "/profile" },
  { icon: Package, label: "Mes Commandes", href: "/orders" },
];

// Configuration des catégories avec couleurs personnalisées et icônes
const categories = [
  {
    id: "isopodes",
    name: "Isopodes",
    icon: Bug,
    color: "#22c56e", 
    subcategories: [
      { name: "Débutant", href: "/categories/isopodes/debutant" },
      { name: "Intermédiaire", href: "/categories/isopodes/intermediaire" },
      { name: "Expert", href: "/categories/isopodes/expert" }
    ]
  },
  {
    id: "blattes",
    name: "Blattes",
    icon: Bug,
    color: "#7ba996", 
    subcategories: [
      { name: "Débutant", href: "/categories/blattes/debutant" },
      { name: "Intermédiaire", href: "/categories/blattes/intermediaire" },
      { name: "Expert", href: "/categories/blattes/expert" }
    ]
  },
  {
    id: "accessoires",
    name: "Accessoires",
    icon: Zap,
    color: "#00d492", 
    subcategories: [
      { name: "Terrariums", href: "/categories/accessoires/terrariums" },
      { name: "Substrats", href: "/categories/accessoires/substrats" },
      { name: "Décoration", href: "/categories/accessoires/decoration" },
      { name: "Nourriture", href: "/categories/accessoires/nourriture" }
    ]
  }
];

export function SidebarContent() {
  const { data: session } = useSession();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Effet de scan lines */}
      <div className="scan-lines absolute inset-0 pointer-events-none opacity-10" />
      
      {/* Header avec effet glitch */}
      <div className="border-b border-primary/30 pb-4 pt-5 px-4 relative">
        <h2 className="text-xl font-bold text-primary tracking-wider glitch-text">
          MANDIBULA
        </h2>
        <p className="text-[10px] text-primary/70 tracking-widest font-mono mt-1">
          SYSTÈME_V2.48.2
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Rechercher..."
            className="pl-10 bg-black/40 border-primary/20 text-foreground placeholder:text-primary/40 focus:border-primary/50 hover:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Contenu avec scroll */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        
        {/* SECTION NAVIGATION */}
        <div className="space-y-2">
          {/* Titre de section */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            <h3 className="text-[10px] font-mono text-primary/80 tracking-widest px-2">
              NAVIGATION
            </h3>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          
          {/* Items de navigation */}
          <div className="space-y-1">
            {navigationItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-primary/20 bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 hover:translate-x-1 gaming-menu-item"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="relative shrink-0">
                    <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-foreground font-medium text-sm tracking-wide hover:neon-glow transition-colors">
                    {item.label}
                  </span>
                  <span className="ml-auto text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all text-xs">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION CATÉGORIES */}
        <div className="space-y-2">
          {/* Titre de section */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            <h3 className="text-[10px] font-mono text-primary/80 tracking-widest px-2">
              CATÉGORIES
            </h3>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
          </div>

          {/* Items des catégories */}
          <div className="space-y-2">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              const isOpen = openCategory === category.id;
              
              return (
                <div key={category.id} className="space-y-1">
                  {/* Bouton de catégorie principale */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="group w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition-all duration-200 hover:translate-x-1 gaming-menu-item"
                    style={{ 
                      background: `linear-gradient(to right, ${category.color}70, ${category.color}33)`,
                      borderColor: `${category.color}30`,
                      boxShadow: `0 4px 10px -2px ${category.color}40`,
                      animationDelay: `${(3 + idx) * 80}ms` 
                    }}
                  >
                    {/* Icône avec effet néon */}
                    <div className="relative shrink-0">
                      <Icon 
                        className="w-5 h-5 transition-transform group-hover:scale-110" 
                        style={{ color: category.color }}
                      />
                      {/* Glow effect au hover */}
                      <div 
                        className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: `${category.color}50` }}
                      />
                    </div>
                    
                    {/* Nom de la catégorie */}
                    <span 
                      className="flex-1 text-left font-medium text-sm tracking-wide transition-colors hover:neon-glow"
                      style={{ 
                        color: '#e4f7de'
                      }}
                    >
                      {category.name}
                    </span>
                    
                    {/* Chevron animé */}
                    <div className="shrink-0">
                      {isOpen ? (
                        <ChevronDown 
                          className="w-4 h-4 transition-all group-hover:translate-y-0.5" 
                          style={{ color: category.color }}
                        />
                      ) : (
                        <ChevronRight 
                          className="w-4 h-4 transition-all group-hover:translate-x-0.5" 
                          style={{ color: category.color }}
                        />
                      )}
                    </div>
                  </button>

                  {/* Sous-catégories avec animation slide */}
                  {isOpen && (
                    <div className="ml-6 mt-2 space-y-1 border-l-2 pl-3" style={{ borderColor: `${category.color}40` }}>
                      {category.subcategories.map((subcat, subIdx) => (
                        <Link
                          key={subcat.href}
                          href={subcat.href}
                          className="group flex items-center gap-3 px-3 py-2 rounded-md border transition-all duration-200 hover:translate-x-1"
                          style={{ 
                            background: `linear-gradient(to right, ${category.color}40, ${category.color}20)`,
                            borderColor: `${category.color}20`,
                            animationDelay: `${(idx * 3 + subIdx) * 40}ms` 
                          }}
                        >
                          {/* Point indicateur */}
                          <div 
                            className="w-1.5 h-1.5 rounded-full transition-all group-hover:scale-150"
                            style={{ 
                              backgroundColor: category.color,
                              boxShadow: `0 0 8px ${category.color}80`
                            }}
                          />
                          
                          {/* Nom de la sous-catégorie */}
                          <span 
                            className="flex-1 text-sm tracking-wide transition-colors hover:neon-glow"
                            style={{ 
                              color: '#e4f7de'
                            }}
                          >
                            {subcat.name}
                          </span>
                          
                          {/* Flèche animée */}
                          <span 
                            className="text-xs transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                            style={{ color: category.color }}
                          >
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION COMPTE - visible uniquement si connecté */}
        {session?.user && <div className="space-y-2">
          {/* Titre de section */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            <h3 className="text-[10px] font-mono text-primary/80 tracking-widest px-2">
              COMPTE
            </h3>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          
          {/* Items de compte */}
          <div className="space-y-1">
            {accountItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-primary/20 bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 hover:translate-x-1 gaming-menu-item"
                  style={{ animationDelay: `${(6 + idx) * 60}ms` }}
                >
                  <div className="relative shrink-0">
                    <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-foreground font-medium text-sm tracking-wide hover:neon-glow transition-colors">
                    {item.label}
                  </span>
                  <span className="ml-auto text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all text-xs">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>}
      </div>

      {/* Footer avec info système */}
      <div className="border-t border-primary/30 p-3 bg-black/40">
        <div className="flex items-center justify-between text-[10px] font-mono text-primary/60">
          <span>STATUS: ONLINE</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            CONNECTED
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import AuthSheet from "@/components/auth/AuthSheet";
import { Input } from "@/components/ui";
import { Search, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // --- AuthSheet ouvert/fermé, persistant sur refresh ---
  const [authOpen, setAuthOpen] = useState(() => {
    // On lit la valeur du localStorage au premier rendu (coté client)
    if (typeof window !== "undefined") {
      return localStorage.getItem("authSheetOpen") === "true";
    }
    return false;
  });

  // À chaque changement d'ouverture, on sauvegarde dans localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authSheetOpen", authOpen ? "true" : "false");
    }
  }, [authOpen]);
  // ------------------------------------------------------

  return (
    <nav aria-label="Navigation principale">
      <div className="flex items-center justify-between w-full bg-black/30 backdrop-blur-lg px-6 py-3 border-b border-black/10 shadow-md">
        
        {/* Espace à gauche pour équilibrer avec les icônes à droite */}
        <div className="flex-1 flex justify-start items-center gap-4">
          {/* Espace vide pour centrer le logo */}
        </div>

        {/* Logo centré */}
        <div className="flex-1 flex justify-center ">
          <Link href="/">
            <Image
              src="/logo_lg_neon.png"
              alt="Mandibula Logo"
              width={60}
              height={60}
              className="mx-auto "
            />
          </Link>
        </div>

        {/* Search, Cart, Profile à droite */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {/* Champ de recherche */}
          {isSearchOpen ? (
            <div className="flex items-center gap-2 animate-in slide-in-from-right duration-200">
              <Input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder={searchValue.length === 0 ? "Rechercher..." : ""}
                autoFocus
              
                className="w-50 px-4 py-2 rounded-md border-neon-glow"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                aria-label="Fermer la recherche"
              >
                <X className="w-6 h-6 icon-foreground icon-neon-hover" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Recherche"
            >
              <Search className="w-6 h-6 icon-foreground icon-neon-hover" />
            </button>
          )}
          
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6 icon-foreground icon-neon-hover" />
          </Link>
          <button onClick={() => setAuthOpen(true)} aria-label="Profil / Auth">
            <User className="w-6 h-6 icon-foreground icon-neon-hover" />
          </button>
        </div>
      </div>
      {/*
        AuthSheet :
        - open = état d'ouverture (persisté)
        - onOpenChange = met à jour l'état et donc le localStorage
      */}
      <AuthSheet open={authOpen} onOpenChange={setAuthOpen} mode="login" />
    </nav>
  );
}

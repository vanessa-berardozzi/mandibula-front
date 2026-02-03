'use client';

import { Search, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder={searchValue.length === 0 ? "Rechercher..." : ""}
                autoFocus
                style={{ color: 'var(--foreground)' }}
                className="w-50 px-4 py-2 rounded-md bg-emerald-100/20 border border-emerald-500/20 placeholder-(--foreground) focus:outline-none focus:border-primary transition"
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
          <Link href="/profile">
            <User className="w-6 h-6 icon-foreground icon-neon-hover" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

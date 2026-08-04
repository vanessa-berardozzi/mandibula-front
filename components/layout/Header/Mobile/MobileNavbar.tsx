'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCartContext } from "@/context/CartContext";
import { Menu, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';

export function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount: cartCount } = useCartContext();

  return (
    <nav 
      aria-label="Navigation mobile principale" 
      className="relative"
    >
      <div className="flex h-16 items-center justify-between w-full border-b border-line bg-[rgba(5,9,7,0.95)] px-4 backdrop-blur-xl">
        
        {/* Burger Menu à gauche avec effet néon pulsant */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button 
              className="relative p-2 rounded-md hover:bg-primary/10 transition-all duration-200 group"
              aria-label="Menu principal"
            >
              <Menu className="w-6 h-6 text-primary icon-neon-hover group-hover:scale-110 transition-transform" />
              {/* Effet de pulsation */}
              <span className="absolute inset-0 rounded-md bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[85%] max-w-sm bg-sidebar backdrop-blur-xl border-r border-primary/30 p-0 hologram-border"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu principal</SheetTitle>
              <SheetDescription>Navigation principale du site</SheetDescription>
            </SheetHeader>
            <MobileMenu onClose={() => setMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Logo centré */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image
                src="/mandibula-logo.png"
                alt="Mandibula Logo"
                width={36}
                height={36}
                style={{ width: '36px', height: 'auto' }}
                priority
              />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
              Mandibula
            </span>
          </Link>
        </div>

        {/* Badge Panier à droite */}
        <Link 
          href="/cart" 
          className="relative p-2 rounded-md hover:bg-primary/10 transition-all duration-200 group"
          aria-label={`Panier (${cartCount} articles)`}
        >
          <ShoppingCart className="w-6 h-6 text-primary icon-neon-hover group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-primary rounded-full border-2 border-black gaming-badge">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
          {/* Effet de pulsation */}
          <span className="absolute inset-0 rounded-md bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </nav>
  );
}

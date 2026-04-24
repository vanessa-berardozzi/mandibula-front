'use client'

import { UserAvatar, useUserAvatar } from "@/components/shared"
import { Input } from "@/components/ui"
import { useCartContext } from "@/context/CartContext"
import { Search, ShoppingCart, User, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * Avatar utilisateur pour la navbar - version ronde et petite
 */
function NavbarUserAvatar() {
  const { isAuthenticated, isLoading } = useUserAvatar();
  const router = useRouter();

  if (isLoading) {
    return <div className="w-9 h-9 rounded-full bg-primary/20 animate-pulse" />;
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        aria-label="Se connecter"
        className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-primary/50 hover:border-primary/80 bg-black/50 hover:bg-primary/10 transition-all hover:scale-110"
      >
        <User className="w-4 h-4 text-primary" />
      </button>
    );
  }

  return (
    <Link
      href="/profile"
      aria-label="Mon profil"
      className="transition-transform hover:scale-110"
    >
      <UserAvatar
        className="w-9 h-9 rounded-full border-2 border-primary-foreground/50 hover:border-primary/80 overflow-hidden flex items-center justify-center"
        imageClassName="w-full h-full object-cover"
        fallbackClassName="w-full h-full flex items-center justify-center font-bold text-xs"
        width={36}
        height={36}
      />
    </Link>
  );
}

function CartLink() {
  const { itemCount } = useCartContext();
  return (
    <Link href="/cart" aria-label={`Panier (${itemCount} articles)`} className="relative">
      <ShoppingCart className="w-6 h-6 icon-foreground icon-neon-hover" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-primary rounded-full border-2 border-black gaming-badge">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  return (
    <nav aria-label="Navigation principale">
      <div className="flex items-center justify-between w-full bg-black/30 backdrop-blur-lg px-6 py-3 border-b border-black/10 shadow-md">
        <div className="flex-1" />

        <div className="flex-1 flex justify-center">
          <Link href="/">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo_lg_neon.png"
                alt="Mandibula"
                width={50}
                height={50}
                style={{ width: '50px', height: 'auto' }}
              />
            </div>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          {isSearchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Rechercher..."
                autoFocus
                aria-label="Rechercher dans le site"
                className="w-50 px-4 py-2 rounded-md border-neon-glow"
              />
              <button onClick={() => setIsSearchOpen(false)} aria-label="Fermer la recherche">
                <X className="w-6 h-6 icon-foreground icon-neon-hover" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} aria-label="Recherche">
              <Search className="w-6 h-6 icon-foreground icon-neon-hover" />
            </button>
          )}

          <CartLink />

          {/* Avatar utilisateur - version navbar (rond, petit) */}
          <NavbarUserAvatar />
        </div>
      </div>
    </nav>
  )
}


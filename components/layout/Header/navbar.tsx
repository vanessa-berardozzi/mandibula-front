'use client'

import { UserAvatar, useUserAvatar } from "@/components/shared"
import { Input } from "@/components/ui"
import { useCartContext } from "@/context/CartContext"
import { Search, ShoppingCart, User, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimalsDropdown } from './AnimalsDropdown'
import { NAV_LINKS } from './navLinks'

function NavbarUserAvatar() {
  const { isAuthenticated, isLoading } = useUserAvatar();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="account-link pointer-events-none">
        <span className="account-icon">
          <span className="h-full w-full animate-pulse bg-primary/20" />
        </span>
        <span className="account-link-label">Compte</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        aria-label="Se connecter"
        className="account-link"
      >
        <span className="account-icon">
          <User className="h-4 w-4" />
        </span>
        <span className="account-link-label">Compte</span>
      </button>
    );
  }

  return (
    <Link href="/profile" aria-label="Mon profil" className="account-link">
      <span className="account-icon">
        <UserAvatar
          className="h-full w-full"
          imageClassName="h-full w-full object-cover"
          fallbackClassName="flex h-full w-full items-center justify-center text-[10px] font-bold"
          width={28}
          height={28}
        />
      </span>
      <span className="account-link-label">Profil</span>
    </Link>
  );
}

function CartLink() {
  const { itemCount } = useCartContext();

  return (
    <Link href="/cart" aria-label={`Panier (${itemCount} articles)`} className="cart-button">
      <ShoppingCart className="h-4 w-4" />
      <span className="cart-button-label">Panier</span>
      <span className="cart-button-count">{itemCount > 9 ? '9+' : itemCount}</span>
    </Link>
  );
}

function LanguageToggle() {
  const [lang, setLang] = useState<"FR" | "EN">("FR");

  return (
    <button
      type="button"
      onClick={() => setLang((current) => (current === "FR" ? "EN" : "FR"))}
      aria-label="Changer de langue (affichage uniquement)"
      className="language-toggle"
    >
      {lang}
    </button>
  );
}

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }

    if (href === '/categories') {
      return pathname === '/categories' || pathname.startsWith('/categories/')
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`)
      setIsSearchOpen(false)
      setSearchValue("")
    }
  }

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`)
      setIsSearchOpen(false)
      setSearchValue("")
    }
  }

  return (
    <nav aria-label="Navigation principale" className="w-full">
      <div className="site-header">
        <Link href="/" className="brand" aria-label="Mandibula, accueil">
          <Image
            src="/mandibula-logo.png"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="grid leading-none">
            <strong>MANDIBULA</strong>
            <small>SYSTEM V.02.6</small>
          </span>
        </Link>

        <div className="desktop-nav">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link.href)

            return link.label === 'Animaux' ? (
              <AnimalsDropdown key={link.label} active={active} />
            ) : (
              <Link key={link.label} href={link.href} className={`nav-link${active ? ' active' : ''}`}>
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="header-actions">
          <LanguageToggle />

          {isSearchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Rechercher..."
                autoFocus
                aria-label="Rechercher dans le site"
                className="w-40 border border-primary/20 bg-black/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground outline-none ring-0 focus:border-primary/50"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                aria-label="Valider la recherche"
                className="icon-button header-link"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchValue("")
                }}
                aria-label="Fermer la recherche"
                className="icon-button header-link"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(true)
                setTimeout(() => searchInputRef.current?.focus(), 0)
              }}
              aria-label="Recherche"
              className="icon-button header-link"
            >
              <Search className="h-4 w-4" />
            </button>
          )}

          <CartLink />
          <NavbarUserAvatar />
          <button type="button" className="mobile-menu" aria-label="Ouvrir le menu">
            Menu
          </button>
        </div>
      </div>
    </nav>
  )
}


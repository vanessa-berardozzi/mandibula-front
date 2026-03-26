'use client'

import { Input } from "@/components/ui"
import { useSession } from "@/lib/auth.client"
import { Search, ShoppingCart, User, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useState } from 'react'

export function Navbar() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleProfileClick = () => {
    if (session?.user) {
      router.push("/profile")
    } else if (!isPending) {
      router.push("/login")
    }
  }

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

          <Link href="/cart" aria-label="Panier">
            <ShoppingCart className="w-6 h-6 icon-foreground icon-neon-hover" />
          </Link>

          <button
            type="button"
            onClick={handleProfileClick}
            aria-label={session?.user ? "Mon profil" : "Se connecter"}
          >
            <User className="w-6 h-6 icon-foreground icon-neon-hover" />
          </button>
        </div>
      </div>
    </nav>
  )
}


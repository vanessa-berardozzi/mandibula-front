'use client';

import { SidebarTrigger } from '@/components/layout/Sidebar/sidebar';
import { Search, ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav aria-label="Navigation principale">
      <div className="flex items-center justify-between w-full bg-black/30 backdrop-blur-lg px-6 py-3 border-b border-black/10 shadow-md">
        
        {/* Menu burger à gauche */}
        <div className="flex-1 flex justify-start">
          <SidebarTrigger className='text-green-400 hover:text-green-200 transition' />
        </div>

        {/* Logo centré */}
        <div className="flex-1 flex justify-center ">
          <Link href="/">
            <Image
              src="/logo_lg_neon.png"
              alt="Mandibula Logo"
              width={60}
              height={60}
              className="mx-auto"
            />
          </Link>
        </div>

        {/* Search, Cart, Profile à droite */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <button aria-label="Recherche" className="hover:text-green-300 transition">
            <Search className="w-6 h-6 text-green-400" />
          </button>
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6 text-green-400 hover:text-green-200 transition" />
          </Link>
          <Link href="/profile">
            <User className="w-6 h-6 text-green-400 hover:text-green-200 transition" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

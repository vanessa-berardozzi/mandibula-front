'use client';

import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth.client";
import { Bug, ChevronDown, ChevronRight, Home, Package, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ApiSubcategory { id: string; name: string; slug: string; }
interface ApiCategory { id: string; name: string; slug: string; children: ApiSubcategory[]; }

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products/categories/all')
      .then((res) => res.ok ? res.json() as Promise<ApiCategory[]> : Promise.resolve([]))
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const CATEGORY_COLORS = ['#22c56e', '#7ba996', '#00d492', '#4fc3a1', '#a8d8a8', '#56b870'];

  const navItems = [
    { icon: Home,        label: 'Accueil',     href: '/' },
    { icon: ShoppingBag, label: 'Boutique',    href: '/shop' },
    { icon: Package,     label: 'Nouveautés',  href: '/nouveautes' },
  ];

  const accountItems = [
    { icon: User,    label: 'Mon Profil',    href: '/profile' },
    { icon: Package, label: 'Mes Commandes', href: '/orders' },
  ];

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="scan-lines absolute inset-0 pointer-events-none opacity-10" />

      <SheetHeader className="border-b border-primary/30 pb-4 pt-6 px-6 relative">
        <SheetTitle className="text-2xl font-bold text-primary tracking-wider glitch-text">
          MANDIBULA
        </SheetTitle>
        <p className="text-xs text-primary/70 tracking-widest font-mono mt-1">
          SYSTÈME_V2.48.2
        </p>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* NAVIGATION */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            <h3 className="text-xs font-mono text-primary/80 tracking-widest px-2">NAVIGATION</h3>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-4 px-4 py-3 rounded-lg border border-primary/20 bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 hover:translate-x-1"
              >
                <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-foreground font-medium text-sm tracking-wide group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <span className="ml-auto text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* CATÉGORIES DYNAMIQUES */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            <h3 className="text-xs font-mono text-primary/80 tracking-widest px-2">CATÉGORIES</h3>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
          </div>
          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
              const isOpen = openCategory === cat.id;
              return (
                <div key={cat.id} className="space-y-1">
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                    className="w-full group flex items-center gap-4 px-4 py-3 rounded-lg border transition-all duration-200 hover:translate-x-1"
                    style={{
                      background: `linear-gradient(to right, ${color}60, ${color}20)`,
                      borderColor: `${color}30`,
                    }}
                  >
                    <Bug className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color }} />
                    <span className="flex-1 text-left font-medium text-sm tracking-wide" style={{ color: '#e4f7de' }}>
                      {cat.name}
                    </span>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4" style={{ color }} />
                      : <ChevronRight className="w-4 h-4" style={{ color }} />
                    }
                  </button>

                  {isOpen && (
                    <div className="ml-6 space-y-1 border-l-2 pl-3" style={{ borderColor: `${color}40` }}>
                      {cat.children.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/categories/${cat.slug}/${sub.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-md border transition-all hover:translate-x-1"
                          style={{ background: `${color}15`, borderColor: `${color}20` }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="flex-1 text-sm" style={{ color: '#e4f7de' }}>{sub.name}</span>
                          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>→</span>
                        </Link>
                      ))}
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-md border border-dashed transition-all hover:translate-x-1"
                        style={{ borderColor: `${color}30` }}
                      >
                        <span className="text-xs font-mono tracking-widest" style={{ color: `${color}99` }}>VOIR TOUT</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPTE */}
        {session?.user && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
              <h3 className="text-xs font-mono text-primary/80 tracking-widest px-2">COMPTE</h3>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            </div>
            <div className="space-y-1">
              {accountItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-4 px-4 py-3 rounded-lg border border-primary/20 bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 hover:translate-x-1"
                >
                  <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-foreground font-medium text-sm tracking-wide group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                  <span className="ml-auto text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all text-xs">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-primary/30 p-4 bg-black/60">
        <div className="flex items-center justify-between text-xs font-mono text-primary/60">
          <span>STATUS: ONLINE</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            CONNECTED
          </span>
        </div>
      </div>
    </div>
  );
}

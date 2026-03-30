'use client';

import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth.client";
import { Bug, Home, Package, ShoppingBag, User, Zap } from 'lucide-react';
import Link from 'next/link';

interface MobileMenuProps {
  onClose: () => void;
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const { data: session } = useSession();

  const allSections = [
    {
      title: "NAVIGATION",
      items: [
        { icon: Home, label: "Accueil", href: "/" },
        { icon: ShoppingBag, label: "Boutique", href: "/shop" },
        { icon: Package, label: "Nouveautés", href: "/nouveautes" },
      ]
    },
    {
      title: "CATÉGORIES",
      items: [
        { icon: Bug, label: "Isopodes", href: "/categories/isopodes" },
        { icon: Bug, label: "Blattes", href: "/categories/blattes" },
        { icon: Zap, label: "Accessoires", href: "/categories/accessoires" },
      ]
    },
    {
      title: "COMPTE",
      items: [
        { icon: User, label: "Mon Profil", href: "/profile" },
        { icon: Package, label: "Mes Commandes", href: "/orders" },
      ],
      requiresAuth: true,
    }
  ];

  const menuSections = allSections.filter(
    (section) => !section.requiresAuth || session?.user
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Effet de scan lines */}
      <div className="scan-lines absolute inset-0 pointer-events-none opacity-10" />
      
      {/* Header avec effet glitch */}
      <SheetHeader className="border-b border-primary/30 pb-4 pt-6 px-6 relative">
        <SheetTitle className="text-2xl font-bold text-primary tracking-wider glitch-text">
          MANDIBULA
        </SheetTitle>
        <p className="text-xs text-primary/70 tracking-widest font-mono mt-1">
          SYSTÈME_V2.48.2
        </p>
      </SheetHeader>

      {/* Contenu du menu avec scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {menuSections.map((section, sectionIdx) => (
          <div key={section.title} className="space-y-2">
            {/* Titre de section avec style terminal */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
              <h3 className="text-xs font-mono text-primary/80 tracking-widest px-2">
                {section.title}
              </h3>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            {/* Items du menu */}
            <div className="space-y-1">
              {section.items.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-4 px-4 py-3 rounded-lg border border-primary/20 bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 hover:translate-x-1 gaming-menu-item"
                  style={{ 
                    animationDelay: `${(sectionIdx * 3 + idx) * 50}ms` 
                  }}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    {/* Glow effect au hover */}
                    <div className="absolute inset-0 bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-foreground font-medium text-sm tracking-wide group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                  {/* Flèche animée */}
                  <span className="ml-auto text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all text-xs">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer avec info système */}
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

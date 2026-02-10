'use client';

import AuthSheet from "@/components/auth/AuthSheet";
import { Bug, Home, Search, ShoppingCart, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Déterminer l'onglet actif basé sur le pathname
  const activeTab = useMemo(() => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/categories')) return 'categories';
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/cart')) return 'cart';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  const navItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Accueil', 
      href: '/',
      action: 'link'
    },
    { 
      id: 'categories', 
      icon: Bug, 
      label: 'Catégories', 
      href: '/categories',
      action: 'link'
    },
    { 
      id: 'search', 
      icon: Search, 
      label: 'Recherche', 
      action: 'modal',
      handler: () => setSearchOpen(true)
    },
    { 
      id: 'cart', 
      icon: ShoppingCart, 
      label: 'Panier', 
      href: '/cart',
      action: 'link',
      badge: 3 // TODO: Remplacer par le vrai compteur
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profil', 
      action: 'modal',
      handler: () => setAuthOpen(true)
    },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.action === 'modal' && item.handler) {
      item.handler();
    } else if (item.action === 'link' && item.href) {
      router.push(item.href);
    }
  };

  return (
    <>
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-primary/30 gaming-bottom-nav"
        aria-label="Navigation principale mobile"
      >
        {/* Ligne de scan animée en haut */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent animate-scan-line" />
        
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map((item, idx) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`
                  relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg
                  transition-all duration-300 gaming-nav-item group
                  ${isActive 
                    ? 'text-primary scale-110' 
                    : 'text-foreground/60 hover:text-primary hover:scale-105'
                  }
                `}
                style={{ 
                  animationDelay: `${idx * 80}ms` 
                }}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Background glow pour l'item actif */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md" />
                )}
                
                {/* Icône avec effet néon */}
                <div className="relative z-10">
                  <Icon 
                    className={`
                      w-6 h-6 transition-all duration-200
                      ${isActive ? 'drop-shadow-neon' : 'group-hover:scale-110'}
                    `} 
                  />
                  
                  {/* Badge pour le panier */}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-black bg-primary rounded-full border border-black gaming-badge">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                  
                  {/* Scan effect au hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full blur-sm transition-all" />
                  )}
                </div>
                
                {/* Label */}
                <span 
                  className={`
                    relative z-10 text-[10px] font-mono tracking-wider transition-all
                    ${isActive ? 'font-bold text-shadow-neon' : 'font-medium'}
                  `}
                >
                  {item.label}
                </span>
                
                {/* Indicateur actif (ligne en bas) */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-neon-glow" />
                )}
              </button>
            );
          })}
        </div>

        {/* Coin indicators (style gaming UI) */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-primary/40" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-primary/40" />
      </nav>

      {/* Modals */}
      <AuthSheet open={authOpen} onOpenChange={setAuthOpen} mode="login" />
      
      {/* TODO: Ajouter SearchModal quand prêt */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div className="flex items-start justify-center pt-20 px-4">
            <div className="w-full max-w-md p-6 bg-black/95 border border-primary/30 rounded-lg">
              <p className="text-primary text-center font-mono">
                Recherche en cours de développement...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

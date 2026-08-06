'use client';
import { useCartContext } from "@/context/CartContext";
import { useSession } from "@/lib/auth.client";
import { Bug, Home, Search, ShoppingCart, User, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { itemCount } = useCartContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeTab = useMemo(() => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/categories')) return 'categories';
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/cart')) return 'cart';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const navItems = [
    { id: 'home',       icon: Home,         label: 'Accueil',    action: 'link'  as const, href: '/' },
    { id: 'categories', icon: Bug,          label: 'Catégories', action: 'link'  as const, href: '/categories' },
    { id: 'search',     icon: Search,       label: 'Recherche',  action: 'modal' as const },
    { id: 'cart',       icon: ShoppingCart, label: 'Panier',     action: 'link'  as const, href: '/cart', badge: itemCount },
    { id: 'profile',    icon: User,         label: 'Profil',     action: 'link'  as const, href: session?.user ? '/profile' : '/login' },
  ];

  const handleClick = (item: (typeof navItems)[number]) => {
    if (item.action === 'modal') {
      openSearch()
    } else if (item.action === 'link' && 'href' in item) {
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
      
      {/* Modal de recherche */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex flex-col"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="flex-1 flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md p-6 bg-black/95 border border-primary/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-primary font-mono text-sm tracking-widest">RECHERCHER</h3>
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Fermer"
                  className="p-1 hover:bg-primary/10 rounded transition-all"
                >
                  <X className="w-5 h-5 text-primary/60 hover:text-primary" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/60" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-primary/30 rounded-lg text-foreground placeholder:text-primary/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  autoFocus
                />
              </div>

              {searchValue && (
                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg text-primary text-sm font-mono transition-all"
                >
                  Rechercher
                </button>
              )}

              <p className="text-primary/50 text-xs mt-4 text-center font-mono">
                Appuyez sur Entrée pour rechercher
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

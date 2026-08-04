'use client';

import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth.client";
import { LucideIcon, Package, User } from 'lucide-react';
import Link from 'next/link';
import { MobileAnimalsTree } from '../MobileAnimalsTree';
import { NAV_LINKS, SECONDARY_LINKS } from '../navLinks';

interface MobileMenuProps {
  onClose: () => void;
}

const accountItems = [
  { icon: User,    label: 'Mon Profil',    href: '/profile' },
  { icon: Package, label: 'Mes Commandes', href: '/orders' },
];

/** Titre de section avec traits décoratifs, factorisé pour éviter la répétition entre blocs. */
function MobileMenuSectionTitle({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <h3 className="text-xs font-mono text-primary/80 tracking-widest px-2">{children}</h3>
      <div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}

/** Carte de lien du menu mobile, factorisée pour éviter la répétition entre blocs. */
function MobileMenuLink({
  href,
  label,
  icon: Icon,
  onClose,
}: {
  href: string;
  label: string;
  icon?: LucideIcon;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex items-center gap-4 px-4 py-3 rounded-lg border border-primary/20 bg-black/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 hover:translate-x-1"
    >
      {Icon && <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />}
      <span className="text-foreground font-medium text-sm tracking-wide group-hover:text-primary transition-colors">
        {label}
      </span>
      <span className="ml-auto text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all text-xs">→</span>
    </Link>
  );
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="scan-lines absolute inset-0 pointer-events-none opacity-10" />

      <SheetHeader className="border-b border-primary/30 pb-4 pt-6 px-6 relative">
        <SheetTitle className="text-2xl font-bold text-primary tracking-wider glitch-text">
          MANDIBULA
        </SheetTitle>
        <p className="text-xs text-primary/70 tracking-widest font-mono mt-1">
          SYSTEM V.02.6
        </p>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* NAVIGATION — liens statiques, cf. navLinks.ts */}
        <div className="space-y-2">
          <MobileMenuSectionTitle>NAVIGATION</MobileMenuSectionTitle>
          <div className="space-y-1">
            {NAV_LINKS.map((item) =>
              item.label === 'Animaux' ? (
                <MobileAnimalsTree key={item.label} onNavigate={onClose} />
              ) : (
                <MobileMenuLink key={item.label} href={item.href} label={item.label} onClose={onClose} />
              )
            )}
          </div>
        </div>

        {/* COMPTE */}
        {session?.user && (
          <div className="space-y-2">
            <MobileMenuSectionTitle>COMPTE</MobileMenuSectionTitle>
            <div className="space-y-1">
              {accountItems.map((item) => (
                <MobileMenuLink key={item.href} href={item.href} label={item.label} icon={item.icon} onClose={onClose} />
              ))}
            </div>
          </div>
        )}

        {/* PAGES — liens éditoriaux, visibles seulement en mobile (cf. maquette : mobile-nav-secondary) */}
        <div className="space-y-2">
          <MobileMenuSectionTitle>PAGES</MobileMenuSectionTitle>
          <div className="space-y-1">
            {SECONDARY_LINKS.map((item) => (
              <MobileMenuLink key={item.label} href={item.href} label={item.label} onClose={onClose} />
            ))}
          </div>
        </div>
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


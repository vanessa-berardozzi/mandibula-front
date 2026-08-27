"use client";

import { findAdminNavItem } from "@/lib/admin/adminNav";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminTopbarProps = {
  onOpenNav: () => void;
};

export function AdminTopbar({ onOpenNav }: AdminTopbarProps) {
  const pathname = usePathname();
  const current = findAdminNavItem(pathname);

  return (
    <header className="sticky top-0 z-20 flex min-h-23 items-center gap-4 border-b border-admin-border bg-[#020905]/86 px-4 py-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Ouvrir la navigation"
        className="admin-type-micro min-h-9 border border-admin-border px-3 font-mono uppercase tracking-[0.2em] text-[#7d9985] transition-colors hover:border-admin-green hover:text-admin-green md:hidden"
      >
        ☰
      </button>

      <div className="min-w-0 flex-1">
        <p className="admin-type-micro font-mono uppercase tracking-[0.16em] text-[#5e9b70]">
          Control / Module {current?.code ?? "--"}
        </p>
        <h1 className="mt-1.75 truncate font-sans text-[clamp(24px,3vw,30px)] font-black leading-[0.9] tracking-[-0.045em] text-[#eef5f0]">
          {current?.label ?? "Administration"}
        </h1>
      </div>

      <Link
        href="/"
        className="admin-type-micro hidden min-h-9 items-center border border-admin-border bg-[#040e08]/80 px-3 font-mono uppercase tracking-[0.2em] text-[#7d9985] transition-colors hover:border-admin-green hover:text-admin-green sm:inline-flex"
      >
        Retour au site
      </Link>
    </header>
  );
}

export type AdminNavItem = {
  code: string;
  label: string;
  href: string;
};

export const adminNav: AdminNavItem[] = [
  { code: "01", label: "Tableau de bord", href: "/admin" },
  { code: "02", label: "Commandes", href: "/admin/orders" },
  { code: "03", label: "Expeditions", href: "/admin/expeditions" },
  { code: "04", label: "Catalogue & stocks", href: "/admin/products" },
  { code: "05", label: "Clients", href: "/admin/customers" },
  { code: "06", label: "Promotions", href: "/admin/promotions" },
  { code: "07", label: "Paramètres", href: "/admin/settings" },
  // Removed as they are now renumbered above
];

export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
  return [...adminNav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

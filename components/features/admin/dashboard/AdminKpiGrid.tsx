import type { AdminDashboardStats } from "@/types/admin";
import { AdminKpiCard } from "./AdminKpiCard";
import { AdminTopProductsCard } from "./AdminTopProductsCard";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function AdminKpiGrid({ stats }: { stats: AdminDashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      <AdminKpiCard
        label="Chiffre d'affaires"
        value={currency.format(stats.revenue)}
        hint={`${stats.paidOrders} paiement(s)`}
      />
      <AdminKpiCard
        label="Commandes"
        value={String(stats.orders)}
        hint={`${stats.ordersToday} aujourd'hui`}
      />
      <AdminKpiCard
        label="Panier moyen"
        value={currency.format(stats.averageBasket)}
        hint="sur la période"
      />
      <AdminTopProductsCard label="Top ventes" products={stats.topProducts} />
    </div>
  );
}


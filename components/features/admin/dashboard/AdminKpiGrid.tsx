import type { AdminDashboardStats } from "@/types/admin";
import { AdminKpiCard } from "./AdminKpiCard";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function AdminKpiGrid({ stats }: { stats: AdminDashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
      <AdminKpiCard
        label="CA encaissé"
        value={currency.format(stats.revenue)}
        hint={`${stats.paidOrders} paiement(s)`}
      />
      <AdminKpiCard
        label="Panier moyen"
        value={currency.format(stats.averageBasket)}
        hint="sur la période"
      />
      <AdminKpiCard
        label="Commandes"
        value={String(stats.orders)}
        hint={`${stats.cancelledOrders} annulée(s)`}
      />
      <AdminKpiCard
        label="Clients"
        value={String(stats.customers)}
        hint={`${stats.products} produit(s) au catalogue`}
      />
    </div>
  );
}




import { AdminCustomerClaimsCard } from "@/components/features/admin/dashboard/AdminCustomerClaimsCard";
import { AdminKpiGrid } from "@/components/features/admin/dashboard/AdminKpiGrid";
import { AdminOrdersFlowPanel } from "@/components/features/admin/dashboard/AdminOrdersFlowPanel";
import { AdminPeriodSelect } from "@/components/features/admin/dashboard/AdminPeriodSelect";
import { AdminStockAlertsCard } from "@/components/features/admin/dashboard/AdminStockAlertsCard";
import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { fetchAdmin } from "@/lib/admin/adminApi.server";
import { ADMIN_PERIOD_COOKIE, resolveAdminPeriod } from "@/lib/admin/adminPeriod";
import type { AdminDashboardStats, AdminOrdersPage, AdminStockAlert } from "@/types/admin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const period = resolveAdminPeriod(params.period, cookieStore.get(ADMIN_PERIOD_COOKIE)?.value);
  const [statsResult, openOrdersResult, stockAlertsResult] = await Promise.all([
    fetchAdmin<{ stats: AdminDashboardStats }>(`/api/admin/dashboard/stats?period=${period}`),
    fetchAdmin<AdminOrdersPage>("/api/admin/orders?scope=open&limit=100"),
    fetchAdmin<{ alerts: AdminStockAlert[] }>("/api/admin/stock-alerts"),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AdminPeriodSelect current={period} />
      </div>
      {statsResult.ok ? (
        <AdminKpiGrid stats={statsResult.data.stats} />
      ) : (
        <AdminEmptyState
          title="Statistiques indisponibles"
          description="Impossible de charger les indicateurs pour le moment."
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {openOrdersResult.ok ? (
            <AdminOrdersFlowPanel orders={openOrdersResult.data.orders} />
          ) : (
            <AdminEmptyState
              title="Suivi des commandes indisponible"
              description="Impossible de charger les commandes à traiter pour le moment."
            />
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          {stockAlertsResult.ok ? (
            <AdminStockAlertsCard alerts={stockAlertsResult.data.alerts} />
          ) : (
            <AdminEmptyState
              title="Alertes indisponibles"
              description="Impossible de charger les alertes de stock."
            />
          )}
          <AdminCustomerClaimsCard />
        </div>
      </div>
    </div>
  );
}
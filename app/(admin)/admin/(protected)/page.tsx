

import { AdminKpiGrid } from "@/components/features/admin/dashboard/AdminKpiGrid";
import { AdminOrdersFlowPanel } from "@/components/features/admin/dashboard/AdminOrdersFlowPanel";
import { AdminPeriodSelect } from "@/components/features/admin/dashboard/AdminPeriodSelect";
import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { fetchAdmin } from "@/lib/admin/adminApi.server";
import { ADMIN_PERIOD_COOKIE, resolveAdminPeriod } from "@/lib/admin/adminPeriod";
import type { AdminDashboardStats, AdminOrdersPage } from "@/types/admin";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const period = resolveAdminPeriod(params.period, cookieStore.get(ADMIN_PERIOD_COOKIE)?.value);
  const [statsResult, openOrdersResult] = await Promise.all([
    fetchAdmin<{ stats: AdminDashboardStats }>(`/api/admin/dashboard/stats?period=${period}`),
    fetchAdmin<AdminOrdersPage>("/api/admin/orders?scope=open&limit=100"),
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
      {openOrdersResult.ok ? (
        <AdminOrdersFlowPanel orders={openOrdersResult.data.orders} />
      ) : (
        <AdminEmptyState
          title="Suivi des commandes indisponible"
          description="Impossible de charger les commandes à traiter pour le moment."
        />
      )}
    </div>
  );
}

 
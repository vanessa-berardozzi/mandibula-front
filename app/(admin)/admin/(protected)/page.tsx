

import { AdminKpiGrid } from "@/components/features/admin/dashboard/AdminKpiGrid";
import { AdminPeriodSelect } from "@/components/features/admin/dashboard/AdminPeriodSelect";
import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { fetchAdmin } from "@/lib/admin/adminApi.server";
import type { AdminDashboardPeriod, AdminDashboardStats } from "@/types/admin";

export const dynamic = "force-dynamic";

const VALID_PERIODS: AdminDashboardPeriod[] = ["7d", "30d", "90d", "12m", "all"];

function resolvePeriod(value: string | undefined): AdminDashboardPeriod {
  return VALID_PERIODS.includes(value as AdminDashboardPeriod) ? (value as AdminDashboardPeriod) : "30d";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const period = resolvePeriod((await searchParams).period);
  const result = await fetchAdmin<{ stats: AdminDashboardStats }>(
    `/api/admin/dashboard/stats?period=${period}`
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AdminPeriodSelect current={period} />
      </div>
      {result.ok ? (
        <AdminKpiGrid stats={result.data.stats} />
      ) : (
        <AdminEmptyState
          title="Statistiques indisponibles"
          description="Impossible de charger les indicateurs pour le moment."
        />
      )}
    </div>
  );
}

 
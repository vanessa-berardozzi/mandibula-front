import { AdminOrdersFilters } from "@/components/features/admin/orders/AdminOrdersFilters";
import { AdminOrdersTable } from "@/components/features/admin/orders/AdminOrdersTable";
import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { AdminPagination } from "@/components/features/admin/shared/AdminPagination";
import { AdminPanel } from "@/components/features/admin/shared/AdminPanel";
import { fetchAdmin } from "@/lib/admin/adminApi.server";
import { ORDER_STATUS_LABELS } from "@/lib/admin/adminOrderLabels";
import type { AdminOrdersPage as AdminOrdersPageData, AdminOrderStatus } from "@/types/admin";

export const dynamic = "force-dynamic";

function resolveStatus(value: string | undefined): AdminOrderStatus | "" {
  return value && value in ORDER_STATUS_LABELS ? (value as AdminOrderStatus) : "";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = resolveStatus(params.status);
  const search = params.q?.trim() ?? "";

  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) query.set("status", status);
  if (search) query.set("search", search);

  const result = await fetchAdmin<AdminOrdersPageData>(`/api/admin/orders?${query.toString()}`);

  const buildHref = (target: number) => {
    const href = new URLSearchParams();
    if (status) href.set("status", status);
    if (search) href.set("q", search);
    href.set("page", String(target));
    return `?${href.toString()}`;
  };

  return (
    <AdminPanel
      kicker="ORDER.MANAGEMENT"
      title="Commandes & préparation"
      action={result.ok ? <p>{result.data.total} résultat(s)</p> : null}
    >
      <AdminOrdersFilters status={status} search={search} />

      {!result.ok ? (
        <AdminEmptyState
          title="Commandes indisponibles"
          description="Impossible de charger les commandes pour le moment."
        />
      ) : result.data.orders.length === 0 ? (
        <AdminEmptyState
          title="Aucune commande"
          description="Aucune commande ne correspond à ces critères."
        />
      ) : (
        <>
          <AdminOrdersTable orders={result.data.orders} />
          <AdminPagination
            page={result.data.page}
            pages={result.data.pages}
            total={result.data.total}
            buildHref={buildHref}
          />
        </>
      )}
    </AdminPanel>
  );
}
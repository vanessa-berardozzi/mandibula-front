import { AdminCustomersFilters } from "@/components/features/admin/customers/AdminCustomersFilters";
import { AdminCustomersTable } from "@/components/features/admin/customers/AdminCustomersTable";
import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { AdminPagination } from "@/components/features/admin/shared/AdminPagination";
import { AdminPanel } from "@/components/features/admin/shared/AdminPanel";
import { fetchAdmin } from "@/lib/admin/adminApi.server";
import type { AdminCustomerSortKey, AdminCustomersPage } from "@/types/admin";

export const dynamic = "force-dynamic";

const SORT_KEYS: AdminCustomerSortKey[] = ["name", "orders", "spent"];

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string; direction?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.q?.trim() ?? "";
  const sort = SORT_KEYS.includes(params.sort as AdminCustomerSortKey)
    ? (params.sort as AdminCustomerSortKey)
    : "name";
  const direction = params.direction === "desc" ? "desc" : "asc";

  const query = new URLSearchParams({ page: String(page), limit: "20", sort, direction });
  if (search) query.set("search", search);

  const result = await fetchAdmin<AdminCustomersPage>(`/api/admin/customers?${query.toString()}`);

  const buildHref = (target: number) => {
    const href = new URLSearchParams({ sort, direction, page: String(target) });
    if (search) href.set("q", search);
    return `?${href.toString()}`;
  };

  return (
    <AdminPanel
      kicker="CUSTOMER.DATABASE"
      title="Clients"
      action={result.ok ? <p>{result.data.total} profil(s)</p> : null}
    >
      <AdminCustomersFilters search={search} />

      {!result.ok ? (
        <AdminEmptyState
          title="Clients indisponibles"
          description="Impossible de charger les clients pour le moment."
        />
      ) : result.data.customers.length === 0 ? (
        <AdminEmptyState
          title="Aucun profil client"
          description="Aucun client ne correspond à ces critères."
        />
      ) : (
        <>
          <AdminCustomersTable
            customers={result.data.customers}
            sort={sort}
            direction={direction}
          />
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

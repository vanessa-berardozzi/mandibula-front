import { KanBanExpedition } from "@/components/features/admin/expeditions/kanBanExpedition";
import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { fetchAdmin } from "@/lib/admin/adminApi.server";
import type { AdminOrdersPage } from "@/types/admin";

export const dynamic = "force-dynamic";

export default function AdminExpeditionsPage() {
  return <AdminExpeditionsContent />;
}

async function fetchAllOpenOrders() {
  const firstPage = await fetchAdmin<AdminOrdersPage>("/api/admin/orders?scope=open&limit=100&page=1");
  if (!firstPage.ok || firstPage.data.pages <= 1) return firstPage;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.data.pages - 1 }, (_, index) =>
      fetchAdmin<AdminOrdersPage>(
        `/api/admin/orders?scope=open&limit=100&page=${index + 2}`
      )
    )
  );

  if (remainingPages.some((page) => !page.ok)) {
    return { ok: false as const, status: 502, data: null };
  }

  return {
    ...firstPage,
    data: {
      ...firstPage.data,
      orders: [
        firstPage.data.orders,
        ...remainingPages.map((page) => (page.ok ? page.data.orders : [])),
      ].flat(),
    },
  };
}

async function AdminExpeditionsContent() {
  const result = await fetchAllOpenOrders();

  if (!result.ok) {
    return (
      <AdminEmptyState
        title="Expéditions indisponibles"
        description="Impossible de charger les commandes à expédier pour le moment."
      />
    );
  }

  return <KanBanExpedition orders={result.data.orders} />;
}
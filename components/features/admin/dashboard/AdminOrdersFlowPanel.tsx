import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { AdminPanel } from "@/components/features/admin/shared/AdminPanel";
import { formatEuro, ORDER_STATUS_LABELS } from "@/lib/admin/adminOrderLabels";
import type { AdminOrderListItem } from "@/types/admin";
import Link from "next/link";

export function AdminOrdersFlowPanel({ orders }: { orders: AdminOrderListItem[] }) {
  return (
    <AdminPanel
      kicker="LOGISTICS.PIPELINE"
      title="Flux des commandes"
      action={<Link href="/admin/orders">Tout voir</Link>}
    >
      {orders.length === 0 ? (
        <AdminEmptyState
          title="Aucune commande à traiter"
          description="Les commandes encore en cours apparaîtront ici jusqu’à leur clôture."
        />
      ) : (
        <div className="admin-table compact">
          {orders.map((order) => (
            <div className="admin-table-row" key={order.id}>
              <strong>{order.reference}</strong>
              <span>{order.customerName || order.customerEmail}</span>
              <b>{formatEuro(order.total)}</b>
              <em>{ORDER_STATUS_LABELS[order.status]}</em>
            </div>
          ))}
        </div>
      )}
    </AdminPanel>
  );
}

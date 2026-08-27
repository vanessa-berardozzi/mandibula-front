import { PAYMENT_STATUS_LABELS } from "@/lib/admin/adminOrderLabels";
import type { AdminOrderListItem, AdminPaymentStatus } from "@/types/admin";

export function isCancelledOrder(order: Pick<AdminOrderListItem, "status" | "paymentStatus">) {
  return order.status === "CANCELLED" || order.paymentStatus === "FAILED";
}

export function AdminPaymentStatusBadge({
  status,
  cancelled,
}: {
  status: AdminPaymentStatus;
  cancelled?: boolean;
}) {
  return (
    <span className={cancelled ? "admin-status cancelled" : "admin-status"}>
      {cancelled ? "Annulée" : PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}

export function AdminLiveChip() {
  return <span className="admin-chip live">Vivant</span>;
}

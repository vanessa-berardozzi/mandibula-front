"use client";

import {
    AdminLiveChip,
    AdminPaymentStatusBadge,
    isCancelledOrder,
} from "@/components/features/admin/orders/AdminOrderBadges";
import { AdminOrderDetailDrawer } from "@/components/features/admin/orders/AdminOrderDetailDrawer";
import {
    formatEuro,
    formatOrderDate,
    ORDER_STATUS_LABELS,
    ORDER_STATUS_OPTIONS,
    PAYMENT_METHOD_LABELS,
    PAYMENT_STATUS_LABELS,
} from "@/lib/admin/adminOrderLabels";
import type { AdminOrderListItem, AdminOrderStatus } from "@/types/admin";
import { useRouter } from "next/navigation";
import { Fragment, useState, useTransition } from "react";

export function AdminOrdersTable({ orders }: { orders: AdminOrderListItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openedOrderId, setOpenedOrderId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const changeStatus = async (orderId: string, status: AdminOrderStatus) => {
    setError("");
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setError("⚠ Le changement de traitement a échoué");
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <>
      {error && <p className="admin-inline-error">{error}</p>}

      <div className="admin-data-table" aria-busy={isPending}>
        <div className="admin-data-head">
          <span>Commande</span>
          <span>Client</span>
          <span>Total</span>
          <span>Statut</span>
          <span>Traitement</span>
          <span>Action</span>
        </div>

        {orders.map((order) => {
          const cancelled = isCancelledOrder(order);
          const isOpen = openedOrderId === order.id;
          return (
            <Fragment key={order.id}>
              <div className={`admin-data-row admin-order-row${cancelled ? " cancelled-order" : ""}`}>
                <div data-label="Commande">
                  <button
                    type="button"
                    className="admin-order-details-trigger"
                    onClick={() => setOpenedOrderId(isOpen ? null : order.id)}
                    aria-expanded={isOpen}
                    aria-controls={`order-detail-${order.id}`}
                  >
                    <strong>{order.reference}</strong>
                    <span>
                      {isOpen ? "Masquer" : "Voir le contenu"} <b>{isOpen ? "−" : "+"}</b>
                    </span>
                  </button>
                  <small>{formatOrderDate(order.createdAt)}</small>
                </div>

                <div data-label="Client">
                  <strong>{order.customerName || "Client"}</strong>
                  <small>{order.customerEmail}</small>
                </div>

                <strong data-label="Total">{formatEuro(order.total)}</strong>

                <div className="admin-order-signals" data-label="Statut">
                  <AdminPaymentStatusBadge status={order.paymentStatus} cancelled={cancelled} />
                  {order.containsLive && <AdminLiveChip />}
                </div>

                <select
                  data-label="Traitement"
                  aria-label={`Traitement de la commande ${order.reference}`}
                  value={order.status}
                  onChange={(event) =>
                    void changeStatus(order.id, event.target.value as AdminOrderStatus)
                  }
                >
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button data-label="Action" type="button" onClick={() => setDetailId(order.id)}>
                  Détail
                </button>
              </div>

              {isOpen && (
                <section
                  className={`admin-order-detail${cancelled ? " cancelled" : ""}`}
                  id={`order-detail-${order.id}`}
                  aria-label={`Détail de la commande ${order.reference}`}
                >
                  <header>
                    <div>
                      <span>ORDER.CONTENT</span>
                      <h3>
                        {order.reference} · {order.itemCount} article
                        {order.itemCount > 1 ? "s" : ""}
                      </h3>
                    </div>
                    <b>{formatEuro(order.total)}</b>
                  </header>

                  <div className="admin-order-context">
                    <div>
                      <span>Date</span>
                      <strong>{formatOrderDate(order.createdAt)}</strong>
                    </div>
                    <div>
                      <span>Paiement</span>
                      <strong>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</strong>
                      <small>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</small>
                    </div>
                    <div>
                      <span>Traitement</span>
                      <strong>{ORDER_STATUS_LABELS[order.status]}</strong>
                      <small>{order.containsLive ? "Contient du vivant" : "Colis sec"}</small>
                    </div>
                    <div>
                      <span>Destinataire</span>
                      <strong>{order.customerName || "Client"}</strong>
                      <small>{order.customerEmail}</small>
                    </div>
                  </div>

                  {order.items.length ? (
                    <div className="admin-order-detail-items">
                      {order.items.map((item) => (
                        <article key={item.id}>
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt="" />
                          ) : (
                            <span className="admin-order-item-placeholder">▦</span>
                          )}
                          <div>
                            <strong>{item.productName}</strong>
                            <small>{item.variantName}</small>
                          </div>
                          <span>×{item.quantity}</span>
                          <b>{formatEuro(item.lineTotal)}</b>
                          {item.quantity > 1 && (
                            <small className="admin-order-unit-price">
                              {formatEuro(item.unitPrice)} / unité
                            </small>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-order-detail-empty">
                      Le détail des articles n’est pas disponible pour cette commande.
                    </p>
                  )}
                </section>
              )}
            </Fragment>
          );
        })}
      </div>

      <AdminOrderDetailDrawer
        orderId={detailId}
        onClose={() => setDetailId(null)}
        onStatusChange={() => {
          startTransition(() => router.refresh());
        }}
      />
    </>
  );
}

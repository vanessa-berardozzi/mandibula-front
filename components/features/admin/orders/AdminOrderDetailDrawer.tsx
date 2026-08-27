"use client";

import {
    AdminLiveChip,
    AdminPaymentStatusBadge,
    isCancelledOrder,
} from "@/components/features/admin/orders/AdminOrderBadges";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    formatEuro,
    formatOrderDate,
    ORDER_STATUS_LABELS,
    PAYMENT_METHOD_LABELS,
    PAYMENT_STATUS_LABELS,
} from "@/lib/admin/adminOrderLabels";
import type { AdminOrderDetail } from "@/types/admin";
import { useEffect, useState } from "react";

export function AdminOrderDetailDrawer({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    setOrder(null);
    setError("");

    fetch(`/api/admin/orders/${orderId}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Commande indisponible");
        return (await response.json()) as { order: AdminOrderDetail };
      })
      .then((body) => {
        if (!cancelled) setOrder(body.order);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger le détail de cette commande.");
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <Sheet open={Boolean(orderId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="admin-drawer" overlayClassName="admin-drawer-overlay">
        <header>
          <div>
            <span>FULFILMENT.PIPELINE</span>
            <SheetTitle asChild>
              <h2>{order ? order.reference : "Commande"}</h2>
            </SheetTitle>
            <SheetDescription asChild>
              <small>{order ? formatOrderDate(order.createdAt) : "Chargement…"}</small>
            </SheetDescription>
          </div>
        </header>

        {error && <p className="admin-drawer-error">⚠ {error}</p>}

        {order && (
          <>
            <section className="admin-order-overview">
              <div>
                <span>Client</span>
                <strong>{order.customerName || "Client"}</strong>
                <small>{order.customerEmail}</small>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatEuro(order.total)}</strong>
                <small>
                  {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                </small>
              </div>
              <div>
                <span>État</span>
                <strong>{ORDER_STATUS_LABELS[order.status]}</strong>
                <small>Paiement : {PAYMENT_STATUS_LABELS[order.paymentStatus]}</small>
              </div>
            </section>

            <div className="admin-order-signals">
              <AdminPaymentStatusBadge
                status={order.paymentStatus}
                cancelled={isCancelledOrder(order)}
              />
              {order.containsLive && <AdminLiveChip />}
            </div>

            <div className="admin-order-context">
              <div>
                <span>Moyen de paiement</span>
                <strong>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</strong>
              </div>
              <div>
                <span>Livraison</span>
                <strong>{order.shippingAddress || "Non renseignée"}</strong>
              </div>
              <div>
                <span>Facturation</span>
                <strong>{order.billingAddress || "Non renseignée"}</strong>
              </div>
              <div>
                <span>Note</span>
                <strong>{order.notes || "Aucune"}</strong>
              </div>
            </div>

            <section className="admin-order-items" aria-label="Articles de la commande">
              <header>
                <div>
                  <span>ORDER.ITEMS</span>
                  <h3>Articles de la commande</h3>
                </div>
                <b>
                  {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                </b>
              </header>
              {order.items.length ? (
                <div className="admin-order-items-list">
                  {order.items.map((item) => (
                    <article key={item.id}>
                      <div>
                        <strong>{item.productName}</strong>
                        <small>{item.variantName}</small>
                      </div>
                      <span>×{item.quantity}</span>
                      <div className="admin-order-item-price">
                        <strong>{formatEuro(item.lineTotal)}</strong>
                        {item.quantity > 1 && <small>{formatEuro(item.unitPrice)} / unité</small>}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="admin-order-items-empty">
                  Le détail des articles n’est pas disponible pour cette commande.
                </p>
              )}
            </section>

            <div className="admin-order-context">
              <div>
                <span>Sous-total</span>
                <strong>{formatEuro(order.subtotal)}</strong>
              </div>
              <div>
                <span>Frais de port</span>
                <strong>{formatEuro(order.shippingCost)}</strong>
              </div>
              <div>
                <span>TVA</span>
                <strong>{order.tax === null ? "—" : formatEuro(order.tax)}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatEuro(order.total)}</strong>
              </div>
            </div>
          </>
        )}

        <footer>
          <SheetClose asChild>
            <button type="button">Fermer</button>
          </SheetClose>
        </footer>
      </SheetContent>
    </Sheet>
  );
}

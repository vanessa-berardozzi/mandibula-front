"use client";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/admin/adminOrderLabels";
import type { AdminOrderStatus, AdminPaymentStatus } from "@/types/admin";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface OrderItemDetail {
  id: string;
  quantity: number;
  variantName: string;
  variant: {
    product: {
      id: string;
      name: string;
      images: string[];
    };
  };
}

interface OrderDetail {
  id: string;
  status: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  paymentMethod: string;
  total: string | number;
  createdAt: string;
  shippingAddress?: { name?: string; line1?: string; line2?: string; city?: string; postalCode?: string; country?: string } | string | null;
  orderItems: OrderItemDetail[];
}

interface OrderDetailModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Étapes du parcours normal d'une commande, utilisées pour le suivi visuel (mêmes libellés que l'admin)
const PROGRESS_STEPS: { key: AdminOrderStatus; label: string }[] = [
  { key: "CONFIRMED", label: ORDER_STATUS_LABELS.CONFIRMED },
  { key: "TO_PREPARE", label: ORDER_STATUS_LABELS.TO_PREPARE },
  { key: "PREPARING", label: ORDER_STATUS_LABELS.PREPARING },
  { key: "READY", label: ORDER_STATUS_LABELS.READY },
  { key: "SHIPPED", label: ORDER_STATUS_LABELS.SHIPPED },
  { key: "DELIVERED", label: ORDER_STATUS_LABELS.DELIVERED },
];

const formatShippingAddress = (address: OrderDetail["shippingAddress"]) => {
  if (!address) return "Non renseignée";
  if (typeof address === "string") return address;
  return [address.name, address.line1, address.line2, `${address.postalCode ?? ""} ${address.city ?? ""}`.trim(), address.country]
    .filter(Boolean)
    .join(", ");
};

function OrderProgressTracker({ status }: { status: AdminOrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm text-sm text-red-300 font-semibold">
        Commande annulée
      </div>
    );
  }

  if (status === "HELD_WEATHER") {
    return (
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-sm text-sm text-yellow-300 font-semibold">
        Expédition suspendue temporairement pour raison météo
      </div>
    );
  }

  // PENDING n'est pas encore une commande confirmée : on affiche l'étape 0 en attente
  const currentIndex = status === "PENDING" ? -1 : PROGRESS_STEPS.findIndex((step) => step.key === status);

  return (
    <div className="flex items-center">
      {PROGRESS_STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                  isDone
                    ? "bg-primary text-black border-primary"
                    : "bg-transparent text-muted-foreground border-primary/30"
                } ${isCurrent ? "shadow-[0_0_10px_rgba(216,249,153,0.6)]" : ""}`}
              >
                {isDone ? "✓" : index + 1}
              </div>
              <p className={`text-[10px] uppercase text-center whitespace-nowrap ${isDone ? "text-primary" : "text-muted-foreground"}`}>
                {step.label}
              </p>
            </div>
            {index < PROGRESS_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-4 ${index < currentIndex ? "bg-primary" : "bg-primary/20"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/orders/${orderId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Impossible de charger les détails");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isOpen) return;
    fetchOrderDetail();
  }, [isOpen, orderId, fetchOrderDetail]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
      <div className="bg-black border border-primary/30 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-primary/20 bg-black">
          <div>
            <h2 className="text-lg font-bold text-primary">DÉTAIL COMMANDE</h2>
            {order && (
              <p className="text-sm font-semibold text-foreground mt-1">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : order ? (
            <>
              {/* Suivi de l'avancée */}
              <section className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                <p className="text-xs font-semibold text-primary uppercase mb-4">Suivi de la commande</p>
                <OrderProgressTracker status={order.status} />
              </section>

              {/* Infos générales */}
              <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Statut</p>
                  <p className="text-sm font-semibold text-foreground">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Total</p>
                  <p className="text-lg font-bold text-primary">{Number(order.total).toFixed(2)}€</p>
                </div>
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Date</p>
                  <p className="text-sm text-foreground">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </section>

              {/* Articles */}
              {order.orderItems && order.orderItems.length > 0 && (
                <section className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs font-semibold text-primary uppercase mb-3">Articles</p>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="text-foreground font-medium">{item.variant.product.name}</p>
                          <p className="text-muted-foreground">{item.variantName}</p>
                        </div>
                        <p className="text-foreground">×{item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Paiement */}
              <section className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Statut paiement</p>
                  <p className="text-sm text-foreground font-semibold">{PAYMENT_STATUS_LABELS[order.paymentStatus]}</p>
                </div>
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Moyen de paiement</p>
                  <p className="text-sm text-foreground font-semibold">{order.paymentMethod || "-"}</p>
                </div>
              </section>

              {/* Livraison */}
              <section className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                <p className="text-xs text-muted-foreground uppercase mb-2">Adresse de livraison</p>
                <p className="text-sm text-foreground">{formatShippingAddress(order.shippingAddress)}</p>
              </section>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-primary/20 bg-black">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-primary/50 text-primary hover:bg-primary/10 rounded-sm text-xs h-9"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}

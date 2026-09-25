"use client";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/admin/adminOrderLabels";
import type { AdminOrderStatus, AdminPaymentStatus } from "@/types/admin";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState, type CSSProperties } from "react";

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

const jungleModalStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgba(2,7,5,0.97) 0%, rgba(2,8,6,0.92) 58%, rgba(2,8,6,0.82) 100%), linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px), url("/mandibula-jungle.png")',
  backgroundPosition: "center, 0 0, 0 0, center",
  backgroundSize: "cover, 48px 48px, 48px 48px, cover",
};

const surfaceClass = "relative overflow-hidden border border-[var(--line)] bg-[rgba(7,15,10,0.72)] shadow-[inset_0_0_28px_rgba(112,241,139,0.025)] rounded-none";
const labelClass = "text-[10px] font-black tracking-[0.18em] text-muted-foreground uppercase";

function ScanCorners({ className = "" }: { className?: string }) {
  const cornerClass = "absolute h-4 w-4 border-primary/45";

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`} aria-hidden="true">
      <span className={`${cornerClass} left-0 top-0 border-l border-t`} />
      <span className={`${cornerClass} right-0 top-0 border-r border-t`} />
      <span className={`${cornerClass} bottom-0 left-0 border-b border-l`} />
      <span className={`${cornerClass} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

function OrderProgressTracker({ status }: { status: AdminOrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="border border-red-500/40 bg-red-500/10 p-3 text-sm font-semibold text-red-300 rounded-none">
        Commande annulée
      </div>
    );
  }

  if (status === "HELD_WEATHER") {
    return (
      <div className="border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm font-semibold text-yellow-300 rounded-none">
        Expédition suspendue temporairement pour raison météo
      </div>
    );
  }

  // PENDING n'est pas encore une commande confirmée : on affiche l'étape 0 en attente
  const currentIndex = status === "PENDING" ? -1 : PROGRESS_STEPS.findIndex((step) => step.key === status);

  return (
    <div className="flex min-w-155 items-start md:min-w-0 md:items-center">
      {PROGRESS_STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-7 h-7 border flex items-center justify-center font-mono text-[10px] font-bold rounded-none ${
                  isDone
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-[rgba(7,15,10,0.7)] text-muted-foreground border-line"
                } ${isCurrent ? "shadow-[0_0_18px_rgba(112,241,139,0.38)]" : ""}`}
              >
                {isDone ? "✓" : index + 1}
              </div>
              <p className={`font-mono text-[9px] uppercase text-center whitespace-nowrap ${isDone ? "text-primary" : "text-muted-foreground"}`}>
                {step.label}
              </p>
            </div>
            {index < PROGRESS_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-7 ${index < currentIndex ? "bg-primary" : "bg-line"}`} />
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
    <div className="fixed inset-x-0 bottom-0 top-19 z-60 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:top-23.5 sm:p-5 lg:top-24">
      <div
        className="relative isolate w-full max-w-2xl max-h-[min(90vh,calc(100dvh-8rem))] overflow-hidden border border-primary/35 bg-background text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.62),inset_0_0_70px_rgba(112,241,139,0.035)] rounded-none sm:max-h-[calc(100dvh-8.5rem)] lg:max-h-[calc(100dvh-9rem)]"
        style={jungleModalStyle}
      >
        <div className="pointer-events-none absolute inset-3.5 border border-line opacity-70" aria-hidden="true" />
        <ScanCorners className="m-3.5 opacity-80" />
        <div className="relative z-10 max-h-[inherit] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-5 border-b border-line bg-[rgba(3,8,5,0.9)] p-5 backdrop-blur-sm sm:p-6">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">Compte client · suivi</p>
            <h2 className="mt-2 text-2xl font-black uppercase leading-none tracking-tight text-foreground">Détail commande</h2>
            {order && (
              <p className="mt-3 inline-flex border border-primary/35 bg-primary/10 px-3 py-1 font-mono text-xs font-black text-primary">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center border border-line bg-black/25 text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
            aria-label="Fermer la modale"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5 sm:p-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-none">
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
              <section className={`${surfaceClass} p-4`}>
                <ScanCorners className="opacity-70" />
                <p className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">Suivi de la commande</p>
                <div className="overflow-x-auto pb-1">
                  <OrderProgressTracker status={order.status} />
                </div>
              </section>

              {/* Infos générales */}
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className={`${surfaceClass} p-4`}>
                  <ScanCorners className="opacity-45" />
                  <p className={`${labelClass} mb-2`}>Statut</p>
                  <p className="text-sm font-semibold text-foreground">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
                <div className={`${surfaceClass} p-4`}>
                  <ScanCorners className="opacity-45" />
                  <p className={`${labelClass} mb-2`}>Total</p>
                  <p className="font-mono text-2xl font-black text-primary">{Number(order.total).toFixed(2)}€</p>
                </div>
                <div className={`${surfaceClass} p-4 sm:col-span-2 md:col-span-1`}>
                  <ScanCorners className="opacity-45" />
                  <p className={`${labelClass} mb-2`}>Date</p>
                  <p className="text-sm text-foreground">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </section>

              {/* Articles */}
              {order.orderItems && order.orderItems.length > 0 && (
                <section className={`${surfaceClass} p-4`}>
                  <ScanCorners className="opacity-45" />
                  <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">Articles</p>
                  <div className="divide-y divide-line">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-xs first:pt-0 last:pb-0">
                        <div>
                          <p className="text-foreground font-medium">{item.variant.product.name}</p>
                          <p className="text-muted-foreground">{item.variantName}</p>
                        </div>
                        <p className="font-mono text-primary">×{item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Paiement */}
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className={`${surfaceClass} p-4`}>
                  <ScanCorners className="opacity-45" />
                  <p className={`${labelClass} mb-2`}>Statut paiement</p>
                  <p className="text-sm text-foreground font-semibold">{PAYMENT_STATUS_LABELS[order.paymentStatus]}</p>
                </div>
                <div className={`${surfaceClass} p-4`}>
                  <ScanCorners className="opacity-45" />
                  <p className={`${labelClass} mb-2`}>Moyen de paiement</p>
                  <p className="text-sm text-foreground font-semibold">{order.paymentMethod || "-"}</p>
                </div>
              </section>

              {/* Livraison */}
              <section className={`${surfaceClass} p-4`}>
                <ScanCorners className="opacity-45" />
                <p className={`${labelClass} mb-2`}>Adresse de livraison</p>
                <p className="text-sm text-foreground">{formatShippingAddress(order.shippingAddress)}</p>
              </section>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-line bg-[rgba(3,8,5,0.9)] p-5 backdrop-blur-sm sm:p-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="h-10 w-full rounded-none border-line bg-transparent text-xs font-black uppercase tracking-[0.12em] text-primary hover:border-primary/70 hover:bg-primary/10"
          >
            Fermer
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}

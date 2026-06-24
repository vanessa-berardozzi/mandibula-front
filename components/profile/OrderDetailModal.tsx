"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderItemDetail {
  id: string;
  quantity: number;
  price: string | number;
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
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: string | number;
  subtotal: string | number;
  shippingCost: string | number;
  tax: string | number;
  createdAt: string;
  billingAddress?: string;
  shippingAddress?: string;
  notes?: string;
  orderItems: OrderItemDetail[];
}

interface OrderDetailModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
    case "Livré":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "CONFIRMED":
    case "En cours":
      return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    case "PENDING":
    case "En préparation":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    case "CANCELLED":
    case "Annulé":
      return "bg-red-500/20 text-red-300 border-red-500/50";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "PENDING":
      return "bg-orange-500/20 text-orange-300 border-orange-500/50";
    case "FAILED":
      return "bg-red-500/20 text-red-300 border-red-500/50";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case "PAID":
      return "Payée";
    case "PENDING":
      return "En attente";
    case "FAILED":
      return "Échouée";
    default:
      return status;
  }
};

const getOrderStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "CONFIRMED":
      return "Confirmée";
    case "DELIVERED":
      return "Livrée";
    case "CANCELLED":
      return "Annulée";
    default:
      return status;
  }
};

export function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetchOrderDetail();
  }, [isOpen, orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/orders/${orderId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Impossible de charger les détails de la commande");
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-32">
      <div className="bg-black border border-primary/30 rounded-sm w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-primary/20 bg-black">
          <div>
            <h2 className="text-xl font-bold text-primary">Détails de la Commande</h2>
            {order && (
              <p className="text-xs text-muted-foreground mt-1">
                {order.id.slice(0, 8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
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
              {/* Status Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Statut de la commande</p>
                  <Badge className={`${getStatusColor(order.status)} border text-xs`}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Statut du paiement</p>
                  <Badge className={`${getPaymentStatusColor(order.paymentStatus)} border text-xs`}>
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Badge>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Articles ({order.orderItems.length})</h3>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-accent/15 border border-primary/20 rounded-sm flex items-start gap-3"
                    >
                      {item.variant.product.images?.[0] && (
                        <div className="w-12 h-12 bg-accent/30 rounded-sm shrink-0 overflow-hidden">
                          <img
                            src={item.variant.product.images[0]}
                            alt={item.variant.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{item.variant.product.name}</p>
                        <p className="text-xs font-medium text-foreground">{item.variantName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Quantité: {item.quantity}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-semibold text-primary">
                          {(Number(item.price) * item.quantity).toFixed(2)}€
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Number(item.price).toFixed(2)}€ × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="p-4 bg-accent/15 border border-primary/20 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground">{Number(order.subtotal).toFixed(2)}€</span>
                </div>
                {order.shippingCost && Number(order.shippingCost) > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Frais de port</span>
                    <span className="text-foreground">{Number(order.shippingCost).toFixed(2)}€</span>
                  </div>
                )}
                {order.tax && Number(order.tax) > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="text-foreground">{Number(order.tax).toFixed(2)}€</span>
                  </div>
                )}
                <div className="border-t border-primary/20 pt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">{Number(order.total).toFixed(2)}€</span>
                </div>
              </div>

              {/* Addresses Section */}
              {(order.shippingAddress || order.billingAddress) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.shippingAddress && (
                    <div className="p-3 bg-accent/15 border border-primary/20 rounded-sm">
                      <p className="text-xs font-semibold text-primary uppercase mb-2">Adresse de livraison</p>
                      <p className="text-xs text-foreground whitespace-pre-wrap">{order.shippingAddress}</p>
                    </div>
                  )}
                  {order.billingAddress && (
                    <div className="p-3 bg-accent/15 border border-primary/20 rounded-sm">
                      <p className="text-xs font-semibold text-primary uppercase mb-2">Adresse de facturation</p>
                      <p className="text-xs text-foreground whitespace-pre-wrap">{order.billingAddress}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Section */}
              {order.notes && (
                <div className="p-3 bg-accent/15 border border-primary/20 rounded-sm">
                  <p className="text-xs font-semibold text-primary uppercase mb-2">Notes</p>
                  <p className="text-xs text-foreground whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}

              {/* Payment Method */}
              <div className="p-3 bg-accent/15 border border-primary/20 rounded-sm">
                <p className="text-xs font-semibold text-primary uppercase">Méthode de paiement</p>
                <p className="text-xs text-foreground mt-1">{order.paymentMethod || "Non spécifiée"}</p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-primary/20 bg-black flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-primary/50 text-primary hover:bg-primary/10 rounded-sm text-xs h-8"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}

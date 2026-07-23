"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { OrderDetailModal } from "./OrderDetailModal";

interface OrderItem {
  id: string;
  date: string;
  orderNumber: string;
  total: number;
  status: "Livré" | "En cours" | "Annulé" | "En préparation" | "Paiement en attente";
  items: number;
  trackingUrl?: string;
  canRetry?: boolean;
}

interface OrderHistoryProps {
  orders: OrderItem[];
  onDeleteOrder?: (orderId: string) => Promise<void>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Livré":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "En cours":
      return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    case "En préparation":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    case "Paiement en attente":
      return "bg-orange-500/20 text-orange-300 border-orange-500/50";
    case "Annulé":
      return "bg-red-500/20 text-red-300 border-red-500/50";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

function RetryButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentMethod: "SUM_UP" }),
      });
      if (!res.ok) throw new Error();
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleRetry}
      disabled={loading}
      className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/50 rounded-sm text-xs h-8 gap-1"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
      Reprendre
    </Button>
  );
}

function DeleteButton({ orderId, onDelete }: { orderId: string; onDelete: (id: string) => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.")) return;
    
    setLoading(true);
    try {
      await onDelete(orderId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded-sm text-xs h-8 gap-1"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
      Annuler
    </Button>
  );
}

export function OrderHistory({ orders, onDeleteOrder }: OrderHistoryProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = async (orderId: string) => {
    if (!onDeleteOrder) return;
    try {
      await onDeleteOrder(orderId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <Card className="border-primary/30 bg-card/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-primary">Historique des Commandes</CardTitle>
        <CardDescription>Vos {orders.length} dernière(s) commande(s)</CardDescription>
      </CardHeader>

      <div className="px-6 pb-6 space-y-3">
        {sortedOrders.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Aucune commande pour le moment. 🎮</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className="relative p-3 sm:p-4 bg-accent/15 border border-primary/20 rounded-sm hover:border-primary/50 transition-colors"
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                }}
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />

                {/* Mobile layout (stacked) */}
                <div className="flex flex-col gap-3 sm:hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Commande</p>
                      <p className="text-sm font-bold text-primary font-mono">{order.orderNumber}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border shrink-0`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Date</p>
                      <p className="text-foreground">{new Date(order.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Total</p>
                      <p className="font-semibold text-primary">{order.total.toFixed(2)}€</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Articles</p>
                      <p className="text-foreground">{order.items} article(s)</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full pt-2">
                    {order.canRetry ? (
                      <>
                        <div className="flex-1">
                          <RetryButton orderId={order.id} />
                        </div>
                        {onDeleteOrder && (
                          <div className="flex-1">
                            <DeleteButton orderId={order.id} onDelete={handleDelete} />
                          </div>
                        )}
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-xs h-8"
                      >
                        Détails
                      </Button>
                    )}
                  </div>
                </div>

                {/* Desktop layout (grid) */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
                  <div className="md:col-span-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Commande</p>
                    <p className="text-sm font-bold text-primary font-mono">{order.orderNumber}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase">Date</p>
                    <p className="text-sm text-foreground">{new Date(order.date).toLocaleDateString("fr-FR")}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase">Total</p>
                    <p className="text-sm font-semibold text-primary">{order.total.toFixed(2)}€</p>
                  </div>

                  <div className="md:col-span-1">
                    <p className="text-xs text-muted-foreground uppercase">Articles</p>
                    <p className="text-sm text-foreground">{order.items}</p>
                  </div>

                  <div className="md:col-span-2">
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-2 justify-end">
                    {order.canRetry ? (
                      <>
                        <RetryButton orderId={order.id} />
                        {onDeleteOrder && (
                          <DeleteButton orderId={order.id} onDelete={handleDelete} />
                        )}
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-xs h-8"
                      >
                        Détails
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </Card>
  );
}



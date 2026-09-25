"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ORDER_STATUS_LABELS } from "@/lib/admin/adminOrderLabels";
import type { AdminOrderStatus } from "@/types/admin";
import { Loader2, Search } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { OrderDetailModal } from "./OrderDetailModal";

interface OrderItem {
  id: string;
  date: string;
  orderNumber: string;
  total: number;
  status: AdminOrderStatus;
  items: number;
  trackingUrl?: string;
  canRetry?: boolean;
}

interface OrderHistoryProps {
  orders: OrderItem[];
  onDeleteOrder?: (orderId: string) => Promise<void>;
}

const historyPanelStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgba(2,7,5,0.96) 0%, rgba(2,8,6,0.88) 48%, rgba(2,8,6,0.58) 100%), radial-gradient(circle at 88% 20%, rgba(112,241,139,0.18), transparent 22%), linear-gradient(rgba(255,255,255,0.026) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.026) 1px, transparent 1px), url("/mandibula-jungle.png")',
  backgroundPosition: "center, center, 0 0, 0 0, center",
  backgroundSize: "cover, cover, 44px 44px, 44px 44px, cover",
};

const orderRowStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, rgba(12,34,18,0.9), rgba(4,13,7,0.82) 58%, rgba(4,13,7,0.68)), url("/mandibula-jungle.png")',
  backgroundPosition: "center",
  backgroundSize: "cover",
};

function ScanCorners({ className = "" }: { className?: string }) {
  const cornerClass = "absolute h-5 w-5 border-primary/75";

  return (
    <div className={`pointer-events-none absolute inset-0 z-10 ${className}`} aria-hidden="true">
      <span className={`${cornerClass} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${cornerClass} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${cornerClass} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${cornerClass} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

const getStatusColor = (status: AdminOrderStatus) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "CONFIRMED":
    case "READY":
    case "SHIPPED":
      return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    case "PENDING":
    case "TO_PREPARE":
    case "PREPARING":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    case "HELD_WEATHER":
      return "bg-orange-500/20 text-orange-300 border-orange-500/50";
    case "CANCELLED":
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
      className="h-9 rounded-none border border-orange-500/60 bg-orange-500/20 text-xs font-black uppercase tracking-[0.08em] text-orange-200 hover:bg-orange-500/30"
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
      className="h-9 rounded-none border border-red-500/60 bg-red-500/20 text-xs font-black uppercase tracking-[0.08em] text-red-200 hover:bg-red-500/30"
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
    <Card
      className="relative isolate overflow-hidden border-primary/50 bg-background shadow-[0_22px_80px_rgba(0,0,0,0.32),inset_0_0_80px_rgba(112,241,139,0.05)]"
      style={historyPanelStyle}
    >
      <div className="pointer-events-none absolute inset-4 border border-(--system-line) opacity-55" aria-hidden="true" />
      <ScanCorners className="m-4" />

      <CardHeader className="relative z-20 border-b border-primary/25 bg-black/20 px-5 py-5 sm:px-7">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-primary">Compte client · archive</p>
        <CardTitle className="mt-2 text-2xl font-black uppercase leading-none tracking-tight text-foreground">Historique des commandes</CardTitle>
        <CardDescription className="text-muted-foreground">{orders.length} commande(s) enregistrée(s)</CardDescription>
      </CardHeader>

      <div className="relative z-20 space-y-3 px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
        {sortedOrders.length === 0 ? (
          <div className="border border-primary/25 bg-black/30 py-8 text-center text-muted-foreground">
            <p>Aucune commande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className="relative overflow-hidden border border-primary/35 p-4 shadow-[inset_0_0_40px_rgba(112,241,139,0.055)] transition-colors hover:border-primary/80 sm:p-5"
                style={orderRowStyle}
              >
                <ScanCorners className="opacity-80" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-primary/70" aria-hidden="true" />

                {/* Mobile layout (stacked) */}
                <div className="flex flex-col gap-3 sm:hidden">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Commande</p>
                      <p className="font-mono text-base font-black text-primary">{order.orderNumber}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border shrink-0`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Date</p>
                      <p className="text-foreground">{new Date(order.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Total</p>
                      <p className="font-semibold text-primary">{order.total.toFixed(2)}€</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Articles</p>
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
                        className="h-10 w-full rounded-none border border-primary bg-primary text-xs font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/85"
                      >
                        <Search className="h-3.5 w-3.5" />
                        Détails
                      </Button>
                    )}
                  </div>
                </div>

                {/* Desktop layout (grid) */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
                  <div className="md:col-span-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Commande</p>
                    <p className="font-mono text-base font-black text-primary">{order.orderNumber}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Date</p>
                    <p className="text-sm text-foreground">{new Date(order.date).toLocaleDateString("fr-FR")}</p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Total</p>
                    <p className="font-mono text-base font-black text-primary">{order.total.toFixed(2)}€</p>
                  </div>

                  <div className="md:col-span-1">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Articles</p>
                    <p className="text-sm text-foreground">{order.items}</p>
                  </div>

                  <div className="md:col-span-2">
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {ORDER_STATUS_LABELS[order.status]}
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
                        className="h-9 rounded-none border border-primary bg-primary px-4 text-xs font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/85"
                      >
                        <Search className="h-3.5 w-3.5" />
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



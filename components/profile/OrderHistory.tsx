"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderItem {
  id: string;
  date: string;
  orderNumber: string;
  total: number;
  status: "Livré" | "En cours" | "Annulé" | "En préparation";
  items: number;
  trackingUrl?: string;
}

interface OrderHistoryProps {
  orders: OrderItem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Livré":
      return "bg-green-500/20 text-green-300 border-green-500/50";
    case "En cours":
      return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    case "En préparation":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    case "Annulé":
      return "bg-red-500/20 text-red-300 border-red-500/50";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export function OrderHistory({ orders }: OrderHistoryProps) {
  // Trier les commandes les plus récentes d'abord
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
                className="relative p-4 bg-accent/15 border border-primary/20 rounded-sm hover:border-primary/50 transition-colors"
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                }}
              >
                {/* Petit coin décoratif */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Numéro de commande */}
                  <div className="md:col-span-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Commande</p>
                    <p className="text-sm font-bold text-primary font-mono">{order.orderNumber}</p>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase">Date</p>
                    <p className="text-sm text-foreground">{new Date(order.date).toLocaleDateString("fr-FR")}</p>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase">Total</p>
                    <p className="text-sm font-semibold text-primary">{order.total.toFixed(2)}€</p>
                  </div>

                  {/* Nombre articles */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase">Articles</p>
                    <p className="text-sm text-foreground">{order.items} article(s)</p>
                  </div>

                  {/* Statut */}
                  <div className="md:col-span-2">
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {order.status}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex gap-2 justify-end">
                    <Button
                      size="sm"
                      className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-xs h-8"
                    >
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

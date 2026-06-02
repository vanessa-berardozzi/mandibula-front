"use client";

import { OrderHistory } from "@/components/profile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth.client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ApiOrderItem {
  id: string;
  quantity: number;
  variant: { product: { id: string; name: string; images: string[] } };
}

interface ApiOrder {
  id: string;
  status: string;
  paymentStatus: string;
  total: string | number;
  createdAt: string;
  orderItems: ApiOrderItem[];
}

function mapStatus(order: ApiOrder): "Livré" | "En cours" | "Annulé" | "En préparation" | "Paiement en attente" {
  if (order.paymentStatus === "PAID") return "Livré";
  if (order.status === "CANCELLED" || order.paymentStatus === "FAILED") return "Annulé";
  if (order.paymentStatus === "PENDING") return "Paiement en attente";
  if (order.status === "CONFIRMED") return "En cours";
  return "En préparation";
}

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

export default function OrdersPage() {
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      // Redirect to login would happen here
      setOrdersLoading(false);
    }
  }, [isPending, session]);

  useEffect(() => {
    if (!session?.user) return;
    fetchOrders();
  }, [session?.user]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setError(null);
      const res = await fetch("/api/orders", { credentials: "include" });
      if (!res.ok) throw new Error("Erreur lors du chargement des commandes");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de l'annulation");
      }

      // Recharger les commandes après la suppression
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
      throw err;
    }
  };

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen pb-12">
        <div className="w-full px-4 md:px-8 text-center text-muted-foreground">
          Chargement...
        </div>
      </main>
    );
  }

  const mappedOrders: OrderItem[] = orders.map((o) => ({
    id: o.id,
    date: o.createdAt,
    orderNumber: `#${o.id.slice(0, 8).toUpperCase()}`,
    total: Number(o.total),
    status: mapStatus(o),
    items: o.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    canRetry: o.paymentStatus === "PENDING",
  }));

  return (
    <main className="min-h-screen pb-12">
      <div className="w-full px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mes Commandes</h1>
          <p className="text-muted-foreground">Consultez et gérez toutes vos commandes</p>
        </div>

        {error && (
          <Card className="mb-8 border-red-500/30 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-300 text-base">Erreur</CardTitle>
              <CardDescription className="text-red-200">{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {ordersLoading ? (
          <Card className="border-primary/30 bg-card/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-primary">Mes Commandes</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          </Card>
        ) : (
          <OrderHistory orders={mappedOrders} onDeleteOrder={handleDeleteOrder} />
        )}
      </div>
    </main>
  );
}

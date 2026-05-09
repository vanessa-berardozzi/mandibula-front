"use client";

import { AccountSettings, OrderHistory, SavedAddresses, UserProfileHeader, UserStats } from "@/components/profile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut, useSession } from "@/lib/auth.client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ── Types API ─────────────────────────────────────────────────────────────────

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

// ── Mapping statut API → label FR ────────────────────────────────────────────

function mapStatus(order: ApiOrder): "Livré" | "En cours" | "Annulé" | "En préparation" | "Paiement en attente" {
  if (order.paymentStatus === "PAID") return "Livré";
  if (order.status === "CANCELLED" || order.paymentStatus === "FAILED") return "Annulé";
  if (order.paymentStatus === "PENDING") return "Paiement en attente";
  if (order.status === "CONFIRMED") return "En cours";
  return "En préparation";
}

const MOCK_USER = {
  userName: "MandibulaDemo",
  email: "user@mandibula.demo",
  avatarUrl: undefined,
  memberSince: "Janvier 2024",
  level: 8,
  loyaltyPoints: 2450,
};

const MOCK_ADDRESSES = [
  {
    id: "1",
    label: "Forteresse principale",
    fullName: "Jungle Survivor",
    street: "123 Rue de la Végétation",
    city: "Amazonis",
    postalCode: "69000",
    country: "Jungle Primaire",
    phone: "+33 6 12 34 56 78",
    isDefault: true,
  },
  {
    id: "2",
    label: "Bunker de secours",
    fullName: "Jungle Survivor",
    street: "456 Avenue des Fougères",
    city: "Neo-Tropica",
    postalCode: "75000",
    country: "Jungle Primaire",
    phone: "+33 6 98 76 54 32",
    isDefault: false,
  },
];

const MOCK_SETTINGS = [
  {
    id: "email-notif",
    label: "Notifications par email",
    description: "Recevez des mises à jour sur vos commandes et promotions",
    icon: "📧",
    action: () => console.log("Toggle email notifications"),
    actionLabel: "Gérer",
    type: "button" as const,
    status: true,
  },
  {
    id: "2fa",
    label: "Authentification à 2 facteurs",
    description: "Sécurisez votre compte avec 2FA",
    icon: "🔐",
    action: () => console.log("Toggle 2FA"),
    actionLabel: "Activer",
    type: "button" as const,
    status: false,
  },
  {
    id: "newsletter",
    label: "Infolettre & Promotions",
    description: "Recevez les dernières news et offres exclusives",
    icon: "📢",
    action: () => console.log("Toggle newsletter"),
    actionLabel: "Désabonner",
    type: "button" as const,
    status: true,
  },
  {
    id: "privacy",
    label: "Données personnelles",
    description: "Téléchargez ou supprimez vos données",
    icon: "👤",
    action: () => console.log("Manage privacy"),
    actionLabel: "Gérer",
    type: "button" as const,
  },
];

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((data: ApiOrder[]) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [session?.user]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen pb-12">
        <div className="w-full px-4 md:px-8 text-center text-muted-foreground">
          Chargement du profil...
        </div>
      </main>
    );
  }

  // Calcul des stats depuis les vraies commandes
  const totalSpent = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingCount = orders.filter((o) => o.paymentStatus === "PENDING").length;

  const stats = [
    { label: "Commandes", value: ordersLoading ? "..." : String(orders.length), icon: "📦", color: "primary" as const },
    { label: "Dépense totale", value: ordersLoading ? "..." : `${totalSpent.toFixed(2)}€`, icon: "💰", color: "secondary" as const },
    { label: "En attente", value: ordersLoading ? "..." : String(pendingCount), icon: "⏳", color: "accent" as const },
    { label: "Réductions actives", value: "0", icon: "🎟️", color: "primary" as const },
  ];

  // Mapping API → format OrderHistory
  const mappedOrders = orders.map((o) => ({
    id: o.id,
    date: o.createdAt,
    orderNumber: `#${o.id.slice(0, 8).toUpperCase()}`,
    total: Number(o.total),
    status: mapStatus(o),
    items: o.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    canRetry: o.paymentStatus === "PENDING",
  }));

  const profileHeaderData = {
    ...MOCK_USER,
    userName: session.user.name || MOCK_USER.userName,
    email: session.user.email,
  };

  return (
    <main className="min-h-screen pb-12">
      <div className="w-full px-4 md:px-8">
        {/* En-tête du profil */}
        <UserProfileHeader {...profileHeaderData} onSignOut={handleSignOut} />

        {/* Statistiques utilisateur */}
        <UserStats stats={stats} />

        {/* Historique des commandes */}
        <div className="mb-8">
          <OrderHistory orders={mappedOrders} />
        </div>

        {/* Section adresses et paramètres - Grille responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SavedAddresses addresses={MOCK_ADDRESSES} />
          <AccountSettings settings={MOCK_SETTINGS} />
        </div>

        {/* Section favori/wishlist (bonus) */}
        <Card className="border-primary/30 bg-card/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-primary">Liste de Souhait</CardTitle>
            <CardDescription>Vos articles favoris à suivre 🎯</CardDescription>
          </CardHeader>

          <div className="px-6 pb-6">
            <div className="py-8 text-center text-muted-foreground">
              <p className="mb-4">Aucun article dans votre liste de souhait</p>
              <button className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-sm font-semibold transition-colors">
                Explorer les produits
              </button>
            </div>
          </div>
        </Card>

        {/* Zone danger - Suppression de compte */}
        <div className="mt-8 relative p-4 bg-red-500/10 backdrop-blur border-2 border-red-500/30 rounded-sm" 
          style={{
            clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
          }}>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-red-500/50" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-red-300 mb-1">Zone Danger 🚨</h3>
              <p className="text-xs text-red-200/70">Supprimer définitivement votre compte et toutes vos données</p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded-sm text-sm font-semibold transition-colors whitespace-nowrap">
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

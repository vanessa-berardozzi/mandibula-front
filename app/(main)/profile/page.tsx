"use client";

import { AccountSettings, OrderHistory, SavedAddresses, UserProfileHeader, UserStats } from "@/components/profile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut, useSession } from "@/lib/auth.client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Types pour les données
const MOCK_USER = {
  userName: "MandibulaDemo",
  email: "user@mandibula.demo",
  avatarUrl: undefined,
  memberSince: "Janvier 2024",
  level: 8,
  loyaltyPoints: 2450,
};

const MOCK_STATS = [
  {
    label: "Commandes",
    value: "12",
    icon: "📦",
    color: "primary" as const,
  },
  {
    label: "Dépense totale",
    value: "2,847€",
    icon: "💰",
    color: "secondary" as const,
  },
  {
    label: "En attente",
    value: "2",
    icon: "⏳",
    color: "accent" as const,
  },
  {
    label: "Réductions actives",
    value: "3",
    icon: "🎟️",
    color: "primary" as const,
  },
];

const MOCK_ORDERS = [
  {
    id: "1",
    date: "2024-03-15",
    orderNumber: "#ORD-2024-001",
    total: 299.99,
    status: "Livré" as const,
    items: 3,
    trackingUrl: "#",
  },
  {
    id: "2",
    date: "2024-03-10",
    orderNumber: "#ORD-2024-002",
    total: 549.98,
    status: "En cours" as const,
    items: 5,
    trackingUrl: "#",
  },
  {
    id: "3",
    date: "2024-03-05",
    orderNumber: "#ORD-2024-003",
    total: 199.99,
    status: "En préparation" as const,
    items: 1,
    trackingUrl: "#",
  },
  {
    id: "4",
    date: "2024-02-28",
    orderNumber: "#ORD-2024-004",
    total: 1797.03,
    status: "Livré" as const,
    items: 12,
    trackingUrl: "#",
  },
];

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

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          Chargement du profil...
        </div>
      </main>
    );
  }

  const profileHeaderData = {
    ...MOCK_USER,
    userName: session.user.name || MOCK_USER.userName,
    email: session.user.email,
    avatarUrl: session.user.image || MOCK_USER.avatarUrl,
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* En-tête du profil */}
        <UserProfileHeader {...profileHeaderData} onSignOut={handleSignOut} />

        {/* Statistiques utilisateur */}
        <UserStats stats={MOCK_STATS} />

        {/* Historique des commandes */}
        <div className="mb-8">
          <OrderHistory orders={MOCK_ORDERS} />
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

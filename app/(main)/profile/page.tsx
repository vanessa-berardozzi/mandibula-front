"use client";

import { SimpleProductCard } from "@/components/features/SimpleProductCard";
import { SavedAddresses, UserProfileHeader, UserStats } from "@/components/profile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/hooks/useFavorites";
import { signOut, useSession } from "@/lib/auth.client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MOCK_USER = {
  userName: "MandibulaDemo",
  email: "user@mandibula.demo",
  avatarUrl: undefined,
  memberSince: "Janvier 2024",
  level: 8,
  loyaltyPoints: 2450,
};

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
  const { items: favorites, isLoading: favLoading } = useFavorites();

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
      <main className="min-h-screen pb-12">
        <div className="w-full px-4 md:px-8 text-center text-muted-foreground">
          Chargement du profil...
        </div>
      </main>
    );
  }

  const stats = [
    { label: "Commandes", value: "...", icon: "📦", color: "primary" as const },
    { label: "Dépense totale", value: "...", icon: "💰", color: "secondary" as const },
    { label: "Niveau", value: String(MOCK_USER.level), icon: "⭐", color: "accent" as const },
    { label: "Points de fidélité", value: String(MOCK_USER.loyaltyPoints), icon: "🎟️", color: "primary" as const },
  ];

  const memberSince = session.user.createdAt
    ? new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
        new Date(session.user.createdAt)
      )
    : MOCK_USER.memberSince;

  const profileHeaderData = {
    ...MOCK_USER,
    userName: session.user.name,
    email: session.user.email,
    memberSince,
  };

  return (
    <main className="min-h-screen pb-12">
      <div className="w-full px-4 md:px-8">
        {/* En-tête du profil */}
        <UserProfileHeader {...profileHeaderData} onSignOut={handleSignOut} />

        {/* Statistiques utilisateur */}
        <UserStats stats={stats} />

        {/* Section adresses et paramètres - Grille responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SavedAddresses />
         {/* <AccountSettings settings={MOCK_SETTINGS} /> */}
        </div>

        {/* Section favoris */}
        <Card className="border-primary/30 bg-card/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-primary">Liste de Souhait</CardTitle>
            <CardDescription>Vos articles favoris à suivre 🎯</CardDescription>
          </CardHeader>

          <div className="px-6 pb-6">
            {favLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">Chargement...</div>
            ) : favorites.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="mb-4">Aucun article dans votre liste de souhait</p>
                <Link
                  href="/"
                  className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50 rounded-sm text-sm font-semibold transition-colors"
                >
                  Explorer les produits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                {favorites.map(({ product }) => {
                  const firstVariant = product.variants[0];
                  const stock = firstVariant
                    ? firstVariant.stock - firstVariant.reservedStock
                    : 0;
                  return (
                    <SimpleProductCard
                      key={product.id}
                      productId={product.id}
                      title={product.name}
                      price={parseFloat(product.price)}
                      stock={stock}
                      imageUrl={product.images[0]}
                      href={`/product/${product.id}`}
                      variantId={firstVariant?.id}
                      categoryName={product.category.name}
                    />
                  );
                })}
              </div>
            )}
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

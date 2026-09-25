"use client";

import { SimpleProductCard } from "@/components/features/SimpleProductCard";
import { SavedAddresses, UserProfileHeader } from "@/components/profile";
import styles from "@/components/profile/Profile.module.css";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFavorites } from "@/hooks/useFavorites";
import { signOut, useSession } from "@/lib/auth.client";
import { toPrice } from "@/lib/priceUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MOCK_USER = {
  userName: "MandibulaDemo",
  email: "user@mandibula.demo",
  avatarUrl: undefined,
  memberSince: "Janvier 2024",
  level: 8,
  loyaltyPoints: 2450,
};

interface ProfileOrder {
  id: string;
  status: string;
  paymentStatus: string;
  total: string | number;
}

const euroFormatter = new Intl.NumberFormat("fr-LU", {
  style: "currency",
  currency: "EUR",
});

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { items: favorites, isLoading: favLoading } = useFavorites();
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Échec de la suppression");
      await signOut();
      router.replace("/");
    } catch {
      setDeleteError("La suppression du compte a échoué. Veuillez réessayer.");
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session?.user) return;

    let cancelled = false;
    fetch("/api/orders", { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Commandes indisponibles");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
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
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const totalSpent = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const activeStatuses = ["PENDING", "CONFIRMED", "TO_PREPARE", "PREPARING", "HELD_WEATHER", "READY", "SHIPPED"];
  const activeOrders = orders.filter((order) => activeStatuses.includes(order.status)).length;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.index} aria-hidden="true">
          <span>Compte membre / profil</span>
          <span>Mandibula biosystem · accès sécurisé</span>
        </div>
        {/* En-tête du profil */}
        <UserProfileHeader {...profileHeaderData} onSignOut={handleSignOut} />

        {/* Section adresses et commandes - Grille responsive */}
        <div className={styles.layout}>
          <SavedAddresses />

          {/* Accès à l'historique et au suivi des commandes */}
          <Card className={`${styles.panel} ${styles.orders}`}>
            <CardHeader className={`${styles.panelHeader} ${styles.ordersHeader}`}>
              <div>
                <CardTitle className={styles.panelTitle}>Mes commandes</CardTitle>
                <CardDescription className={styles.panelDescription}>Suivez vos commandes et consultez le détail de chacune</CardDescription>
              </div>
            </CardHeader>
            <div className={styles.orderStats} aria-busy={ordersLoading}>
              <div className={styles.orderStat}>
                <span>Commandes</span>
                <strong>{ordersLoading ? "—" : orders.length}</strong>
              </div>
              <div className={styles.orderStat}>
                <span>Total dépensé</span>
                <strong>{ordersLoading ? "—" : euroFormatter.format(totalSpent)}</strong>
              </div>
              <div className={styles.orderStat}>
                <span>En cours</span>
                <strong>{ordersLoading ? "—" : activeOrders}</strong>
              </div>
            </div>
            <div className={styles.ordersBody}>
              <p className={styles.ordersNote}>Le montant cumulé inclut uniquement les commandes payées.</p>
              <Link
                href="/orders"
                className={styles.action}
              >
                Voir mes commandes
              </Link>
            </div>
          </Card>
        </div>

        {/* Section favoris */}
        <Card className={`${styles.panel} ${styles.wishlist}`}>
          <CardHeader className={styles.panelHeader}>
            <CardTitle className={styles.panelTitle}>Liste de souhaits</CardTitle>
            <CardDescription className={styles.panelDescription}>Vos espèces et équipements favoris</CardDescription>
          </CardHeader>

          <div className="px-6 pb-6">
            {favLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">Chargement...</div>
            ) : favorites.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="mb-4">Aucun article dans votre liste de souhait</p>
                <Link
                  href="/"
                  className={styles.action}
                >
                  Explorer les produits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                {favorites.map(({ product }) => {
                  const firstVariant = product.variants[0];
                  const stock = Math.max(0, product.totalStock - product.reservedStock);
                  return (
                    <SimpleProductCard
                      key={product.id}
                      productId={product.id}
                      title={product.name}
                      price={toPrice(product.price)}
                      stock={stock}
                      imageUrl={product.images[0]}
                      href={`/product/${product.id}`}
                      variantId={firstVariant?.id}
                      categoryName={product.category.name}
                      categorySlug={product.category.slug}
                      vatCategory={product.vatCategory}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Zone danger - Suppression de compte */}
        <div className={styles.danger}>
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-red-500/50" />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-red-300 mb-1">Zone Danger 🚨</h3>
              <p className="text-xs text-red-200/70">Supprimer définitivement votre compte et toutes vos données</p>
            </div>
            <button
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded-sm text-sm font-semibold transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Suppression..." : "Supprimer le compte"}
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={(open) => !isDeleting && setShowDeleteDialog(open)}>
        <DialogContent className="border-2 border-red-500/40 bg-card/95 backdrop-blur">
          <DialogTitle className="text-red-300">Supprimer votre compte ? 🚨</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Cette action est <span className="font-semibold text-red-300">irréversible</span>.
            Toutes vos données personnelles (profil, favoris, adresses) seront définitivement supprimées.
          </DialogDescription>

          {deleteError && (
            <p className="text-sm text-red-400">{deleteError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded-sm text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Suppression..." : "Oui, supprimer définitivement"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

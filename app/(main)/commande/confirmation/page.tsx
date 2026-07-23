"use client";

import { useCartContext } from "@/context/CartContext";
import { useSession } from "@/lib/auth.client";
import { Check, Loader2, PackageCheck, ShoppingBag, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface OrderStatus {
  orderId: string;
  status: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "DELETED" | "REFUNDED";
  total: number | string;
}

function OrderConfirmationContent() {
  const { data: session, isPending: sessionLoading } = useSession();
  const { clearCart } = useCartContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  // Vider le panier quand le paiement est confirmé
  useEffect(() => {
    if (orderStatus?.paymentStatus === "PAID" && !cartCleared) {
      clearCart();
      setCartCleared(true);
    }
  }, [orderStatus, cartCleared, clearCart]);

  useEffect(() => {
    if (sessionLoading) return; // Attendre que la session soit chargée

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (!orderId) {
      setError("ID de commande manquant");
      setIsLoading(false);
      return;
    }

    // Fonction pour vérifier le statut de la commande
    const checkOrderStatus = async () => {
      try {
        const response = await fetch(
          `/api/checkout/order/${orderId}/status`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la vérification du statut");
        }

        const data: OrderStatus = await response.json();
        setOrderStatus(data);
        setIsLoading(false);

        // Si le paiement est toujours en attente, réessayer dans 3 secondes
        if (data.paymentStatus === "PENDING") {
          setTimeout(checkOrderStatus, 3000);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
        setIsLoading(false);
      }
    };

    checkOrderStatus();
  }, [session, sessionLoading, orderId, router]);

  if (sessionLoading || !session?.user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center"
              style={{ boxShadow: "0 0 20px rgba(146,204,10,0.2), inset 0 0 20px rgba(146,204,10,0.05)" }}>
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary/20" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground"
            style={{ textShadow: "0 0 10px rgba(146,204,10,0.5)" }}>
            Vérification du paiement...
          </h2>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">Connexion au système de paiement</p>
        </div>
      </div>
    );
  }

  if (error || !orderStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative max-w-md w-full">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-destructive" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-destructive" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-destructive" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-destructive" />

          <div className="text-center px-8 py-10"
            style={{ background: "rgba(13,31,20,0.85)", backdropFilter: "blur(12px)", boxShadow: "0 0 30px rgba(204,21,21,0.15)" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-destructive/10 border border-destructive/30">
              <X className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Erreur système</h2>
            <p className="text-muted-foreground mb-8 text-sm">{error || "Commande introuvable"}</p>
            <button
              onClick={() => router.push("/cart")}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-all uppercase tracking-wider text-sm"
              style={{ boxShadow: "0 0 15px rgba(146,204,10,0.3)" }}
            >
              Retour au panier
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paiement réussi
  if (orderStatus.paymentStatus === "PAID") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative max-w-lg w-full">
          {/* Corner brackets */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary" style={{ filter: "drop-shadow(0 0 6px #92cc0a)" }} />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary" style={{ filter: "drop-shadow(0 0 6px #92cc0a)" }} />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary" style={{ filter: "drop-shadow(0 0 6px #92cc0a)" }} />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary" style={{ filter: "drop-shadow(0 0 6px #92cc0a)" }} />

          {/* Scan lines overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-sm opacity-30"
            style={{ background: "repeating-linear-gradient(0deg, rgba(146,204,10,0.03) 0px, rgba(146,204,10,0.03) 1px, transparent 1px, transparent 2px)" }} />

          <div className="relative px-8 py-10 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(13,31,20,0.9) 0%, rgba(9,21,13,0.95) 100%)",
              backdropFilter: "blur(16px)",
              boxShadow: "inset 0 0 30px rgba(146,204,10,0.05), 0 0 40px rgba(146,204,10,0.1), 0 0 80px rgba(146,204,10,0.05)",
              border: "1px solid rgba(146,204,10,0.15)",
            }}>

            {/* Icône succès */}
            <div className="relative inline-flex mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-primary/10 border border-primary/40"
                style={{ boxShadow: "0 0 20px rgba(146,204,10,0.3), 0 0 40px rgba(146,204,10,0.15), inset 0 0 20px rgba(146,204,10,0.05)" }}>
                <Check className="w-12 h-12 text-primary" style={{ filter: "drop-shadow(0 0 8px #92cc0a)" }} />
              </div>
              <div className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-primary/10" />
            </div>

            {/* Titre */}
            <div className="mb-1">
              <span className="text-xs font-mono tracking-[0.3em] text-primary/70 uppercase">Transaction validée</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground"
              style={{ textShadow: "0 0 10px rgba(146,204,10,0.4)" }}>
              Paiement confirmé !
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              Votre commande a été traitée avec succès.
            </p>

            {/* Séparateur */}
            <div className="h-px mb-6 bg-linear-to-r from-transparent via-primary/40 to-transparent" />

            {/* Détails commande */}
            <div className="space-y-3 mb-6 text-sm text-left">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">Réf. commande</span>
                <span className="font-mono text-primary text-xs" style={{ textShadow: "0 0 6px rgba(146,204,10,0.5)" }}>
                  #{orderStatus.orderId.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">Montant</span>
                <span className="font-bold text-foreground">{Number(orderStatus.total).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">Statut</span>
                <span className="flex items-center gap-1.5 text-primary font-semibold text-xs"
                  style={{ textShadow: "0 0 8px rgba(146,204,10,0.6)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                  CONFIRMÉ
                </span>
              </div>
            </div>

            {/* Note email */}
            <div className="text-xs text-muted-foreground/70 mb-8 flex items-center justify-center gap-2">
              <PackageCheck className="w-3.5 h-3.5" />
              Un email de confirmation vous sera envoyé.
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/orders")}
                className="flex-1 px-4 py-3 border border-border/50 text-muted-foreground rounded-sm hover:border-primary/40 hover:text-foreground transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Mes commandes
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-all text-sm uppercase tracking-wider"
                style={{ boxShadow: "0 0 15px rgba(146,204,10,0.3)" }}
              >
                Accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paiement échoué
  if (orderStatus.paymentStatus === "FAILED") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative max-w-md w-full">
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-destructive" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-destructive" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-destructive" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-destructive" />

          <div className="relative px-8 py-10 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(13,31,20,0.9) 0%, rgba(9,21,13,0.95) 100%)",
              backdropFilter: "blur(16px)",
              boxShadow: "inset 0 0 30px rgba(204,21,21,0.05), 0 0 40px rgba(204,21,21,0.1)",
              border: "1px solid rgba(204,21,21,0.15)",
            }}>

            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-destructive/10 border border-destructive/30"
              style={{ boxShadow: "0 0 20px rgba(204,21,21,0.2), inset 0 0 10px rgba(204,21,21,0.05)" }}>
              <X className="w-10 h-10 text-destructive" />
            </div>

            <div className="mb-1">
              <span className="text-xs font-mono tracking-[0.3em] text-destructive/70 uppercase">Transaction refusée</span>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">Paiement échoué</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Votre paiement n&apos;a pas pu être traité.
            </p>

            <div className="h-px mb-6 bg-linear-to-r from-transparent via-destructive/30 to-transparent" />

            <ul className="text-xs text-muted-foreground text-left space-y-2 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">▸</span> Vérifiez vos informations bancaires
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">▸</span> Assurez-vous d&apos;avoir suffisamment de fonds
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-0.5">▸</span> Contactez votre banque si le problème persiste
              </li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/cart")}
                className="flex-1 px-4 py-3 border border-border/50 text-muted-foreground rounded-sm hover:border-destructive/40 hover:text-foreground transition-all text-sm"
              >
                Panier
              </button>
              <button
                onClick={() => router.push("/cart/checkout")}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-sm hover:bg-primary/90 transition-all text-sm uppercase tracking-wider"
                style={{ boxShadow: "0 0 15px rgba(146,204,10,0.3)" }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PENDING — polling en cours
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center"
            style={{ boxShadow: "0 0 20px rgba(146,204,10,0.2), inset 0 0 20px rgba(146,204,10,0.05)" }}>
            <Loader2 className="w-10 h-10 animate-spin text-primary" style={{ filter: "drop-shadow(0 0 6px #92cc0a)" }} />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-primary" />
        </div>
        <span className="text-xs font-mono tracking-[0.3em] text-primary/70 uppercase block mb-2">En attente de confirmation</span>
        <h2 className="text-2xl font-bold mb-2 text-foreground"
          style={{ textShadow: "0 0 10px rgba(146,204,10,0.4)" }}>
          Paiement en cours...
        </h2>
        <p className="text-muted-foreground text-sm">Nous attendons la confirmation de votre paiement.</p>
        <p className="text-muted-foreground/50 text-xs mt-1">Cela peut prendre quelques instants.</p>
      </div>
    </div>
  );
}

// Composant wrapper avec Suspense boundary
export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-flex mb-8">
              <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center"
                style={{ boxShadow: "0 0 20px rgba(146,204,10,0.2), inset 0 0 20px rgba(146,204,10,0.05)" }}>
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground">Chargement...</h2>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

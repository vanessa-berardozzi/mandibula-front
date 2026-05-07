"use client";

import { useCartContext } from "@/context/CartContext";
import { useSession } from "@/lib/auth.client";
import { Check, Loader2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface OrderStatus {
  orderId: string;
  status: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  total: number;
}

function OrderConfirmationContent() {
  const { data: session } = useSession();
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/order/${orderId}/status`,
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
  }, [session, orderId, router]);

  if (!session?.user) {
    return null; // Redirection en cours
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Vérification du paiement...</h2>
          <p className="text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error || !orderStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <X className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p className="text-muted-foreground mb-6">{error || "Commande introuvable"}</p>
          <button
            onClick={() => router.push("/cart")}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retour au panier
          </button>
        </div>
      </div>
    );
  }

  // Paiement réussi
  if (orderStatus.paymentStatus === "PAID") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Paiement confirmé !</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Votre commande a été payée avec succès.
          </p>

          <div className="bg-card border rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-2">Détails de la commande</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Numéro de commande :</span>
                <span className="font-mono">{orderStatus.orderId.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant :</span>
                <span className="font-semibold">{orderStatus.total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut :</span>
                <span className="text-green-600 font-semibold">Payé</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 border rounded-lg p-4 mb-6">
            <p className="text-sm">
              Un email de confirmation vous a été envoyé avec les détails de votre commande.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/profile/orders")}
              className="px-6 py-2 border rounded hover:bg-accent transition-colors"
            >
              Voir mes commandes
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paiement échoué
  if (orderStatus.paymentStatus === "FAILED") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Paiement refusé</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Le paiement de votre commande a échoué.
          </p>

          <div className="bg-card border rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-2">Que faire ?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Vérifiez que vos informations bancaires sont correctes</li>
              <li>• Assurez-vous d'avoir suffisamment de fonds</li>
              <li>• Contactez votre banque si le problème persiste</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/cart")}
              className="px-6 py-2 border rounded hover:bg-accent transition-colors"
            >
              Retour au panier
            </button>
            <button
              onClick={() => router.push(`/cart/checkout?orderId=${orderId}`)}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paiement en attente (le polling continue)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">Paiement en cours...</h2>
        <p className="text-muted-foreground">
          Nous attendons la confirmation de votre paiement.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cela peut prendre quelques instants.
        </p>
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
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Chargement...</h2>
            <p className="text-muted-foreground">
              Vérification de votre commande.
            </p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

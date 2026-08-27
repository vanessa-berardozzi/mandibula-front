import type { AdminOrderStatus, AdminPaymentMethod, AdminPaymentStatus } from "@/types/admin";

export const ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  PENDING: "A préparer",
  CONFIRMED: "Payée",
  PREPARING: "En Préparation",
  HELD_WEATHER: "Attente météo",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const ORDER_STATUS_OPTIONS = (
  Object.keys(ORDER_STATUS_LABELS) as AdminOrderStatus[]
).map((value) => ({ value, label: ORDER_STATUS_LABELS[value] }));

export const PAYMENT_STATUS_LABELS: Record<AdminPaymentStatus, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
};

export const PAYMENT_METHOD_LABELS: Record<AdminPaymentMethod, string> = {
  SUM_UP: "SumUp",
  PAYPAL: "PayPal",
  BANK_TRANSFER: "Virement",
  CASH: "Espèces",
};

const euroFormatter = new Intl.NumberFormat("fr-LU", { style: "currency", currency: "EUR" });

export function formatEuro(amount: number): string {
  return euroFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("fr-LU", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatOrderDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  return Number.isNaN(parsed.getTime()) ? "Date indisponible" : dateFormatter.format(parsed);
}

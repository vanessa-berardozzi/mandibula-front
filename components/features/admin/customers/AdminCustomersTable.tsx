"use client";

import { isCancelledOrder } from "@/components/features/admin/orders/AdminOrderBadges";
import {
    formatEuro,
    formatOrderDate,
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS_LABELS,
} from "@/lib/admin/adminOrderLabels";
import type { AdminCustomerListItem, AdminCustomerSortKey } from "@/types/admin";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";

const SORT_COLUMNS: { key: AdminCustomerSortKey; label: string; hint: string }[] = [
  { key: "name", label: "Client", hint: "Trier les clients par ordre alphabétique" },
  { key: "orders", label: "Commandes", hint: "Trier par nombre de commandes" },
  { key: "spent", label: "Dépensé", hint: "Trier par montant dépensé" },
];

type Props = {
  customers: AdminCustomerListItem[];
  sort: AdminCustomerSortKey;
  direction: "asc" | "desc";
};

export function AdminCustomersTable({ customers, sort, direction }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openedCustomerId, setOpenedCustomerId] = useState<string | null>(null);

  const toggleSort = (key: AdminCustomerSortKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", key);
    params.set("direction", sort === key && direction === "asc" ? "desc" : "asc");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const sortLabel = (key: AdminCustomerSortKey) =>
    sort !== key ? "↕" : direction === "asc" ? "↑" : "↓";

  return (
    <div className="admin-data-table customers">
      <div className="admin-data-head">
        {SORT_COLUMNS.map((column) => (
          <button
            key={column.key}
            type="button"
            className="admin-sort-button"
            onClick={() => toggleSort(column.key)}
            aria-label={column.hint}
          >
            {column.label} <b>{sortLabel(column.key)}</b>
          </button>
        ))}
        <span>Fidélité</span>
        <span>Actions</span>
      </div>

      {customers.map((customer) => {
        const isOpen = openedCustomerId === customer.id;
        const validOrders = customer.orders.filter((order) => !isCancelledOrder(order));
        const cancelledOrders = customer.orders.filter(isCancelledOrder);

        return (
          <Fragment key={customer.id}>
            <div className="admin-data-row">
              <div data-label="Client">
                <strong>{customer.name || "Sans nom"}</strong>
                <small>{customer.email}</small>
              </div>

              <div data-label="Commandes">
                <button
                  type="button"
                  className="customer-orders-trigger"
                  onClick={() => setOpenedCustomerId(isOpen ? null : customer.id)}
                  aria-expanded={isOpen}
                  aria-controls={`customer-orders-${customer.id}`}
                >
                  {customer.orderCount} <span>{isOpen ? "−" : "+"}</span>
                </button>
                <small>
                  {customer.orders.length === 0
                    ? "Aucune commande enregistrée"
                    : isOpen
                      ? "Masquer le détail"
                      : "Voir le détail"}
                </small>
              </div>

              <strong data-label="Dépensé">{formatEuro(customer.totalSpent)}</strong>

              <div data-label="Fidélité">
                <strong>Bientôt</strong>
              </div>

              <div className="customer-row-actions" data-label="Actions">
                <span>Bientôt</span>
              </div>
            </div>

            {isOpen && (
              <section
                className="customer-orders-detail"
                id={`customer-orders-${customer.id}`}
                aria-label={`Commandes de ${customer.name || "ce client"}`}
              >
                <header>
                  <div>
                    <span>HISTORIQUE.COMMANDES</span>
                    <h3>
                      {validOrders.length} commande{validOrders.length > 1 ? "s" : ""} validée
                      {validOrders.length > 1 ? "s" : ""}
                      {cancelledOrders.length
                        ? ` · ${cancelledOrders.length} annulée${cancelledOrders.length > 1 ? "s" : ""}`
                        : ""}
                    </h3>
                  </div>
                  <b>{formatEuro(customer.totalSpent)}</b>
                </header>

                {customer.orders.length ? (
                  <div className="customer-orders-list">
                    {customer.orders.map((order) => {
                      const cancelled = isCancelledOrder(order);
                      return (
                        <article
                          key={order.id}
                          className={`customer-order-card${cancelled ? " cancelled" : ""}`}
                        >
                          <header>
                            <div>
                              <span>{order.reference}</span>
                              <strong>{formatOrderDate(order.createdAt)}</strong>
                            </div>
                            <div>
                              <b>{formatEuro(order.total)}</b>
                              <small>
                                {cancelled ? "Commande annulée" : ORDER_STATUS_LABELS[order.status]}
                              </small>
                            </div>
                          </header>

                          <div className="customer-order-flags">
                            {cancelled && <span className="cancelled">Annulée</span>}
                            <span>
                              {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                            </span>
                            <span>Paiement : {PAYMENT_STATUS_LABELS[order.paymentStatus]}</span>
                            {order.containsLive && <span className="live">Vivant</span>}
                          </div>

                          {order.items.length ? (
                            <div className="customer-order-items">
                              {order.items.map((item) => (
                                <div className="customer-order-item" key={item.id}>
                                  {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt="" />
                                  ) : (
                                    <span className="customer-item-placeholder">▦</span>
                                  )}
                                  <div>
                                    <strong>{item.productName}</strong>
                                    <small>
                                      {item.variantName}
                                      {item.quantity > 1
                                        ? ` · ${formatEuro(item.unitPrice)} / unité`
                                        : ""}
                                    </small>
                                  </div>
                                  <span className="customer-order-quantity">×{item.quantity}</span>
                                  <b>{formatEuro(item.lineTotal)}</b>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="customer-orders-empty">
                              Le détail des articles n’est pas disponible pour cette commande.
                            </p>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="customer-orders-empty">
                    Aucune commande n’a été retrouvée pour ce profil.
                  </p>
                )}
              </section>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

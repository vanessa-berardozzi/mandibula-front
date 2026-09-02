"use client";

import styles from "@/app/(admin)/admin/(protected)/products/products.module.css";

type AdminProductsFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function AdminProductsFilters({
  search,
  onSearchChange,
}: AdminProductsFiltersProps) {
  return (
    <label className={styles.searchLabel}>
      <span className="sr-only">Rechercher</span>
      <input
        type="text"
        className={styles.searchInput}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher un produit…"
      />
    </label>
  );
}

"use client";

import { ORDER_STATUS_OPTIONS } from "@/lib/admin/adminOrderLabels";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminOrdersFilters({ status, search }: { status: string; search: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(search);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      className="admin-panel-toolbar"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilter("q", query.trim());
      }}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Nom, e-mail ou référence…"
        aria-label="Rechercher une commande"
      />
      <select
        value={status}
        onChange={(event) => applyFilter("status", event.target.value)}
        aria-label="Filtrer par traitement"
      >
        <option value="">Tous les traitements</option>
        {ORDER_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit">Rechercher</button>
    </form>
  );
}

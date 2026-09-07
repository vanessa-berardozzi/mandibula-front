"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminCustomersFilters({ search }: { search: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(search);

  return (
    <form
      className="admin-panel-toolbar"
      onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        const value = query.trim();
        if (value) params.set("q", value);
        else params.delete("q");
        params.delete("page");
        router.push(`?${params.toString()}`);
      }}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Nom ou e-mail…"
        aria-label="Rechercher un client"
      />
      <button type="submit">Rechercher</button>
    </form>
  );
}

"use client";

import type { AdminDashboardPeriod } from "@/types/admin";
import { useRouter, useSearchParams } from "next/navigation";

const PERIOD_OPTIONS: { value: AdminDashboardPeriod; label: string }[] = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
  { value: "12m", label: "12 mois" },
  { value: "all", label: "Tout" },
];

export function AdminPeriodSelect({ current }: { current: AdminDashboardPeriod }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (period: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={(event) => handleChange(event.target.value)}
      aria-label="Période des statistiques"
      className="admin-type-small border border-admin-border bg-admin-panel px-3 py-2 font-mono  tracking-widest text-admin-muted hover:cursor-pointer"
    >
      {PERIOD_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

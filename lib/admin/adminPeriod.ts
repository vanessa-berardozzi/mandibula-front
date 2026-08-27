import type { AdminDashboardPeriod } from "@/types/admin";

export const ADMIN_PERIOD_COOKIE = "admin_period";

export const ADMIN_PERIODS: AdminDashboardPeriod[] = ["7d", "30d", "90d", "12m", "all"];

export function resolveAdminPeriod(...values: (string | undefined)[]): AdminDashboardPeriod {
  const match = values.find((value) => ADMIN_PERIODS.includes(value as AdminDashboardPeriod));
  return (match as AdminDashboardPeriod) ?? "30d";
}

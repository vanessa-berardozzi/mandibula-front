import { redirect } from "next/navigation";
import { fetchAdmin } from "./adminApi.server";
import type { AdminUser } from "./adminPermissions";

/**
 * Garde serveur des pages admin. Toute page admin doit passer par ici.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const result = await fetchAdmin<{ user: AdminUser }>("/api/admin/session");

  if (!result.ok) {
    redirect(result.status === 403 ? "/admin/forbidden" : "/admin/login");
  }

  return result.data.user;
}

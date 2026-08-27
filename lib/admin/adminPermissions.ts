export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function isAdmin(user: { role?: string | null } | null | undefined): boolean {
  return user?.role === "ADMIN";
}

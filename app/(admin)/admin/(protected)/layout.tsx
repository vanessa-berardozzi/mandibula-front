import { AdminShell } from "@/components/features/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}

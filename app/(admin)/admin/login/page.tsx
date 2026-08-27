import { AdminLoginForm } from "@/components/features/admin/AdminLoginForm";
import { fetchAdmin } from "@/lib/admin/adminApi.server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await fetchAdmin<{ user: unknown }>("/api/admin/session");
  if (session.ok) {
    redirect("/admin");
  }

  return (
    <div className="grid min-h-svh place-items-center px-4 py-12">
      <AdminLoginForm />
    </div>
  );
}

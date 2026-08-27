"use client";

import type { AdminUser } from "@/lib/admin/adminPermissions";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

type AdminShellProps = {
  user: AdminUser;
  children: React.ReactNode;
};

export function AdminShell({ user, children }: AdminShellProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      {isNavOpen && (
        <button
          type="button"
          aria-label="Fermer la navigation"
          onClick={() => setIsNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-63.75 transition-transform md:sticky md:top-0 md:h-svh md:translate-x-0",
          isNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <AdminSidebar user={user} onNavigate={() => setIsNavOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenNav={() => setIsNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { adminNav } from "@/lib/admin/adminNav";
import type { AdminUser } from "@/lib/admin/adminPermissions";
import { signOut } from "@/lib/auth.client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminSidebarProps = {
  user: AdminUser;
  onNavigate: () => void;
};

export function AdminSidebar({ user, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    await signOut();
    window.location.replace("/admin/login");
  }

  return (
    <div className="flex h-full flex-col border-r border-admin-green/27 bg-[#020905]">
      <Link
        href="/"
        className="flex min-h-23 items-center justify-between gap-5 border-b border-admin-green/20 px-4.75 py-3.25"
      >
        <Image
          src="/Mandibula-logo-site-HD-padded.png"
          alt=""
          aria-hidden="true"
          width={166}
          height={60}
          className="h-15 w-41.5 object-contain object-left drop-shadow-[0_0_10px_rgba(71,255,131,.16)]"
        />
        <span className="admin-type-micro grid shrink-0 gap-1 text-right font-mono uppercase leading-none tracking-[0.17rem] text-[#52705b] ">
          <span>Control</span>
          <span>System</span>
        </span>
      </Link>

      <div className="admin-type-micro flex items-center justify-between gap-2.5 border-b border-admin-green/12 px-4.5 py-3.5 font-mono uppercase text-[#587764]">
        <span className="flex items-center">
          <span
            className="mr-1.5 size-1.25 rounded-full bg-admin-green shadow-[0_0_8px_var(--admin-green)]"
            aria-hidden
          />
          Admin.node
        </span>
        <strong className="admin-type-micro tracking-[0.08em] text-[#67d987]">Opérationnel</strong>
      </div>

      <nav className="flex flex-col overflow-y-auto px-2.5 py-4.5" aria-label="Navigation administration">
        {adminNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "admin-type-small flex min-h-11.25 items-center gap-2.5 border-l-2 px-3 font-mono font-bold uppercase tracking-[0.14em] transition-all",
                isActive
                  ? "border-admin-green bg-linear-to-r from-admin-green/12 to-transparent text-admin-green"
                  : "border-transparent text-[#718077] hover:text-[#c7d4ca]",
              )}
            >
              <span className={cn("admin-type-micro font-mono font-bold", isActive ? "text-admin-green" : "text-[#3e5947]")}>
                {item.code}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t border-admin-border p-4">
        <span className="admin-type-small grid size-8 place-items-center border border-admin-green font-mono font-black text-admin-green">
          {user.name?.charAt(0).toUpperCase() ?? "A"}
        </span>
        <div className="min-w-0 flex-1">
          <strong className="admin-type-text block truncate text-[#dce7df]">{user.name}</strong>
          <small className="admin-type-micro block truncate font-mono text-[#526259]">{user.email}</small>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="admin-type-micro font-mono uppercase tracking-[0.12em] text-[#64806b] transition-colors hover:text-admin-green [writing-mode:vertical-rl]"
          title="Déconnexion"
        >
          ⌝
        </button>
      </div>
    </div>
  );
}

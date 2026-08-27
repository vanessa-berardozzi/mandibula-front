import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <div className="grid min-h-svh place-items-center px-4 py-12">
      <div className="w-full max-w-md border border-admin-border bg-admin-panel p-8 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-admin-muted">
          Erreur 403
        </p>
        <h1 className="mt-2 text-xl font-black uppercase text-foreground">Accès refusé</h1>
        <p className="mt-3 text-sm text-admin-muted">
          Votre compte ne dispose pas des droits nécessaires pour accéder à cette console.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block border border-admin-border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-admin-muted transition-colors hover:border-admin-green hover:text-admin-green"
        >
          Retour au site
        </Link>
      </div>
    </div>
  );
}

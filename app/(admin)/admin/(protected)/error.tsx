"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="border border-destructive/40 bg-admin-panel p-8 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-admin-muted">
        Incident console
      </p>
      <h2 className="mt-2 text-lg font-black uppercase text-foreground">
        Ce module n&apos;a pas pu être chargé
      </h2>
      <button
        type="button"
        onClick={reset}
        className="mt-6 border border-admin-border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-admin-muted transition-colors hover:border-admin-green hover:text-admin-green"
      >
        Réessayer
      </button>
    </div>
  );
}

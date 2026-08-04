// Footer minimal façon "system" : uniquement marque/baseline + localisation/statut.
// Volontairement sans colonnes de liens ni réseaux sociaux (KISS).
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-background px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {/* Bloc 1 : marque + baseline */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Mandibula</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Élevage responsable d&apos;invertébrés exotiques. Spécimens nés en captivité, substrats développés en interne.
          </p>
        </div>

        {/* Bloc 2 : localisation + statut système */}
        <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:items-end">
          <span>Paris, France</span>
          <span className="flex items-center gap-1.5 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Système actif
          </span>
          <span>© {currentYear} Mandibula</span>
        </div>
      </div>
    </footer>
  );
}


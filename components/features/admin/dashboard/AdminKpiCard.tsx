type AdminKpiCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function AdminKpiCard({ label, value, hint }: AdminKpiCardProps) {
  return (
    <article className="relative flex min-h-42.5 flex-col justify-end overflow-hidden border border-admin-border bg-admin-panel p-4.75">
      <span
        className="pointer-events-none absolute -right-7 -top-7 size-22.5 rounded-full border border-admin-green/10"
        aria-hidden
      />
      <p className="admin-type-small font-mono uppercase tracking-[0.2em] text-admin-muted">{label}</p>
      <p className="mt-2 text-[clamp(28px,3vw,43px)] font-black leading-none tracking-[-0.05em] text-admin-green">{value}</p>
      {hint && <p className="admin-type-micro mt-2 text-admin-muted">{hint}</p>}
    </article>
  );
}

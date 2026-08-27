type AdminEmptyStateProps = {
  title: string;
  description?: string;
};

export function AdminEmptyState({ title, description }: AdminEmptyStateProps) {
  return (
    <div className="min-h-57.5 border border-dashed border-admin-border px-8 py-10 text-center">
      <p className="text-[17px] font-black uppercase leading-tight text-[#dce7df]">{title}</p>
      {description && <p className="admin-type-small mx-auto mt-3 max-w-md text-admin-muted/80">{description}</p>}
    </div>
  );
}

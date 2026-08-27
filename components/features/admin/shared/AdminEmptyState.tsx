type AdminEmptyStateProps = {
  title: string;
  description?: string;
  code?: string;
};

export function AdminEmptyState({ title, description, code = "NO.DATA" }: AdminEmptyStateProps) {
  return (
    <div className="admin-empty">
      <span>{code}</span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}

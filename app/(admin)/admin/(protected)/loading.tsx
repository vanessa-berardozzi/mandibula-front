export default function AdminLoading() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-37.5 animate-pulse border border-admin-border bg-admin-panel" />
        ))}
      </div>
      <div className="h-48 animate-pulse border border-admin-border bg-admin-panel" />
    </div>
  );
}

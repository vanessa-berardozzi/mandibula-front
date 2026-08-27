type AdminPanelProps = {
  title: string;
  kicker?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminPanel({ title, kicker, action, children }: AdminPanelProps) {
  return (
    <section className="admin-panel">
      <header>
        <div>
          {kicker && <span>{kicker}</span>}
          <h2>{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

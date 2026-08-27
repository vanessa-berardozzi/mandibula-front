type AdminPanelProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminPanel({ title, action, children }: AdminPanelProps) {
  return (
    <section className="border border-admin-border bg-admin-panel">
      <header className="flex min-h-19.5 items-center justify-between gap-5 border-b border-admin-green/14 px-5 py-4.25">
        <h2 className="text-[clamp(18px,2vw,25px)] font-black uppercase leading-none tracking-[-0.04em] text-[#e7f1e9]">
          {title}
        </h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

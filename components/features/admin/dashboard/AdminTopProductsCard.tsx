import type { AdminTopProduct } from "@/types/admin";

type AdminTopProductsCardProps = {
  label: string;
  products: AdminTopProduct[];
};

export function AdminTopProductsCard({ label, products }: AdminTopProductsCardProps) {
  return (
    <article className="relative flex min-h-42.5 flex-col justify-start overflow-hidden border border-admin-border bg-admin-panel p-4.75">
      <span
        className="pointer-events-none absolute -right-7 -top-7 size-22.5 rounded-full border border-admin-green/10"
        aria-hidden
      />
      <p className="admin-type-small font-mono  tracking-[0.2em] text-admin-muted">{label}</p>
      {products.length === 0 ? (
        <p className="admin-type-small mt-2 text-admin-muted">Aucune vente sur la période</p>
      ) : (
        <ol className="mt-2 flex flex-col gap-1.5">
          {products.map((product, index) => (
            <li key={product.productId} className="flex items-baseline justify-between gap-3">
              <span className="admin-type-text truncate font-bold text-admin-green">
                {index + 1}. {product.name}
              </span>
              <span className="admin-type-micro whitespace-nowrap text-admin-muted">
                {product.quantity} vendu(s)
              </span>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

import Link from "next/link";

type AdminPaginationProps = {
  page: number;
  pages: number;
  total: number;
  buildHref: (page: number) => string;
};

export function AdminPagination({ page, pages, total, buildHref }: AdminPaginationProps) {
  return (
    <nav aria-label="Pagination" className="admin-pagination">
      <p>
        {total} résultat{total > 1 ? "s" : ""} · page {page} / {pages}
      </p>
      <div>
        {page > 1 ? (
          <Link href={buildHref(page - 1)}>Précédent</Link>
        ) : (
          <span aria-disabled>Précédent</span>
        )}
        {page < pages ? <Link href={buildHref(page + 1)}>Suivant</Link> : <span aria-disabled>Suivant</span>}
      </div>
    </nav>
  );
}

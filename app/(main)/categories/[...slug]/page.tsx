import { CategoryCatalog } from '@/components/features/Category/CategoryCatalog';
import { notFound } from 'next/navigation';

interface Variant {
  id: string;
  name: string;
  lotSize: number;
  price: string;
  availableStock: number;
  isActive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  variants: Variant[];
  availableStock: number;
}

interface CategoryResponse {
  category: { id: string; name: string; slug: string; parentId: string | null };
  data: ApiProduct[];
  total: number;
}

const backendUrl =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://mandibula-back.onrender.com';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugSegments = Array.isArray(slug) ? slug : [slug];
  const categorySlug = slugSegments[slugSegments.length - 1];

  const res = await fetch(`${backendUrl}/api/products/category/${categorySlug}`, {
    cache: 'no-store',
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: CategoryResponse = await res.json();

  return (
    <main className="min-h-screen pb-12">
      <div className="w-full max-w-500 mx-auto px-4 md:px-8 xl:px-16 2xl:px-24">
        {/* ── En-tête catégorie ── */}
        <div
          className="relative mb-8 p-6 md:p-8 bg-card/15 backdrop-blur-md border border-primary/40"
          style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
        >
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          <p className="text-[10px] font-mono text-primary/40 uppercase tracking-widest mb-1">
            catalogue / {slugSegments.join(' / ')}
          </p>
          <h1 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tight">
            {data.category.name}
          </h1>
          <p className="text-sm font-mono text-primary/50 mt-1">
            {data.data.length} spécimen{data.data.length !== 1 ? 's' : ''} disponible{data.data.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Recherche, tri et grille produits ── */}
        <CategoryCatalog products={data.data} categoryName={data.category.name} />
      </div>
    </main>
  );
}

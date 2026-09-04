'use client';

import { ProductGallery } from '@/components/features/ProductGallery';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/context/CartContext';
import { useSession } from '@/lib/auth.client';
import { toPrice } from '@/lib/priceUtils';
import { Check, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// ── Types API ────────────────────────────────────────────────────────────────

interface ProductVariant {
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
  description: string | null;
  price: string;
  images: string[];
  attributes: Record<string, unknown> | null;
  category: { id: string; name: string; slug: string } | null;
  variants: ProductVariant[];
  availableStock: number;
}

interface ProductsResponse {
  data: ApiProduct[];
}

//Todo: rendre les catégories dynamiques.
const livingCategories = new Set([
  'Araignées',
  'Ardentiella',
  'Autres isopodes',
  'Blattes',
  'Collemboles',
  'Coléoptères',
  'Cubaris',
  'Laureola',
  'Mantes',
  'Myriapodes',
  'Porcellio',
  'Troglodillo',
]);

function productDetails(product: Pick<ApiProduct, 'name' | 'category'>) {
  const normalizedName = product.name.toLocaleLowerCase('fr');
  const isBoost = normalizedName.includes('boost') || normalizedName.includes('protein.exe');
  const isSubstrate = product.category?.name === 'Substrats' || normalizedName.includes('substrat');

  if (product.category && livingCategories.has(product.category.name)) {
    return {
      badge: 'Élevé chez Mandibula',
      reassurance: [
        'Garantie arrivée en vie',
        'Expédition adaptée à la météo',
        "Conseils d'élevage après achat",
      ],
    };
  }

  if (isBoost) {
    return {
      badge: 'Créé et produit dans nos locaux',
      reassurance: [
        'Formule développée chez Mandibula',
        'Produit dans nos locaux',
        "Conseils d'utilisation inclus",
      ],
    };
  }

  if (isSubstrate) {
    return {
      badge: 'Recette développée et testée dans nos locaux',
      reassurance: [
        'Recette développée chez Mandibula',
        'Testé dans nos élevages',
        'Conseils de mise en place inclus',
      ],
    };
  }

  return {
    badge: 'Sélectionné par Mandibula',
    reassurance: [
      'Produit contrôlé avant expédition',
      'Emballage adapté et soigné',
      "Conseils d'utilisation après achat",
    ],
  };
}

function descriptionValue(description: string | null, labels: string[]) {
  const lines = (description ?? '').split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const line = lines.find((item) => labels.some((label) => item.toLocaleLowerCase('fr').startsWith(label)));
  return line?.replace(/^[^:]+:\s*/, '').replace(/[🌡️💧💡🎯]/gu, '').trim() || null;
}

function firstText(...values: unknown[]) {
  return values.find((value): value is string => typeof value === 'string' && value.trim().length > 0) ?? null;
}

// ── Page principale ──────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartContext();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/products/${id}`),
      fetch('/api/products?limit=100'),
    ])
      .then(async ([productResponse, productsResponse]) => {
        if (productResponse.status === 404) { setNotFound(true); return null; }
        if (!productResponse.ok) throw new Error(`HTTP ${productResponse.status}`);
        const productData = await productResponse.json() as ApiProduct;

        if (productsResponse.ok) {
          const productsData = await productsResponse.json() as ProductsResponse;
          const candidates = productsData.data.filter((item) => (
            item.id !== productData.id && item.images.length > 0 && item.variants.length > 0
          ));
          setRelatedProducts(candidates.sort(() => Math.random() - 0.5).slice(0, 4));
        }

        return productData;
      })
      .then((data) => {
        if (data) {
          setProduct(data);
          setSelectedVariant(data.variants[0] ?? null);
        }
      })
      .catch((err) => console.error('Erreur chargement produit:', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!session?.user) { router.push('/login'); return; }
    if (!selectedVariant || selectedVariant.availableStock === 0) return;

    setIsAdding(true);
    setStockError(null);
    const result = await addItem(selectedVariant.id, quantity, toPrice(selectedVariant.price));
    if (result?.error) {
      setStockError(result.error);
      setTimeout(() => setStockError(null), 3000);
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
    setIsAdding(false);
  };

  // ── États de chargement ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-mono text-primary/60 text-xs tracking-widest animate-pulse uppercase">
          Chargement du spécimen...
        </p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-mono text-destructive text-sm tracking-widest uppercase">Produit introuvable</p>
        <Button variant="outline" onClick={() => router.push('/')}>← Retour à l&rsquo;accueil</Button>
      </div>
    );
  }

  const attrs = product.attributes as {
    type?: string;
    temperature?: string;
    humidite?: string;
    substrat?: string;
    alimentation?: string;
    origine?: string;
    niveau?: string;
    niveauScore?: number;
    wc?: boolean;
    conseils?: string[];
    compatible?: string;
    utilisation?: string;
    contenance?: string;
    [key: string]: unknown;
  } | null;
  const price = toPrice(selectedVariant?.price ?? product.price, 0);
  const stock = selectedVariant?.availableStock ?? product.availableStock ?? 0;
  const details = productDetails(product);
  const overview = firstText(
    attrs?.presentation,
    descriptionValue(product.description, ['présentation']),
    product.description,
  );
  const technicalFacts = [
    ['ORIGINE', firstText(attrs?.origine, descriptionValue(product.description, ['origine']))],
    ['TEMPÉRATURE', firstText(attrs?.temperature, descriptionValue(product.description, ['température']))],
    ['HUMIDITÉ', firstText(attrs?.humidite, descriptionValue(product.description, ['humidité', 'hygrométrie']))],
    ['NIVEAU', firstText(attrs?.niveau, descriptionValue(product.description, ['niveau de difficulté', 'niveau']))],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));
  const carePanels = [
    ['ALIMENTATION', firstText(attrs?.alimentation, descriptionValue(product.description, ['alimentation', 'alimentations']))],
    ['COMPLÉMENTS', firstText(attrs?.complements, descriptionValue(product.description, ['compléments']))],
    ['CONSEIL MANDIBULA', firstText(
      Array.isArray(attrs?.conseils) ? attrs.conseils.join(' ') : null,
      descriptionValue(product.description, ['conseil', 'conseils']),
    )],
    ['COMPOSITION', firstText(
      Array.isArray(attrs?.caracteristiques) ? attrs.caracteristiques.join(' ') : null,
      descriptionValue(product.description, ['composition']),
    )],
  ].filter((panel): panel is [string, string] => Boolean(panel[1]));

  return (
    <main className="min-h-screen bg-[#070c09] pb-8 text-[#edf4ef]">
      <div className="w-full space-y-6">

        {/* ── LIGNE HAUTE : Visuel (gauche) + Panier & Conditionnement (droite) ── */}
        <div
          className="grid grid-cols-1 items-start gap-8 px-5 pb-20 pt-12 text-[#edf4ef] md:grid-cols-[1.08fr_.92fr] md:gap-[clamp(35px,6vw,90px)] md:px-[clamp(20px,7vw,110px)] md:pt-17.5"
          style={{
            background:
              'radial-gradient(circle at 9% 28%, rgba(37,124,71,.12), transparent 24%), radial-gradient(circle at 91% 76%, rgba(37,124,71,.1), transparent 25%), linear-gradient(rgba(7,12,9,.78), rgba(7,12,9,.86)), url("/mandibula-jungle.png") center / cover fixed no-repeat',
          }}
        >

          {/* ── GAUCHE : Visuel produit avec panneau décoratif ── */}
          <div className="w-full justify-self-center xl:max-w-155">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* ── DROITE : Titre + Prix + Conditionnement + Panier ── */}
          <div className="flex flex-col gap-3 pt-1 md:pt-6">
            {/* Titre & Prix */}
            <div>
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {product.category?.name ?? 'Produit'}
              </p>
              <h1 className="flex flex-wrap items-baseline gap-x-3 gap-y-2 font-sans text-[clamp(43px,5vw,70px)] font-black uppercase leading-[0.95] tracking-[-0.055em] text-[#f0f5f1]">
                <span>{product.name}</span>
                {stock === 0 && (
                  <span className="inline-flex items-center border border-[#c33b3b]/60 bg-[#3a1515] px-2.5 py-2 align-middle font-mono text-[10px] font-extrabold tracking-widest text-[#ff9e9e]">
                    Épuisé
                  </span>
                )}
              </h1>
              <p className="mt-5.5 font-mono text-xl font-extrabold text-primary">
                {price.toFixed(2)}€
              </p>
              <p className="mt-5 inline-flex w-fit items-center border border-primary/35 bg-primary/10 px-2.5 py-2 font-mono text-[10px] font-black uppercase tracking-[0.08em] text-primary">
                <span className="mr-2 inline-block h-1.75 w-1.75 rounded-full bg-primary shadow-[0_0_8px_#70f18b]" />
                {details.badge}
              </p>
              
            </div>

            {/* Dropdown conditionnement */}
            {product.variants.length > 1 && (
              <div className="mt-4 grid gap-2.5 font-mono text-[10px] font-black uppercase tracking-[0.08em] text-[#829187]">
                <label htmlFor="product-variant">Choisir une variante</label>
                <div className="relative">
                  <select
                    id="product-variant"
                    value={selectedVariant?.id ?? ''}
                    onChange={(e) => {
                      const v = product.variants.find((v) => v.id === e.target.value);
                      if (v) { setSelectedVariant(v); setQuantity(1); }
                    }}
                    className="w-full cursor-pointer appearance-none border border-primary/20 bg-[#080e0a] px-3 py-3 pr-8 font-mono text-xs uppercase tracking-wider text-[#dfe9e2] transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {product.variants.map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        disabled={v.availableStock === 0}
                        className="bg-[#080e0a] text-[#dfe9e2]"
                      >
                        {v.name} — {toPrice(v.price).toFixed(2)}€{v.availableStock === 0 ? ' (épuisé)' : ''}
                      </option>
                    ))}
                  </select>
                  {/* Icône chevron */}
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <svg className="w-3 h-3 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Bloc panier */}
            <div
              className="mt-5 border border-primary/35 bg-[#080e0a] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
              style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
            >
              {/* Quantité */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[#829187]">Qté</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline" size="icon"
                    className="h-7! w-7! border-primary/35 bg-transparent text-[#edf4ef]"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </Button>
                  <span className="w-8 text-center font-bold text-primary text-sm font-mono">{quantity}</span>
                  <Button
                    variant="outline" size="icon"
                    className="h-7! w-7! border-primary/35 bg-transparent text-[#edf4ef]"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
                <span className={`ml-auto font-mono text-xs ${stock > 0 ? 'text-primary' : 'text-[#ff9e9e]'}`}>
                  {stock > 0 ? `${stock} dispo` : 'Épuisé'}
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isAdding || stock === 0}
                className={`w-full py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  added
                    ? 'bg-primary text-[#050907]'
                    : stock === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-primary text-[#050907] shadow-[7px_7px_0_rgba(71,255,131,.12)] hover:bg-[#99ffaa]'
                }`}
              >
                {isAdding ? (
                  <><div className="w-3 h-3 mr-2 animate-spin border border-current border-t-transparent rounded-full" />Ajout...</>
                ) : added ? (
                  <><Check className="w-3 h-3 mr-2" />Ajouté !</>
                ) : stock === 0 ? 'Épuisé' : (
                  <><ShoppingCart className="w-3 h-3 mr-2" />Ajouter au panier</>
                )}
              </Button>

              {stockError && (
                <p className="text-center font-mono text-xs text-red-600 motion-safe:animate-pulse">{stockError}</p>
              )}

              <div className="pt-2 mt-2 border-t border-primary/30 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#829187]">Total</span>
                <span className="font-mono font-black text-primary">{(price * quantity).toFixed(2)}€</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5 pt-2 text-[9px] uppercase tracking-[0.06em] text-[#9aa59e] sm:grid-cols-3">
              {details.reassurance.map((item) => (
                <span key={item} className="leading-4">
                  <span className="mr-1.5 text-primary">✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section
          className="border-t border-primary/20 px-5 py-16 md:px-[clamp(20px,7vw,110px)] md:py-22.5"
          style={{
            background: 'linear-gradient(rgba(5,12,8,.93), rgba(5,12,8,.97)), url("/mandibula-jungle.png") center / cover fixed',
          }}
        >
          <header className="mb-8 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-primary">
                DOSSIER ESPÈCE / RÉF. {product.id.slice(0, 8)}
              </p>
              <h2 className="font-sans text-[clamp(35px,5vw,62px)] font-black uppercase leading-[0.95] tracking-[-0.055em] text-[#edf4ef]">
                Données d’élevage
              </h2>
            </div>
            <span className="border border-primary/25 px-3 py-2 font-mono text-[8px] font-bold tracking-[0.13em] text-[#8ca095]">
              <i className="mr-2 inline-block h-1.75 w-1.75 rounded-full bg-primary shadow-[0_0_11px_#70f18b]" />
              SYSTÈME ACTIF
            </span>
          </header>

          <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr]">
            <article className="relative flex min-h-82.5 flex-col justify-between overflow-hidden border border-primary/25 bg-[linear-gradient(135deg,rgba(71,255,131,.075),rgba(7,13,9,.82)_52%)] p-7 md:p-14">
              <span className="font-mono text-[8px] font-extrabold tracking-[0.15em] text-primary">00 / PRÉSENTATION</span>
              <p className="relative z-10 mt-14 max-w-190 font-serif text-[clamp(19px,2.2vw,29px)] leading-[1.55] text-[#d7e2da]">
                {overview }
              </p>
              <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background:repeating-linear-gradient(0deg,transparent_0_5px,rgba(71,255,131,.25)_6px)]" />
              <span className="absolute right-3 top-3 h-5 w-5 border-r border-t border-primary" />
            </article>

            {technicalFacts.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {technicalFacts.map(([label, value], index) => (
                  <article key={label} className="flex min-h-39.75 flex-col justify-between overflow-hidden border border-primary/25 bg-[linear-gradient(135deg,rgba(71,255,131,.075),rgba(7,13,9,.82)_52%)] p-6">
                    <span className="font-mono text-[8px] font-extrabold tracking-[0.15em] text-primary">0{index + 1} / {label}</span>
                    <strong className="text-[clamp(15px,1.5vw,21px)] leading-[1.35] text-[#e5eee8]">{value}</strong>
                  </article>
                ))}
              </div>
            )}
          </div>                                                                                  

          {carePanels.length > 0 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {carePanels.map(([title, text], index) => (
                <article key={title} className="relative min-h-52.5 overflow-hidden border border-primary/25 bg-[linear-gradient(135deg,rgba(71,255,131,.075),rgba(7,13,9,.82)_52%)] p-6">
                  <span className="font-sans text-[34px] font-black leading-none text-primary/40">0{index + 1}</span>
                  <h3 className="mt-7 mb-3 font-mono text-[10px] font-extrabold uppercase tracking-[0.13em] text-primary">{title}</h3>
                  <p className="text-[13px] leading-[1.65] text-[#91a197]">{text}</p>
                  <span className="absolute right-3 top-3 h-5 w-5 border-r border-t border-primary" />
                </article>
              ))}
            </div>
          )}
        </section>

        {relatedProducts.length > 0 && (
          <section className="border-t border-primary/20 bg-[#0a0f0c] px-5 pb-24 pt-16 md:px-[clamp(20px,7vw,110px)] md:pb-28 md:pt-22.5">
            <div className="mb-8 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-3 font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-primary">
                  LOADOUT RECOMMANDÉ / COMPATIBILITÉ
                </p>
                <h2 className="font-sans text-[clamp(35px,5vw,62px)] font-black uppercase leading-[0.95] tracking-[-0.055em] text-[#edf4ef]">
                  Compléter l’élevage
                </h2>
                <p className="mt-4 max-w-162.5 text-sm leading-[1.6] text-[#87978d]">
                  Tout le nécessaire pour accompagner l’élevage de cette espèce.
                </p>
              </div>
              <Link
                href="/categories"
                className="border-b border-primary/45 pb-1.5 font-mono text-[10px] font-extrabold uppercase text-[#cad7ce] transition hover:text-primary"
              >
                Voir toute la boutique <span className="ml-2 text-primary">↗</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((related, index) => {
                const relatedPrice = Math.min(
                  ...related.variants
                    .map((variant) => toPrice(variant.price))
                    .filter((value) => value > 0),
                );
                return (
                  <Link
                    href={`/product/${related.id}`}
                    key={related.id}
                    className="group min-w-0 border border-primary/20 bg-[#080d0a] transition hover:-translate-y-1 hover:border-primary/65 hover:shadow-[0_18px_45px_rgba(0,0,0,.32),0_0_24px_rgba(71,255,131,.07)]"
                  >
                    <div className="relative aspect-[1.2] overflow-hidden border-b border-primary/20 bg-[#101711]">
                      <Image
                        src={related.images[0]}
                        alt={related.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-4 top-4 z-10 bg-[#040a06]/85 px-2 py-1.5 font-mono text-[7px] font-extrabold tracking-[0.13em] text-primary">
                        LINK 0{index + 1}
                      </span>
                      <span className="pointer-events-none absolute inset-2.5 border border-primary/15" />
                    </div>
                    <div className="p-5">
                      <small className="font-mono text-[8px] font-extrabold uppercase tracking-[0.13em] text-[#718078]">
                        {related.category?.name ?? 'Produit'}
                      </small>
                      <h3 className="mt-2 min-h-12 font-serif text-xl leading-[1.2] text-[#edf4ef]">
                        {related.name}
                      </h3>
                      <strong className="mt-5 flex justify-between gap-2 border-t border-primary/15 pt-3.5 font-mono text-[11px] leading-[1.2] text-primary">
                        Dès {Number.isFinite(relatedPrice) ? `${relatedPrice.toFixed(2)}€` : 'Voir le produit'}
                        <i className="not-italic">↗</i>
                      </strong>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

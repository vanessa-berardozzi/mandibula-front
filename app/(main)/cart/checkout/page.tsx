"use client";

import { useCartContext } from "@/context/CartContext";
import { useSession } from "@/lib/auth.client";
import { AlertTriangle, CreditCard, Loader2, Lock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type PaymentMethod = "SUM_UP" | "PAYPAL" | "BANK_TRANSFER";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

interface SavedAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

type ProductVatCategory = "STANDARD_GOODS" | "LIVE_ANIMALS";

interface CheckoutVariantData {
  id: string;
  price: number;
  product: {
    id: string;
    vatCategory: ProductVatCategory;
  };
}

interface VatCalculationResponse {
  totals: {
    totalVatCents: number;
  };
}

const COUNTRIES = [
  { code: 'FR', label: 'France' },
  { code: 'BE', label: 'Belgique' },
  { code: 'CH', label: 'Suisse' },
  { code: 'LU', label: 'Luxembourg' },
  { code: 'MC', label: 'Monaco' },
  { code: '---', label: '─────────────', disabled: true },
  { code: 'DE', label: 'Allemagne' },
  { code: 'AT', label: 'Autriche' },
  { code: 'ES', label: 'Espagne' },
  { code: 'IT', label: 'Italie' },
  { code: 'NL', label: 'Pays-Bas' },
  { code: 'PT', label: 'Portugal' },
  { code: 'GB', label: 'Royaume-Uni' },
  { code: 'IE', label: 'Irlande' },
  { code: 'DK', label: 'Danemark' },
  { code: 'SE', label: 'Suède' },
  { code: 'NO', label: 'Norvège' },
  { code: 'FI', label: 'Finlande' },
  { code: 'PL', label: 'Pologne' },
  { code: 'CZ', label: 'République tchèque' },
  { code: 'SK', label: 'Slovaquie' },
  { code: 'HU', label: 'Hongrie' },
  { code: 'RO', label: 'Roumanie' },
  { code: 'BG', label: 'Bulgarie' },
  { code: 'HR', label: 'Croatie' },
  { code: 'SI', label: 'Slovénie' },
  { code: 'GR', label: 'Grèce' },
  { code: 'CY', label: 'Chypre' },
  { code: 'MT', label: 'Malte' },
  { code: 'EE', label: 'Estonie' },
  { code: 'LV', label: 'Lettonie' },
  { code: 'LT', label: 'Lituanie' },
  { code: '---2', label: '─────────────', disabled: true },
  { code: 'CA', label: 'Canada' },
  { code: 'US', label: 'États-Unis' },
  { code: 'AU', label: 'Australie' },
  { code: 'JP', label: 'Japon' },
];

function getCountryOption(value: string) {
  const normalizedValue = value.trim().toLowerCase();
  return COUNTRIES.find((country) => (
    !country.disabled
    && (country.code.toLowerCase() === normalizedValue || country.label.toLowerCase() === normalizedValue)
  ));
}

function getCountryLabel(code: string) {
  return getCountryOption(code)?.label ?? code;
}

function CheckoutContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, subtotal, promoResult, discount } = useCartContext();

  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("SUM_UP");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [checkoutVariants, setCheckoutVariants] = useState<Record<string, CheckoutVariantData>>({});
  const [vatAmount, setVatAmount] = useState(0);
  const [isVatLoading, setIsVatLoading] = useState(false);
  const [vatError, setVatError] = useState<string | null>(null);

  // Décompose le nom complet (best effort) en prénom + nom
  const fullName = session?.user?.name ?? '';
  const nameParts = fullName.trim().split(' ');
  const defaultFirstName = nameParts[0] ?? '';
  const defaultLastName = nameParts.slice(1).join(' ');

  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: defaultFirstName,
    lastName: defaultLastName,
    email: session?.user?.email ?? '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    countryCode: 'FR',
  });

  const SHIPPING_COST = 5.99;
  const discountedSubtotal = subtotal - discount;
  const total = discountedSubtotal + SHIPPING_COST;

  useEffect(() => {
    setMounted(true);
    // Pré-remplir depuis les données de session (au cas où pas encore disponible au 1er render)
    setShipping(prev => ({
      ...prev,
      firstName: prev.firstName || defaultFirstName,
      lastName: prev.lastName || defaultLastName,
      email: prev.email || session?.user?.email || '',
    }));
  }, [defaultFirstName, defaultLastName, session?.user?.email]);

  useEffect(() => {
    const variantIds = items.filter((item) => item.variantId).map((item) => item.variantId);
    if (variantIds.length === 0) {
      setCheckoutVariants({});
      return;
    }

    let ignore = false;
    fetch(`/api/products/variants/batch?ids=${variantIds.join(',')}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<CheckoutVariantData[]>;
      })
      .then((variants) => {
        if (ignore) return;
        const byId: Record<string, CheckoutVariantData> = {};
        for (const variant of variants) {
          byId[variant.id] = variant;
        }
        setCheckoutVariants(byId);
      })
      .catch(() => {
        if (!ignore) {
          setCheckoutVariants({});
          setIsVatLoading(false);
          setVatError('TVA recalculée à la validation');
        }
      });

    return () => {
      ignore = true;
    };
  }, [items]);

  useEffect(() => {
    if (items.length === 0 || !shipping.countryCode) {
      setVatAmount(0);
      setVatError(null);
      return;
    }

    const vatItems = items.map((item) => {
      const variant = checkoutVariants[item.variantId];
      if (!variant) return null;
      return {
        productId: variant.product.id,
        productCategory: variant.product.vatCategory,
        unitPriceInclVatCents: Math.round((variant.price ?? item.price ?? 0) * 100),
        quantity: item.quantity,
      };
    });

    if (vatItems.some((item) => item === null)) {
      setVatAmount(0);
      setIsVatLoading(true);
      setVatError(null);
      return;
    }

    const controller = new AbortController();
    setIsVatLoading(true);
    setVatError(null);

    fetch('/api/vat/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      signal: controller.signal,
      body: JSON.stringify({
        items: vatItems,
        shipToCountry: shipping.countryCode,
        buyerType: 'B2C',
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<VatCalculationResponse>;
      })
      .then((vatResult) => {
        setVatAmount(vatResult.totals.totalVatCents / 100);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setVatAmount(0);
        setVatError('TVA recalculée à la validation');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsVatLoading(false);
      });

    return () => controller.abort();
  }, [checkoutVariants, items, shipping.countryCode]);

  // Charger les adresses sauvegardées
  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/addresses', { credentials: 'include' })
      .then(r => r.json())
      .then(({ addresses }: { addresses: SavedAddress[] }) => {
        setSavedAddresses(addresses ?? []);
        // Pré-remplir avec la première adresse si disponible
        if (addresses?.length > 0) {
          const first = addresses[0];
          const country = getCountryOption(first.country) ?? getCountryOption('FR')!;
          setSelectedAddressId(first.id);
          setShipping(prev => ({
            ...prev,
            street: first.street,
            city: first.city,
            postalCode: first.postalCode,
            country: country.label,
            countryCode: country.code,
          }));
        }
      })
      .catch(() => {});
  }, [session?.user]);

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    const country = getCountryOption(addr.country) ?? getCountryOption('FR')!;
    setSelectedAddressId(addr.id);
    setShipping(prev => ({
      ...prev,
      street: addr.street,
      city: addr.city,
      postalCode: addr.postalCode,
      country: country.label,
      countryCode: country.code,
    }));
  };

  const shippingField = (
    field: keyof ShippingAddress,
    label: string,
    placeholder: string,
    required = true,
    type = 'text'
  ) => (
    <div className="space-y-1">
      <label htmlFor={`shipping-${field}`} className="font-mono text-xs text-primary/60 uppercase tracking-widest">
        {label}{required && ' *'}
      </label>
      <input
        id={`shipping-${field}`}
        type={type}
        value={shipping[field]}
        onChange={e => setShipping(prev => ({ ...prev, [field]: e.target.value }))}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 bg-black/60 border border-primary/30 font-mono text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/70 transition-colors"
        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
      />
    </div>
  );

  const isShippingComplete = Boolean(shipping.firstName && shipping.lastName && shipping.email
    && shipping.street && shipping.city && shipping.postalCode && shipping.countryCode);

  const handlePayment = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      setError("Votre panier est vide");
      return;
    }

    if (!isShippingComplete) {
      setError("Veuillez remplir tous les champs de livraison obligatoires");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Créer la commande avec l'adresse de livraison
      const orderResponse = await fetch('/api/orders', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map(item => ({ variantId: item.variantId, quantity: item.quantity })),
          paymentMethod,
          shippingAddress: `${shipping.firstName} ${shipping.lastName}\n${shipping.street}\n${shipping.postalCode} ${shipping.city}\n${getCountryLabel(shipping.countryCode)}`,
          shippingCountryCode: shipping.countryCode,
          customerEmail: shipping.email,
          customerPhone: shipping.phone,
          discount,
          promoCode: promoResult?.code,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Erreur lors de la création de la commande");
      }

      const { orderId } = await orderResponse.json();

      // 2. Créer le checkout SumUp
      const checkoutResponse = await fetch('/api/checkout', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, paymentMethod }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || "Erreur lors de la création du checkout");
      }

      const { checkoutUrl } = await checkoutResponse.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Erreur checkout:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsProcessing(false);
    }
  };

  // Skeleton pendant le SSR pour éviter l'hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/60 animate-spin" />
            <Lock className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <p className="font-mono text-xs text-primary/60 tracking-widest uppercase animate-pulse">
            Vérification sécurisée...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 pb-12">
      
      {/* ── HUD HEADER ── */}
      <div className="mb-6 relative overflow-hidden border-b border-primary/50 pb-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-mono text-sm text-primary/65 tracking-[0.3em] uppercase mb-1">
              payment_gateway :: v3.14.2
            </p>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-primary drop-shadow-[0_0_12px_rgba(216,249,153,0.35)]">
              Sécurisation Paiement
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary/80 uppercase tracking-wider">Connexion sécurisée</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      {/* ── RÉCAPITULATIF COMMANDE ── */}
      <div className="max-w-4xl mx-auto space-y-6">
          <div
            className="relative border border-primary/30 bg-black/80 backdrop-blur-md overflow-hidden"
            style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(146,204,10,1) 0px, rgba(146,204,10,1) 1px, transparent 1px, transparent 4px)' }}
            />
            <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <span className="ml-2 font-mono text-xs text-primary/60 tracking-widest uppercase">
                CART :: RÉCAPITULATIF
              </span>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-lg font-black uppercase tracking-wider text-primary/90 mb-4">
                Récapitulatif Transaction
              </h2>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-start gap-3 pb-2 border-b border-primary/10 hover:bg-primary/5 px-2 py-1 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-primary/60 font-mono mt-1">
                        {item.variantId.slice(0, 8)}…
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        QTY: {item.quantity} × {item.price ? Number(item.price).toFixed(2) : '—'} €
                      </p>
                    </div>
                    <div className="font-bold text-sm text-primary tabular-nums">
                      {item.price ? (Number(item.price) * item.quantity).toFixed(2) : '—'} €
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-primary/30">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground uppercase tracking-wide">Sous-total</span>
                  <span className="text-foreground tabular-nums">{subtotal.toFixed(2)} €</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-primary uppercase tracking-wide">
                      {promoResult?.code ?? 'Remise'}
                    </span>
                    <span className="text-primary tabular-nums">-{discount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground uppercase tracking-wide">Livraison</span>
                  <span className="text-foreground tabular-nums">{SHIPPING_COST.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground uppercase tracking-wide">Dont TVA ({shipping.countryCode})</span>
                  <span className="text-foreground tabular-nums">
                    {isVatLoading ? 'Calcul...' : vatError ?? `${vatAmount.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-black pt-3 border-t border-primary/50">
                  <span className="uppercase tracking-wider text-primary">Total</span>
                  <span className="text-primary tabular-nums drop-shadow-[0_0_8px_rgba(146,204,10,0.6)]">
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        <div
          className="relative border border-primary/30 bg-black/80 backdrop-blur-md overflow-hidden"
          style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(146,204,10,1) 0px, rgba(146,204,10,1) 1px, transparent 1px, transparent 4px)' }}
          />
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="ml-2 font-mono text-xs text-primary/60 tracking-widest uppercase">
              SHIPPING :: DELIVERY_ADDRESS
            </span>
          </div>

          <div className="p-6 space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-primary/90">
              Adresse de livraison
            </h2>

            {/* Adresses sauvegardées */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-xs text-primary/50 uppercase tracking-widest">Adresses enregistrées</p>
                <div className="space-y-2">
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`w-full text-left px-3 py-2 border font-mono text-sm transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-primary/20 text-foreground/70 hover:border-primary/50'
                      }`}
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      {addr.street}, {addr.postalCode} {addr.city}, {addr.country}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(null);
                      setShipping(prev => ({ ...prev, street: '', city: '', postalCode: '', country: 'France', countryCode: 'FR' }));
                    }}
                    className={`w-full text-left px-3 py-2 border font-mono text-sm transition-all ${
                      selectedAddressId === null
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-primary/20 text-foreground/70 hover:border-primary/50'
                    }`}
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                  >
                    + Nouvelle adresse
                  </button>
                </div>
              </div>
            )}

            {/* Formulaire */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shippingField('firstName', 'Prénom', 'Jean')}
              {shippingField('lastName', 'Nom', 'Dupont')}
              {shippingField('email', 'Email', 'jean@exemple.fr', true, 'email')}
              {shippingField('phone', 'Téléphone', '+33 6 00 00 00 00', false, 'tel')}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {shippingField('street', 'Adresse', '12 rue des Invertébrés')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shippingField('postalCode', 'Code postal', '75001')}
              {shippingField('city', 'Ville', 'Paris')}
              <div className="space-y-1">
                <label htmlFor="shipping-country" className="font-mono text-xs text-primary/60 uppercase tracking-widest">
                  Pays *
                </label>
                <select
                  id="shipping-country"
                  value={shipping.countryCode}
                  onChange={e => {
                    const country = getCountryOption(e.target.value);
                    if (!country) return;
                    setShipping(prev => ({ ...prev, country: country.label, countryCode: country.code }));
                  }}
                  required
                  className="w-full px-3 py-2 bg-black/60 border border-primary/30 font-mono text-sm text-foreground focus:outline-none focus:border-primary/70 transition-colors appearance-none cursor-pointer"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                >
                  {COUNTRIES.map(c => (
                    <option
                      key={c.code}
                      value={c.code}
                      disabled={c.disabled}
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative border border-primary/30 bg-black/80 backdrop-blur-md overflow-hidden"
          style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}
        >
          {/* Scan line overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(146,204,10,1) 0px, rgba(146,204,10,1) 1px, transparent 1px, transparent 4px)',
            }}
          />
          
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="ml-2 font-mono text-xs text-primary/60 tracking-widest uppercase">
              PAYMENT_METHOD :: SELECT
            </span>
          </div>

          <div className="p-6 space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-primary/90 mb-4">
              Mode de Paiement
            </h2>

            {/* SumUp - Actif */}
            <label
              className={`group relative flex items-center p-4 border-2 cursor-pointer transition-all ${
                paymentMethod === "SUM_UP"
                  ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(146,204,10,0.2)]"
                  : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              }`}
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="SUM_UP"
                checked={paymentMethod === "SUM_UP"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="sr-only"
              />
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === "SUM_UP"
                      ? "border-primary bg-primary"
                      : "border-primary/40 bg-transparent"
                  }`}
                >
                  {paymentMethod === "SUM_UP" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                    Carte Bancaire (SumUp)
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    Paiement sécurisé • Visa, Mastercard, Amex
                  </div>
                </div>
                <Lock className="w-5 h-5 text-primary/60" />
              </div>
            </label>

            {/* PayPal - Désactivé */}
            <div
              className="relative flex items-center p-4 border-2 border-primary/10 bg-black/40 opacity-40"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-5 h-5 rounded-full border-2 border-primary/20 bg-transparent" />
                <div className="flex-1">
                  <div className="font-bold text-muted-foreground">PayPal</div>
                  <div className="text-xs text-muted-foreground/60 font-mono mt-1">
                    Bientôt disponible
                  </div>
                </div>
              </div>
            </div>

            {/* Virement bancaire - Désactivé */}
            <div
              className="relative flex items-center p-4 border-2 border-primary/10 bg-black/40 opacity-40"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-5 h-5 rounded-full border-2 border-primary/20 bg-transparent" />
                <div className="flex-1">
                  <div className="font-bold text-muted-foreground">Virement Bancaire</div>
                  <div className="text-xs text-muted-foreground/60 font-mono mt-1">
                    Bientôt disponible
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MESSAGE ERREUR ── */}
        {error && (
          <div
            className="relative border-2 border-destructive bg-destructive/10 backdrop-blur-sm overflow-hidden"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-destructive uppercase tracking-wide text-sm mb-1">Erreur Paiement</p>
                <p className="text-sm text-destructive/90 font-mono">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex-1 px-8 py-3 font-black uppercase tracking-wider text-sm border-2 border-primary/60 text-primary hover:bg-primary/10 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            disabled={isProcessing}
          >
            ← Retour
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !isShippingComplete}
            className="flex-1 px-8 py-3 font-black uppercase tracking-wider text-sm bg-primary text-black hover:shadow-[0_0_20px_rgba(216,249,153,0.5)] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Procéder au paiement
              </>
            )}
          </button>
        </div>

        {/* ── NOTICE SÉCURITÉ ── */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <Lock className="w-3 h-3 text-primary/60" />
            <p className="text-xs font-mono text-primary/70 tracking-wide">
              Connexion SSL • Données cryptées • PCI-DSS Compliant
            </p>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
            Aucune donnée bancaire n&apos;est stockée sur nos serveurs
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant wrapper avec Suspense boundary
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-primary/60 animate-spin" />
              <Lock className="absolute inset-0 m-auto w-6 h-6 text-primary" />
            </div>
            <p className="font-mono text-xs text-primary/60 tracking-widest uppercase animate-pulse">
              Initialisation sécurisée...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

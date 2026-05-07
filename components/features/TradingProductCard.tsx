"use client";

import { useCartContext } from "@/context/CartContext";
import { useSession } from "@/lib/auth.client";
import { Check, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

// ─── Couleurs par sous-catégorie ────────────────────────────────────────────
interface CategoryConfig {
  label: string;
  frameColor: string;
  glowColor: string;
  innerGlow: string;
  cardBg: string;
}

const CATEGORY_COLORS: Record<string, CategoryConfig> = {
  // Animaux vivants
  "araignees":       { label: "Araignées",      frameColor: "#4e4268", glowColor: "rgba(78,66,104,0.4)",    innerGlow: "rgba(78,66,104,0.10)",   cardBg: "linear-gradient(170deg, #0d0b18 0%, #070510 60%, #0f0b1a 100%)" },
  "myriapodes":      { label: "Myriapodes",     frameColor: "#7a3030", glowColor: "rgba(122,48,48,0.45)",   innerGlow: "rgba(122,48,48,0.12)",   cardBg: "linear-gradient(170deg, #160808 0%, #0c0404 60%, #180808 100%)" },
  "blattes":         { label: "Blattes",        frameColor: "#6b4f10", glowColor: "rgba(107,79,16,0.45)",   innerGlow: "rgba(107,79,16,0.12)",   cardBg: "linear-gradient(170deg, #130e02 0%, #0a0700 60%, #140f00 100%)" },
  "collemboles":     { label: "Collemboles",    frameColor: "#0b7a8a", glowColor: "rgba(11,122,138,0.45)",  innerGlow: "rgba(11,122,138,0.12)",  cardBg: "linear-gradient(170deg, #000d10 0%, #00070a 60%, #000e12 100%)" },
  "coleopteres":     { label: "Coléoptères",    frameColor: "#1f5c35", glowColor: "rgba(31,92,53,0.45)",    innerGlow: "rgba(31,92,53,0.12)",    cardBg: "linear-gradient(170deg, #040e07 0%, #020804 60%, #051005 100%)" },
  "mantes":          { label: "Mantes",         frameColor: "#4d6b0a", glowColor: "rgba(77,107,10,0.45)",   innerGlow: "rgba(77,107,10,0.12)",   cardBg: "linear-gradient(170deg, #090e02 0%, #050800 60%, #0a0f00 100%)" },
  "ardentiella":     { label: "Ardentiella",    frameColor: "#a05010", glowColor: "rgba(160,80,16,0.45)",   innerGlow: "rgba(160,80,16,0.12)",   cardBg: "linear-gradient(170deg, #150b00 0%, #0b0600 60%, #160c00 100%)" },
  "autres-isopodes": { label: "Isopodes",       frameColor: "#363470", glowColor: "rgba(54,52,112,0.45)",   innerGlow: "rgba(54,52,112,0.12)",   cardBg: "linear-gradient(170deg, #080818 0%, #040412 60%, #08081a 100%)" },
  "cubaris":         { label: "Cubaris",        frameColor: "#0b5f6e", glowColor: "rgba(11,95,110,0.45)",   innerGlow: "rgba(11,95,110,0.12)",   cardBg: "linear-gradient(170deg, #001014 0%, #000a0e 60%, #001214 100%)" },
  "laureola":        { label: "Laureola",       frameColor: "#8b1545", glowColor: "rgba(139,21,69,0.45)",   innerGlow: "rgba(139,21,69,0.12)",   cardBg: "linear-gradient(170deg, #180008 0%, #0e0005 60%, #1a0009 100%)" },
  "porcellio":       { label: "Porcellio",      frameColor: "#7a3815", glowColor: "rgba(122,56,21,0.45)",   innerGlow: "rgba(122,56,21,0.12)",   cardBg: "linear-gradient(170deg, #180800 0%, #0e0500 60%, #1a0900 100%)" },
  "troglodillo":     { label: "Troglodillo",    frameColor: "#45106e", glowColor: "rgba(69,16,110,0.45)",   innerGlow: "rgba(69,16,110,0.12)",   cardBg: "linear-gradient(170deg, #0c0418 0%, #070210 60%, #0e051c 100%)" },
  // Non-vivant
  "nourriture":      { label: "Nourriture",     frameColor: "#3a5410", glowColor: "rgba(58,84,16,0.45)",    innerGlow: "rgba(58,84,16,0.12)",    cardBg: "linear-gradient(170deg, #080e02 0%, #050900 60%, #090f00 100%)" },
  "accessoires":     { label: "Accessoires",    frameColor: "#243c6b", glowColor: "rgba(36,60,107,0.45)",   innerGlow: "rgba(36,60,107,0.12)",   cardBg: "linear-gradient(170deg, #020614 0%, #01040f 60%, #020716 100%)" },
  "packs-kits":      { label: "Packs & Kits",   frameColor: "#6b4e08", glowColor: "rgba(107,78,8,0.45)",    innerGlow: "rgba(107,78,8,0.12)",    cardBg: "linear-gradient(170deg, #140e00 0%, #0c0a00 60%, #160f00 100%)" },
  "divers":          { label: "Divers",         frameColor: "#234030", glowColor: "rgba(35,64,48,0.35)",    innerGlow: "rgba(35,64,48,0.10)",    cardBg: "linear-gradient(170deg, #060d08 0%, #040a05 60%, #070f06 100%)" },
};

const DEFAULT_CATEGORY: CategoryConfig = CATEGORY_COLORS["divers"];

// ─── Tier visuel : détermine le style du contour animé ────────────────────────
type Tier = "common" | "rare" | "epic" | "legendary";

const CATEGORY_TIER: Record<string, Tier> = {
  ardentiella: "legendary",
  collemboles: "epic",
  cubaris:     "rare",
};

function getCategoryTier(slug?: string): Tier {
  if (!slug) return "common";
  return CATEGORY_TIER[slug] ?? "common";
}

function getBorderGradient(tier: Tier, frameColor: string): string {
  switch (tier) {
    case "legendary":
      // Or lumineux tournant
      return "linear-gradient(90deg, #6b4900, #c8960c, #ffd700, #fffacd, #ffd700, #e8a800, #c8960c, #6b4900)";
    case "epic":
      // Argent chromé
      return "linear-gradient(90deg, #4a4a5a, #9898b8, #d8d8f0, #ffffff, #d8d8f0, #9898b8, #4a4a5a)";
    case "rare":
      // Couleur catégorie + reflets métalliques
      return `linear-gradient(90deg, ${frameColor}60, ${frameColor}, #c0c0c0, #ffffff99, ${frameColor}, ${frameColor}bb, #c0c0c0, ${frameColor}60)`;
    case "common":
    default:
      // Shimmer doux sur la couleur de la catégorie
      return `linear-gradient(90deg, ${frameColor}40, ${frameColor}99, ${frameColor}ff, ${frameColor}cc, ${frameColor}40)`;
  }
}

const TIER_ANIM: Record<Tier, { speed: string; idleOpacity: number; hoverOpacity: number }> = {
  legendary: { speed: "2.5s", idleOpacity: 0.75, hoverOpacity: 1    },
  epic:      { speed: "3.5s", idleOpacity: 0.6,  hoverOpacity: 0.95 },
  rare:      { speed: "4s",   idleOpacity: 0.5,  hoverOpacity: 0.85 },
  common:    { speed: "6s",   idleOpacity: 0,    hoverOpacity: 0.7  },
};
// ─────────────────────────────────────────────────────────────────────────────

interface TradingProductCardProps {
  title: string;
  price: number;
  stock: number;
  imageUrl?: string;
  href?: string;
  variantId?: string;
  priority?: boolean;
  categorySlug?: string;
}

export function TradingProductCard({
  title,
  price,
  stock,
  imageUrl,
  href = "/product",
  variantId,
  priority = false,
  categorySlug,
}: TradingProductCardProps) {
  const isInStock = stock > 0;
  const rc   = CATEGORY_COLORS[categorySlug ?? ""] ?? DEFAULT_CATEGORY;
  const tier = getCategoryTier(categorySlug);
  const ta   = TIER_ANIM[tier];

  const { data: session } = useSession();
  const { addItem } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // ── Effet tilt 3D ──
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mouseX, setMouseX] = useState(50); // 0→100% position sur la carte
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const dy = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({ x: -dy * 12, y: dx * 12 });
    setMouseX(((e.clientX - rect.left) / rect.width) * 100);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMouseX(50);
    setIsHovered(false);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || !session?.user) {
      if (!session?.user) window.location.href = "/login";
      return;
    }
    if (!isInStock) return;
    setIsAdding(true);
    try {
      await addItem(variantId, 1, price);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
  };

  const cardContent = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full"
      style={{ perspective: "900px" }}
    >
      {/* Keyframes pour l'animation shimmer du contour */}
      <style>{`
        @keyframes shimmer-border {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      {/* ── FRAME EXTÉRIEURE (padding = épaisseur du cadre TCG) ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "5 / 7",
          background: `linear-gradient(145deg, ${rc.frameColor}cc 0%, ${rc.frameColor}55 40%, ${rc.frameColor}88 100%)`,
          borderRadius: "10px",
          padding: "14px 12px 12px",
          boxShadow: [
            `0 0 0 1px ${rc.frameColor}30`,
            `0 0 ${isHovered ? "30px" : "18px"} ${rc.glowColor}`,
            `0 ${isHovered ? "20px" : "10px"} 40px rgba(0,0,0,0.8)`,
            tier === "legendary" ? `0 0 ${isHovered ? "55px" : "35px"} rgba(255,215,0,0.45)` : "",
            tier === "epic"      ? `0 0 ${isHovered ? "45px" : "25px"} rgba(200,200,255,0.35)` : "",
          ].filter(Boolean).join(", "),
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? "-8px" : "0"})`,
          transition: isHovered
            ? "transform 0.08s ease-out, box-shadow 0.15s ease"
            : "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.55s ease",
          willChange: "transform",
          isolation: "isolate",
        }}
      >
        {/* ── CONTOUR ANIMÉ — shimmer par tier ── */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[10px]"
          style={{
            padding: "14px 12px 12px",
            background: getBorderGradient(tier, rc.frameColor),
            backgroundSize: "200% 100%",
            backgroundPosition: isHovered ? `${mouseX}% center` : "50% center",
            animation: "none",
            opacity: isHovered ? ta.hoverOpacity : ta.idleOpacity,
            transition: isHovered
              ? "opacity 0.3s ease"
              : "opacity 0.4s ease, background-position 0.6s ease",
            maskImage: "linear-gradient(#000, #000), linear-gradient(#000, #000)",
            maskClip: "border-box, content-box",
            maskOrigin: "border-box, content-box",
            maskComposite: "exclude",
            WebkitMaskImage: "linear-gradient(#000, #000), linear-gradient(#000, #000)",
            WebkitMaskClip: "border-box, content-box" as React.CSSProperties["WebkitMaskClip"],
            WebkitMaskOrigin: "border-box, content-box" as React.CSSProperties["WebkitMaskOrigin"],
            WebkitMaskComposite: "xor" as React.CSSProperties["WebkitMaskComposite"],
          }}
        />

        {/* Ornements de coins du cadre — petits losanges */}
        {[
          "top-1 left-1",
          "top-1 right-1",
          "bottom-1 left-1",
          "bottom-1 right-1",
        ].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-2.5 h-2.5 z-30 pointer-events-none`}
            style={{
              background: rc.frameColor,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              opacity: 0.85,
            }}
          />
        ))}

        {/* ── CORPS INTERNE ── */}
        <div
          className="relative h-full flex flex-col overflow-hidden"
          style={{
            background: rc.cardBg,
            borderRadius: "5px",
            border: `1px solid ${rc.frameColor}25`,
          }}
        >
          {/* ══ NAME PLATE ════════════════════════════════════ */}
          <div
            className="shrink-0 flex items-center justify-between gap-1 px-2 py-1"
            style={{
              background: `linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 100%)`,
              borderBottom: `1px solid ${rc.frameColor}40`,
            }}
          >
            <h3 className="text-sm font-black uppercase tracking-wide line-clamp-1 text-white leading-tight">
              {title}
            </h3>
            {/* Prix façon "HP" TCG */}
            <div className="shrink-0 flex items-baseline gap-0.5 ml-2">
              <span className="text-[10px] font-mono text-white/70 uppercase">px</span>
              <span
                className="text-base font-black font-mono leading-none text-white"
              >
                {price.toFixed(0)}
              </span>
            </div>
          </div>

          {/* ══ ZONE ART ═════════════════════════════════════ */}
          <div
            className="relative flex-1 min-h-0 overflow-hidden"
            style={{
              margin: "4px 4px 0",
              border: `2px solid ${rc.frameColor}50`,
              borderRadius: "3px",
              /* Ombre intérieure = effet biseau TCG */
              boxShadow: `inset 0 0 12px rgba(0,0,0,0.6), inset 0 0 0 1px ${rc.frameColor}20`,
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-700"
                style={{ transform: isHovered ? "scale(1.07)" : "scale(1)" }}
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                priority={priority}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: `radial-gradient(circle, ${rc.innerGlow} 0%, transparent 70%)` }}>
                <svg className="w-10 h-10 opacity-20" fill="none" stroke={rc.frameColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Scan lines */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-15"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(146,204,10,0.1) 0px, rgba(146,204,10,0.1) 1px, transparent 1px, transparent 3px)" }}
            />



            {/* Coins ornements intérieurs de la zone art */}
            <div className="absolute top-0.5 left-0.5 w-3 h-3 pointer-events-none z-20"
              style={{ borderTop: `1.5px solid ${rc.frameColor}90`, borderLeft: `1.5px solid ${rc.frameColor}90` }} />
            <div className="absolute top-0.5 right-0.5 w-3 h-3 pointer-events-none z-20"
              style={{ borderTop: `1.5px solid ${rc.frameColor}90`, borderRight: `1.5px solid ${rc.frameColor}90` }} />
            <div className="absolute bottom-0.5 left-0.5 w-3 h-3 pointer-events-none z-20"
              style={{ borderBottom: `1.5px solid ${rc.frameColor}90`, borderLeft: `1.5px solid ${rc.frameColor}90` }} />
            <div className="absolute bottom-0.5 right-0.5 w-3 h-3 pointer-events-none z-20"
              style={{ borderBottom: `1.5px solid ${rc.frameColor}90`, borderRight: `1.5px solid ${rc.frameColor}90` }} />

            {/* Dégradé bas */}
            <div className="absolute bottom-0 left-0 right-0 h-6 z-20 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(4,8,2,0.85), transparent)" }} />

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute bottom-1.5 right-1.5 z-30 w-6 h-6 flex items-center justify-center transition-all duration-200"
              style={{
                background: "rgba(4,8,2,0.8)",
                backdropFilter: "blur(4px)",
                borderRadius: "50%",
                border: `1px solid ${wishlisted ? "#ff4d6d70" : rc.frameColor + "35"}`,
                boxShadow: wishlisted ? "0 0 8px rgba(255,77,109,0.6)" : "none",
              }}
              aria-label={wishlisted ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
            >
              <Heart
                className="w-3 h-3 transition-all duration-200"
                style={{
                  color: wishlisted ? "#ff4d6d" : "rgba(255,255,255,0.5)",
                  fill: wishlisted ? "#ff4d6d" : "transparent",
                  filter: wishlisted ? "drop-shadow(0 0 4px #ff4d6d)" : "none",
                }}
              />
            </button>
          </div>

          {/* ══ TYPE LINE ════════════════════════════════════ */}
          <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${rc.frameColor}50)` }} />
            <span className="text-xs font-mono tracking-wider uppercase whitespace-nowrap text-white/60">
              {rc.label}
            </span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${rc.frameColor}50)` }} />
          </div>

          {/* ══ TEXT BOX ══════════════════════════════════════ */}
          <div
            className="shrink-0 mx-1 mb-1 rounded-sm overflow-hidden"
            style={{
              background: "rgba(2,6,1,0.7)",
              border: `1px solid ${rc.frameColor}25`,
            }}
          >
            {/* Prix centré + bouton panier */}
            <div className="flex items-center justify-between gap-1 px-2.5 py-1.5">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black font-mono leading-none text-white">
                  {price.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-white/70">€</span>
              </div>

              {variantId ? (
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wide transition-all duration-200 rounded-sm"
                  style={{
                    background: added ? "rgba(146,204,10,0.18)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${added ? "#92cc0a" : "rgba(255,255,255,0.18)"}`,
                    color: added ? "#92cc0a" : isInStock ? "rgba(255,255,255,0.85)" : "#555",
                    boxShadow: added ? "0 0 8px rgba(146,204,10,0.4)" : "none",
                    cursor: isInStock ? "pointer" : "not-allowed",
                    opacity: isInStock ? 1 : 0.3,
                  }}
                >
                  {isAdding ? (
                    <div className="w-2.5 h-2.5 animate-spin border border-current border-t-transparent rounded-full" />
                  ) : added ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    <ShoppingCart className="w-2.5 h-2.5" />
                  )}
                  <span>{added ? "Ajouté" : "Panier"}</span>
                </button>
              ) : (
                <span className="text-xs font-mono font-bold text-white/70">Voir →</span>
              )}
            </div>

            {/* Ligne collector : stock + numéro */}
            <div
              className="flex items-center justify-between px-2.5 py-0.5"
              style={{ borderTop: `1px solid ${rc.frameColor}20` }}
            >
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wide"
                style={{ color: isInStock ? "rgba(255,255,255,0.6)" : "#cc1515" }}>
                {isInStock ? `◈ ${stock} en stock` : "◈ épuisé"}
              </span>
              <span className="text-[9px] font-mono opacity-60 text-white">MDB •◆</span>
            </div>
          </div>
        </div>

        {/* Glow interne au hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-[10px]"
          style={{
            boxShadow: `inset 0 0 24px ${rc.glowColor}`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      </div>
    </div>
  );

  if (!href) {
    return <div className="group relative">{cardContent}</div>;
  }

  return (
    <Link
      href={href}
      className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Voir la fiche produit de ${title}`}
    >
      {cardContent}
    </Link>
  );
}

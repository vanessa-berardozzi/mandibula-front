"use client";

import { useCartContext } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type TouchEvent } from "react";

import styles from "./PacksSection.module.css";

interface Variant {
  id: string;
  name: string;
  price: string;
  stock: number;
  reservedStock: number;
}

interface ApiProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  variants: Variant[];
}

interface CategoryResponse {
  data: ApiProduct[];
}

const PACK_SUBTITLES: Record<string, string> = {
  "1": "Démarrer sur de bonnes bases",
  "50": "L'installation complète",
  "99": "Passer au niveau supérieur",
};

const PACK_FALLBACK_IMAGES: Record<string, string> = {
  "1": "/pack-level-1.png",
  "50": "/pack-level-50.png",
  "99": "/pack-level-99.png",
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function extractLevel(name: string): string {
  const match = name.match(/level\s*(\d+)/i);
  return match ? match[1] : "—";
}

export function PacksSection() {
  const [packs, setPacks] = useState<ApiProduct[]>([]);
  const [activePackImages, setActivePackImages] = useState<Record<string, number>>({});
  const packTouchStarts = useRef<Record<string, number>>({});
  const { addItem } = useCartContext();

  useEffect(() => {
    fetch("/api/products/category/packs-kits")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<CategoryResponse>;
      })
      .then((data) => setPacks(data.data.slice(0, 3)))
      .catch(() => setPacks([]));
  }, []);

  function changePackImage(packId: string, imageCount: number, direction: number) {
    if (imageCount <= 1) return;

    setActivePackImages((current) => ({
      ...current,
      [packId]: ((current[packId] ?? 0) + direction + imageCount) % imageCount,
    }));
  }

  function handlePackTouchStart(packId: string, event: TouchEvent<HTMLDivElement>) {
    packTouchStarts.current[packId] = event.touches[0]?.clientX ?? 0;
  }

  function handlePackTouchEnd(packId: string, imageCount: number, event: TouchEvent<HTMLDivElement>) {
    const startX = packTouchStarts.current[packId];
    const endX = event.changedTouches[0]?.clientX;

    delete packTouchStarts.current[packId];
    if (typeof startX !== "number" || typeof endX !== "number" || imageCount <= 1) return;

    const distance = endX - startX;
    if (Math.abs(distance) < 42) return;
    changePackImage(packId, imageCount, distance < 0 ? 1 : -1);
  }

  if (packs.length === 0) return null;

  return (
    <section className={styles["packs-impact"]} id="packs">
      <span className={styles["packs__watermark"]} aria-hidden="true">PACKS</span>

      <div className={styles["packs__heading"]}>
        <div className={styles["packs__title-wrap"]}>
          <p className="eyebrow">BREEDING LOADOUTS / SÉRIE 01—99</p>
          <h2 className={styles["packs__title"]}>Choisis ton niveau.</h2>
          <div className={styles["packs__level-track"]} aria-hidden="true">
            <span><b>01</b><i /></span>
            <span><b>50</b><i /></span>
            <span><b>99</b></span>
          </div>
        </div>
        <div className={styles["packs__intro"]}>
          <p>Trois packs complets conçus pour installer un élevage fiable sans oublier l’essentiel.</p>
          <Link href="/categories/packs-kits">
            Comparer tous les packs <span>→</span>
          </Link>
        </div>
      </div>

      <div className={styles["packs__grid"]}>
        {packs.map((pack, index) => {
          const level = extractLevel(pack.name);
          const featured = index === 1;
          const availableVariants = pack.variants
            .filter((variant) => Number(variant.price) > 0)
            .sort((first, second) => Number(first.price) - Number(second.price));
          const defaultVariant = availableVariants[0] ?? pack.variants[0];
          const price = defaultVariant ? Number(defaultVariant.price) : Number(pack.price);
          const fallbackImage = PACK_FALLBACK_IMAGES[level];
          const apiImages = pack.images.filter((image): image is string => Boolean(image));
          const packImages = fallbackImage && !apiImages.includes(fallbackImage) ? [...apiImages, fallbackImage] : apiImages;
          const activeImage = activePackImages[pack.id] ?? 0;

          if (packImages.length === 0) return null;

          return (
            <article
              key={pack.id}
              className={`${styles["pack-card"]} ${featured ? styles["pack-card--featured"] : ""}`}
            >
              {featured && <span className={styles["pack-card__featured"]}>Le plus choisi</span>}

              <div className={styles["pack-card__index"]} aria-hidden="true">
                <span>LEVEL</span>
                <strong>{level}</strong>
              </div>

              <div
                className={styles["pack-card__image"]}
                onTouchStart={(event) => handlePackTouchStart(pack.id, event)}
                onTouchEnd={(event) => handlePackTouchEnd(pack.id, packImages.length, event)}
              >
                <Link href={`/product/${pack.id}`} aria-label={pack.name}>
                  <Image
                    src={packImages[activeImage]}
                    alt={`${pack.name} — image ${activeImage + 1} sur ${packImages.length}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </Link>
                <i aria-hidden="true" />
                {packImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles["pack-carousel-arrow"]} ${styles["pack-carousel-arrow--previous"]}`}
                      onClick={() => changePackImage(pack.id, packImages.length, -1)}
                      aria-label="Image précédente"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={`${styles["pack-carousel-arrow"]} ${styles["pack-carousel-arrow--next"]}`}
                      onClick={() => changePackImage(pack.id, packImages.length, 1)}
                      aria-label="Image suivante"
                    >
                      ›
                    </button>
                    <div className={styles["pack-carousel-dots"]} aria-label={`${activeImage + 1} / ${packImages.length}`}>
                      {packImages.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          type="button"
                          className={imageIndex === activeImage ? styles["is-active"] : ""}
                          onClick={() => setActivePackImages((current) => ({ ...current, [pack.id]: imageIndex }))}
                          aria-label={`Afficher l’image ${imageIndex + 1}`}
                          aria-current={imageIndex === activeImage ? "true" : undefined}
                        />
                      ))}
                    </div>
                    <span className={styles["pack-carousel-count"]}>
                      {String(activeImage + 1).padStart(2, "0")} / {String(packImages.length).padStart(2, "0")}
                    </span>
                  </>
                )}
              </div>

              <div className={styles["pack-card__info"]}>
                <p>{PACK_SUBTITLES[level] ?? "Un pack complet pour ton élevage"}</p>
                <h3>
                  <Link href={`/product/${pack.id}`}>{pack.name}</Link>
                </h3>
                <small>Configurations pensées pour chaque étape de ton élevage.</small>

                <div className={styles["pack-card__actions"]}>
                  <strong>
                    <span>À partir de</span>
                    {formatPrice(price)} €
                  </strong>
                  <Link href={`/product/${pack.id}`}>Découvrir →</Link>
                  {defaultVariant && (
                    <button
                      type="button"
                      className={styles["pack-card__add"]}
                      onClick={() => addItem(defaultVariant.id, 1, price)}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles["packs__status"]} aria-hidden="true">
        <span>03 CONFIGURATIONS</span>
        <span>READY TO BREED</span>
        <span>MANDIBULA SYSTEM / ONLINE</span>
      </div>
    </section>
  );
}

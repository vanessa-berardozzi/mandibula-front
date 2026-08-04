"use client";

import { useCartContext } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

function extractLevel(name: string): string {
  const match = name.match(/level\s*(\d+)/i);
  return match ? match[1] : "—";
}

// Section "Choisis ton niveau" — packs d'élevage réels (catégorie packs-kits), thème sombre.
export function PacksSection() {
  const [packs, setPacks] = useState<ApiProduct[]>([]);
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

  if (packs.length === 0) return null;

  return (
    <section className={styles["packs"]} id="packs">
      <span className={styles["packs__watermark"]} aria-hidden="true">PACKS</span>

      <div className={styles["packs__heading"]}>
        <div>
          <p className="eyebrow">Kits d&apos;élevage</p>
          <h2 className={styles["packs__title"]}>Choisis ton niveau</h2>
          <div className={styles["packs__level-track"]} aria-hidden="true">
            <span><b>01</b><i /></span>
            <span><b>50</b><i /></span>
            <span><b>99</b></span>
          </div>
        </div>
        <div className={styles["packs__intro"]}>
          <p>
            Trois configurations pensées pour chaque étape de ton élevage : de l&apos;installation
            de démarrage à l&apos;équipement complet pour les passionnés confirmés.
          </p>
          <Link href="/categories?categorie=pack">
            Voir tous les packs <span>→</span>
          </Link>
        </div>
      </div>

      <div className={styles["packs__grid"]}>
        {packs.map((pack, index) => {
          const level = extractLevel(pack.name);
          const featured = index === 1;
          const defaultVariant = pack.variants[0];
          const price = defaultVariant ? parseFloat(defaultVariant.price) : parseFloat(pack.price);

          return (
            <article key={pack.id} className={`${styles["pack-card"]} ${featured ? styles["is-featured"] : ""}`}>
              {featured && <span className={styles["pack-card__featured"]}>Le plus choisi</span>}

              <div className={styles["pack-card__index"]} aria-hidden="true">
                <span>LEVEL</span>
                <strong>{level}</strong>
              </div>

              <Link href={`/product/${pack.id}`} className={styles["pack-card__image"]}>
                {pack.images[0] && (
                  <Image src={pack.images[0]} alt={pack.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain" />
                )}
              </Link>

              <div className={styles["pack-card__info"]}>
                <p>{PACK_SUBTITLES[level] ?? "Un pack complet pour ton élevage"}</p>
                <h3>
                  <Link href={`/product/${pack.id}`}>{pack.name}</Link>
                </h3>

                <div className={styles["pack-card__actions"]}>
                  <strong>
                    <span>Dès</span>
                    {price.toFixed(2)} €
                  </strong>
                  <Link href={`/product/${pack.id}`}>Découvrir →</Link>
                  {defaultVariant && (
                    <button
                      type="button"
                      className={styles["pack-card__add"]}
                      onClick={() => addItem(defaultVariant.id, 1, price)}
                    >
                      Ajouter au panier
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

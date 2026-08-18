"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { defaultHeroSpecimens, type HeroSpecimen } from "./hero.mock";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  title?: string;
  /** Ligne centrale du titre, mise en avant en vert (voir .kinetic-title em) */
  highlight?: string;
  /** Dernière ligne du titre, en blanc */
  closing?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  /** Spécimens du carrousel bio-sonar — voir hero.mock.ts (données statiques pour le moment) */
  specimens?: HeroSpecimen[];
}

export function HeroSection({
  title = "Le vivant,",
  highlight = "élevé avec",
  closing = "exigence.",
  description = "Isopodes, myriapodes et matériel d'élevage sélectionnés par des passionnés. Des animaux nés chez nous, des conseils précis et une expédition pensée pour leur sécurité.",
  ctaLabel = "Découvrir les espèces",
  ctaHref = "/categories/animaux-vivants",
  ctaSecondaryLabel = "Voir les packs d'élevage",
  ctaSecondaryHref = "/categories/packs-kits",
  specimens = defaultHeroSpecimens,
}: HeroSectionProps) {
  const [activeSpecimen, setActiveSpecimen] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isInteracting) return;
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(
      () => setActiveSpecimen((current) => (current + 1) % specimens.length),
      3000,
    );
    return () => window.clearInterval(interval);
  }, [isInteracting, specimens.length]);

  const specimen = specimens[activeSpecimen];

  const finishSwipe = (clientX: number) => {
    const start = pointerStartX.current;
    pointerStartX.current = null;
    setIsInteracting(false);

    if (start === null) return;
    const distance = clientX - start;
    if (Math.abs(distance) < 42) return;

    setActiveSpecimen((current) =>
      distance < 0 ? (current + 1) % specimens.length : (current - 1 + specimens.length) % specimens.length,
    );
  };

  return (
    <section className={styles.hero}>
      {/* Fond jungle + dégradés de contraste (décoratif) */}
      <div className={styles["hero-backdrop"]} aria-hidden="true">
        <Image src="/mandibula-jungle.png" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>

      {/* Repères de coordonnées, purement décoratifs */}
      <div className={styles["hero-index"]} aria-hidden="true">
        <span>U-01 / ÉLEVAGE RESPONSABLE</span>
        <span>49.6116° N · 6.1319° E</span>
      </div>

      {/* ========== COLONNE GAUCHE: CONTENU ========== */}
      <div className={styles["hero-content"]}>
        <div>
          <p className="eyebrow">Élevage responsable · Luxembourg</p>
          <h1 className={`kinetic-title ${styles["hero-title"]}`}>
            <span>{title}</span>
            <em>{highlight}</em>
            <span>{closing}</span>
          </h1>
        </div>

        <p className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={ctaHref}>
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 border-primary/40 text-primary-foreground font-bold uppercase text-xs md:text-sm">
              {ctaLabel}
            </Button>
          </Link>
          <Link href={ctaSecondaryHref}>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-primary/40 text-foreground hover:border-primary hover:neon-glow font-bold uppercase text-xs md:text-sm"
            >
              {ctaSecondaryLabel}
            </Button>
          </Link>
        </div>

        <ul className={styles.guarantees}>
          <li>
            <span>✓</span> Élevage maison
          </li>
          <li>
            <span>✓</span> Garantie arrivée en vie
          </li>
          <li>
            <span>✓</span> Conseils personnalisés
          </li>
        </ul>
      </div>

      {/* ========== COLONNE DROITE: BIO-SONAR + SPECIMEN ========== */}
      <div
        className={styles["hero-visual"]}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") {
            pointerStartX.current = event.clientX;
            setIsInteracting(true);
          }
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") finishSwipe(event.clientX);
        }}
        onPointerCancel={() => {
          pointerStartX.current = null;
          setIsInteracting(false);
        }}
      >
        {/* Bio-sonar */}
        <div className={styles["bio-sonar"]} aria-hidden="true">
          <div className={styles["sonar-ring"]} />
          <div className={styles["sonar-ring"]} />
          <div className={styles["sonar-ring"]} />
          <div className={`${styles["sonar-axis"]} ${styles["axis-x"]}`} />
          <div className={`${styles["sonar-axis"]} ${styles["axis-y"]}`} />
          <div className={styles["sonar-sweep"]} />
          <div className={`${styles["sonar-blip"]} ${styles["blip-a"]}`} />
          <div className={`${styles["sonar-blip"]} ${styles["blip-b"]}`} />
          <div className={`${styles["sonar-blip"]} ${styles["blip-c"]}`} />
          <div className={`${styles["sonar-blip"]} ${styles["blip-d"]}`} />
          <div className={styles["sonar-readout"]}>
            <span>BIOSCAN / ACTIVE</span>
            <strong>{String(specimens.length).padStart(2, "0")}</strong>
            <small>Signatures détectées</small>
          </div>
        </div>

        <div className={styles["scan-line"]} aria-hidden="true" />
        <div className={`${styles["specimen-frame"]} ${styles["frame-one"]}`} aria-hidden="true" />
        <div className={`${styles["specimen-frame"]} ${styles["frame-two"]}`} aria-hidden="true" />

        <div className={styles["specimen-slides"]} aria-live="polite">
          {specimens.map((spec, index) => (
            <Image
              key={spec.code}
              className={`${styles["specimen-image"]} ${index === activeSpecimen ? styles.active : ""}`}
              src={spec.image}
              alt={index === activeSpecimen ? spec.name : ""}
              fill
              sizes="(max-width: 768px) 60vw, 330px"
              aria-hidden={index !== activeSpecimen}
            />
          ))}
        </div>

        <div className={styles["specimen-card"]}>
          <span>SPECIMEN / {specimen.code}</span>
          <strong>{specimen.name}</strong>
          <small>{specimen.variety}</small>
        </div>

        <div className={styles["specimen-data"]} aria-hidden="true">
          <span>ORIGIN / {specimen.origin}</span>
          <span>HYGRO / {specimen.hygro}</span>
          <span>TEMP / {specimen.temp}</span>
        </div>

        <div className={styles["specimen-dots"]} aria-label="Choisir le spécimen affiché">
          {specimens.map((spec, index) => (
            <button
              key={spec.code}
              type="button"
              className={index === activeSpecimen ? styles.active : ""}
              onClick={() => {
                setActiveSpecimen(index);
                setIsInteracting(false);
              }}
              aria-label={`Afficher ${spec.name} ${spec.variety}`}
              aria-current={index === activeSpecimen ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


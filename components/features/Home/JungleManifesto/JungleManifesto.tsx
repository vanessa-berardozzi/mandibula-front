import Image from "next/image";
import Link from "next/link";

import styles from "./JungleManifesto.module.css";

// Bannière manifeste : message de marque + lien vers les guides d'élevage.
export function JungleManifesto() {
  return (
    <section className={`section ${styles["jungle-manifesto"]}`} aria-label="Guides d'élevage et tutoriels Mandibula">
      {/* Fond jungle + grille topographique en overlay, purement décoratifs */}
      <Image
        src="/mandibula-jungle.png"
        alt="Post apocalyptic jungle with a neon topographic grid overlay "
        aria-hidden="true"
        fill
        className={styles["jungle-manifesto__backdrop"]}
      />
      <Image
        src="/topographic-neon.png"
        alt=""
        aria-hidden="true"
        fill
        className={styles["jungle-manifesto__overlay"]}
      />

      <div className={styles["jungle-manifesto__content"]}>
        <span className={styles["jungle-manifesto__tag"]}>Mandibula Academy / 04</span>
        <h2 className="kinetic-title">
          <span>Élever, c&apos;est</span>
          <em>comprendre.</em>
        </h2>
        <p className={styles["jungle-manifesto__text"]}>
          Retrouvez nos guides d&apos;élevage, tutoriels pratiques et fiches récapitulatives pour mieux
          comprendre les besoins de vos isopodes, myriapodes et microfaunes. Des bases accessibles, des
          méthodes précises et des conseils issus de nos élevages.
        </p>
        <Link href="/guides" className={styles["jungle-manifesto__link"]}>
          Explorer les guides et tutoriels <span>→</span>
        </Link>
      </div>

      <div className={styles["jungle-manifesto__data"]} aria-hidden="true">
        <span>Academy / Online</span>
        <strong>08</strong>
        <small>Guides disponibles</small>
      </div>
    </section>
  );
}

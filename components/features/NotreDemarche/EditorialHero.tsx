import Image from "next/image";

import styles from "./EditorialHero.module.css";

// Hero éditorial plein écran de la page "Notre démarche" : fond jungle assombri + titre + intro.
export function EditorialHero() {
  return (
    <section className={styles["editorial-hero"]}>
      <Image
        src="/mandibula-jungle.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        className={styles["editorial-hero__image"]}
      />
      <div className={styles["editorial-hero__scrim"]} aria-hidden="true" />
      <div className={styles["editorial-hero__content"]}>
        <p className="eyebrow">Pourquoi Mandibula existe</p>
        <h1 className="kinetic-title">
          <span>Changer les mentalités</span>
          <em>derrière la passion.</em>
        </h1>
        <p className={styles["editorial-hero__text"]}>
          Nous voulons professionnaliser l&rsquo;achat d&rsquo;invertébrés, combattre les prélèvements massifs et
          reconnecter chacun au vivant.
        </p>
      </div>
    </section>
  );
}

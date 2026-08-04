import Link from "next/link";

import styles from "./MissionSection.module.css";

// Section "Derrière la passion, une responsabilité" : fond plein vert, deux colonnes.
export function MissionSection() {
  return (
    <section className={`section ${styles["mission"]}`}>
      <div>
        <p className="eyebrow">Notre raison d&apos;être</p>
        <h2 className={styles["mission__title"]}>Derrière la passion, une responsabilité.</h2>
      </div>

      <div className={styles["mission__content"]}>
        <p className={styles["mission__text"]}>
          Chaque spécimen est né et élevé chez nous, dans des conditions contrôlées. Nous privilégions la
          reproduction en captivité plutôt que le prélèvement en milieu naturel, pour préserver les
          populations sauvages et garantir des animaux robustes et acclimatés.
        </p>
        <Link href="/notre-demarche" className={styles["mission__link"]}>
          En savoir plus <span>→</span>
        </Link>
      </div>
    </section>
  );
}

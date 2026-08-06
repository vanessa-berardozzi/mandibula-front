import Link from "next/link";

import styles from "./MissionSection.module.css";

// Section "Raison d'etre" de la home, calquee sur la maquette.
export function MissionSection() {
  return (
    <section className={`section ${styles["mission"]}`} id="mission">
      <div className={styles["mission__heading"]}>
        <p className="eyebrow">Notre raison d&apos;être</p>
        <h2 className={styles["mission__title"]}>Derrière la passion, une responsabilité.</h2>
      </div>

      <div className={styles["mission__content"]}>
        <p className={styles["mission__text"]}>
          Mandibula défend un élevage traçable, lutte contre les prélèvements massifs et accompagne
          refuges, écoles et éleveurs vers de meilleures pratiques.
        </p>
        <Link href="/notre-demarche" className={styles["mission__link"]}>
          Découvrir notre engagement <span>→</span>
        </Link>
      </div>
    </section>
  );
}

import { defaultApproachValues, type ApproachValue } from "./values.mock";
import styles from "./ValuesGrid.module.css";

interface ValuesGridProps {
  values?: ApproachValue[];
}

// Rupture éditoriale claire (fidèle à la maquette) : 3 piliers de la démarche Mandibula.
export function ValuesGrid({ values = defaultApproachValues }: ValuesGridProps) {
  return (
    <section className={styles["values-grid"]}>
      {values.map((value) => (
        <article key={value.code} className={styles["values-grid__item"]}>
          <span className={styles["values-grid__code"]}>{value.code}</span>
          <h2 className={styles["values-grid__title"]}>{value.title}</h2>
          <p className={styles["values-grid__text"]}>{value.description}</p>
        </article>
      ))}
    </section>
  );
}

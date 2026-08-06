import Image from "next/image";
import Link from "next/link";

import { defaultHeroSpecimens } from "../HeroSection/hero.mock";
import styles from "./AboutSection.module.css";

const VALUES: [string, string][] = [
  ["Élevage en captivité", "Aucun prélèvement en milieu naturel : chaque animal naît et grandit chez nous."],
  ["Substrats maison", "Des mélanges techniques développés en interne, adaptés à chaque espèce."],
  ["Accompagnement réel", "Des conseils personnalisés avant et après l'achat, par des passionnés."],
];

export function AboutSection() {
  const gallery = defaultHeroSpecimens.slice(0, 3);

  return (
    <section className={styles["about"]} id="qui-nous-sommes">
      <div className={styles["about__leaves"]} aria-hidden="true" />

      <div className={styles["about__copy"]}>
        <p className="eyebrow">Notre écosystème / depuis le Luxembourg</p>
        <h2 className={styles["about__title"]}>Qui nous sommes.</h2>
        <p className={styles["about__lead"]}>
          Mandibula est né d&apos;une passion pour les invertébrés exotiques, portée par des éleveurs
          qui refusent de choisir entre exigence scientifique et accessibilité.
        </p>
        <p className={styles["about__text"]}>
          Depuis notre atelier, nous reproduisons isopodes et myriapodes en petites lignées suivies,
          nous développons nos propres substrats et nous testons chaque protocole d&apos;élevage avant
          de le partager. L&apos;objectif : des animaux robustes, acclimatés, et des clients bien accompagnés.
        </p>

        <div className={styles["about__values"]}>
          {VALUES.map(([title, description], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>

        <Link href="/notre-demarche" className={styles["about__cta"]}>
          Découvrir notre démarche <span>→</span>
        </Link>
      </div>

      <div className={styles["about__gallery"]}>
        {gallery.map((item, index) => (
          <figure key={item.code} className={`${styles["about__photo"]} ${styles[`about__photo-${index + 1}`]}`}>
            <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            <figcaption>
              <span>Élevé chez Mandibula</span>
              <strong>{item.name}</strong>
              <small>{item.variety}</small>
            </figcaption>
          </figure>
        ))}
        <div className={styles["about__seal"]} aria-hidden="true">
          <strong>100%</strong>
          <span>
            PASSION
            <br />
            &amp; RESPECT
          </span>
        </div>
      </div>
    </section>
  );
}

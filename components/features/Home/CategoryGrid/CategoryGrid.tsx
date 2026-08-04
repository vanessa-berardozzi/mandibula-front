import Link from "next/link";

import { defaultHomeCategories, type HomeCategory } from "./categoryGrid.mock";
import styles from "./CategoryGrid.module.css";

interface CategoryGridProps {
  /** Catégories affichées — voir categoryGrid.mock.ts (données statiques pour le moment) */
  categories?: HomeCategory[];
}

// Grille de catégories mises en avant en page d'accueil.
export function CategoryGrid({ categories = defaultHomeCategories }: CategoryGridProps) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Explorer</p>
          <h2>Catégories</h2>
        </div>
      </div>

      <div className={styles["category-grid"]}>
        {categories.map((category) => (
          <Link key={category.code} href={category.href} className={styles["category-card"]}>
            <span className={styles["category-card__code"]}>{category.code}</span>
            <strong>{category.name}</strong>
            <p>{category.description}</p>
            <span className={styles["category-card__arrow"]} aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

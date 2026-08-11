import { defaultApproachValues, type ApproachValue } from "./values.mock";

interface ValuesGridProps {
  values?: ApproachValue[];
}

// Rupture éditoriale claire (fidèle à la maquette) : 3 piliers de la démarche Mandibula.
export function ValuesGrid({ values = defaultApproachValues }: ValuesGridProps) {
  return (
    <section className="values-grid">
      {values.map((value) => (
        <article key={value.code}>
          <span>{value.code}</span>
          <h2>{value.title}</h2>
          <strong>{value.lead}</strong>
          {value.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <small>{value.footer}</small>
        </article>
      ))}
    </section>
  );
}

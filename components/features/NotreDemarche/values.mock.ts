// MOCK — contenu éditorial statique, à remplacer par un CMS si le contenu doit devenir modifiable.
export interface ApproachValue {
  code: string;
  title: string;
  description: string;
}

export const defaultApproachValues: ApproachValue[] = [
  {
    code: "01",
    title: "Élever, pas prélever",
    description:
      "Nous vendons le fruit de nos élevages et développons des souches durables, suivies et maintenues dans de bonnes conditions.",
  },
  {
    code: "02",
    title: "Transmettre",
    description:
      "Nos fiches et conseils donnent des informations concrètes pour maintenir chaque espèce correctement, sans improvisation.",
  },
  {
    code: "03",
    title: "Agir localement",
    description:
      "Mandibula accompagne des refuges, des écoles et des projets pédagogiques afin de transmettre des connaissances fiables et de favoriser une relation plus responsable avec le vivant.",
  },
];

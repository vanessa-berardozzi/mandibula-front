// MOCK — contenu éditorial statique, à remplacer par un CMS si le contenu doit devenir modifiable.
export interface ApproachValue {
  code: string;
  title: string;
  lead: string;
  paragraphs: string[];
  footer: string;
}

export const defaultApproachValues: ApproachValue[] = [
  {
    code: "01 / ÉLEVAGE RESPONSABLE",
    title: "Élever, pas prélever",
    lead: "Faire de la reproduction la règle, jamais l’exception.",
    paragraphs: [
      "Nous favorisons très largement les animaux nés dans nos élevages et travaillons à installer des souches stables, suivies et durables. Chaque reproduction obtenue en captivité réduit la nécessité de retourner prélever dans les milieux naturels.",
      "Un apport issu du milieu naturel ne peut être envisagé que lorsqu’il est réellement nécessaire pour démarrer ou renouveler une souche. Il doit alors rester limité, raisonné et le plus rare possible. L’objectif demeure toujours le même : rendre ensuite l’élevage autonome grâce aux reproductions.",
    ],
    footer: "Priorité aux reproductions · Traçabilité · Souches durables",
  },
  {
    code: "02 / CONNAISSANCES PARTAGÉES",
    title: "Transmettre pour mieux élever",
    lead: "Un animal bien compris est un animal mieux maintenu.",
    paragraphs: [
      "L’accès au vivant doit toujours s’accompagner d’informations fiables. Nous créons des fiches de conseils, des guides et des contenus pratiques pour expliquer les besoins de chaque espèce : habitat, température, humidité, alimentation, reproduction et erreurs à éviter.",
      "Et parce qu’une fiche ne répond pas à toutes les situations, nous restons particulièrement disponibles avant comme après l’achat. Une question, un doute ou un problème dans un élevage ? Notre rôle est aussi d’écouter, d’expliquer et d’accompagner, sans laisser l’éleveur seul face à ses difficultés.",
    ],
    footer: "Fiches pratiques · Conseils personnalisés · Disponibilité",
  },
  {
    code: "03 / ENGAGEMENT DE PROXIMITÉ",
    title: "Agir localement",
    lead: "Changer les regards commence près de chez nous.",
    paragraphs: [
      "Nous intervenons auprès des écoles et soutenons des refuges ainsi que des projets pédagogiques. Présenter ces animaux, expliquer leur rôle dans les écosystèmes et permettre aux jeunes de les observer aide à remplacer la peur ou le dégoût par la curiosité, la compréhension et le respect.",
      "Cette logique se retrouve aussi dans notre fonctionnement quotidien. Nous privilégions les circuits courts et utilisons, selon les saisons, des végétaux issus de potagers cultivés chez nous pour nourrir nos élevages. Agir localement, c’est rendre chaque décision plus concrète, plus cohérente et plus responsable.",
    ],
    footer: "Écoles · Refuges · Projets pédagogiques · Circuits courts",
  },
];

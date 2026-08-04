// MOCK — Spécimens mis en avant dans le carrousel du hero.
// Ces données sont statiques pour le moment (pas d'appel API) : elles seront
// remplacées par de vraies données produits dynamiques dans une itération future.
// Pour modifier les spécimens affichés en page d'accueil, éditer uniquement ce tableau.
export interface HeroSpecimen {
  name: string;
  variety: string;
  code: string;
  image: string;
  origin: string;
  hygro: string;
  temp: string;
}

export const defaultHeroSpecimens: HeroSpecimen[] = [
  {
    name: "Ardentiella sp.",
    variety: "« Blister »",
    code: "U-01",
    image: "https://images.sumup.com/img_739KRRWANC8D1A7MATD3WBAJ79",
    origin: "VIETNAM",
    hygro: "70—90%",
    temp: "22—26°C",
  },
  {
    name: "Cubaris murina",
    variety: "« Glacier »",
    code: "U-02",
    image: "https://images.sumup.com/img_39DCXRXVWA8F4S2B60MTWR2CTJ",
    origin: "TROPICAL",
    hygro: "65—80%",
    temp: "20—26°C",
  },
  {
    name: "Laureola sp.",
    variety: "« Durian spiky »",
    code: "U-03",
    image: "https://images.sumup.com/img_0VSKGXE75H89KVH0XHH0GBGC9J",
    origin: "ASIA",
    hygro: "75—90%",
    temp: "22—26°C",
  },
  {
    name: "Anadenobolus",
    variety: "monilicornis",
    code: "U-04",
    image: "https://images.sumup.com/img_6HP6AF9ZYH9899YW5W53KPA0HP",
    origin: "CARIBBEAN",
    hygro: "70—85%",
    temp: "22—27°C",
  },
];

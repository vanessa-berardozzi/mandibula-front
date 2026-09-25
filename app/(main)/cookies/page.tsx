import type { Metadata } from "next";

// Centralise les liens externes de cette page pour pouvoir les modifier facilement
const contactUrl = "https://www.mandibula.lu/contact";

export const metadata: Metadata = {
  title: "Politique de cookies - Mandibula",
  description:
    "Découvrez comment Mandibula utilise les cookies et technologies similaires sur son site.",
};

export default function CookiesPage() {
  return (
    <main className="inner-page legal-page">
      <div className="legal-header">
        <p className="eyebrow">Mandibula &middot; Documents légaux</p>
        <h1>Politique de cookies</h1>
        <p>La présente politique a été mise à jour le 09/04/2024.</p>
      </div>

      <div className="legal-body">
        <p>
          Lorsque vous visitez ou interagissez avec nos sites, nous ou nos
          prestataires de services autorisés pouvons utiliser des cookies,
          balises Web et autres technologies similaires pour stocker des
          informations qui nous permettront de vous fournir une meilleure
          expérience, plus rapide et plus sécurisée, ainsi qu&apos;à des fins
          publicitaires.
        </p>

        <p>
          La présente page est conçue pour vous aider à mieux comprendre
          lesdites technologies et l&apos;utilisation que nous en faisons sur
          nos sites. Vous trouverez ci-après une synthèse des quelques points
          clés à connaître à propos de notre utilisation desdites
          technologies.
        </p>

        <section id="definitions">
          <span>01</span>
          <h2>
            Que sont les cookies, balises Web et technologies similaires ?
          </h2>
          <p>
            Comme la plupart des sites, nous utilisons des technologies qui
            sont des petits fichiers de données placés sur votre ordinateur,
            votre tablette, votre téléphone mobile ou tout autre appareil
            (ci-après collectivement désignés comme des « appareils ») qui
            nous permettent d&apos;enregistrer un certain nombre
            d&apos;informations lorsque vous visitez ou interagissez avec nos
            sites, services, applications, messageries et outils.
          </p>
          <p>
            Les types et noms spécifiques des cookies, balises et autres
            technologies similaires que nous utilisons peuvent varier à tout
            moment. Afin de mieux comprendre la présente Politique et notre
            utilisation desdites technologies, nous fournissons les
            définitions et la terminologie limitées suivantes :
          </p>

          <p>
            <strong>Cookies : </strong>
            petits fichiers texte (généralement composés de lettres et de
            chiffres) placés dans la mémoire de votre navigateur ou de votre
            appareil lorsque vous visitez un site Web ou affichez un message.
            Les cookies permettent à un site Web de reconnaître un appareil
            ou un navigateur spécifique.
          </p>

          <p>Il existe différents types de cookies :</p>
          <ul>
            <li>
              <strong>Les cookies de session</strong> expirent à la fin de
              votre session de navigation et nous permettent d&apos;associer
              vos actions au cours de cette session.
            </li>
            <li>
              <strong>Les cookies persistants</strong> sont stockés sur votre
              appareil entre les sessions du navigateur, ce qui nous permet de
              conserver vos préférences ou actions sur plusieurs sites.
            </li>
            <li>
              <strong>Les cookies internes</strong> sont définis par le site
              que vous visitez.
            </li>
            <li>
              <strong>Les cookies tiers</strong> sont définis par un site
              tiers, différent du site que vous visitez.
            </li>
          </ul>

          <p>
            Les cookies peuvent être désactivés ou supprimés par des outils
            disponibles sur la plupart des navigateurs commerciaux. Les
            préférences de chaque navigateur que vous utilisez devront être
            définies séparément, car chaque navigateur propose des
            fonctionnalités et options différentes.
          </p>

          <p>
            <strong>Balises Web : </strong>
            petites images graphiques (également connues sous le nom de «
            pixels espions » ou « GIF invisibles ») qui peuvent être ajoutées
            sur nos sites, services, applications, messageries et outils.
            Elles sont généralement utilisées avec des cookies pour
            identifier nos utilisateurs et leur comportement.
          </p>

          <p>
            <strong>Autres technologies similaires : </strong>
            technologies qui stockent des informations dans votre navigateur
            ou dans votre appareil à l&apos;aide d&apos;objets locaux
            partagés ou de stockage local, tels que des cookies ou témoins
            Flash ou HTML 5 et d&apos;autres logiciels d&apos;application
            Web. Ces technologies peuvent fonctionner sur l&apos;ensemble de
            vos navigateurs. Dans certains cas, elles peuvent ne pas être
            entièrement gérées par les navigateurs et nécessiter une gestion
            directement par le biais de votre appareil ou de vos applications
            installées. Nous n&apos;utilisons pas ces technologies pour
            stocker des informations en vue de cibler des publicités à votre
            intention sur ou en dehors de nos sites.
          </p>

          <p>
            Nous pourrons utiliser les termes « cookies » ou « technologies
            similaires » de manière interchangeable dans nos politiques pour
            nous référer à toutes les technologies que nous sommes
            susceptibles d&apos;utiliser pour stocker des données dans votre
            navigateur ou appareil, collecter des informations ou nous aider
            à vous identifier de la manière susmentionnée.
          </p>
        </section>

        <section id="cookies-utilises">
          <span>02</span>
          <h2>Cookies utilisés sur ce site Internet</h2>
          <p>
            Ce site Internet utilise des cookies de performance. Vous
            trouverez ci-dessous davantage d&apos;informations sur les
            cookies de performance utilisés sur ce site.
          </p>

          <p>
            <strong>Cookies de performance : </strong>
            ces cookies nous permettent de compter le nombre de visites et
            d&apos;identifier les sources de trafic afin de mesurer et
            d&apos;améliorer la performance de notre site. Ils nous aident à
            identifier les pages qui sont le plus populaires et celles qui le
            sont moins et nous permettent de voir comment les visiteurs
            naviguent sur le site. Toutes les informations collectées par ces
            cookies sont agrégées et donc anonymes. Si vous n&apos;autorisez
            pas ces cookies, nous ne saurons pas quand vous avez visité notre
            site et nous ne pourrons pas contrôler sa performance.
          </p>

          <p>
            Vous trouverez dans le tableau ci-dessous une liste des cookies de
            performance utilisés sur ce site Internet.
          </p>

          <table>
            <thead>
              <tr>
                <th>Nom du cookie</th>
                <th>Durée</th>
                <th>Internes ou tiers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>2 ans</td>
                <td>Tiers</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>24 heures</td>
                <td>Tiers</td>
              </tr>
              <tr>
                <td>_ga_&lt;container-id&gt;</td>
                <td>2 ans</td>
                <td>Tiers</td>
              </tr>
              <tr>
                <td>_gac_gb_&lt;container-id&gt;</td>
                <td>90 jours</td>
                <td>Tiers</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="a-propos-politique">
          <span>03</span>
          <h2>À propos de la présente politique</h2>
          <p>
            Nous pouvons modifier ponctuellement la politique sur les
            cookies, en tout ou en partie, à notre discrétion. La dernière
            version de ce document sera toujours disponible sur notre site
            Internet et prendra effet à la date de sa mise à jour.
          </p>
        </section>

        <section id="preferences">
          <span>04</span>
          <h2>Mettre à jour vos préférences</h2>
          <p>
            Vous pouvez personnaliser vos choix en ce qui concerne les
            cookies (sauf les cookies nécessaires) en cliquant sur le bouton
            « Paramètres des cookies » ci-dessous :
          </p>

          {/* Bouton statique en attendant l'intégration d'un gestionnaire de consentement */}
          <button type="button" className="legal-cookie-settings-btn">
            Paramètres des cookies
          </button>

          <p>
            Pour toutes questions, veuillez contacter{" "}
            <a href={contactUrl} target="_blank" rel="noreferrer">
              Mandibula
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

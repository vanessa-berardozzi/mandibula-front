import Image from "next/image";
import Link from "next/link";

const legalBase = "https://mandibula.sumupstore.com";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mandibula-footer">
      <div className="footer-scanline" aria-hidden="true" />

      <div className="footer-main">
        <div className="footer-brand">
          <Link className="footer-logo" href="/" aria-label="Mandibula, accueil">
            <Image
              src="/mandibula-logo.png"
              alt=""
              aria-hidden="true"
              width={58}
              height={58}
              className="object-contain"
            />
            <span>
              <strong>MANDIBULA</strong>
              <small>BUILT FOR INSECTS · DESIGNED FOR YOU</small>
            </span>
          </Link>

          <p>
            Élevage responsable d&apos;invertébrés, matériel et solutions conçues
            pour accompagner chaque espèce dans les meilleures conditions.
          </p>

          <div className="footer-badges" aria-label="Engagements Mandibula">
            <span>ÉLEVAGE MAISON</span>
            <span>GARANTIE ARRIVÉE EN VIE</span>
            <span>EXPÉDITION UE</span>
          </div>
        </div>

        <nav className="footer-column" aria-label="Explorer Mandibula">
          <p>EXPLORER</p>
          <Link href="/">Accueil</Link>
          <Link href="/categories">Boutique</Link>
          <Link href="/categories/animaux-vivants">Animaux</Link>
          <Link href="/categories/packs-kits">Packs d&apos;élevage</Link>
          <Link href="/notre-demarche">Notre démarche</Link>
        </nav>

        <nav className="footer-column" aria-label="Informations et aide">
          <p>INFORMATIONS</p>
          <Link href="/notre-demarche">Pourquoi Mandibula existe</Link>
          <a href={`${legalBase}/page/conditions-generales#livraison`} target="_blank" rel="noreferrer">
            Livraison du vivant
          </a>
          <a
            href={`${legalBase}/page/conditions-generales#politique-de-retour`}
            target="_blank"
            rel="noreferrer"
          >
            Retours &amp; garantie
          </a>
          <Link href="/profile">Mon compte</Link>
          <a href="mailto:contact@mandibula.lu">Contact &amp; SAV</a>
        </nav>

        <div className="footer-column footer-contact">
          <p>NOUS CONTACTER</p>
          <a className="footer-contact-link" href="mailto:contact@mandibula.lu">
            <small>E-MAIL</small>
            <strong>contact@mandibula.lu</strong>
          </a>
          <a
            className="footer-contact-link"
            href="https://www.instagram.com/mandibula_official/"
            target="_blank"
            rel="noreferrer"
          >
            <small>INSTAGRAM</small>
            <strong>@mandibula_official</strong>
          </a>
          <div className="footer-contact-link">
            <small>BASE D&apos;ÉLEVAGE</small>
            <strong>Luxembourg · Europe</strong>
          </div>
          <p className="footer-response">
            Une question sur une espèce ou une installation ? Nous restons
            disponibles avant et après votre commande.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {currentYear} MANDIBULA</span>
        <nav aria-label="Informations légales">
          <a href={`${legalBase}/page/conditions-generales`} target="_blank" rel="noreferrer">
            Conditions générales
          </a>
          <a href={`${legalBase}/page/politique-de-confidentialite`} target="_blank" rel="noreferrer">
            Confidentialité
          </a>
          <a href={`${legalBase}/politique-cookies`} target="_blank" rel="noreferrer">
            Cookies
          </a>
        </nav>
        <span className="footer-status">
          <i aria-hidden="true" />
          SYSTEM STATUS / ONLINE
        </span>
      </div>
    </footer>
  );
}


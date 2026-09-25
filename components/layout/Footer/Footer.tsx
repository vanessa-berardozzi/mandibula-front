import Image from "next/image";
import Link from "next/link";

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
              alt="Mandibula Logo"
              aria-hidden="true"
              width={100}
              height={100}
              className="object-contain"
            />
            <span>
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
          <Link href="/conditions-generales#livraison">Livraison du vivant</Link>
          <Link href="/conditions-generales#politique-de-retour">
            Retours &amp; garantie
          </Link>
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
            href="https://www.instagram.com/mandibula_lux/"
            target="_blank"
            rel="noreferrer"
          >
            <small>INSTAGRAM</small>
            <strong>@mandibula_lux</strong>
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
          <Link href="/conditions-generales">Conditions générales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/cookies">Cookies</Link>
        </nav>
        <span className="footer-status">
          <i aria-hidden="true" />
          SYSTEM STATUS / ONLINE
        </span>
      </div>
    </footer>
  );
}


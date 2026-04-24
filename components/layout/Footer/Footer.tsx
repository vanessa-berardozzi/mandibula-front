"use client";

import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = {
  shop: [
    { label: "Isopodes", href: "/shop/isopodes" },
    { label: "Blattes", href: "/shop/blattes" },
    { label: "Accessoires", href: "/shop/accessoires" },
    { label: "Guides d'élevage", href: "/guides" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Livraison & Retours", href: "/shipping" },
    { label: "Garantie", href: "/warranty" },
  ],
  legal: [
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Politique de cookies", href: "/cookies" },
    { label: "Mentions légales", href: "/legal" },
  ],
  company: [
    { label: "À propos", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Carrières", href: "/careers" },
    { label: "Partenaires", href: "/partners" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com/mandibula", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/mandibula", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com/mandibula", label: "Twitter/X" },
  { icon: Youtube, href: "https://youtube.com/@mandibula", label: "YouTube" },
];

const LINK_COLS = [
  { title: "Boutique", links: FOOTER_LINKS.shop },
  { title: "Support", links: FOOTER_LINKS.support },
  { title: "Entreprise", links: FOOTER_LINKS.company },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black/70 backdrop-blur-md border-t border-primary/25 mt-12">
      {/* Ligne néon en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

      <div className="px-6 py-8">
        {/* RANGÉE PRINCIPALE : infos + liens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 mb-8">

          {/* Colonne 1 : Brand + contact */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Mandibula Shop</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Invertébrés exotiques & équipements.<br />
              Qualité garantie, expédition sécurisée.
            </p>
            <div className="space-y-1.5">
              <a
                href="mailto:contact@mandibula.shop"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="E-mail de contact"
              >
                <Mail className="w-3 h-3 shrink-0" />
                contact@mandibula.shop
              </a>
              <a
                href="tel:+33123456789"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                aria-label="Numéro de téléphone"
              >
                <Phone className="w-3 h-3 shrink-0" />
                +33 (0)1 23 45 67 89
              </a>
              <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>

          {/* Colonnes 2, 3, 4 : liens */}
          {LINK_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {col.title}
              </p>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary hover:translate-x-0.5 transition-all duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-linear-to-r from-transparent via-primary/15 to-transparent mb-5" />

        {/* RANGÉE BAS : sociaux | légal | copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">

          {/* Réseaux sociaux */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`Suivre sur ${social.label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center border border-primary/25 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 rounded-sm transition-all duration-150"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>

          {/* Liens légaux */}
          <nav aria-label="Liens légaux" className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="whitespace-nowrap">© {currentYear} Mandibula Shop 🦂</p>
        </div>
      </div>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mandibula Shop",
            url: "https://mandibula.shop",
            logo: "https://mandibula.shop/logo.png",
            description: "Boutique en ligne spécialisée dans la vente d'isopodes, blattes et accessoires pour terrariums",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              email: "contact@mandibula.shop",
              telephone: "+33123456789",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "42, Rue de la Jungle",
              addressLocality: "Paris",
              postalCode: "75001",
              addressCountry: "FR",
            },
            sameAs: [
              "https://facebook.com/mandibula",
              "https://instagram.com/mandibula",
              "https://twitter.com/mandibula",
              "https://youtube.com/@mandibula",
            ],
          }),
        }}
      />
    </footer>
  );
}


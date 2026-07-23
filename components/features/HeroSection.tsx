import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function HeroSection({
  title = "Mandibula",
  subtitle = "Shop",
  description = "Boutique spécialisée en isopodes, blattes et invertébrés pour terrariums !",
  ctaLabel = "Voir les produits",
  ctaHref = "/categories",
}: HeroSectionProps) {
  return (
    <section className="relative w-full py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground uppercase tracking-tight mb-3">
              {title}
              <br />
              <span
                className="text-primary"
                style={{
                  textShadow: "0 0 20px rgba(93, 191, 122, 0.6)",
                }}
              >
                {subtitle}
              </span>
            </h1>
          </div>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href={ctaHref}>
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
                {ctaLabel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

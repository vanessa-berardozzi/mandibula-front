// Composant réutilisable pour les boutons de connexion avec les providers
// Utilise les logos du dossier public
// La logique d'auth sera branchée plus tard

import { Button } from "@/components/ui/button";
import Image from "next/image";

export type AuthProvider = "google" | "discord" | "facebook";

const PROVIDERS: { key: AuthProvider; label: string; img: string; aria: string }[] = [
  {
    key: "google",
    label: "Google",
    img: "/google.svg",
    aria: "Connexion avec Google",
  },
  {
    key: "discord",
    label: "Discord",
    img: "/Discord-Symbol-Blurple.svg",
    aria: "Connexion avec Discord",
  },
  {
    key: "facebook",
    label: "Facebook",
    img: "/Facebook_Logo_Primary.png",
    aria: "Connexion avec Facebook",
  },
];

export function AuthProviderButtons({ onProviderClick }: {
  onProviderClick?: (provider: AuthProvider) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {PROVIDERS.map((provider) => (
        <Button
          key={provider.key}
          variant="outline"
          type="button"
          aria-label={provider.aria}
          onClick={() => onProviderClick?.(provider.key)}
        >
          <Image src={provider.img} alt={provider.label} width={24} height={24} />
        </Button>
      ))}
    </div>
  );
}

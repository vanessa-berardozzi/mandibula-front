import Image from "next/image";

export type AuthProvider = "google" | "discord" | "facebook";

const PROVIDERS: {
  key: AuthProvider;
  label: string;
  img: string;
  aria: string;
  hover: string;
}[] = [
  {
    key: "google",
    label: "Google",
    img: "/google.svg",
    aria: "Se connecter avec Google",
    hover: "hover:bg-white/10 hover:border-white/25 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]",
  },
  {
    key: "discord",
    label: "Discord",
    img: "/Discord-Symbol-Blurple.svg",
    aria: "Se connecter avec Discord",
    hover: "hover:bg-[#5865F2]/15 hover:border-[#5865F2]/50 hover:shadow-[0_0_12px_rgba(88,101,242,0.2)]",
  },
  {
    key: "facebook",
    label: "Facebook",
    img: "/Facebook_Logo_Primary.png",
    aria: "Se connecter avec Facebook",
    hover: "hover:bg-[#1877F2]/15 hover:border-[#1877F2]/50 hover:shadow-[0_0_12px_rgba(24,119,242,0.2)]",
  },
];

export function AuthProviderButtons({ onProviderClick }: {
  onProviderClick?: (provider: AuthProvider) => void;
}) {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {PROVIDERS.map((provider) => (
        <button
          key={provider.key}
          type="button"
          aria-label={provider.aria}
          onClick={() => onProviderClick?.(provider.key)}
          className={`
            flex flex-col items-center justify-center gap-2 h-16 w-full rounded-lg
            border border-white/10 bg-white/5
            transition-all duration-200 cursor-pointer
            ${provider.hover}
          `}
        >
          <Image src={provider.img} alt="" width={22} height={22} />
          <span className="text-[11px] font-medium text-muted-foreground leading-none">
            {provider.label}
          </span>
        </button>
      ))}
    </div>
  );
}

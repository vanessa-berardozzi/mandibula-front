'use client';

import { useSession } from "@/lib/auth.client";
import Image from "next/image";
import { ReactNode } from "react";

interface UseAvatarReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  userName: string;
  avatarUrl: string | null;
  renderImage: (className: string, width?: number, height?: number) => ReactNode;
  renderFallback: (className: string) => ReactNode;
}

/**
 * Hook pour gérer la logique de l'avatar utilisateur
 * Retourne les données et des fonctions de rendu
 * Le CSS est géré par le composant parent
 */
export function useUserAvatar(): UseAvatarReturn {
  const { data: session, isPending } = useSession();

  const userName = session?.user?.name || "User";
  // pictureProfile (upload Cloudinary) prime sur image (OAuth provider)
  const avatarUrl =
    (session?.user as { pictureProfile?: string } | undefined)?.pictureProfile ||
    session?.user?.image ||
    null;
  const isAuthenticated = !!session?.user;

  const renderImage = (className: string, width = 112, height = 112) => {
    if (!avatarUrl) return null;
    return (
      <Image
        src={avatarUrl}
        alt={userName}
        width={width}
        height={height}
        className={className}
        priority={false}
      />
    );
  };

  const renderFallback = (className: string) => (
    <div className={className}>
      {userName.charAt(0).toUpperCase()}
    </div>
  );

  return {
    isLoading: isPending,
    isAuthenticated,
    userName,
    avatarUrl,
    renderImage,
    renderFallback,
  };
}

/**
 * Composant UserAvatar - Gère juste l'affichage
 * Le CSS est entièrement contrôlé par le composant parent
 */
interface UserAvatarProps {
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  width?: number;
  height?: number;
}

export function UserAvatar({
  className = "w-28 h-28 rounded-sm",
  imageClassName = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full flex items-center justify-center font-bold text-3xl",
  width = 112,
  height = 112,
}: UserAvatarProps) {
  const { isLoading, avatarUrl, renderImage, renderFallback } = useUserAvatar();

  if (isLoading) {
    return <div className={`${className} animate-pulse bg-primary/20`} />;
  }

  return (
    <div className={className}>
      {avatarUrl ? renderImage(imageClassName, width, height) : renderFallback(fallbackClassName)}
    </div>
  );
}

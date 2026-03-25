"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UserProfileHeaderProps {
  userName: string;
  email: string;
  avatarUrl?: string;
  memberSince: string;
  level: number;
  loyaltyPoints: number;
  onSignOut?: () => void;
}

export function UserProfileHeader({
  userName,
  email,
  avatarUrl,
  memberSince,
  level,
  loyaltyPoints,
  onSignOut,
}: UserProfileHeaderProps) {
  return (
    <div className="relative mb-8">
      {/* Fond anime gradient avec effet néon */}
      <div 
        className="relative p-8 bg-card/20 backdrop-blur-md border-2 border-primary/60 rounded-sm shadow-[0_0_40px_rgba(216,249,153,0.4)] overflow-hidden"
        style={{
          clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
        }}
      >
        {/* Coins décoratifs néon */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

        {/* Ligne d'accent néon */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />

        {/* Contenu */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Avatar et infos principales */}
          <div className="flex gap-6 items-start flex-1">
            {/* Avatar avec cadre gaming */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-sm border-2 border-primary/70 overflow-hidden bg-accent/40 flex items-center justify-center shadow-[inset_0_0_15px_rgba(216,249,153,0.2)]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-primary/30 to-secondary/30">
                    <span className="text-3xl font-bold text-primary">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              {/* Badge niveau */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold border-2 border-primary shadow-lg">
                L{level}
              </div>
            </div>

            {/* Infos texte */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1 wrap-break-word">{userName}</h1>
              <p className="text-muted-foreground text-sm mb-3 break-all">{email}</p>
              <div className="flex flex-wrap gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Membre depuis:</span>
                  <span className="text-foreground font-semibold">{memberSince}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Pts de fidélité:</span>
                  <span className="text-accent-foreground font-bold">{loyaltyPoints.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm border border-primary/50 font-semibold"
            >
              Modifier Profil
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10 rounded-sm font-semibold"
              onClick={onSignOut}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

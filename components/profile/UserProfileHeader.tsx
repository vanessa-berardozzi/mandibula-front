"use client";

import { UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { EditProfileSheet } from "./EditProfileSheet";
import styles from "./Profile.module.css";

interface UserProfileHeaderProps {
  userName: string;
  email: string;
  memberSince: string;
  level: number;

  onSignOut?: () => void;
}

export function UserProfileHeader({
  userName,
  email,
  memberSince,
  onSignOut,
}: UserProfileHeaderProps) {
  return (
    <div className={styles.profileHeader}>
        {/* Contenu */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Avatar et infos principales */}
          <div className="flex gap-6 items-start flex-1">
            {/* Avatar gaming carré */}
            <div className="relative shrink-0">
              <div className={`${styles.avatar} overflow-hidden`}>
                <UserAvatar
                  className="w-28 h-28 rounded-sm flex items-center justify-center"
                  imageClassName="w-full h-full object-cover"
                  fallbackClassName="w-full h-full flex items-center justify-center font-bold text-3xl text-primary"
                  width={112}
                  height={112}
                />
              </div>
              {/* Badge niveau */}
             
            </div>

            {/* Infos texte */}
            <div className="flex-1 min-w-0">
              <h1 className={`${styles.profileName} wrap-break-word`}>{userName}</h1>
              <p className="text-muted-foreground text-sm mb-3 break-all">{email}</p>
              <div className="flex flex-wrap gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Membre depuis:</span>
                  <span className="text-foreground font-semibold">{memberSince}</span>
                </div>
                <div className="flex items-center gap-2">
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <EditProfileSheet>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm border border-primary/50 font-semibold"
              >
                Modifier Profil
              </Button>
            </EditProfileSheet>
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
  );
}

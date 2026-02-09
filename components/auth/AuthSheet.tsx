"use client";

import { LoginFormSheet } from "@/components/auth/LoginFormSheet";
import { SignupFormSheet } from "@/components/auth/SignupFormSheet";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useRef, useState } from "react";

export default function AuthSheet({ open, onOpenChange, mode = "login" }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "login" | "signup";
}) {
  const [currentMode, setCurrentMode] = useState<"login" | "signup">(mode);
  const prevOpenRef = useRef(open);

  // Réinitialise le mode seulement quand le panneau passe de fermé à ouvert
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentMode(mode);
    }
    prevOpenRef.current = open;
  }, [open, mode]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full md:w-md max-w-full md:max-w-[90vw] bg-sidebar backdrop-blur-xl border-l-0 md:border-l border-sidebar-border shadow-lg p-0 flex flex-col overflow-y-auto"
      >
        <SheetTitle className="sr-only  ">
          {currentMode === "login" ? "Connexion" : "Inscription"}
        </SheetTitle>
        <div className="flex-1 flex flex-col justify-center py-8">
          {currentMode === "login" ? (
            <LoginFormSheet
              onSuccess={() => onOpenChange(false)}
              onSwitchToSignup={() => setCurrentMode("signup")}
            />
          ) : (
            <SignupFormSheet
              onSuccess={() => onOpenChange(false)}
              onSwitchToLogin={() => setCurrentMode("login")}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

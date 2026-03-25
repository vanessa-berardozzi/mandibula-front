"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function AuthPanel({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const hasNavigatedBack = useRef(false);

  const close = () => setIsClosing(true);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    // Ignorer les événements qui remontent des enfants
    if (e.target !== e.currentTarget) return;
    // Ne naviguer en arrière qu'une seule fois
    if (isClosing && !hasNavigatedBack.current) {
      hasNavigatedBack.current = true;
      router.back();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end" role="dialog" aria-modal="true">
      <div className="flex-1 cursor-default" onClick={close} aria-hidden="true" />
      <div
        className={`relative w-full max-w-md flex flex-col justify-center backdrop-blur-xl border-l border-primary/20 shadow-[-20px_0_60px_rgba(0,0,0,0.6)] px-8 py-12 overflow-y-auto ${isClosing ? "auth-panel-out" : "auth-panel"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Barre néon en haut */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/70 to-transparent" />

        {/* Coins gaming */}
        <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-primary/50" />
        <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-primary/50" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-primary/20" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-primary/20" />

        {/* Bouton fermer */}
        <button
          onClick={close}
          className="absolute top-4 right-10 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {children}
      </div>
    </div>
  );
}

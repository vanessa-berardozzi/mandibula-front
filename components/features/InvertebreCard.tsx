"use client";

import { formatPrice } from "@/lib/priceUtils";
import Image from "next/image";
import { useState } from "react";

interface BreedingConditions {
  temperature: string;
  humidity: string;
  substrate: string;
  feeding: string;
}

interface InvertebreCardProps {
  imageUrl: string;
  name: string;
  price: number;
  category: string;
  origin: string;
  difficulty: string;
  difficultyLevel: number;
  breedingConditions: BreedingConditions;
  className?: string;
  priority?: boolean;
}

const DIFFICULTY_COLORS: Record<number, { text: string; filled: string }> = {
  1: { text: "text-green-400",  filled: "bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.9)]" },
  2: { text: "text-blue-400",   filled: "bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.9)]" },
  3: { text: "text-yellow-400", filled: "bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.9)]" },
  4: { text: "text-orange-400", filled: "bg-orange-400 shadow-[0_0_4px_rgba(251,146,60,0.9)]" },
  5: { text: "text-red-400",    filled: "bg-red-400 shadow-[0_0_4px_rgba(248,113,113,0.9)]" },
};

export function InvertebreCard({
  imageUrl,
  name,
  price,
  category,
  origin,
  difficulty,
  difficultyLevel,
  breedingConditions,
  className = "",
  priority = false,
}: InvertebreCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const diff = DIFFICULTY_COLORS[difficultyLevel] ?? DIFFICULTY_COLORS[1];

  return (
    <div
      className={`relative w-full transition-all duration-500 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
        clipPath: "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
      }}
    >
      {/* Fond semi-transparent backdrop-blur */}
      <div className="absolute inset-0 bg-linear-to-b from-black/75 via-gray-900/55 to-black/75 backdrop-blur-md" />

      {/* Bordure lumineuse animée */}
      <div
        className="absolute inset-0 animate-gradient-rotate"
        style={{
          padding: "1.5px",
          background: "linear-gradient(90deg, #cae2c5, #4ade80 30%, #1a3f1a 60%, #cae2c5)",
          backgroundSize: "300% 100%",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Scan lines subtiles */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(202,226,197,0.4) 2px, rgba(202,226,197,0.4) 3px)",
        }}
      />

      {/* Contenu */}
      <div className="relative z-10 p-3 flex flex-col gap-2.5">

        {/* TOP : Catégorie + Prix */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/15 border border-primary/50 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">
              {category}
            </span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-black text-primary font-mono tabular-nums">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-primary/70 font-bold">€</span>
          </div>
        </div>


 {/* NOM */}
        <div className="text-center">
          <div className="h-px bg-linear-to-r from-transparent via-primary/50 to-transparent mb-1.5" />
          <h3 className="text-[15px] font-black text-foreground uppercase tracking-[0.15em] leading-tight">
            {name}
          </h3>
          <div className="h-px bg-linear-to-r from-transparent via-primary/50 to-transparent mt-1.5" />
        </div>
        {/* IMAGE */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full h-56">
            {/* Halo sol */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-primary/25 blur-xl rounded-full" />
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain drop-shadow-[0_0_22px_rgba(202,226,197,0.55)]"
              priority={priority}
            />
          </div>
        </div>

       

        {/* CONDITIONS 2×2 */}
        <div className="grid grid-cols-2 gap-1">
          {[
            { icon: "🌡️", label: "Température.", value: breedingConditions.temperature.split(" ")[0] },
            { icon: "💧", label: "Humidité.",  value: breedingConditions.humidity.split(" ")[0] },
            
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-1.5 p-1.5 bg-primary/5 border border-primary/20 rounded-sm">
              <span className="text-sm leading-none">{icon}</span>
              <div className="min-w-0">
                <div className="text-[9px] text-primary/60 uppercase tracking-wider">{label}</div>
                <div className="text-[10px] text-foreground font-bold leading-tight truncate">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM : Origine + Difficulté */}
        <div className="flex gap-1">
          <div className="flex-1 flex items-center gap-1.5 p-1.5 bg-black/30 border border-primary/25 rounded-sm">
            <span className="text-xs leading-none">📍</span>
            <div className="min-w-0">
              <div className="text-[9px] text-primary/60 uppercase tracking-wider">Origine</div>
              <div className="text-[10px] text-foreground font-bold truncate">{origin}</div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-between p-1.5 bg-black/30 border border-primary/25 rounded-sm">
            <div>
              <div className="text-[9px] text-primary/60 uppercase tracking-wider mb-0.5">Niveau</div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-sm ${i <= difficultyLevel ? diff.filled : "bg-gray-700/80"}`}
                  />
                ))}
              </div>
            </div>
            <span className={`text-[10px] font-black ${diff.text}`}>{difficulty}</span>
          </div>
        </div>

      </div>

      {/* Reflet hover */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: "shine 1.5s ease-in-out",
            background:
              "linear-gradient(105deg, transparent 38%, rgba(202,226,197,0.07) 50%, transparent 62%)",
          }}
        />
      )}

      {/* Glow extérieur */}
      <div
        className={`absolute inset-0 -z-10 blur-2xl bg-primary/15 transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-40"
        }`}
      />
    </div>
  );
}

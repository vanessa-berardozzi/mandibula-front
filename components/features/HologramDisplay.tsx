"use client";

import Image from "next/image";
import { useState } from "react";

// Particules d'énergie autour du produit
const ENERGY_PARTICLES = [
  { angle: 0, distance: 140, duration: 3.5, delay: 0 },
  { angle: 60, distance: 150, duration: 3.2, delay: 0.5 },
  { angle: 120, distance: 145, duration: 3.8, delay: 1.0 },
  { angle: 180, distance: 155, duration: 3.3, delay: 1.5 },
  { angle: 240, distance: 148, duration: 3.6, delay: 2.0 },
  { angle: 300, distance: 152, duration: 3.4, delay: 2.5 },
];

interface HologramDisplayProps {
  imageUrl?: string;
  productName: string;
  autoRotate?: boolean;
}

export function HologramDisplay({ 
  imageUrl, 
  productName, 
  autoRotate = true 
}: HologramDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full max-w-lg mx-auto h-[600px] flex items-center justify-center">
      
      {/* Socle holographique - base */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80">
        {/* Plateforme principale */}
        <div className="relative h-16 rounded-full bg-gradient-to-b from-gray-800 via-gray-900 to-black border-t-2 border-gray-700 shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
          {/* Reflet métallique sur le dessus */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
          
          {/* Anneaux lumineux verts */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-1 rounded-full bg-primary shadow-[0_0_20px_rgba(202,226,197,0.8)] animate-pulse" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[85%] h-0.5 rounded-full bg-primary/60 shadow-[0_0_15px_rgba(202,226,197,0.6)]" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-0.5 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(202,226,197,0.4)]" />
          
          {/* Cercles de lumière sur la plateforme */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        </div>
      </div>

      {/* Faisceaux de lumière verticaux */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 h-96 pointer-events-none">
        {/* Faisceau central */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/20 to-transparent"
          style={{
            clipPath: 'polygon(40% 100%, 60% 100%, 50% 0%, 50% 0%)',
            filter: 'blur(8px)',
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/30 to-transparent"
          style={{
            clipPath: 'polygon(45% 100%, 55% 100%, 50% 0%, 50% 0%)',
            filter: 'blur(4px)',
          }}
        />
        
        {/* Rayons latéraux */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent"
          style={{
            clipPath: 'polygon(30% 100%, 35% 100%, 45% 30%, 42% 30%)',
            filter: 'blur(6px)',
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent"
          style={{
            clipPath: 'polygon(65% 100%, 70% 100%, 58% 30%, 55% 30%)',
            filter: 'blur(6px)',
          }}
        />
        
        {/* Éclats de lumière */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
      </div>

      {/* Produit flottant */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`relative w-72 h-72 flex items-center justify-center ${autoRotate && !isHovered ? 'animate-rotate-y' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered ? 'scale(1.15)' : undefined,
            transition: 'transform 0.5s ease',
          }}
        >
          {imageUrl ? (
            <div className="relative w-full h-full p-8">
              <Image
                src={imageUrl}
                alt={productName}
                width={600}
                height={600}
                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(202,226,197,0.8)]"
                style={{ 
                  filter: 'brightness(1.3) contrast(1.2)',
                }}
              />
              
              {/* Effet de lueur autour du produit */}
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10" />
              
              {/* Particules d'énergie autour */}
              {ENERGY_PARTICLES.map((particle, i) => {
                const x = Math.cos((particle.angle * Math.PI) / 180) * particle.distance;
                const y = Math.sin((particle.angle * Math.PI) / 180) * particle.distance;
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(202,226,197,0.8)]"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      animation: `pulse ${particle.duration}s ease-in-out infinite`,
                      animationDelay: `${particle.delay}s`,
                    }}
                  />
                );
              })}
              
              {/* Cercles d'énergie qui pulsent */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 border border-primary/30 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-primary/40">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-mono uppercase tracking-wider">Chargement...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reflets de lumière au sol */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-2xl" />
      
    </div>
  );
}

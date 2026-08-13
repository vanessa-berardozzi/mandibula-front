'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const availableImages = images.filter(Boolean);

  if (availableImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center border border-primary/30 bg-[#dae0da] text-xs font-mono uppercase tracking-[0.14em] text-[#687169]">
        Image indisponible
      </div>
    );
  }

  const activeImage = availableImages[activeIndex] ?? availableImages[0];
  const hasMultipleImages = availableImages.length > 1;

  const selectImage = (index: number) => {
    setActiveIndex((index + availableImages.length) % availableImages.length);
  };

  return (
    <div className="min-w-0" aria-label={`Galerie photos de ${productName}`}>
      <div className="relative overflow-hidden border border-primary/55 bg-[#dae0da]">
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${productName} - photo ${activeIndex + 1} sur ${availableImages.length}`}
          width={1200}
          height={1200}
          priority
          className="aspect-square w-full object-cover motion-safe:animate-[gallery-image-in_280ms_ease-out]"
          sizes="(max-width: 768px) 100vw, 52vw"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={() => selectImage(activeIndex - 1)}
              aria-label="Afficher la photo précédente"
              className="absolute left-3 top-1/2 z-10 flex h-14 w-11 -translate-y-1/2 items-center justify-center border border-primary/60 bg-[#050d08]/80 font-sans text-4xl font-light leading-none text-primary transition hover:border-primary hover:bg-[#0c2613]/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => selectImage(activeIndex + 1)}
              aria-label="Afficher la photo suivante"
              className="absolute right-3 top-1/2 z-10 flex h-14 w-11 -translate-y-1/2 items-center justify-center border border-primary/60 bg-[#050d08]/80 font-sans text-4xl font-light leading-none text-primary transition hover:border-primary hover:bg-[#0c2613]/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 border border-primary/45 bg-[#050d08]/85 px-2.5 py-2 font-mono text-[9px] font-extrabold tracking-widest text-[#b8ffc8]">
              {activeIndex + 1} / {availableImages.length}
            </span>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="mt-2 flex gap-2 overflow-x-auto px-0.5 pb-1.5" role="list" aria-label="Choisir une photo">
          {availableImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => selectImage(index)}
              aria-label={`Afficher la photo ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`min-w-22 flex-[0_0_calc((100%-24px)/4)] overflow-hidden border-2 bg-[#101713] transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101713] ${
                index === activeIndex
                  ? 'border-primary opacity-100 shadow-[0_0_0_1px_rgba(66,255,116,0.28),0_0_14px_rgba(66,255,116,0.25)]'
                  : 'border-transparent opacity-60'
              }`}
            >
              <Image
                src={image}
                alt=""
                width={240}
                height={200}
                className="aspect-[1.2] w-full object-cover"
                sizes="88px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

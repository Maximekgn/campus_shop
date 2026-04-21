'use client';

import { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { ListingPhoto } from '@/types';

type PhotoGalleryProps = {
  photos: ListingPhoto[];
  listingId?: number;
};

export default function PhotoGallery({ photos, listingId }: PhotoGalleryProps): ReactNode {
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  if (!photos || photos.length === 0) {
    const defaultImage = `https://picsum.photos/seed/${listingId || 'default'}/800/600`;
    return (
      <div className="relative h-96 w-full overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <Image
          src={defaultImage}
          alt="Image par défaut"
          fill
          className="object-cover"
        />
      </div>
    );
  }

  const mainPhoto = photos[0];

  const handlePrevious = (): void => {
    setCurrentPhotoIndex((prev: number) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (): void => {
    setCurrentPhotoIndex((prev: number) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative h-96 w-full cursor-pointer overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={mainPhoto.path}
            alt="Photo principale"
            fill
            className="object-cover"
            priority
          />
          {photos.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white">
              1 / {photos.length}
            </div>
          )}
        </div>

        {photos.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo: ListingPhoto, idx: number) => (
              <button
                key={photo.id}
                onClick={() => {
                  setCurrentPhotoIndex(idx);
                  setLightboxOpen(true);
                }}
                className={`relative h-24 overflow-hidden rounded-[16px] border-2 transition ${
                  idx === currentPhotoIndex
                    ? 'border-[var(--color-primary)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary-dark)]'
                }`}
              >
                <Image
                  src={photo.path}
                  alt={`Photo ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="relative flex max-h-full w-full max-w-4xl flex-col items-center justify-center">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Fermer (ESC)
            </button>

            <div className="relative h-96 w-full overflow-hidden rounded-[16px]">
              <Image
                src={photos[currentPhotoIndex].path}
                alt={`Photo ${currentPhotoIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                className="rounded-full bg-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/30"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
              </button>
              <span className="text-sm font-semibold text-white">
                {currentPhotoIndex + 1} / {photos.length}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full bg-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/30"
              >
                Suivant <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

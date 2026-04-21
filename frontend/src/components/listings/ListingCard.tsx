'use client';

import { useState } from 'react';
import type { Listing } from '@/types';
import { listingService } from '@/services/listing.service';
import Link from 'next/link';
import { Package, Heart, Eye, ArrowRight } from 'lucide-react';

type ListingCardProps = {
  listing: Partial<Listing>;
};

function isNew(createdAt?: string): boolean {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

function getStatusLabel(status?: ListingStatus): string {
  const labels: Record<string, string> = {
    publiee: 'Disponible',
    reservee: 'Réservé',
    vendus: 'Vendu',
    archivee: 'Archivé',
  };
  return status ? labels[status] || status : 'Disponible';
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const isReserved = listing.status === 'reservee' || listing.status === 'vendue';
  const isNewListing = isNew(listing.created_at);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await listingService.toggleFavorite(Number(listing.id));
      setIsFavorited(result.is_favorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const photo = listing.photos?.[0]?.path;

  return (
    <Link href={`/listings/${listing.id}`}>
      <article
        className={`group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white shadow-[var(--color-shadow)] transition hover:-translate-y-1 hover:shadow-lg ${
          isReserved ? 'opacity-75' : ''
        }`}
      >
        <div className="relative h-48 bg-[var(--color-primary-soft)]">
          {photo ? (
            <img src={photo} alt={listing.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-[var(--color-primary)]">
              <Package className="h-12 w-12" />
            </div>
          )}
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              onClick={handleFavorite}
              className="rounded-full bg-white/90 p-2 shadow transition hover:scale-110"
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          {isNewListing && (
            <span className="absolute left-4 top-4 inline-flex rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
              Nouveau
            </span>
          )}
          {isReserved && (
            <div className="absolute inset-0 flex items-start justify-end">
              <div className="rotate-45 translate-x-6 -translate-y-4 bg-orange-500 px-12 py-1 text-center text-xs font-semibold text-white">
                {getStatusLabel(listing.status)}
              </div>
            </div>
          )}
          <span className="absolute bottom-4 left-4 inline-flex rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            {listing.type === 'vente' ? 'À vendre' : listing.type === 'don' ? 'À donner' : 'Échange'}
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-foreground)]">{listing.title}</h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">{listing.description}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="block text-lg font-semibold text-[var(--color-primary-dark)]">
                {listing.price != null ? `${listing.price} FCFA` : 'Gratuit'}
              </span>
              <span className="text-xs text-[var(--color-muted)] flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.views_count ?? 0} vues</span>
            </div>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isReserved ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
              }`}
              disabled={isReserved}
            >
              Voir
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
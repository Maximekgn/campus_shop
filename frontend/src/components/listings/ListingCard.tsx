'use client';

import { useState } from 'react';
import type { Listing } from '@/types';
import { listingService } from '@/services/listing.service';
import Link from 'next/link';
import { Package, Heart } from 'lucide-react';

type ListingCardProps = {
  listing: Partial<Listing>;
};

function isNew(createdAt?: string): boolean {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

const typeLabel: Record<string, string> = {
  vente: 'À vendre',
  don: 'À donner',
  échange: 'Échange',
};

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

  const photo = listing.photos?.[0]?.path ?? `https://picsum.photos/seed/${listing.id}/400/300`;

  return (
    <Link href={`/listings/${listing.id}`}>
      <article
        className={`group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition hover:border-[var(--color-foreground)]/20 hover:shadow-md ${
          isReserved ? 'opacity-60' : ''
        }`}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-[var(--color-surface)]">
          {photo ? (
            <img
              src={photo}
              alt={listing.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-10 w-10 text-[var(--color-border)]" />
            </div>
          )}

          {/* Type badge */}
          <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
            {typeLabel[listing.type ?? ''] ?? listing.type}
          </span>

          {/* New badge */}
          {isNewListing && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white">
              Nouveau
            </span>
          )}

          {/* Reserved overlay */}
          {isReserved && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
              <span className="rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--color-muted)] shadow-sm">
                {listing.status === 'vendue' ? 'Vendu' : 'Réservé'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                {listing.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">
                {listing.description}
              </p>
            </div>
            <button
              onClick={handleFavorite}
              className="shrink-0 rounded-full p-1.5 text-[var(--color-muted)] transition hover:text-red-500"
              aria-label="Ajouter aux favoris"
            >
              <Heart
                className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>

          {/* Price row */}
          <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
            <span className="text-sm font-semibold text-[var(--color-foreground)]">
              {listing.price != null && listing.price > 0
                ? `${listing.price.toLocaleString()} FCFA`
                : 'Gratuit'}
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              {listing.views_count ?? 0} vue{(listing.views_count ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
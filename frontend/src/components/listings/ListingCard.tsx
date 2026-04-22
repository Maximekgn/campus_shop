'use client';

import { useState } from 'react';
import type { Listing } from '@/types';
import { listingService } from '@/services/listing.service';
import Link from 'next/link';
import { Package, Heart } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

type ListingCardProps = {
  listing: Partial<Listing>;
  forceFavorited?: boolean;
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

export default function ListingCard({ listing, forceFavorited }: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(forceFavorited ?? !!listing.is_favorited);
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
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <article
        className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-[var(--color-border)]/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-[var(--color-border)] ${
          isReserved ? 'opacity-60' : ''
        }`}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-surface)]">
          {photo ? (
            <img
              src={getImageUrl(photo)}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-10 w-10 text-[var(--color-border)]" />
            </div>
          )}
          
          {/* Subtle gradient overlay for better badge readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <span className="inline-flex w-fit items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-foreground)] backdrop-blur-sm shadow-sm">
              {typeLabel[listing.type ?? ''] ?? listing.type}
            </span>
            {isNewListing && (
              <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm shadow-sm">
                Nouveau
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[var(--color-muted)] backdrop-blur-sm transition-all hover:bg-white hover:scale-110 hover:text-red-500 shadow-sm"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>

          {/* Reserved Overlay */}
          {isReserved && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <span className="rounded-full border border-[var(--color-border)] bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] shadow-sm">
                {listing.status === 'vendue' ? 'Vendu' : 'Réservé'}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex-1">
            <h3 className="line-clamp-1 text-base font-bold tracking-tight text-[var(--color-foreground)] group-hover:text-[var(--color-primary-dark)] transition-colors">
              {listing.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
              {listing.description}
            </p>
          </div>

          {/* Price & Meta Footer */}
          <div className="mt-4 flex items-end justify-between pt-4">
            <span className="text-lg font-black tracking-tight text-[var(--color-foreground)]">
              {listing.price != null && listing.price > 0
                ? `${listing.price.toLocaleString()} FCFA`
                : 'Gratuit'}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              {listing.views_count ?? 0} vue{(listing.views_count ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
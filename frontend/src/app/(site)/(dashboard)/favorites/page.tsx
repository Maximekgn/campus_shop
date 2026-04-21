'use client';

import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import { mockListings } from '@/data/listings';
import type { Listing } from '@/types';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const favoriteIds = [1, 3];
  const favoriteListings = mockListings.filter((l) =>
    favoriteIds.includes(l.id)
  ) as Listing[];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Mes favoris
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {favoriteListings.length} annonce{favoriteListings.length !== 1 ? 's' : ''} sauvegardée{favoriteListings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {favoriteListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] py-24 text-center">
          <Heart className="mb-4 h-8 w-8 text-[var(--color-border)]" />
          <p className="text-base font-medium text-[var(--color-foreground)]">Aucun favori</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Ajoute des annonces à tes favoris pour les retrouver ici.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-foreground)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-80"
          >
            Découvrir les annonces <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

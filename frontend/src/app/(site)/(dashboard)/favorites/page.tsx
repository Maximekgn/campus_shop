'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import { mockListings } from '@/data/listings';
import type { Listing } from '@/types';

export default function FavoritesPage(): ReactNode {
  // Simulation : annonces 1 et 3 sont en favori
  const favoriteIds = [1, 3];
  const favoriteListings = mockListings.filter((l) => favoriteIds.includes(l.id)) as Listing[];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Mes favoris</h1>
        <p className="mt-1 text-[var(--color-muted)]">
          {favoriteListings.length} annonce{favoriteListings.length > 1 ? 's' : ''} en favori
        </p>
      </div>

      {favoriteListings.length === 0 ? (
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
          <p className="mb-4 text-lg text-[var(--color-muted)]">
            Tu n'as aucun favori pour l'instant
          </p>
          <Link href="/listings" className="inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]">
            Découvrir les annonces
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}


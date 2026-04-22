'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import { listingService } from '@/services/listing.service';
import type { Listing } from '@/types';
import { Heart, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function FavoritesPage() {
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await listingService.getFavorites();
        setFavoriteListings(response.data || response || []);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

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

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Impossible de charger vos favoris.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner />
        </div>
      ) : favoriteListings.length === 0 ? (
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
            <ListingCard key={listing.id} listing={listing} forceFavorited={true} />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import ListingFilters from '@/components/listings/ListingFilters';
import ListingCard from '@/components/listings/ListingCard';
import { mockListings } from '@/data/listings';
import type { Listing } from '@/types';

type FilterState = {
  search: string;
  type: string;
  maxPrice: string;
};

export default function ListingsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    maxPrice: '',
  });

  const filteredListings = useMemo(() => {
    return mockListings.filter((listing: Listing) => {
      // Filtre par recherche
      if (filters.search && !listing.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filtre par type
      if (filters.type && listing.type !== filters.type) {
        return false;
      }

      // Filtre par prix max
      if (filters.maxPrice && listing.price) {
        if (listing.price > parseInt(filters.maxPrice, 10)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-semibold text-[var(--color-foreground)]">Annonces</h1>
        <p className="text-[var(--color-muted)]">
          {filteredListings.length} annonce{filteredListings.length > 1 ? 's' : ''} trouvée{filteredListings.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-8">
        <ListingFilters onFilter={setFilters} />
      </div>

      {filteredListings.length === 0 ? (
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
          <p className="text-lg text-[var(--color-muted)]">Aucune annonce ne correspond à tes critères.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing: Listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}


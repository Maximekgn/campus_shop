"use client";

import { useState, useEffect } from "react";
import ListingFilters from "@/components/listings/ListingFilters";
import ListingCard from "@/components/listings/ListingCard";
import {
  listingService,
  ListingFilters as Filters,
} from "@/services/listing.service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { mockListings } from "@/data/listings";
import type { Listing } from "@/types";

export default function ListingsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    last_page: 1,
    total: 0,
  });

  const fetchListings = async (page = 1) => {
    setLoading(true);
    try {
      const data = await listingService.getAll({
        ...filters,
        page,
        per_page: 15,
      });
      setListings(data.data || data);
      setPagination({
        page: data.current_page || page,
        last_page: data.last_page || 1,
        total: data.total || 0,
      });
      setError(false);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError(true);
      setListings(mockListings as Listing[]);
      setPagination({ page: 1, last_page: 1, total: mockListings.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    fetchListings(1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-semibold text-[var(--color-foreground)]">
          Annonces
        </h1>
        <p className="text-[var(--color-muted)]">
          {pagination.total} annonce{pagination.total > 1 ? "s" : ""} trouvée
          {pagination.total > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mb-8">
        <ListingFilters onFilter={handleFilter} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
          <p className="text-lg text-[var(--color-muted)]">
            Aucune annonce ne correspond à tes critères.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {pagination.last_page > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => fetchListings(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-4 py-2 text-[var(--color-muted)]">
                {pagination.page} / {pagination.last_page}
              </span>
              <button
                onClick={() => fetchListings(pagination.page + 1)}
                disabled={pagination.page === pagination.last_page}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

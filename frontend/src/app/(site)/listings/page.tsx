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
import { ArrowLeft, ArrowRight, SlidersHorizontal } from "lucide-react";

export default function ListingsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Annonces
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {pagination.total} résultat{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-foreground)]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-8 rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <ListingFilters onFilter={handleFilter} />
        </div>
      )}

      {/* Offline banner */}
      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Mode hors ligne — résultats limités.
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner />
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-24 text-center">
          <p className="text-base font-medium text-[var(--color-foreground)]">
            Aucun résultat
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Essaie de modifier tes filtres de recherche.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => fetchListings(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-foreground)] disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </button>
              <span className="min-w-[5rem] text-center text-sm text-[var(--color-muted)]">
                {pagination.page} / {pagination.last_page}
              </span>
              <button
                onClick={() => fetchListings(pagination.page + 1)}
                disabled={pagination.page === pagination.last_page}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-foreground)] disabled:pointer-events-none disabled:opacity-40"
              >
                Suivant
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

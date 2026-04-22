"use client";

import { useEffect, useState } from "react";
import { Eye, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { listingService } from "@/services/listing.service";
import { getImageUrl } from "@/lib/utils";
import { mockListings } from "@/data/listings";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Listing } from "@/types";

const statusMap: Record<string, { label: string; color: string }> = {
  publiee:  { label: "Disponible", color: "bg-emerald-50 text-emerald-700" },
  reservee: { label: "Réservée",   color: "bg-amber-50 text-amber-700"    },
  vendue:   { label: "Vendue",     color: "bg-red-50 text-red-600"        },
  archivee: { label: "Archivée",   color: "bg-gray-100 text-gray-500"     },
};

const typeMap: Record<string, string> = {
  vente:   "Vente",
  don:     "Don",
  echange: "Échange",
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    listingService
      .getMyListings()
      .then((data) => setListings(data.data || data))
      .catch(() => {
        setError(true);
        setListings(mockListings as Listing[]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            Mes annonces
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {listings.length} annonce{listings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/listings/create"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80"
        >
          <Plus className="h-4 w-4" />
          Nouvelle
        </Link>
      </div>

      {/* Offline */}
      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Mode hors ligne — données limitées.
        </div>
      )}

      {/* Empty state */}
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] py-24 text-center">
          <p className="text-base font-medium text-[var(--color-foreground)]">
            Aucune annonce
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Publie ta première annonce dès maintenant.
          </p>
          <Link
            href="/listings/create"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-foreground)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-80"
          >
            <Plus className="h-4 w-4" />
            Créer une annonce
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          {listings.map((listing) => {
            const status = statusMap[listing.status] ?? { label: listing.status, color: "bg-gray-100 text-gray-500" };
            return (
              <div
                key={listing.id}
                className="flex items-center gap-4 bg-white px-5 py-4 transition hover:bg-[var(--color-surface)]"
              >
                {/* Thumbnail */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface)]">
                  <img
                    src={getImageUrl(listing.photos?.[0]?.path)}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                    {listing.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {typeMap[listing.type] ?? listing.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                      <Eye className="h-3 w-3" />
                      {listing.views_count ?? 0}
                    </span>
                  </div>
                </div>

                {/* Price + action */}
                <div className="ml-4 flex shrink-0 items-center gap-4">
                  <span className="hidden text-sm font-semibold text-[var(--color-foreground)] sm:block">
                    {listing.price != null && listing.price > 0
                      ? `${listing.price.toLocaleString()} FCFA`
                      : "Gratuit"}
                  </span>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition"
                  >
                    Voir <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

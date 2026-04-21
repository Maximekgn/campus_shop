"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { listingService } from "@/services/listing.service";
import { mockListings } from "@/data/listings";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Listing } from "@/types";

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const data = await listingService.getMyListings();
        setListings(data.data || data);
      } catch (err) {
        console.error("Failed to fetch my listings:", err);
        setError(true);
        setListings(mockListings as Listing[]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      publiee: "Disponible",
      reservee: "Réservée",
      vendus: "Vendue",
      archivee: "Archivée",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      publiee: "bg-green-100 text-green-700",
      reservee: "bg-orange-100 text-orange-700",
      vendus: "bg-red-100 text-red-700",
      archivee: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
          Mode hors ligne — Certaines fonctionnalités peuvent être limitées
        </div>
      )}

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">
            Mes annonces
          </h1>
          <p className="mt-1 text-[var(--color-muted)]">
            {listings.length} annonce{listings.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/listings/create">
          <Button>+ Nouvelle annonce</Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
          <p className="mb-4 text-lg text-[var(--color-muted)]">
            Tu n'as aucune annonce pour l'instant
          </p>
          <Link href="/listings/create">
            <Button>Créer ma première annonce</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between rounded-[20px] border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-primary)]"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--color-foreground)]">
                  {listing.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
                    {listing.type === "vente"
                      ? "À vendre"
                      : listing.type === "don"
                        ? "À donner"
                        : "Échange"}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(listing.status)}`}
                  >
                    {getStatusLabel(listing.status)}
                  </span>
                  <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {listing.views_count ?? 0} vues
                  </span>
                </div>
              </div>
              <div className="ml-6 text-right">
                <p className="mb-2 text-lg font-semibold text-[var(--color-primary-dark)]">
                  {listing.price != null ? `${listing.price}fcfa` : "Gratuit"}
                </p>
                <div className="flex gap-2">
                  <Link href={`/listings/${listing.id}`}>
                    <Button variant="secondary" className="text-sm">
                      Voir
                    </Button>
                  </Link>
                  <Button variant="ghost" className="text-sm">
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhotoGallery from "@/components/listings/PhotoGallery";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { listingService } from "@/services/listing.service";
import { mockListings } from "@/data/listings";
import { mockUsers } from "@/data/users";
import type { Listing } from "@/types";
import {
  Eye,
  Heart,
  Flag,
  ArrowLeft,
  MessageCircle,
  CalendarDays,
  Tag,
} from "lucide-react";

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

const statusMap: Record<string, { label: string; color: string }> = {
  publiee:  { label: "Disponible",  color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  reservee: { label: "Réservé",     color: "bg-amber-50  text-amber-700  border-amber-200"   },
  vendus:   { label: "Vendu",       color: "bg-red-50    text-red-700    border-red-200"     },
  archivee: { label: "Archivé",     color: "bg-gray-100  text-gray-500   border-gray-200"    },
};

const typeMap: Record<string, string> = {
  vente:   "À vendre",
  don:     "À donner",
  echange: "Échange",
};

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const data = await listingService.getById(Number(id));
        setListing(data);
      } catch {
        setError(true);
        const found = mockListings.find((l) => l.id === Number(id)) as Listing | undefined;
        setListing(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleFavorite = async () => {
    if (!listing) return;
    setFavoriteLoading(true);
    try {
      const result = await listingService.toggleFavorite(listing.id);
      setIsFavorited(result.is_favorited);
    } catch {
      setIsFavorited((v) => !v);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-base font-medium text-[var(--color-foreground)]">Annonce introuvable</p>
        <button
          onClick={() => router.push("/listings")}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux annonces
        </button>
      </div>
    );
  }

  const status = statusMap[listing.status] ?? { label: listing.status, color: "bg-gray-100 text-gray-600 border-gray-200" };
  const isUnavailable = listing.status === "reservee" || listing.status === "vendue";
  const seller = listing.user || mockUsers.find((u) => u.id === listing.user_id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      {/* Offline */}
      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Mode hors ligne — données limitées.
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-[1fr_320px] lg:gap-12">

        {/* Left — gallery + description */}
        <div className="space-y-8">
          <PhotoGallery photos={listing.photos || []} listingId={listing.id} />

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Description
            </h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-[var(--color-muted)]">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-5">

          {/* Status + Title + Price */}
          <div className="space-y-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
            <h1 className="text-2xl font-semibold leading-snug text-[var(--color-foreground)]">
              {listing.title}
            </h1>
            <p className="text-3xl font-semibold text-[var(--color-foreground)]">
              {listing.price != null && listing.price > 0
                ? `${listing.price.toLocaleString()} FCFA`
                : "Gratuit"}
            </p>
          </div>

          {/* Meta */}
          <div className="rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-[var(--color-muted)]">
                <Tag className="h-4 w-4" /> Type
              </span>
              <span className="font-medium text-[var(--color-foreground)]">
                {typeMap[listing.type] ?? listing.type}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-[var(--color-muted)]">
                <Eye className="h-4 w-4" /> Vues
              </span>
              <span className="font-medium text-[var(--color-foreground)]">
                {listing.views_count ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-[var(--color-muted)]">
                <CalendarDays className="h-4 w-4" /> Publié
              </span>
              <span className="font-medium text-[var(--color-foreground)]">
                {new Date(listing.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Seller */}
          {seller && (
            <button
              type="button"
              onClick={() => seller.id && router.push(`/users/${seller.id}`)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-white p-4 text-left transition hover:border-[var(--color-foreground)]"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                Vendeur
              </p>
              <p className="mt-2 font-semibold text-[var(--color-foreground)]">{seller.name}</p>
              <p className="text-sm text-[var(--color-muted)]">{seller.email}</p>
            </button>
          )}

          {/* Actions */}
          <div className="space-y-2.5">
            <Button
              className="w-full"
              disabled={isUnavailable}
              onClick={() => router.push(`/messages?listing=${listing.id}`)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isUnavailable ? "Non disponible" : "Contacter le vendeur"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleFavorite}
              disabled={favoriteLoading}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
              />
              {isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
          </div>

          {/* Report */}
          <button
            onClick={() => router.push(`/report/${listing.id}`)}
            className="flex w-full items-center justify-center gap-2 text-xs text-[var(--color-muted)] transition hover:text-red-500"
          >
            <Flag className="h-3.5 w-3.5" />
            Signaler cette annonce
          </button>
        </div>
      </div>
    </div>
  );
}

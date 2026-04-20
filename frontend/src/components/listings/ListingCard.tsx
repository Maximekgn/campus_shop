import type { Listing, ListingStatus } from "@/types";
import Link from "next/link";

type ListingCardProps = {
  listing?: Partial<Listing>;
  key?: string;
};

function isNew(createdAt?: string): boolean {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 24 * 60 * 60 * 1000; // 24 heures
}

function getStatusLabel(status?: ListingStatus): string {
  const labels: Record<string, string> = {
    publiee: "Disponible",
    reservee: "Réservé",
    vendue: "Vendu",
    archivee: "Archivé",
  };
  return status ? labels[status] || status : "Disponible";
}

export default function ListingCard({
  listing = {
    id: "l0",
    title: "Titre de l'annonce",
    description: "Courte description de l'annonce pour donner envie au visiteur.",
    type: "vente",
    price: 15,
    status: "publiee",
    views_count: 0,
    created_at: new Date().toISOString(),
  },
}: ListingCardProps) {
  const isReserved = listing.status === "reservee" || listing.status === "vendue";
  const isNewListing = isNew(listing.created_at);

  return (
    <Link href={`/listings/${listing.id}`}>
      <article
        className={`group overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white shadow-[var(--color-shadow)] transition hover:-translate-y-1 hover:shadow-lg ${
          isReserved ? "opacity-75" : ""
        }`}
      >
        <div className="relative bg-[var(--color-primary-soft)] px-4 py-3">
          {isNewListing && (
            <span className="absolute right-4 top-4 inline-flex rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
              Nouveau
            </span>
          )}
          {isReserved && (
            <div className="absolute inset-0 flex items-start justify-end">
              <div className="rotate-45 translate-x-6 -translate-y-4 bg-orange-500 px-12 py-1 text-center text-xs font-semibold text-white">
                {getStatusLabel(listing.status)}
              </div>
            </div>
          )}
          <span className="inline-flex rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            {listing.type === "vente"
              ? "À vendre"
              : listing.type === "don"
              ? "À donner"
              : "Échange"}
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
              {listing.title}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
              {listing.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="block text-lg font-semibold text-[var(--color-primary-dark)]">
                {listing.price != null ? `${listing.price} FCFA` : "Gratuit"}
              </span>
              <span className="text-xs text-[var(--color-muted)]">
                👁 {listing.views_count ?? 0} vues
              </span>
            </div>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isReserved
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              }`}
              disabled={isReserved}
            >
              Voir
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

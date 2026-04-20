'use client';

import { notFound } from 'next/navigation';
import { mockListings } from '@/data/listings';
import { mockUsers } from '@/data/users';
import PhotoGallery from '@/components/listings/PhotoGallery';
import Button from '@/components/ui/Button';
import type { Listing } from '@/types';

type ListingDetailPageProps = {
  params: { id: string };
};

function getStatusBadge(status: string) {
  const statuses: Record<string, { label: string; color: string }> = {
    publiee: { label: 'Disponible', color: 'bg-green-100 text-green-700' },
    reservee: { label: 'Réservé', color: 'bg-orange-100 text-orange-700' },
    vendue: { label: 'Vendu', color: 'bg-red-100 text-red-700' },
    archivee: { label: 'Archivé', color: 'bg-gray-100 text-gray-700' },
  };
  const s = statuses[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  return s;
}

function getTypeBadge(type: string) {
  const types: Record<string, string> = {
    vente: 'À vendre',
    don: 'À donner',
    echange: 'Échange',
  };
  return types[type] || type;
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const listing = mockListings.find((l) => l.id === params.id) as Listing | undefined;

  if (!listing) {
    notFound();
  }

  const seller = mockUsers.find((u) => u.id === listing.user_id);
  const statusBadge = getStatusBadge(listing.status);
  const isReservedOrSold = listing.status === 'reservee' || listing.status === 'vendue';

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-3 lg:gap-12">
        {/* Colonne gauche : photos */}
        <div className="md:col-span-2">
          <PhotoGallery photos={listing.photos || []} />
        </div>

        {/* Colonne droite : infos */}
        <div className="space-y-6">
          {/* Statut */}
          <div
            className={`rounded-[16px] px-4 py-3 text-sm font-semibold ${statusBadge.color}`}
          >
            {statusBadge.label}
          </div>

          {/* Titre & prix */}
          <div>
            <h1 className="mb-4 text-3xl font-semibold text-[var(--color-foreground)]">
              {listing.title}
            </h1>
            <div className="text-4xl font-bold text-[var(--color-primary-dark)]">
              {listing.price != null ? `${listing.price} FCFA` : 'Gratuit'}
            </div>
          </div>

          {/* Infos */}
          <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Type</span>
              <span className="font-semibold text-[var(--color-foreground)]">
                {getTypeBadge(listing.type)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-[var(--color-muted)]">Vues</span>
              <span className="font-semibold text-[var(--color-foreground)]">
                👁 {listing.views_count ?? 0}
              </span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-[var(--color-muted)]">Publié</span>
              <span className="font-semibold text-[var(--color-foreground)]">
                {new Date(listing.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Vendeur */}
          {seller && (
            <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                Vendeur
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-[var(--color-foreground)]">{seller.name}</p>
                <p className="text-sm text-[var(--color-muted)]">{seller.email}</p>
                {seller.student_id && (
                  <p className="text-xs text-[var(--color-muted)]">ID: {seller.student_id}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full"
              disabled={isReservedOrSold}
            >
              {isReservedOrSold ? 'Non disponible' : 'Contacter le vendeur'}
            </Button>
            <Button variant="secondary" className="w-full">
              ❤️ Ajouter aux favoris
            </Button>
          </div>
        </div>
      </div>

      {/* Description complète */}
      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)]">
          Description
        </h2>
        <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="whitespace-pre-wrap leading-7 text-[var(--color-muted)]">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Signalement */}
      <div className="mt-10 border-t border-[var(--color-border)] pt-6">
        <button className="text-sm text-[var(--color-muted)] transition hover:text-red-500">
          🚩 Signaler cette annonce
        </button>
      </div>
    </div>
  );
}

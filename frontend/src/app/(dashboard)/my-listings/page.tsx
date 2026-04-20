'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { mockListings } from '@/data/listings';
import type { Listing } from '@/types';
import { ListingStatus } from '@/types';

export default function MyListingsPage(): ReactNode {
  // Filtrer les annonces de l'utilisateur actuel (simulé : u1)
  const userListings = mockListings.filter((l) => l.user_id === 'u1') as Listing[];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Mes annonces</h1>
          <p className="mt-1 text-[var(--color-muted)]">
            {userListings.length} annonce{userListings.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/listings/create">
          <Button>+ Nouvelle annonce</Button>
        </Link>
      </div>

      {userListings.length === 0 ? (
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
          {userListings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between rounded-[20px] border border-[var(--color-border)] bg-white p-5 transition hover:border-[var(--color-primary)]"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--color-foreground)]">{listing.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--color-primary-dark)]">
                    {listing.type === 'vente' ? 'À vendre' : listing.type === 'don' ? 'À donner' : 'Échange'}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      listing.status === ListingStatus.PUBLISHED
                        ? 'bg-green-100 text-green-700'
                        : listing.status === ListingStatus.RESERVED
                        ? 'bg-orange-100 text-orange-700'
                        : listing.status === ListingStatus.SOLD
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {listing.status === ListingStatus.PUBLISHED
                      ? 'Disponible'
                      : listing.status === ListingStatus.RESERVED
                      ? 'Réservée'
                      : listing.status === ListingStatus.SOLD
                      ? 'Vendue'
                      : 'Archivée'}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">👁 {listing.views_count ?? 0} vues</span>
                </div>
              </div>
              <div className="ml-6 text-right">
                <p className="mb-2 text-lg font-semibold text-[var(--color-primary-dark)]">
                  {listing.price != null ? `${listing.price} FCFA` : 'Gratuit'}
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

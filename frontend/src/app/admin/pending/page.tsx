'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { mockListings } from '@/data/listings';
import type { Listing } from '@/types';
import { ListingStatus } from '@/types';

export default function PendingListingsPage(): ReactNode {
  const pendingListings = (mockListings.filter((l) => l.status !== ListingStatus.ARCHIVED) || []) as Listing[];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">← Retour</button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Annonces en attente</h1>
          <p className="mt-1 text-[var(--color-muted)]">{pendingListings.length} annonce(s) à valider</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {pendingListings.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center">
            <p className="text-[var(--color-muted)]">Aucune annonce en attente</p>
          </div>
        ) : (
          pendingListings.map((listing) => (
            <div key={listing.id} className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-foreground)]">{listing.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Type: <span className="font-medium text-[var(--color-foreground)]">{listing.type}</span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Prix: <span className="font-medium text-[var(--color-primary)]">{listing.price} FCFA</span>
                  </p>
                </div>
                <div className="rounded-[20px] bg-[var(--color-soft)] p-4">
                  <p className="truncate text-sm text-[var(--color-muted)]">Détails supplémentaires</p>
                  <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                    {listing.description.substring(0, 50)}...
                  </p>
                </div>
              </div>

              <div className="mb-4 rounded-[20px] border border-[var(--color-border)] p-4">
                <p className="text-sm font-semibold text-[var(--color-foreground)]">Description</p>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">{listing.description}</p>
              </div>

              <div className="flex gap-3">
                <Link href={`/admin/pending/${listing.id}`}>
                  <Button>Examiner</Button>
                </Link>
                <button className="rounded-full border border-green-500 px-6 py-2 font-semibold text-green-600 transition hover:bg-green-50">
                  ✓ Valider
                </button>
                <button className="rounded-full border border-red-500 px-6 py-2 font-semibold text-red-600 transition hover:bg-red-50">
                  ✕ Rejeter
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

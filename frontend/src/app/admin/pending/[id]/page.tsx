'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { mockListings } from '@/data/listings';
import { mockUsers } from '@/data/users';
import type { Listing } from '@/types';

export default function PendingListingDetailPage(): ReactNode {
  const params = useParams();
  const id = params?.id as string;

  const listing = mockListings.find((l) => l.id === id) as Listing | undefined;
  const seller = listing ? mockUsers.find((u) => u.id === listing.user_id) : undefined;

  if (!listing) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <p className="text-[var(--color-muted)]">Annonce non trouvée</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/pending">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">← Retour</button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">{listing.title}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Statut: {listing.status}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-3">
        {/* Annonce */}
        <div className="sm:col-span-2 space-y-6">
          {/* Photos */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white overflow-hidden">
            <div className="aspect-video w-full bg-gradient-to-br from-[var(--color-primary-soft)] to-[var(--color-soft)] flex items-center justify-center">
              <span className="text-[var(--color-muted)]">Galerie photos • {listing.photos.length} photo(s)</span>
            </div>
          </div>

          {/* Infos */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Type</p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-foreground)]">
                  {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Prix</p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-primary)]">{listing.price} FCFA</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Créée le</p>
                <p className="mt-2 text-lg text-[var(--color-foreground)]">{new Date(listing.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Vues</p>
                <p className="mt-2 text-lg text-[var(--color-foreground)]">{listing.views_count}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Description</h2>
            <p className="mt-4 whitespace-pre-wrap text-[var(--color-muted)]">{listing.description}</p>
          </div>
        </div>

        {/* Vendeur + Actions */}
        <div className="space-y-6">
          {/* Vendeur */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Vendeur</h3>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Nom</p>
                <p className="font-semibold text-[var(--color-foreground)]">{seller?.name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Email</p>
                <p className="truncate text-sm font-medium text-[var(--color-primary)]">{seller?.email}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-muted)]">Rôle</p>
                <p className="font-semibold text-[var(--color-foreground)]">{seller?.role}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Actions</h3>
            <button className="w-full rounded-full bg-green-100 py-3 font-semibold text-green-700 transition hover:bg-green-200">
              ✓ Valider l'annonce
            </button>
            <button className="w-full rounded-full border border-red-300 py-3 font-semibold text-red-600 transition hover:bg-red-50">
              ✕ Rejeter l'annonce
            </button>
            <button className="w-full rounded-full border border-[var(--color-border)] py-3 font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]">
              Contacter le vendeur
            </button>
          </div>

          {/* Commentaires */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Notes</h3>
            <textarea
              className="mt-3 w-full rounded-[16px] border border-[var(--color-border)] p-3 text-sm placeholder-[var(--color-muted)]"
              rows={3}
              placeholder="Ajouter une note interne..."
            />
            <button className="mt-3 w-full rounded-full bg-[var(--color-primary-soft)] py-2 font-semibold text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary)] hover:text-white">
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

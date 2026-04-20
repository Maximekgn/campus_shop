'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { mockListings } from '@/data/listings';
import type { Listing } from '@/types';
import { ListingStatus } from '@/types';

export default function AdminDashboard(): ReactNode {
  const pendingListings = (mockListings.filter((l) => l.status !== ListingStatus.ARCHIVED) || []) as Listing[];
  const reportCount = 3; // Simulé

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Tableau de bord modération</h1>
        <p className="mt-1 text-[var(--color-muted)]">Gère les annonces et les signalements</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Annonces en attente
          </p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-primary-dark)]">
            {pendingListings.length}
          </p>
        </div>
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Signalements ouverts
          </p>
          <p className="mt-3 text-4xl font-bold text-orange-600">
            {reportCount}
          </p>
        </div>
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Utilisateurs
          </p>
          <p className="mt-3 text-4xl font-bold text-[var(--color-foreground)]">
            3
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)]">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/pending">
            <Button>Valider les annonces ({pendingListings.length})</Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="secondary">Traiter les signalements ({reportCount})</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost">Gérer les membres</Button>
          </Link>
        </div>
      </div>

      {/* Annonces en attente */}
      <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8">
        <h2 className="mb-6 text-2xl font-semibold text-[var(--color-foreground)]">
          Annonces en attente de validation
        </h2>
        {pendingListings.length === 0 ? (
          <p className="text-[var(--color-muted)]">Aucune annonce en attente</p>
        ) : (
          <div className="space-y-3">
            {pendingListings.map((listing) => (
              <Link key={listing.id} href={`/admin/pending/${listing.id}`}>
                <div className="flex items-center justify-between rounded-[20px] border border-[var(--color-border)] p-4 transition hover:border-[var(--color-primary)]">
                  <div>
                    <h3 className="font-semibold text-[var(--color-foreground)]">{listing.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      par {listing.user_id} • {listing.type}
                    </p>
                  </div>
                  <Button variant="secondary" className="text-sm">
                    Vérifier
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


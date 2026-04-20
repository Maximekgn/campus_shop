'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import type { Listing } from '@/types';
import { moderationService } from '@/services/moderation.service';

export default function PendingListingsPage(): ReactNode {
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadPendingListings = useCallback(async () => {
    setLoading(true);
    try {
      const listings = await moderationService.getPendingListings();
      setPendingListings(listings);
    } catch {
      setError("Impossible de charger les annonces en attente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingListings();
  }, [loadPendingListings]);

  const actionableListings = useMemo(
    () => pendingListings,
    [pendingListings]
  );

  const handleApprove = async (id: string) => {
    setBusyId(id);
    setError('');
    try {
      await moderationService.approveListing(id);
      setPendingListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch {
      setError("Impossible de valider l'annonce.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: string) => {
    setBusyId(id);
    setError('');
    try {
      await moderationService.rejectListing(id, 'Non conforme aux règles CampusShop');
      setPendingListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch {
      setError("Impossible de rejeter l'annonce.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Annonces en attente</h1>
        <p className="mt-1 text-[var(--color-muted)]">{actionableListings.length} annonce(s) à valider</p>
      </div>

      {error && (
        <div className="mb-6 rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center">
            <p className="text-[var(--color-muted)]">Chargement des annonces...</p>
          </div>
        ) : actionableListings.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center">
            <p className="text-[var(--color-muted)]">Aucune annonce en attente</p>
          </div>
        ) : (
          actionableListings.map((listing) => (
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
                <button
                  onClick={() => handleApprove(listing.id)}
                  disabled={busyId === listing.id}
                  className="rounded-full border border-green-500 px-6 py-2 font-semibold text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyId === listing.id ? 'Validation...' : "✓ Valider"}
                </button>
                <button
                  onClick={() => handleReject(listing.id)}
                  disabled={busyId === listing.id}
                  className="rounded-full border border-red-500 px-6 py-2 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyId === listing.id ? 'Rejet...' : '✕ Rejeter'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoGallery from '@/components/listings/PhotoGallery';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { listingService } from '@/services/listing.service';
import { mockListings } from '@/data/listings';
import { mockUsers } from '@/data/users';
import type { Listing } from '@/types';

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

function getStatusBadge(status: string) {
  const statuses: Record<string, { label: string; color: string }> = {
    publiee: { label: 'Disponible', color: 'bg-green-100 text-green-700' },
    reservee: { label: 'Réservé', color: 'bg-orange-100 text-orange-700' },
    vendus: { label: 'Vendu', color: 'bg-red-100 text-red-700' },
    archivee: { label: 'Archivé', color: 'bg-gray-100 text-gray-700' },
  };
  return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
}

function getTypeBadge(type: string) {
  const types: Record<string, string> = { vente: 'À vendre', don: 'À donner', echange: 'Échange' };
  return types[type] || type;
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const data = await listingService.getById(Number(id));
      setListing(data);
      setError(false);
    } catch (err) {
      console.error('Failed to fetch listing:', err);
      setError(true);
      const found = mockListings.find((l) => l.id === id) as Listing | undefined;
      setListing(found || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleContact = () => {
    if (!listing) return;
    router.push(`/messages?listing=${listing.id}`);
  };

  const handleFavorite = async () => {
    setFavoriteLoading(true);
    try {
      const result = await listingService.toggleFavorite(listing!.id);
      setIsFavorited(result.is_favorited);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      setIsFavorited(!isFavorited);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReport = () => {
    const reason = prompt('Reason for reporting this listing:');
    if (reason) {
      console.log('Report submitted:', reason);
      alert('Signalement envoyé !');
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Annonce non trouvée</h1>
          <button onClick={() => router.push('/listings')} className="mt-4 text-[var(--color-primary)]">
            ← Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(listing.status);
  const isReservedOrSold = listing.status === 'reservee' || listing.status === 'vendue';
  const seller = listing.user || mockUsers.find((u) => u.id === String(listing.user_id));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
          Mode hors ligne — Certaines fonctionnalités peuvent être limitées
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-3 lg:gap-12">
        <div className="md:col-span-2">
          <PhotoGallery photos={listing.photos || []} />
        </div>

        <div className="space-y-6">
          <div className={`rounded-[16px] px-4 py-3 text-sm font-semibold ${statusBadge.color}`}>
            {statusBadge.label}
          </div>

          <div>
            <h1 className="mb-4 text-3xl font-semibold text-[var(--color-foreground)]">{listing.title}</h1>
            <div className="text-4xl font-bold text-[var(--color-primary-dark)]">
              {listing.price != null ? `${listing.price} FCFA` : 'Gratuit'}
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Type</span>
              <span className="font-semibold text-[var(--color-foreground)]">{getTypeBadge(listing.type)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-[var(--color-muted)]">Vues</span>
              <span className="font-semibold text-[var(--color-foreground)]">👁 {listing.views_count ?? 0}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
              <span className="text-[var(--color-muted)]">Publié</span>
              <span className="font-semibold text-[var(--color-foreground)]">
                {new Date(listing.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {seller && (
            <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Vendeur</p>
              <div className="space-y-2">
                <p className="font-semibold text-[var(--color-foreground)]">{seller.name}</p>
                <p className="text-sm text-[var(--color-muted)]">{seller.email}</p>
                {seller.student_id && <p className="text-xs text-[var(--color-muted)]">ID: {seller.student_id}</p>}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button className="w-full" disabled={isReservedOrSold} onClick={handleContact}>
              {isReservedOrSold ? 'Non disponible' : 'Contacter le vendeur'}
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleFavorite} disabled={favoriteLoading}>
              {isFavorited ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)]">Description</h2>
        <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="whitespace-pre-wrap leading-7 text-[var(--color-muted)]">{listing.description}</p>
        </div>
      </div>

      <div className="mt-10 border-t border-[var(--color-border)] pt-6">
        <button onClick={handleReport} className="text-sm text-[var(--color-muted)] transition hover:text-red-500">
          🚩 Signaler cette annonce
        </button>
      </div>
    </div>
  );
}
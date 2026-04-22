'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import type { Listing, User } from '@/types';
import { moderationService } from '@/services/moderation.service';
import Link from 'next/link';

export default function PendingListingDetailPage(): ReactNode {
  const params = useParams();
  const id = params?.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [busyAction, setBusyAction] = useState<'approve' | 'reject' | 'save' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDetail = async () => {
      setLoading(true);
      try {
        const [detail, existingNote] = await Promise.all([
          moderationService.getPendingListingById(Number(id)),
          moderationService.getListingModeratorNote(Number(id)),
        ]);

        if (!mounted) {
          return;
        }

        setListing(detail);
        setInternalNote(existingNote);

        if (detail) {
          const detailSeller = await moderationService.getSellerForListing(detail.id);
          if (mounted) {
            setSeller(detailSeller);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleApprove = async () => {
    setBusyAction('approve');
    setStatusMessage('');
    try {
      await moderationService.approveListing(id);
      setStatusMessage('Annonce validée avec succès.');
      setListing(null);
    } catch {
      setStatusMessage("Échec de la validation de l'annonce.");
    } finally {
      setBusyAction(null);
    }
  };

  const handleReject = async () => {
    setBusyAction('reject');
    setStatusMessage('');
    try {
      await moderationService.rejectListing(id, internalNote || 'Annonce non conforme.');
      setStatusMessage('Annonce rejetée.');
      setListing(null);
    } catch {
      setStatusMessage("Échec du rejet de l'annonce.");
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveNote = async () => {
    setBusyAction('save');
    setStatusMessage('');

    try {
      await moderationService.saveListingModeratorNote(Number(id), internalNote);
      setStatusMessage('Note interne enregistrée.');
    } finally {
      setBusyAction(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-10">
        <p className="text-[var(--color-muted)]">Chargement de l'annonce...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="w-full py-10">
        <p className="text-[var(--color-muted)]">Annonce non trouvée ou deja traitee</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">{listing.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Statut: {listing.status}</p>
      </div>

      {statusMessage && (
        <div className="mb-6 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-soft)] p-4 text-sm font-semibold text-[var(--color-foreground)]">
          {statusMessage}
        </div>
      )}

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
            <button
              onClick={handleApprove}
              disabled={busyAction !== null}
              className="w-full rounded-full bg-green-100 py-3 font-semibold text-green-700 transition hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyAction === 'approve' ? 'Validation...' : <><Check className="mr-1 h-4 w-4" /> Valider l'annonce</>}
            </button>
            <button
              onClick={handleReject}
              disabled={busyAction !== null}
              className="w-full rounded-full border border-red-300 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyAction === 'reject' ? 'Rejet...' : <><X className="mr-1 h-4 w-4" /> Rejeter l'annonce</>}
            </button>
            <Link href="/messages">
              <button className="w-full rounded-full border border-[var(--color-border)] py-3 font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]">
                Contacter le vendeur
              </button>
            </Link>
          </div>

          {/* Commentaires */}
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Notes</h3>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              className="mt-3 w-full rounded-[16px] border border-[var(--color-border)] p-3 text-sm placeholder-[var(--color-muted)]"
              rows={3}
              placeholder="Ajouter une note interne..."
            />
            <button
              onClick={handleSaveNote}
              disabled={busyAction !== null}
              className="mt-3 w-full rounded-full bg-[var(--color-primary-soft)] py-2 font-semibold text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyAction === 'save' ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

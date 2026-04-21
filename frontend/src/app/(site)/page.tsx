'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import { mockListings } from '@/data/listings';
import { listingService } from '@/services/listing.service';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Listing } from '@/types';
import { ArrowRight, Tag, Gift, RefreshCw, Search } from 'lucide-react';

type CategoryItem = {
  key: string;
  label: string;
  count: number;
  icon: React.ReactNode;
};

const categoryLabel: Record<string, string> = {
  vente: 'À vendre',
  don: 'À donner',
  échange: 'Échange',
};

const categoryIcons: Record<string, React.ReactNode> = {
  vente: <Tag className="h-5 w-5" />,
  don: <Gift className="h-5 w-5" />,
  échange: <RefreshCw className="h-5 w-5" />,
};

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingService.getAll({ per_page: 15 });
        setListings(data.data || data);
      } catch (err) {
        console.error('API failed, using mock data:', err);
        setError(true);
        setListings(mockListings as Listing[]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const categories = useMemo<CategoryItem[]>(() => {
    const grouped = listings.reduce<Record<string, number>>((acc, listing) => {
      acc[listing.type] = (acc[listing.type] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([type, count]) => ({
      key: type,
      label: categoryLabel[type] ?? type,
      count,
      icon: categoryIcons[type] ?? <Tag className="h-5 w-5" />,
    }));
  }, [listings]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 space-y-16">

      {/* Offline banner */}
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Mode hors ligne — certaines fonctionnalités peuvent être limitées.
        </div>
      )}

      {/* ── Hero ── */}
      <section className="flex flex-col items-start gap-6 sm:gap-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-[var(--color-muted)]">
          CampusShop
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl lg:text-6xl">
            Le marché des<br />
            <span className="text-[var(--color-primary-dark)]">étudiants</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Achète, vends, donne ou échange avec d'autres étudiants de ton campus en quelques clics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-foreground)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-80"
          >
            Voir les annonces
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:border-[var(--color-foreground)]"
          >
            Me connecter
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-8 pt-2">
          <div>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">{listings.length}</p>
            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-0.5">Annonces actives</p>
          </div>
          <div className="w-px bg-[var(--color-border)]" />
          <div>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">{categories.length}</p>
            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-0.5">Catégories</p>
          </div>
          <div className="w-px bg-[var(--color-border)]" />
          <div>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">100%</p>
            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-0.5">Gratuit</p>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Parcourir par type
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/listings?type=${encodeURIComponent(cat.key)}`}
                className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
              >
                <span className="text-[var(--color-primary-dark)]">{cat.icon}</span>
                {cat.label}
                <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--color-muted)] group-hover:bg-white">
                  {cat.count}
                </span>
              </Link>
            ))}
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
            >
              <Search className="h-4 w-4" />
              Toutes les annonces
            </Link>
          </div>
        </section>
      )}

      {/* ── Listings grid ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
              Dernières annonces
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {listings.length} annonce{listings.length !== 1 ? 's' : ''} publiée{listings.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-foreground)] opacity-60 hover:opacity-100 transition"
          >
            Voir tout
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.slice(0, 9).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

    </div>
  );
}
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import { mockListings } from '@/data/listings';
import { listingService } from '@/services/listing.service';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Listing } from '@/types';
import { ArrowRight, Tag, Gift, RefreshCw, Search, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

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

const typeLabel: Record<string, string> = {
  vente: 'À vendre',
  don: 'À donner',
  échange: 'Échange',
};

const typeBadgeColor: Record<string, string> = {
  vente: 'bg-blue-500/80',
  don: 'bg-emerald-500/80',
  échange: 'bg-violet-500/80',
};

/* ── Popular Articles Carousel ── */
function PopularCarousel({ articles }: { articles: Listing[] }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const popular = useMemo(
    () => [...articles].sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0)).slice(0, 5),
    [articles]
  );

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex((next + popular.length) % popular.length);
      setAnimating(false);
    }, 300);
  };

  // Auto-play
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goTo(index + 1);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, popular.length]);

  if (popular.length === 0) return null;

  const current = popular[index];
  const photo = current.photos?.[0]?.path ?? `https://picsum.photos/seed/${current.id}/700/500`;
  const badge = typeBadgeColor[current.type ?? ''] ?? 'bg-black/60';

  return (
    <div className="relative w-full max-w-sm lg:max-w-md xl:max-w-lg perspective-1000">
      {/* Background glow */}
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-[var(--color-primary-soft)] to-[var(--color-border)] opacity-50 blur-2xl transition-all duration-1000"></div>
      
      {/* Card */}
      <Link href={`/listings/${current.id}`}>
        <div
          className={`relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-500 ease-out transform ${
            animating ? 'scale-95 opacity-50 translate-y-4' : 'scale-100 opacity-100 translate-y-0'
          }`}
        >
          {/* Image */}
          <div className="relative h-64 sm:h-72 overflow-hidden p-2">
            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-inner">
              <img
                src={photo}
                alt={current.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Type badge */}
              <span className={`absolute left-3 top-3 rounded-full ${badge} backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg`}>
                {typeLabel[current.type ?? ''] ?? current.type}
              </span>

              {/* Views */}
              <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 text-[11px] text-white font-semibold shadow-lg border border-white/10">
                <TrendingUp className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                {current.views_count} vues
              </span>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-1 drop-shadow-md">{current.title}</p>
                <p className="mt-1.5 text-sm text-white/80 line-clamp-1 font-medium">{current.description}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-sm border-t border-white/20">
            <span className="text-lg font-black text-[var(--color-foreground)] tracking-tight">
              {current.price != null && current.price > 0
                ? `${current.price.toLocaleString()} FCFA`
                : 'Gratuit'}
            </span>
            <span className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary-dark)] bg-white/50 px-4 py-2 rounded-full hover:bg-white transition-colors">
              Voir l'offre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between px-2">
        {/* Dots */}
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--color-border)]">
          {popular.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 ${
                i === index
                  ? 'w-8 h-2 bg-[var(--color-primary-dark)] shadow-sm'
                  : 'w-2 h-2 bg-[var(--color-muted)]/30 hover:bg-[var(--color-muted)]/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(index - 1)}
            className="rounded-full bg-white/80 shadow-sm border border-[var(--color-border)] p-2.5 text-[var(--color-foreground)] transition-all hover:bg-[var(--color-foreground)] hover:text-white hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            className="rounded-full bg-white/80 shadow-sm border border-[var(--color-border)] p-2.5 text-[var(--color-foreground)] transition-all hover:bg-[var(--color-foreground)] hover:text-white hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

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
      <section className="relative flex flex-col-reverse items-center gap-12 lg:flex-row lg:items-center lg:gap-20 py-8 lg:py-12">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[30rem] h-[30rem] bg-[var(--color-primary-soft)] rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[20rem] h-[20rem] bg-[var(--color-border)] rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Left — text */}
        <div className="relative z-10 flex flex-1 flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)]/50 backdrop-blur-sm px-5 py-2 text-xs font-bold tracking-widest uppercase text-[var(--color-primary-dark)] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary-dark)]"></span>
            </span>
            CampusShop 2.0
          </div>

          <div className="space-y-5">
            <h1 className="text-5xl font-black tracking-tight text-[var(--color-foreground)] sm:text-6xl lg:text-7xl leading-[1.1]">
              Le marché des<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-dark)] to-[#a67c00]">
                étudiants
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[var(--color-muted)] sm:text-xl font-medium">
              Achète, vends, donne ou échange avec d'autres étudiants de ton campus dans un espace sécurisé et élégant.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/listings"
              className="group relative inline-flex items-center gap-2 rounded-full bg-[var(--color-foreground)] px-8 py-4 text-base font-bold text-white overflow-hidden shadow-xl shadow-black/10 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              Explorer les offres
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-border)] bg-white/50 backdrop-blur-sm px-8 py-4 text-base font-bold text-[var(--color-foreground)] transition-all hover:border-[var(--color-foreground)] hover:bg-white"
            >
              Me connecter
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-[var(--color-border)]/60 mt-4 w-full">
            <div className="flex flex-col gap-1">
              <p className="text-3xl font-black text-[var(--color-foreground)]">{listings.length}</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">Offres actives</p>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent" />
            <div className="flex flex-col gap-1">
              <p className="text-3xl font-black text-[var(--color-foreground)]">{categories.length}</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">Catégories</p>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent" />
            <div className="flex flex-col gap-1">
              <p className="text-3xl font-black text-[var(--color-primary-dark)]">100%</p>
              <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">Gratuit</p>
            </div>
          </div>
        </div>

        {/* Right — popular articles carousel */}
        <div className="relative z-10 flex w-full flex-col items-center lg:w-auto lg:items-end">
          <div className="mb-6 flex items-center gap-3 self-start lg:self-auto bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--color-border)] shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-foreground)]">
              En tendance
            </span>
          </div>
          <PopularCarousel articles={listings} />
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
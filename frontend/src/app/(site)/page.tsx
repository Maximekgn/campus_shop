'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/listings/ListingCard';
import { mockListings } from '@/data/listings';

type CategoryItem = {
  key: string;
  label: string;
  count: number;
  image: string;
};

const categoryLabel: Record<string, string> = {
  vente: 'A vendre',
  don: 'A donner',
  échange: 'Echange',
};

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const featuredListings = useMemo(() => {
    return mockListings.slice(0, Math.min(5, mockListings.length));
  }, []);

  const categories = useMemo<CategoryItem[]>(() => {
    const grouped = mockListings.reduce<Record<string, number>>((acc, listing) => {
      acc[listing.type] = (acc[listing.type] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([type, count], index) => ({
      key: type,
      label: categoryLabel[type] ?? type,
      count,
      image: mockListings[index % mockListings.length]?.photos?.[0]?.path ?? 'https://picsum.photos/300/300',
    }));
  }, []);

  useEffect(() => {
    if (featuredListings.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredListings.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [featuredListings.length]);

  const currentListing = featuredListings[activeSlide] ?? mockListings[0];

  return (
    <div className="flex w-full flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <section className="overflow-hidden rounded-[34px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--color-shadow)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[var(--color-primary-soft)]/80 blur-2xl" />
            <p className="relative mb-4 inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary-dark)] sm:text-sm">
              CampusShop
            </p>
            <h1 className="relative max-w-xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
              Petites annonces et troc entre etudiants
            </h1>
            <p className="relative mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Inspiree du style vitrine e-commerce: decouvre en un coup d&apos;oeil les annonces vedettes, puis navigue par categorie avant de consulter tous les articles publies.
            </p>

            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Voir les annonces
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-primary)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-primary-soft)]"
              >
                Me connecter
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] bg-white sm:min-h-[360px] lg:min-h-[440px]">
            <img
              src={currentListing.photos?.[0]?.path ?? 'https://picsum.photos/700/500'}
              alt={currentListing.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent p-5 text-white sm:p-6">
              <p className="inline-flex rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                Annonce vedette
              </p>
              <h2 className="mt-3 text-xl font-semibold sm:text-2xl">{currentListing.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-white/90">{currentListing.description}</p>
            </div>

            {featuredListings.length > 1 && (
              <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-black/45 px-3 py-2 backdrop-blur">
                <button
                  onClick={() => setActiveSlide((prev) => (prev - 1 + featuredListings.length) % featuredListings.length)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/20"
                  aria-label="Slide precedent"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActiveSlide((prev) => (prev + 1) % featuredListings.length)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white transition hover:bg-white/20"
                  aria-label="Slide suivant"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold text-[var(--color-foreground)]">Categories d&apos;articles</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)] sm:text-base">
            Parcours rapide par type d&apos;annonce
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/listings?type=${encodeURIComponent(category.key)}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-[var(--color-shadow)] sm:h-28 sm:w-28">
                <img src={category.image} alt={category.label} className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">{category.label}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {category.count} article{category.count > 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--color-foreground)]">Tous les articles postes</h2>
            <p className="mt-2 text-[var(--color-muted)]">
              {mockListings.length} annonce{mockListings.length > 1 ? 's' : ''} publiee{mockListings.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-primary)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-primary-soft)]"
          >
            Voir tout
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}

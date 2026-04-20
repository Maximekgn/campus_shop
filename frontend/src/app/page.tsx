import ListingCard from "@/components/listings/ListingCard";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 shadow-[var(--color-shadow)]">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
            CampusShop
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
            Petites annonces et troc entre étudiants
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            Découvre des annonces locales de vente, don et échange, contacte directement le vendeur et gère tes favoris dans un espace moderne et élégant.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/listings"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
            >
              Voir les annonces
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-primary)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-primary-soft)]"
            >
              Me connecter
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ListingCard />
        <ListingCard />
        <ListingCard />
      </section>
    </div>
  );
}

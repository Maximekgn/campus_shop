import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
          CampusShop
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-[var(--color-muted)]">
          <Link href="/listings" className="transition hover:text-[var(--color-primary-dark)]">
            Annonces
          </Link>
          <Link href="/my-listings" className="transition hover:text-[var(--color-primary-dark)]">
            Mes annonces
          </Link>
          <Link href="/favorites" className="transition hover:text-[var(--color-primary-dark)]">
            Favoris
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}


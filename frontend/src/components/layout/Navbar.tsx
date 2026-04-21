"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/listings",    label: "Annonces"      },
  { href: "/my-listings", label: "Mes annonces"  },
  { href: "/favorites",   label: "Favoris"       },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-[var(--color-foreground)]"
        >
          CampusShop
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {user?.role !== "moderator" &&
            navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm transition ${
                  pathname === href
                    ? "font-semibold text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {label}
              </Link>
            ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[var(--color-foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

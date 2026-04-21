"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { messageService } from "@/services/message.service";
import { MessageCircle, Bell } from "lucide-react";

const navLinks = [
  { href: "/listings",    label: "Annonces"      },
  { href: "/my-listings", label: "Mes annonces"  },
  { href: "/favorites",   label: "Favoris"       },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    messageService.getUnreadCount()
      .then(setUnreadCount)
      .catch(() => {});
  }, [isAuthenticated]);

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
          <Link
            href="/listings"
            className={`text-sm transition ${
              pathname === "/listings"
                ? "font-semibold text-[var(--color-foreground)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Annonces
          </Link>

          {isAuthenticated && user?.role !== "moderateur" && (
            <>
              <Link
                href="/my-listings"
                className={`text-sm transition ${
                  pathname === "/my-listings"
                    ? "font-semibold text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                Mes annonces
              </Link>
              <Link
                href="/favorites"
                className={`text-sm transition ${
                  pathname === "/favorites"
                    ? "font-semibold text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                Favoris
              </Link>
              <Link
                href="/messages"
                className={`relative text-sm transition ${
                  pathname.startsWith("/messages")
                    ? "font-semibold text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}
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

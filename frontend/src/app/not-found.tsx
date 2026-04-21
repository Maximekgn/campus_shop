"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage(): ReactNode {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      {/* 404 Icon */}
      <div className="mb-6 text-center">
        <span className="text-9xl font-bold text-[var(--color-primary)]">
          404
        </span>
      </div>

      {/* Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
          Page non trouvée
        </h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">
          Désolé, la page que tu cherches n'existe pas ou a été supprimée.
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Vérifie l'URL et réessaye, ou retourne à l'accueil.
        </p>
      </div>

      {/* Illustration */}
      <div className="mt-8 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-soft)] p-12">
        <Search className="mx-auto h-12 w-12 text-[var(--color-muted)]" />
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Rien à voir ici...
        </p>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
        <Link href="/listings">
          <Button variant="secondary">Voir les annonces</Button>
        </Link>
      </div>
    </div>
  );
}

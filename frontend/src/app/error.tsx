'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      {/* Error Icon */}
      <div className="mb-6 rounded-full bg-red-100 p-6">
        <span className="text-5xl">⚠️</span>
      </div>

      {/* Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Oups ! Une erreur est survenue</h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">
          Quelque chose s'est mal passé. Notre équipe a été notifiée.
        </p>

        {/* Error Details (Dev Only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mt-6 rounded-[16px] border border-red-300 bg-red-50 p-4 text-left">
            <p className="text-sm font-semibold text-red-700">Détails (développement)</p>
            <p className="mt-2 font-mono text-xs text-red-600">{error.message}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          onClick={() => reset()}
          className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          Réessayer
        </button>
        <Link href="/">
          <Button variant="secondary">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}

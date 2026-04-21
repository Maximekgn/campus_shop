'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AuthErrorPage(): ReactNode {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-full bg-orange-100 p-6">
        <span className="text-5xl">🔐</span>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Erreur d'authentification</h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">
          Une erreur s'est produite. Veuillez réessayer.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/login">
          <Button>Se connecter</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary">Retour</Button>
        </Link>
      </div>
    </div>
  );
}

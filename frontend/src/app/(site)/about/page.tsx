'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const values = [
  { title: 'Confiance',   desc: 'Une communauté vérifiée et modérée' },
  { title: 'Simplicité',  desc: "Interface intuitive et facile d'utilisation" },
  { title: 'Économie',    desc: 'Échanges équitables et transparents' },
  { title: 'Communauté',  desc: 'Entraide entre étudiants' },
];

const features = [
  'Créer et gérer tes annonces facilement',
  'Rechercher et filtrer par type, prix et catégorie',
  'Messagerie directe avec les autres utilisateurs',
  'Ajouter des favoris pour revenir plus tard',
  'Modération pour assurer la sécurité',
];

export default function AboutPage(): ReactNode {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="mb-14">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          À propos
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
          CampusShop
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
          Une plateforme de petites annonces conçue spécialement pour les étudiants —
          pour acheter, vendre et échanger facilement au sein de la communauté étudiante.
        </p>
      </div>

      {/* Values */}
      <section className="mb-14">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Nos valeurs
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-5"
            >
              <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-surface)]">
                <Check className="h-4 w-4 text-[var(--color-primary-dark)]" />
              </div>
              <p className="font-semibold text-[var(--color-foreground)]">{v.title}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-14">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)]">
          Fonctionnalités
        </h2>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-muted)]">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-dark)]" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <p className="font-semibold text-[var(--color-foreground)]">Besoin d'aide ?</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Consulte notre page de contact ou écris-nous à{' '}
          <span className="font-medium text-[var(--color-foreground)]">support@campusshop.tg</span>.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)] transition hover:opacity-70"
        >
          Nous contacter <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}

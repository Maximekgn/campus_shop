'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

export default function AboutPage(): ReactNode {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Link href="/">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-4">← Retour</button>
        </Link>
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">À propos de CampusShop</h1>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-3">Notre mission</h2>
          <p className="text-[var(--color-muted)] leading-relaxed">
            CampusShop est une plateforme de petites annonces conçue spécialement pour les étudiants. Nous
            facilitons l'achat, la vente et l'échange d'articles entre membres de la communauté étudiante.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-3">Nos valeurs</h2>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-[var(--color-primary)]">✓</span>
              <span className="text-[var(--color-muted)]"><strong>Confiance :</strong> Une communauté vérifiée et modérée</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-primary)]">✓</span>
              <span className="text-[var(--color-muted)]"><strong>Simplicité :</strong> Interface intuitive et facile d'utilisation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-primary)]">✓</span>
              <span className="text-[var(--color-muted)]"><strong>Économie :</strong> Échanges équitables et transparents</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-primary)]">✓</span>
              <span className="text-[var(--color-muted)]"><strong>Communauté :</strong> Entraide entre étudiants</span>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-3">Fonctionnalités principales</h2>
          <ul className="space-y-2">
            <li className="text-[var(--color-muted)]">• Créer et gérer tes annonces facilement</li>
            <li className="text-[var(--color-muted)]">• Rechercher et filtrer par type, prix et catégorie</li>
            <li className="text-[var(--color-muted)]">• Messagerie directe avec les autres utilisateurs</li>
            <li className="text-[var(--color-muted)]">• Ajouter des favoris pour revenir plus tard</li>
            <li className="text-[var(--color-muted)]">• Modération pour assurer la sécurité</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-3">Besoin d'aide ?</h2>
          <p className="text-[var(--color-muted)]">
            Consulte notre <Link href="/contact" className="text-[var(--color-primary)]">page de contact</Link> ou envoie un email à support@campusshop.tg
          </p>
        </section>
      </div>
    </div>
  );
}

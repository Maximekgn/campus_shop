'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

export default function TermsPage(): ReactNode {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Link href="/">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-4">← Retour</button>
        </Link>
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Conditions d'utilisation</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">Dernière mise à jour : avril 2026</p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">1. Acceptation des conditions</h2>
          <p className="text-[var(--color-muted)]">
            En utilisant CampusShop, tu acceptes ces conditions d'utilisation. Si tu n'acceptes pas, merci de ne
            pas utiliser notre service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">2. Inscription</h2>
          <p className="text-[var(--color-muted)]">
            Tu dois avoir au moins 18 ans et être étudiant pour utiliser CampusShop. Les informations que tu
            fournis doivent être exactes et à jour.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">3. Comportement attendu</h2>
          <p className="text-[var(--color-muted)] mb-2">Tu t'engages à :</p>
          <ul className="ml-4 space-y-1 text-[var(--color-muted)]">
            <li>• Être respectueux avec les autres utilisateurs</li>
            <li>• Ne pas poster de contenu offensant ou illégal</li>
            <li>• Ne pas spammer ou faire de publicité non autorisée</li>
            <li>• Respecter la propriété intellectuelle d'autrui</li>
            <li>• Signaler tout contenu problématique</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">4. Annonces</h2>
          <p className="text-[var(--color-muted)]">
            Les annonces doivent être légales et honnêtes. Les vendeurs sont responsables de la qualité et de
            l'exactitude de leurs annonces. CampusShop se réserve le droit de supprimer les annonces non conformes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">5. Responsabilité</h2>
          <p className="text-[var(--color-muted)]">
            CampusShop agit comme intermédiaire. Nous ne sommes pas responsables des transactions entre utilisateurs
            ou des différends qui en découleraient. Les transactions se font aux risques de chacun.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">6. Sanctions</h2>
          <p className="text-[var(--color-muted)]">
            Les violations peuvent entraîner la suppression d'annonces ou le bannissement du compte. Les recours
            pénaux peuvent être envisagés pour les actes graves.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">7. Modifications</h2>
          <p className="text-[var(--color-muted)]">
            CampusShop se réserve le droit de modifier ces conditions à tout moment. Tu seras notifié des
            modifications importantes.
          </p>
        </section>
      </div>
    </div>
  );
}

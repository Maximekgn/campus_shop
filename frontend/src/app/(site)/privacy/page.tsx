'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

export default function PrivacyPage(): ReactNode {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <Link href="/">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-4">← Retour</button>
        </Link>
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Politique de confidentialité</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">Dernière mise à jour : avril 2026</p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">1. Données collectées</h2>
          <p className="text-[var(--color-muted)] mb-2">
            Nous collectons les informations suivantes lors de ton inscription :
          </p>
          <ul className="ml-4 space-y-1 text-[var(--color-muted)]">
            <li>• Nom et prénom</li>
            <li>• Email</li>
            <li>• Numéro étudiant</li>
            <li>• Photos de profil et d'annonces</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">2. Utilisation des données</h2>
          <p className="text-[var(--color-muted)]">
            Tes données sont utilisées pour : créer ton compte, afficher ton profil, permettre la communication
            entre utilisateurs, améliorer nos services, et assurer la sécurité de la plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">3. Protection des données</h2>
          <p className="text-[var(--color-muted)]">
            Nous utilisons le chiffrement SSL/TLS et les meilleures pratiques pour protéger tes données. Tes
            données ne sont jamais partagées avec des tiers sans ton consentement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">4. Cookies</h2>
          <p className="text-[var(--color-muted)]">
            Nous utilisons des cookies pour améliorer ton expérience. Tu peux les désactiver dans les paramètres
            de ton navigateur, mais cela peut affecter les fonctionnalités.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">5. Tes droits</h2>
          <p className="text-[var(--color-muted)] mb-2">Tu as le droit de :</p>
          <ul className="ml-4 space-y-1 text-[var(--color-muted)]">
            <li>• Accéder à tes données</li>
            <li>• Corriger des données inexactes</li>
            <li>• Demander la suppression de ton compte</li>
            <li>• Exporter tes données</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">6. Contact</h2>
          <p className="text-[var(--color-muted)]">
            Pour toute question sur ta confidentialité, contacte-nous à privacy@campusshop.tg
          </p>
        </section>
      </div>
    </div>
  );
}

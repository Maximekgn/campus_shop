'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AdminNavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

const adminNavItems: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', shortLabel: 'Dashboard' },
  { href: '/admin/pending', label: 'Annonces en attente', shortLabel: 'En attente' },
  { href: '/admin/reports', label: 'Signalements', shortLabel: 'Signalements' },
  { href: '/admin/users', label: 'Utilisateurs', shortLabel: 'Utilisateurs' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside className="hidden w-80 shrink-0 rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 lg:sticky lg:top-6 lg:block lg:min-h-[78vh] xl:w-96">
        <div className="mb-8 border-b border-[var(--color-border)] pb-6">
          <p className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
            Admin
          </p>
          <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-[var(--color-foreground)]">Espace moderation</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Gere les annonces, signalements et membres depuis une navigation claire et separee.
          </p>
        </div>

        <nav className="space-y-3">
          {adminNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-5 py-4 text-base font-semibold transition ${
                  active
                    ? 'bg-[var(--color-primary)] text-white shadow-[var(--color-shadow)]'
                    : 'text-[var(--color-foreground)] hover:bg-white hover:shadow-[var(--color-shadow)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">Navigation</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Utilise le menu lateral pour passer d'une action admin a une autre sans revenir en arriere.
          </p>
        </div>
      </aside>

      <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 lg:hidden">
        {adminNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                active
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white text-[var(--color-foreground)]'
              }`}
            >
              {item.shortLabel}
            </Link>
          );
        })}
      </div>
    </>
  );
}

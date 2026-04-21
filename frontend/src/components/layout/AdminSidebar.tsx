'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Users,
  HelpCircle,
} from 'lucide-react';

type AdminNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
};

const adminNavItems: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pending', label: 'Annonces en attente', shortLabel: 'En attente', icon: ShieldAlert },
  { href: '/admin/reports', label: 'Signalements', shortLabel: 'Signalements', icon: BarChart3 },
  { href: '/admin/users', label: 'Utilisateurs', shortLabel: 'Utilisateurs', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (href: string): boolean => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside className="hidden w-80 shrink-0 rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 lg:sticky lg:top-6 lg:block lg:min-h-[78vh] xl:w-96">
        <div className="mb-8 rounded-[26px] border border-[var(--color-border)] bg-white p-5 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Admin
                </p>
                <h2 className="text-[1.5rem] font-semibold leading-tight text-[var(--color-foreground)]">
                  Espace moderation
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold text-[var(--color-foreground)] transition hover:border-[var(--color-primary)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Deconnexion
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
            Gere les annonces, les signalements et les membres depuis une navigation claire et separée.
          </p>
        </div>

        <nav className="space-y-3">
          {adminNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-base font-semibold transition ${
                  active
                    ? 'bg-[var(--color-primary)] text-white shadow-[var(--color-shadow)]'
                    : 'text-[var(--color-foreground)] hover:bg-white hover:shadow-[var(--color-shadow)]'
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

          <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--color-shadow)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">Navigation</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Utilise le menu lateral pour passer d'une action admin a une autre sans revenir en arriere.
            </p>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-foreground)]">
              <span>Raccourci</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-primary-dark)]">
                Parametres <Settings className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
              >
                <HelpCircle className="h-4 w-4" />
                Aide
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
              >
                <LogOut className="h-4 w-4" />
                Sortie
              </button>
            </div>
        </div>
      </aside>

      <div className="mb-4 space-y-2 lg:hidden">
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
          {adminNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white text-[var(--color-foreground)]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.shortLabel}
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-foreground)]"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </div>
    </>
  );
}

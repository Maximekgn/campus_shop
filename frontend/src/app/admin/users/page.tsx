'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/data/users';
import type { User } from '@/types';

export default function UsersPage(): ReactNode {
  const users = mockUsers as User[];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">← Retour</button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Gestion des membres</h1>
          <p className="mt-1 text-[var(--color-muted)]">{users.length} membre(s) inscrit(s)</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[28px] border border-[var(--color-border)] bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="px-6 py-4 text-left font-semibold text-[var(--color-foreground)]">Nom</th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--color-foreground)]">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--color-foreground)]">Rôle</th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--color-foreground)]">Annonces</th>
              <th className="px-6 py-4 text-left font-semibold text-[var(--color-foreground)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[var(--color-border)] transition hover:bg-[var(--color-soft)]">
                <td className="px-6 py-4 text-[var(--color-foreground)]">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-[var(--color-muted)]">ID: {user.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-[var(--color-foreground)]">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--color-primary-dark)]">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--color-foreground)]">
                  <span className="font-semibold">1</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-full border border-blue-500 px-3 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                      Voir profil
                    </button>
                    <button className="rounded-full border border-red-500 px-3 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                      Bannir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Utilisateurs actifs</p>
          <p className="mt-3 text-3xl font-bold text-[var(--color-primary)]">{users.length}</p>
        </div>
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Bannies</p>
          <p className="mt-3 text-3xl font-bold text-red-600">0</p>
        </div>
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Modérateurs</p>
          <p className="mt-3 text-3xl font-bold text-[var(--color-foreground)]">1</p>
        </div>
      </div>
    </div>
  );
}

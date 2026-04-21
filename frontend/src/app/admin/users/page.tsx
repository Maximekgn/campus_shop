'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { User } from '@/types';
import { moderationService } from '@/services/moderation.service';

export default function UsersPage(): ReactNode {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingCounters, setListingCounters] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const [usersData, counters] = await Promise.all([
          moderationService.getUsers(),
          moderationService.getUserListingsCount(),
        ]);

        if (!mounted) {
          return;
        }

        setUsers(usersData);
        setListingCounters(counters);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const activeUsers = users.filter((user) => user.is_active).length;
    const bannedUsers = users.filter((user) => !user.is_active).length;
    const moderators = users.filter((user) => user.role === 'moderateur').length;

    return { activeUsers, bannedUsers, moderators };
  }, [users]);

  const toggleUserStatus = async (userId: string) => {
    await moderationService.toggleUserStatus(userId);
    const refreshedUsers = await moderationService.getUsers();
    setUsers(refreshedUsers);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Gestion des membres</h1>
        <p className="mt-1 text-[var(--color-muted)]">{users.length} membre(s) inscrit(s)</p>
      </div>

      {loading && (
        <div className="mb-6 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
          Chargement des membres...
        </div>
      )}

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
                  <span className="font-semibold">{listingCounters[user.id] ?? 0}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-full border border-blue-500 px-3 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                      Voir profil
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                        user.is_active
                          ? 'border border-red-500 text-red-600 hover:bg-red-50'
                          : 'border border-green-500 text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {user.is_active ? 'Bannir' : 'Réactiver'}
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
          <p className="mt-3 text-3xl font-bold text-[var(--color-primary)]">{stats.activeUsers}</p>
        </div>
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Bannies</p>
          <p className="mt-3 text-3xl font-bold text-red-600">{stats.bannedUsers}</p>
        </div>
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm font-semibold uppercase text-[var(--color-muted)]">Modérateurs</p>
          <p className="mt-3 text-3xl font-bold text-[var(--color-foreground)]">{stats.moderators}</p>
        </div>
      </div>
    </div>
  );
}

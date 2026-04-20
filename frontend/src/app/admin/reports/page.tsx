'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { mockListings } from '@/data/listings';

interface Report {
  id: string;
  listing_id: string;
  reason: string;
  reporter_id: string;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
}

const mockReports: Report[] = [
  {
    id: 'r1',
    listing_id: 'l2',
    reason: 'Contenu inapproprié',
    reporter_id: 'u2',
    status: 'open',
    created_at: '2024-01-18T10:30:00',
  },
  {
    id: 'r2',
    listing_id: 'l3',
    reason: 'Prix non compétitif',
    reporter_id: 'u1',
    status: 'open',
    created_at: '2024-01-17T14:15:00',
  },
  {
    id: 'r3',
    listing_id: 'l1',
    reason: 'Photo trompeuse',
    reporter_id: 'u3',
    status: 'resolved',
    created_at: '2024-01-16T09:45:00',
  },
];

export default function ReportsPage(): ReactNode {
  const [reports, setReports] = useState<Report[]>(mockReports);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">Ouvert</span>;
      case 'resolved':
        return <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">Résolu</span>;
      case 'dismissed':
        return <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">Ignoré</span>;
      default:
        return null;
    }
  };

  const handleResolve = (reportId: string) => {
    setReports(reports.map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r)));
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">← Retour</button>
        </Link>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Signalements</h1>
          <p className="mt-1 text-[var(--color-muted)]">{reports.filter((r) => r.status === 'open').length} ouvert(s)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button className="rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-4 py-2 font-semibold text-[var(--color-primary)]">
          Tous
        </button>
        <button className="rounded-full border border-[var(--color-border)] px-4 py-2 font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]">
          Ouverts
        </button>
        <button className="rounded-full border border-[var(--color-border)] px-4 py-2 font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]">
          Résolus
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center">
            <p className="text-[var(--color-muted)]">Aucun signalement</p>
          </div>
        ) : (
          reports.map((report) => {
            const listing = mockListings.find((l) => l.id === report.listing_id);
            return (
              <div key={report.id} className="rounded-[28px] border border-[var(--color-border)] bg-white p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{listing?.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      Signalé par {report.reporter_id} • {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div className="mb-4 rounded-[20px] bg-[var(--color-soft)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">Raison</p>
                  <p className="mt-2 text-[var(--color-muted)]">{report.reason}</p>
                </div>

                <div className="flex gap-3">
                  <button className="rounded-full border border-green-500 px-6 py-2 font-semibold text-green-600 transition hover:bg-green-50">
                    ✓ Marquer résolu
                  </button>
                  <button className="rounded-full border border-[var(--color-border)] px-6 py-2 font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]">
                    Ignorer
                  </button>
                  <Link href={`/listings/${report.listing_id}`}>
                    <button className="rounded-full border border-[var(--color-border)] px-6 py-2 font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]">
                      Voir l'annonce
                    </button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

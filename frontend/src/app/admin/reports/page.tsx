'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { mockListings } from '@/data/listings';
import { AdminReport, moderationService } from '@/services/moderation.service';

export default function ReportsPage(): ReactNode {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadReports = async () => {
      try {
        const data = await moderationService.getReports();
        if (mounted) {
          setReports(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleReports = useMemo(() => {
    if (activeFilter === 'all') {
      return reports;
    }
    return reports.filter((report) => report.status === activeFilter);
  }, [activeFilter, reports]);

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

  const handleResolve = async (reportId: string) => {
    setBusyId(reportId);
    try {
      await moderationService.resolveReport(reportId, 'mask');
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r)));
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = async (reportId: string) => {
    setBusyId(reportId);
    try {
      await moderationService.resolveReport(reportId, 'dismiss');
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' as const } : r)));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Signalements</h1>
        <p className="mt-1 text-[var(--color-muted)]">{reports.filter((r) => r.status === 'open').length} ouvert(s)</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`rounded-full px-4 py-2 font-semibold transition ${
            activeFilter === 'all'
              ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
              : 'border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-soft)]'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setActiveFilter('open')}
          className={`rounded-full px-4 py-2 font-semibold transition ${
            activeFilter === 'open'
              ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
              : 'border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-soft)]'
          }`}
        >
          Ouverts
        </button>
        <button
          onClick={() => setActiveFilter('resolved')}
          className={`rounded-full px-4 py-2 font-semibold transition ${
            activeFilter === 'resolved'
              ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
              : 'border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-soft)]'
          }`}
        >
          Résolus
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center">
            <p className="text-[var(--color-muted)]">Chargement des signalements...</p>
          </div>
        ) : visibleReports.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-8 text-center">
            <p className="text-[var(--color-muted)]">Aucun signalement</p>
          </div>
        ) : (
          visibleReports.map((report) => {
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
                  <button
                    onClick={() => handleResolve(report.id)}
                    disabled={busyId === report.id || report.status !== 'open'}
                    className="rounded-full border border-green-500 px-6 py-2 font-semibold text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyId === report.id ? 'Traitement...' : '✓ Marquer résolu'}
                  </button>
                  <button
                    onClick={() => handleDismiss(report.id)}
                    disabled={busyId === report.id || report.status !== 'open'}
                    className="rounded-full border border-[var(--color-border)] px-6 py-2 font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
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

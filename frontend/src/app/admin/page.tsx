"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BarChart3,
  ChevronRight,
  Clock3,
  ListChecks,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mockListings } from "@/data/listings";
import { moderationService, type AdminReport } from "@/services/moderation.service";
import type { Listing } from "@/types";

type WeekdayPoint = {
  label: string;
  value: number;
};

const weekdayLabels = ["L", "Ma", "Me", "J", "V", "S", "D"];
const listingTypeLabels: Record<string, string> = {
  vente: "Vente",
  don: "Don",
  "échange": "Échange",
};

function formatRelativeTime(value: string): string {
  const now = Date.now();
  const createdAt = new Date(value).getTime();
  const deltaMinutes = Math.max(0, Math.floor((now - createdAt) / 60000));

  if (deltaMinutes < 60) {
    return `il y a ${deltaMinutes} min`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `il y a ${deltaHours} h`;
  }

  const deltaDays = Math.floor(deltaHours / 24);
  return `il y a ${deltaDays} j`;
}

function buildWeekSeries(entries: Array<{ created_at: string }>): WeekdayPoint[] {
  const counts = new Array(7).fill(0);

  entries.forEach((entry) => {
    const date = new Date(entry.created_at);
    const normalizedDay = (date.getDay() + 6) % 7;
    counts[normalizedDay] += 1;
  });

  return weekdayLabels.map((label, index) => ({ label, value: counts[index] }));
}

function getListingBadgeClass(type: string): string {
  switch (type) {
    case "vente":
      return "bg-[var(--color-primary-soft)] text-[var(--color-primary-dark)]";
    case "don":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-sky-50 text-sky-700";
  }
}

function getListingIcon(type: string): string {
  switch (type) {
    case "vente":
      return "V";
    case "don":
      return "D";
    default:
      return "E";
  }
}

export default function AdminDashboard(): ReactNode {
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [reportCount, setReportCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAdminData = async () => {
      try {
        const [overview, pending, reportItems] = await Promise.all([
          moderationService.getOverview(),
          moderationService.getPendingListings(),
          moderationService.getReports(),
        ]);

        if (!mounted) {
          return;
        }

        setReportCount(overview.openReportsCount);
        setUsersCount(overview.usersCount);
        setPendingListings(pending.data || []);
        setReports(reportItems);
      } catch (err) {
        console.error("Failed to load admin data:", err);
        setError(true);
        setPendingListings(
          mockListings
            .filter((listing) => listing.status !== "archivee")
            .slice(0, 5) as Listing[],
        );
        setReports([
          {
            id: 1,
            listing_id: 2,
            reason: "Contenu inapproprié",
            reporter_id: 2,
            status: "pending",
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            listing_id: 3,
            reason: "Prix suspect",
            reporter_id: 1,
            status: "pending",
            created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          },
        ]);
        setReportCount(2);
        setUsersCount(5);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      mounted = false;
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredListings = pendingListings.filter((listing) => {
    if (!normalizedQuery) {
      return true;
    }

    return [listing.title, listing.description, listing.type, listing.user_id.toString()]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  const recentActivityCount = pendingListings.filter((listing) => {
    const createdAt = new Date(listing.created_at).getTime();
    return Date.now() - createdAt <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  const reviewLoad = pendingListings.length + reportCount + usersCount;
  const workloadIndex = reviewLoad > 0 ? Math.min(100, Math.round((pendingListings.length / reviewLoad) * 100)) : 0;
  const activitySeries = buildWeekSeries([
    ...pendingListings.map((listing) => ({ created_at: listing.created_at })),
    ...reports.map((report) => ({ created_at: report.created_at })),
  ]);
  const maxSeriesValue = Math.max(...activitySeries.map((point) => point.value), 1);
  const topListing = filteredListings[0] ?? pendingListings[0] ?? null;
  const topReport = reports.find((report) => report.status === "pending") ?? reports[0] ?? null;
  const visibleQueue = filteredListings.slice(0, 5);
  const queueShare = pendingListings.length > 0 ? Math.round((visibleQueue.length / pendingListings.length) * 100) : 0;

  return (
    <div className="w-full space-y-6">
      <div className="rounded-[30px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--color-shadow)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
                Administration
              </span>
              {error ? (
                <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  Mode hors ligne
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              Tableau de bord modération
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-base">
              Suis les annonces à valider, les signalements ouverts et la charge de travail du jour depuis une vue plus dense et plus rapide à parcourir.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:min-w-[360px] xl:flex-col xl:items-stretch">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher une annonce"
                className="h-12 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-11 pr-4 text-sm text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-foreground)]"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-foreground)]"
                aria-label="Messages"
              >
                <Mail className="h-5 w-5" />
              </button>
              <div className="flex flex-1 items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 sm:flex-none">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-sm font-semibold text-[var(--color-primary-dark)]">
                  A
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                    Équipe modération
                  </p>
                  <p className="truncate text-xs text-[var(--color-muted)]">
                    Accès admin actif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 rounded-[20px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
            Chargement des données de modération...
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-primary)] p-6 text-white shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/80">Annonces en attente</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">{pendingListings.length}</p>
              <p className="mt-3 text-sm text-white/75">File prioritaire à traiter</p>
            </div>
            <div className="rounded-full bg-white/20 p-2 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">Signalements ouverts</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">{reportCount}</p>
              <p className="mt-3 text-sm text-[var(--color-muted)]">Demandes nécessitant une action</p>
            </div>
            <div className="rounded-full bg-[var(--color-primary-soft)] p-2 text-[var(--color-primary-dark)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">Utilisateurs</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">{usersCount}</p>
              <p className="mt-3 text-sm text-[var(--color-muted)]">Membres suivis par l’admin</p>
            </div>
            <div className="rounded-full bg-[var(--color-primary-soft)] p-2 text-[var(--color-primary-dark)]">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">Activité récente</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
                {recentActivityCount}
              </p>
              <p className="mt-3 text-sm text-[var(--color-muted)]">Publications des 7 derniers jours</p>
            </div>
            <div className="rounded-full bg-[var(--color-primary-soft)] p-2 text-[var(--color-primary-dark)]">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr_1fr]">
        <section className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
                Activité de modération
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Vue condensée des annonces et signalements ajoutés cette semaine.
              </p>
            </div>
            <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              7 jours
            </div>
          </div>

          <div className="mt-8 flex h-56 items-end gap-3 sm:gap-4">
            {activitySeries.map((point) => {
              const height = point.value > 0 ? Math.max(34, (point.value / maxSeriesValue) * 100) : 24;

              return (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-40 w-full items-end justify-center rounded-[22px] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),white)] p-2">
                    <div
                      className="w-full max-w-[46px] rounded-[18px] bg-[var(--color-primary)] shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-muted)]">{point.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                Priorité du jour
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Le prochain dossier à ouvrir rapidement.
              </p>
            </div>
            <div className="rounded-full bg-[var(--color-primary-soft)] p-2 text-[var(--color-primary-dark)]">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            {topReport ? (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Signalement prioritaire
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-[var(--color-foreground)]">
                  {topReport.reason}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  Signalement #{topReport.id} sur l’annonce #{topReport.listing_id} • {formatRelativeTime(topReport.created_at)}
                </p>
                {topListing ? (
                  <p className="mt-3 text-sm text-[var(--color-muted)]">
                    Annonce liée: {topListing.title}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Aucun signalement critique
                </p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-[var(--color-foreground)]">
                  La file reste concentrée sur les annonces à valider.
                </h3>
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  Les prochains dossiers s’affichent ci-dessous.
                </p>
                {topListing ? (
                  <p className="mt-3 text-sm text-[var(--color-muted)]">
                    Prochain dossier suggéré: {topListing.title}
                  </p>
                ) : null}
              </>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/admin/reports">Ouvrir le dossier</Link>
              </Button>
              <Button asChild variant="outline-primary">
                <Link href="/admin/pending">Valider la file</Link>
              </Button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-[18px] border border-[var(--color-border)] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-foreground)]">Charge active</p>
                <p className="text-sm text-[var(--color-muted)]">Indice basé sur les dossiers en attente</p>
              </div>
              <span className="text-lg font-semibold text-[var(--color-foreground)]">{workloadIndex}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${workloadIndex}%` }} />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                File à traiter
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {searchQuery ? `Résultats filtrés pour « ${searchQuery} »` : "Les cinq prochaines annonces visibles dans la file."}
              </p>
            </div>
            <Button asChild variant="ghost-primary" size="sm">
              <Link href="/admin/pending">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle tâche
              </Link>
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {visibleQueue.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm text-[var(--color-muted)]">
                Aucun résultat ne correspond à la recherche actuelle.
              </div>
            ) : (
              visibleQueue.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/admin/pending/${listing.id}`}
                  className="group flex items-center justify-between rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-white"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[var(--color-primary-dark)] shadow-sm">
                      {getListingIcon(listing.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-[var(--color-foreground)]">{listing.title}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getListingBadgeClass(listing.type)}`}>
                          {listingTypeLabels[listing.type] ?? listing.type}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Utilisateur #{listing.user_id} • {formatRelativeTime(listing.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-3 flex items-center gap-2 text-[var(--color-muted)] transition group-hover:text-[var(--color-foreground)]">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-5 rounded-[20px] border border-[var(--color-border)] bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--color-foreground)]">Couverture de la file</p>
                <p className="text-sm text-[var(--color-muted)]">{queueShare}% des annonces visibles dans le panneau</p>
              </div>
              <ListChecks className="h-5 w-5 text-[var(--color-primary-dark)]" />
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                Dernières annonces surveillées
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Raccourci vers les dossiers les plus récents ou les plus visibles.
              </p>
            </div>
            <Button asChild variant="outline-primary" size="sm">
              <Link href="/admin/users">
                Voir les membres
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {pendingListings.slice(0, 4).map((listing) => (
              <div
                key={listing.id}
                className="rounded-[22px] border border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface),white)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {listing.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      #{listing.id} • {formatRelativeTime(listing.created_at)}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getListingBadgeClass(listing.type)}`}>
                    {listingTypeLabels[listing.type] ?? listing.type}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-muted)]">
                  <span>Publié par utilisateur #{listing.user_id}</span>
                  <span>{listing.views_count} vues</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-[var(--color-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                Répartition de la file
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Un indicateur simple pour visualiser la pression courante.
              </p>
            </div>
            <div className="rounded-full bg-[var(--color-primary-soft)] p-2 text-[var(--color-primary-dark)]">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-[16px] border-[var(--color-surface)] border-t-[var(--color-primary)] border-r-[var(--color-primary)] border-b-[var(--color-border)] border-l-[var(--color-primary-soft)]">
              <div className="text-center">
                <p className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
                  {workloadIndex}%
                </p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  charge active
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-[var(--color-muted)]">
            <div className="flex items-center justify-between rounded-[18px] bg-[var(--color-surface)] px-4 py-3">
              <span>Annonces en attente</span>
              <span className="font-semibold text-[var(--color-foreground)]">{pendingListings.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-[18px] bg-[var(--color-surface)] px-4 py-3">
              <span>Signalements ouverts</span>
              <span className="font-semibold text-[var(--color-foreground)]">{reportCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-[18px] bg-[var(--color-surface)] px-4 py-3">
              <span>Résultats visibles</span>
              <span className="font-semibold text-[var(--color-foreground)]">{visibleQueue.length}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

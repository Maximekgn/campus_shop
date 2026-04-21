import { Listing, User, ListingStatus } from '../types';
import { mockListings } from '../data/listings';
import { mockUsers } from '../data/users';

export type AdminReportStatus = 'open' | 'resolved' | 'dismissed';

export interface AdminReport {
  id: string;
  listing_id: string;
  reason: string;
  reporter_id: string;
  status: AdminReportStatus;
  created_at: string;
}

type AdminStore = {
  pendingIds: string[];
  reports: AdminReport[];
  users: User[];
  listingNotes: Record<string, string>;
};

const ADMIN_STORE_KEY = 'campusshop_admin_store_v1';

const initialReports: AdminReport[] = [
  {
    id: 'r1',
    listing_id: 'l2',
    reason: 'Contenu inapproprie',
    reporter_id: 'u2',
    status: 'open',
    created_at: '2026-04-18T10:30:00',
  },
  {
    id: 'r2',
    listing_id: 'l3',
    reason: 'Prix suspect pour la categorie',
    reporter_id: 'u1',
    status: 'open',
    created_at: '2026-04-17T14:15:00',
  },
  {
    id: 'r3',
    listing_id: 'l1',
    reason: 'Photo trompeuse',
    reporter_id: 'u3',
    status: 'resolved',
    created_at: '2026-04-16T09:45:00',
  },
];

function buildInitialStore(): AdminStore {
  return {
    pendingIds: mockListings
      .filter((listing) => listing.status !== ListingStatus.ARCHIVED)
      .map((listing) => listing.id),
    reports: initialReports,
    users: mockUsers,
    listingNotes: {},
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readStore(): AdminStore {
  if (!isBrowser()) {
    return clone(buildInitialStore());
  }

  const raw = window.localStorage.getItem(ADMIN_STORE_KEY);
  if (!raw) {
    const initial = buildInitialStore();
    window.localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(initial));
    return clone(initial);
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AdminStore>;
    const fallback = buildInitialStore();
    const safeStore: AdminStore = {
      pendingIds: Array.isArray(parsed.pendingIds) ? parsed.pendingIds : fallback.pendingIds,
      reports: Array.isArray(parsed.reports) ? parsed.reports : fallback.reports,
      users: Array.isArray(parsed.users) ? parsed.users : fallback.users,
      listingNotes:
        parsed.listingNotes && typeof parsed.listingNotes === 'object'
          ? parsed.listingNotes
          : fallback.listingNotes,
    };
    return clone(safeStore);
  } catch {
    return clone(buildInitialStore());
  }
}

function writeStore(store: AdminStore): void {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(store));
}

function getListingById(id: string): Listing | undefined {
  return mockListings.find((listing) => listing.id === id);
}

function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

function withLatency<T>(value: T, delay = 120): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });
}

export const moderationService = {
  getPendingListings: async (): Promise<Listing[]> => {
    const store = readStore();
    const listings = store.pendingIds
      .map((id) => getListingById(id))
      .filter((listing): listing is Listing => Boolean(listing));
    return withLatency(clone(listings));
  },
  getPendingListingById: async (id: string): Promise<Listing | null> => {
    const store = readStore();
    if (!store.pendingIds.includes(id)) {
      return withLatency(null);
    }
    const listing = getListingById(id);
    return withLatency(listing ? clone(listing) : null);
  },
  getListingModeratorNote: async (listingId: string): Promise<string> => {
    const store = readStore();
    return withLatency(store.listingNotes[listingId] ?? '', 60);
  },
  saveListingModeratorNote: async (listingId: string, note: string): Promise<void> => {
    const store = readStore();
    store.listingNotes[listingId] = note;
    writeStore(store);
    return withLatency(undefined, 60);
  },
  approveListing: async (id: string): Promise<void> => {
    const store = readStore();
    store.pendingIds = store.pendingIds.filter((listingId) => listingId !== id);
    writeStore(store);
    return withLatency(undefined);
  },
  rejectListing: async (id: string, reason: string): Promise<void> => {
    const store = readStore();
    store.pendingIds = store.pendingIds.filter((listingId) => listingId !== id);
    store.listingNotes[id] = reason;
    writeStore(store);
    return withLatency(undefined);
  },
  getReports: async (): Promise<AdminReport[]> => {
    const store = readStore();
    return withLatency(clone(store.reports));
  },
  resolveReport: async (id: string, action: 'mask' | 'dismiss' | 'ban'): Promise<void> => {
    const store = readStore();
    const report = store.reports.find((item) => item.id === id);
    if (!report) {
      return withLatency(undefined);
    }

    if (action === 'dismiss') {
      report.status = 'dismissed';
    } else {
      report.status = 'resolved';
    }

    if (action === 'ban') {
      const user = store.users.find((item) => item.id === report.reporter_id);
      if (user) {
        user.is_active = false;
      }
    }

    writeStore(store);
    return withLatency(undefined);
  },
  getUsers: async (): Promise<User[]> => {
    const store = readStore();
    return withLatency(clone(store.users), 80);
  },
  toggleUserStatus: async (id: string): Promise<User | null> => {
    const store = readStore();
    const user = store.users.find((item) => item.id === id);
    if (!user) {
      return withLatency(null);
    }
    user.is_active = !user.is_active;
    writeStore(store);
    return withLatency(clone(user), 80);
  },
  getUserListingsCount: async (): Promise<Record<string, number>> => {
    const counters = mockListings.reduce<Record<string, number>>((acc, listing) => {
      acc[listing.user_id] = (acc[listing.user_id] ?? 0) + 1;
      return acc;
    }, {});
    return withLatency(counters, 80);
  },
  getOverview: async (): Promise<{
    pendingCount: number;
    openReportsCount: number;
    usersCount: number;
  }> => {
    const store = readStore();
    return withLatency(
      {
        pendingCount: store.pendingIds.length,
        openReportsCount: store.reports.filter((report) => report.status === 'open').length,
        usersCount: store.users.length,
      },
      80
    );
  },
  getBannedUsers: async (): Promise<User[]> => {
    const store = readStore();
    return withLatency(store.users.filter((user) => !user.is_active), 80);
  },
  getSellerForListing: async (listingId: string): Promise<User | null> => {
    const listing = getListingById(listingId);
    if (!listing) {
      return withLatency(null, 60);
    }
    const seller = getUserById(listing.user_id) ?? null;
    return withLatency(seller ? clone(seller) : null, 60);
  },
};

import { api } from './api';
import { Listing, User } from '../types';
import { mockListings } from '../data/listings';
import { mockUsers } from '../data/users';

export type AdminReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface AdminReport {
  id: number;
  listing_id: number;
  reason: string;
  reporter_id: number;
  status: AdminReportStatus;
  created_at: string;
}

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    return await api.get(path);
  } catch {
    return null;
  }
}

async function postApi(path: string, data?: unknown): Promise<boolean> {
  try {
    await api.post(path, data);
    return true;
  } catch {
    return false;
  }
}

export const moderationService = {
  getPendingListings: async (): Promise<{ data: Listing[] }> => {
    const data = await fetchApi<{ data: Listing[] }>('/moderation/pending');
    if (data) return data;
    
    return {
      data: mockListings.filter((l) => l.status !== 'archivee').slice(0, 5) as Listing[]
    };
  },

  getPendingListingById: async (id: number): Promise<Listing | null> => {
    const allListings = await moderationService.getPendingListings();
    return (allListings.data || []).find((l) => l.id === id) || null;
  },

  approveListing: async (id: number): Promise<boolean> => {
    const success = await postApi(`/moderation/listings/${id}/approve`);
    return success;
  },

  rejectListing: async (id: number, reason?: string): Promise<boolean> => {
    const success = await postApi(`/moderation/listings/${id}/reject`, { reason });
    return success;
  },

  getReports: async (): Promise<AdminReport[]> => {
    const data = await fetchApi<{ data: AdminReport[] }>('/moderation/reports');
    if (data) return data.data;
    
    return [
      { id: 1, listing_id: 2, reason: 'Contenu inapproprié', reporter_id: 2, status: 'pending', created_at: '2026-04-18T10:30:00' },
      { id: 2, listing_id: 3, reason: 'Prix suspect', reporter_id: 1, status: 'pending', created_at: '2026-04-17T14:15:00' },
    ];
  },

  resolveReport: async (id: number, action: 'hide' | 'warn' | 'delete'): Promise<boolean> => {
    const success = await postApi(`/moderation/reports/${id}`, { action });
    return success;
  },

  getUsers: async (): Promise<User[]> => {
    const data = await fetchApi<{ data: User[] }>('/moderation/users');
    if (data) return data.data;
    
    return mockUsers as User[];
  },

  getUserListingsCount: async (): Promise<Record<string, number>> => {
    const data = await fetchApi<Record<string, number>>('/moderation/users/counts');
    return data || {};
  },

  toggleUserStatus: async (id: string): Promise<boolean> => {
    const user = await moderationService.getUsers().then(users => users.find(u => u.id.toString() === id));
    if (!user) return false;
    
    if (user.is_active) {
      return postApi(`/moderation/users/${id}/ban`, { ban_until: '2026-05-01' });
    } else {
      return postApi(`/moderation/users/${id}/unban`);
    }
  },

  banUser: async (id: number): Promise<boolean> => {
    const success = await postApi(`/moderation/users/${id}/ban`);
    return success;
  },

  unbanUser: async (id: number): Promise<boolean> => {
    const success = await postApi(`/moderation/users/${id}/unban`);
    return success;
  },

  getListingModeratorNote: async (listingId: number): Promise<string> => {
    const data = await fetchApi<{ note: string }>(`/moderation/listings/${listingId}/note`);
    return data?.note || '';
  },

  saveListingModeratorNote: async (listingId: number, note: string): Promise<boolean> => {
    return postApi(`/moderation/listings/${listingId}/note`, { note });
  },

  getSellerForListing: async (listingId: number): Promise<User | null> => {
    const data = await fetchApi<{ seller: User }>(`/moderation/listings/${listingId}/seller`);
    return data?.seller || null;
  },

  getOverview: async (): Promise<{ pendingCount: number; openReportsCount: number; usersCount: number }> => {
    const [pending, reports, users] = await Promise.all([
      moderationService.getPendingListings(),
      moderationService.getReports(),
      moderationService.getUsers(),
    ]);

    return {
      pendingCount: pending.data?.length || pending.length,
      openReportsCount: reports.filter((r) => r.status === 'pending').length,
      usersCount: users.length,
    };
  },
};
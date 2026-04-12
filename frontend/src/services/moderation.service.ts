import { Listing, Report, User, ListingStatus } from '../types';
import { mockListings } from '../data/listings';
import { mockUsers } from '../data/users';

export const moderationService = {
  getPendingListings: async (): Promise<Listing[]> => {
    return mockListings.filter(l => l.status === ListingStatus.PUBLISHED); // Simuler des annonces à valider
  },
  approveListing: async (id: string): Promise<void> => {
    console.log('Approved', id);
  },
  rejectListing: async (id: string, reason: string): Promise<void> => {
    console.log('Rejected', id, reason);
  },
  getReports: async (): Promise<Report[]> => {
    return [];
  },
  resolveReport: async (id: string, action: 'mask' | 'dismiss' | 'ban'): Promise<void> => {
    console.log('Resolved report', id, action);
  },
  getBannedUsers: async (): Promise<User[]> => {
    return mockUsers.filter(u => !u.is_active);
  }
};

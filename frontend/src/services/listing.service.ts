import { Listing, ListingType, ListingStatus } from '../types';
import { mockListings } from '../data/listings';

export const listingService = {
  getListings: async (filters: any): Promise<Listing[]> => {
    return mockListings;
  },
  getListingById: async (id: string): Promise<Listing | null> => {
    return mockListings.find(l => l.id === id) || null;
  },
  getMyListings: async (): Promise<Listing[]> => {
    return mockListings.filter(l => l.user_id === 'u1'); // Simuler l'utilisateur u1
  },
  createListing: async (data: any): Promise<Listing> => {
    return { ...data, id: Math.random().toString() } as Listing;
  },
  updateListing: async (id: string, data: any): Promise<Listing> => {
    return { ...data, id } as Listing;
  },
  deleteListing: async (id: string): Promise<void> => {
    console.log('Deleted listing', id);
  },
  updateStatus: async (id: string, status: ListingStatus): Promise<void> => {
    console.log('Updated status', id, status);
  },
  toggleFavorite: async (id: string): Promise<void> => {
    console.log('Toggled favorite', id);
  },
  reportListing: async (id: string, reason: string): Promise<void> => {
    console.log('Reported listing', id, reason);
  }
};

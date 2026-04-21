import { api } from './api';
import { Listing, ListingType, ListingStatus } from '../types';

export interface ListingFilters {
  q?: string;
  type?: ListingType;
  price_min?: number;
  price_max?: number;
  categories?: string;
  sort?: 'recent' | 'price_asc' | 'price_desc' | 'popular';
  per_page?: number;
  page?: number;
}

export const listingService = {
  getAll: async (filters: ListingFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const query = params.toString();
    return api.get(`/listings${query ? `?${query}` : ''}`);
  },

  getById: async (id: number) => {
    const data = await api.get(`/listings/${id}`);
    return data.listing as Listing;
  },

  create: async (data: {
    title: string;
    description: string;
    type: ListingType;
    price?: number | null;
    categories?: number[];
  }) => {
    return api.post('/listings', data);
  },

  update: async (id: number, data: Partial<Listing>) => {
    return api.put(`/listings/${id}`, data);
  },

  delete: async (id: number) => {
    return api.delete(`/listings/${id}`);
  },

  getMyListings: async (perPage = 15) => {
    return api.get(`/my-listings?per_page=${perPage}`);
  },

  toggleFavorite: async (listingId: number) => {
    return api.post(`/listings/${listingId}/favorite`);
  },

  getFavorites: async (perPage = 15) => {
    return api.get(`/favorites?per_page=${perPage}`);
  },
};
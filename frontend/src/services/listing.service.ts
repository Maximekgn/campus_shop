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
    photos?: File[];
    force_create?: boolean;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);
    if (data.price != null) formData.append('price', String(data.price));
    if (data.categories) data.categories.forEach(c => formData.append('categories[]', String(c)));
    if (data.force_create) formData.append('force_create', 'true');
    
    const response = await api.post('/listings', formData);
    
    // Upload photos sequentially to the dedicated endpoint after creation
    if (response.listing && response.listing.id && data.photos && data.photos.length > 0) {
      const photosFormData = new FormData();
      data.photos.forEach(p => photosFormData.append('photos[]', p));
      await api.post(`/listings/${response.listing.id}/photos`, photosFormData);
    }
    
    return response;
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

  toggleStatus: async (id: number, status: string) => {
    return api.put(`/listings/${id}/status`, { status });
  },

  report: async (id: number, reason: string) => {
    return api.post(`/listings/${id}/report`, { reason });
  },
};
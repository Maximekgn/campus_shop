import { api } from './api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories');
      return response.data || response;
    } catch {
      return [];
    }
  },

  getById: async (id: number): Promise<Category> => {
    return api.get(`/categories/${id}`);
  },
};
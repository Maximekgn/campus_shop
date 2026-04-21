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
      return await api.get('/categories');
    } catch {
      return [];
    }
  },

  getById: async (id: number): Promise<Category> => {
    return api.get(`/categories/${id}`);
  },
};
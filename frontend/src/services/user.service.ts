import { api } from './api';
import { User } from '../types';

export interface UserProfile {
  id: number;
  name: string;
  created_at: string;
  last_seen_at: string | null;
  is_active: boolean;
}

export interface UserStats {
  published_listings_count: number;
  sold_listings_count: number;
  response_rate_percent: number | null;
  registration_date: string;
}

export interface UserProfileResponse {
  user: UserProfile;
  stats: UserStats;
}

export const userService = {
  getProfile: async (id: number): Promise<UserProfileResponse> => {
    return api.get(`/users/${id}`);
  },
};
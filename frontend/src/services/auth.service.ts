import { api } from './api';
import { User, LoginCredentials, RegisterCredentials } from '../types';

interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Erreur de connexion' }));
      throw new Error(error.message);
    }
    const data = await res.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Erreur d'inscription" }));
      throw new Error(error.message);
    }
    const response = await res.json();
    localStorage.setItem('auth_token', response.token);
    return response;
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 
            'Accept': 'application/json',
            Authorization: `Bearer ${token}` 
          },
        });
      } finally {
        localStorage.removeItem('auth_token');
      }
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      localStorage.removeItem('auth_token');
      return null;
    }
    const data = await res.json();
    return data.user;
  },
};
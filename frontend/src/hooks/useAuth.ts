'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/data/users';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('current_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);

          const token = localStorage.getItem('auth_token') ?? `mock_token_${Date.now()}`;
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `auth_role=${userData.role}; path=/; max-age=86400; SameSite=Lax`;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const matchedUser = mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
      if (!matchedUser || !password.trim()) {
        return { success: false, error: 'Identifiants invalides' };
      }

      const authUser: AuthUser = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      };

      const token = 'mock_token_' + Date.now();
      localStorage.setItem('current_user', JSON.stringify(authUser));
      localStorage.setItem('auth_token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `auth_role=${authUser.role}; path=/; max-age=86400; SameSite=Lax`;
      setUser(authUser);
      setIsAuthenticated(true);
      return { success: true, user: authUser };
    } catch (error) {
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      if (!password.trim()) {
        return { success: false, error: 'Mot de passe requis' };
      }

      const mockUser: AuthUser = {
        id: 'u_new',
        name,
        email,
        role: 'member',
      };

      const token = 'mock_token_' + Date.now();
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', token);
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = 'auth_role=member; path=/; max-age=86400; SameSite=Lax';
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  };
}

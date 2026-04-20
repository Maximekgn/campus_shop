'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    // Simulé : récupérer l'utilisateur depuis le localStorage ou les cookies
    const checkAuth = async () => {
      try {
        // TODO: Remplacer par un appel API réel
        const storedUser = localStorage.getItem('current_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
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
      // TODO: Appel API réel
      const mockUser: AuthUser = {
        id: 'u1',
        name: 'Jean Dupont',
        email,
        role: 'member',
      };
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // TODO: Appel API réel
      const mockUser: AuthUser = {
        id: 'u_new',
        name,
        email,
        role: 'member',
      };
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
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

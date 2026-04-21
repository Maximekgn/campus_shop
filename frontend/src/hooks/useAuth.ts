'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export interface AuthUser {
  id: number;
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
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser({ id: userData.id, name: userData.name, email: userData.email, role: userData.role });
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser({ id: response.user.id, name: response.user.name, email: response.user.email, role: response.user.role });
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string, studentId?: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ name, email, password, password_confirmation: passwordConfirmation, student_id: studentId });
      setUser({ id: response.user.id, name: response.user.name, email: response.user.email, role: response.user.role });
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, isAuthenticated, login, logout, register };
}
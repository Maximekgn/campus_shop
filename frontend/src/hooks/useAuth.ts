'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const { user, isLoading, isAuthenticated, login, logout, register, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isAuthenticated) {
      checkAuth();
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    logout: handleLogout, 
    register 
  };
}
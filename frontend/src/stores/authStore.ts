import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (name: string, email: string, password: string, passwordConfirmation: string, studentId?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true, user: response.user };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: String(error) };
        }
      },

      register: async (name: string, email: string, password: string, passwordConfirmation: string, studentId?: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.register({ 
            name, 
            email, 
            password, 
            password_confirmation: passwordConfirmation,
            student_id: studentId 
          });
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: String(error) };
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            document.cookie = `auth_role=${userData.role};path=/;max-age=${60 * 60 * 24 * 7}`;
          }
          set({ 
            user: userData, 
            isAuthenticated: !!userData, 
            isLoading: false 
          });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
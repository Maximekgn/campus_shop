import { User, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Logic for login
  },
  register: async (data: RegisterCredentials) => {
    // Logic for registration
  },
  logout: () => {
    // Logic for logout
  },
  getCurrentUser: (): User | null => {
    return null;
  }
};

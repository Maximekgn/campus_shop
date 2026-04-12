import { User, LoginCredentials, RegisterCredentials } from '../types';
import { mockUsers } from '../data/users';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    return mockUsers[0]; // Simuler une connexion réussie
  },
  register: async (data: RegisterCredentials) => {
    return mockUsers[0];
  },
  logout: () => {
    console.log('Logged out');
  },
  getCurrentUser: (): User | null => {
    return mockUsers[0];
  }
};

import { api } from './api';

export const emailVerificationService = {
  resendVerification: async (): Promise<{ message: string }> => {
    return api.post('/email/resend');
  },

  verify: async (id: number, hash: string): Promise<{ message: string }> => {
    return api.post(`/email/verify/${id}/${hash}`);
  },
};
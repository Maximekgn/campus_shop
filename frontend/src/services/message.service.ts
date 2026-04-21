import { api } from './api';
import { Conversation, Message } from '../types';

export const messageService = {
  getConversations: async (perPage = 20) => {
    return api.get(`/conversations?per_page=${perPage}`);
  },

  getConversation: async (id: number) => {
    const data = await api.get(`/conversations/${id}`);
    return data.conversation as Conversation;
  },

  createConversation: async (listingId: number) => {
    return api.post('/conversations', { listing_id: listingId });
  },

  sendMessage: async (conversationId: number, body: string) => {
    return api.post(`/conversations/${conversationId}/messages`, { body });
  },

  getUnreadCount: async () => {
    const data = await api.get('/conversations/unread-count');
    return data.unread_count as number;
  },
};
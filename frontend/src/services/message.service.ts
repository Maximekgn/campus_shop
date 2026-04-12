import { Conversation, Message } from '../types';

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    return [];
  },
  getMessages: async (conversationId: string): Promise<Message[]> => {
    return [];
  },
  sendMessage: async (conversationId: string, body: string): Promise<Message> => {
    return {} as Message;
  },
  startConversation: async (listingId: string, message: string): Promise<Conversation> => {
    return {} as Conversation;
  },
  markAsRead: async (conversationId: string): Promise<void> => {
    // Logic to mark as read
  }
};

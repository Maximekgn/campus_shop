import { Conversation, Message } from '../types';
import { mockConversations, mockMessages } from '../data/messages';

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    return mockConversations;
  },
  getMessages: async (conversationId: string): Promise<Message[]> => {
    return mockMessages.filter(m => m.conversation_id === conversationId);
  },
  sendMessage: async (conversationId: string, body: string): Promise<Message> => {
    const newMessage: Message = {
      id: Math.random().toString(),
      conversation_id: conversationId,
      sender_id: 'u1',
      body,
      read_at: null,
      created_at: new Date().toISOString()
    };
    return newMessage;
  },
  startConversation: async (listingId: string, message: string): Promise<Conversation> => {
    return mockConversations[0];
  },
  markAsRead: async (conversationId: string): Promise<void> => {
    console.log('Marked as read', conversationId);
  }
};

import { Conversation, Message } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    listing_id: 'l1',
    buyer_id: 'u3',
    seller_id: 'u1',
    last_message_at: new Date().toISOString(),
    last_message: 'Est-ce que le livre est toujours disponible ?',
    unread_count: 1
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    conversation_id: 'c1',
    sender_id: 'u3',
    body: 'Est-ce que le livre est toujours disponible ?',
    read_at: null,
    created_at: new Date().toISOString()
  }
];

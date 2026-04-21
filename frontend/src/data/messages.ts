export const mockConversations = [
  {
    id: 1,
    listing_id: 1,
    buyer_id: 3,
    seller_id: 1,
    last_message_at: new Date().toISOString(),
    last_message: 'Est-ce que le livre est toujours disponible ?',
    unread_count: 1,
  },
];

export const mockMessages = [
  {
    id: 1,
    conversation_id: 1,
    sender_id: 3,
    body: 'Est-ce que le livre est toujours disponible ?',
    read_at: null,
    created_at: new Date().toISOString(),
  },
];
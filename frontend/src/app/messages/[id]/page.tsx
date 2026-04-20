'use client';

import { ChangeEvent, FormEvent, useState, ReactNode } from 'react';
import { mockConversations, mockMessages } from '@/data/messages';
import { mockListings } from '@/data/listings';
import { mockUsers } from '@/data/users';
import type { Conversation, Message } from '@/types';

type ConversationDetailPageProps = {
  params: { id: string };
};

export default function ConversationDetailPage({ params }: ConversationDetailPageProps): ReactNode {
  const conversation = mockConversations.find((c) => c.id === params.id) as Conversation | undefined;
  const messages = (mockMessages.filter((m) => m.conversation_id === params.id) || []) as Message[];
  
  const [messageInput, setMessageInput] = useState('');
  const [localMessages, setLocalMessages] = useState(messages);

  if (!conversation) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 text-center">
        <p className="text-[var(--color-muted)]">Conversation introuvable</p>
      </div>
    );
  }

  const listing = mockListings.find((l) => l.id === conversation.listing_id);
  const otherUser = conversation.buyer_id === 'u1' ? mockUsers.find((u) => u.id === conversation.seller_id) : mockUsers.find((u) => u.id === conversation.buyer_id);
  const currentUser = mockUsers.find((u) => u.id === 'u1');

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: params.id,
      sender_id: 'u1',
      body: messageInput,
      read_at: null,
      created_at: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 rounded-[28px] border border-[var(--color-border)] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
              {otherUser?.name || 'Utilisateur'}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              À propos de : <strong>{listing?.title}</strong>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
              {listing?.price != null ? `${listing.price} FCFA` : 'Gratuit'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="mb-6 flex h-96 flex-col rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {localMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-[var(--color-muted)]">Aucun message pour l'instant. Commence la conversation !</p>
            </div>
          ) : (
            localMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === 'u1' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-[16px] px-4 py-3 text-sm ${
                    msg.sender_id === 'u1'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'border border-[var(--color-border)] bg-white text-[var(--color-foreground)]'
                  }`}
                >
                  <p>{msg.body}</p>
                  <p
                    className={`mt-1 text-xs ${
                      msg.sender_id === 'u1' ? 'text-white/70' : 'text-[var(--color-muted)]'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={messageInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageInput(e.target.value)}
          placeholder="Écris un message..."
          className="flex-1 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
        />
        <button
          type="submit"
          className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

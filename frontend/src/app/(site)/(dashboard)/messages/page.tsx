'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { mockConversations } from '@/data/messages';
import { mockListings } from '@/data/listings';
import { mockUsers } from '@/data/users';
import type { Conversation } from '@/types';

export default function MessagesPage(): ReactNode {
  const conversations = mockConversations as Conversation[];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">Mes messages</h1>
        <p className="mt-1 text-[var(--color-muted)]">
          {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
          <p className="text-lg text-[var(--color-muted)]">
            Aucune conversation pour l'instant
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const listing = mockListings.find((l) => l.id === conv.listing_id);
            const otherUser = conv.buyer_id === 'u1' ? mockUsers.find((u) => u.id === conv.seller_id) : mockUsers.find((u) => u.id === conv.buyer_id);

            return (
              <Link key={conv.id} href={`/messages/${conv.id}`}>
                <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-4 transition hover:border-[var(--color-primary)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--color-foreground)]">
                        {otherUser?.name || 'Utilisateur'}
                      </p>
                      <p className="text-sm text-[var(--color-muted)]">
                        Annonce: {listing?.title}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                        {conv.last_message || 'Pas de message'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--color-muted)]">
                        {new Date(conv.last_message_at).toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {conv.unread_count && conv.unread_count > 0 && (
                        <div className="mt-2 inline-flex rounded-full bg-[var(--color-primary)] px-2 py-1 text-xs font-semibold text-white">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


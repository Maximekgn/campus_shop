"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { messageService } from "@/services/message.service";
import { mockConversations } from "@/data/messages";
import { mockListings } from "@/data/listings";
import { mockUsers } from "@/data/users";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Conversation } from "@/types";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    messageService
      .getConversations()
      .then((data) => setConversations(data.data || data))
      .catch(() => { setError(true); setConversations(mockConversations as Conversation[]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Messages
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Offline */}
      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Mode hors ligne — données limitées.
        </div>
      )}

      {/* Empty state */}
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] py-24 text-center">
          <MessageCircle className="mb-4 h-8 w-8 text-[var(--color-border)]" />
          <p className="text-base font-medium text-[var(--color-foreground)]">
            Aucun message
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Contacte un vendeur depuis une annonce pour démarrer une conversation.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-foreground)] hover:opacity-70 transition"
          >
            Voir les annonces <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
          {conversations.map((conv) => {
            const listing = mockListings.find(
              (l) => String(l.id) === String(conv.listing_id)
            );
            const otherUser = mockUsers.find(
              (u) => String(u.id) === String(conv.buyer_id === 1 ? conv.seller_id : conv.buyer_id)
            );
            const date = new Date(conv.last_message_at);
            const isToday = date.toDateString() === new Date().toDateString();
            const timeLabel = isToday
              ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
              : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

            return (
              <Link key={conv.id} href={`/messages/${conv.id}`}>
                <div className="flex items-start gap-4 bg-white px-5 py-4 transition hover:bg-[var(--color-surface)]">

                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-foreground)]">
                    {(otherUser?.name ?? "?").charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">
                        {otherUser?.name ?? "Utilisateur"}
                      </p>
                      <span className="shrink-0 text-xs text-[var(--color-muted)]">{timeLabel}</span>
                    </div>
                    <p className="truncate text-xs text-[var(--color-muted)]">
                      {listing?.title ?? conv.listing?.title ?? "Annonce"}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-[var(--color-muted)]">
                      {conv.last_message ?? "Pas de message"}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conv.unread_count != null && conv.unread_count > 0 && (
                    <span className="mt-1 inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-foreground)] px-2 py-0.5 text-[11px] font-semibold text-white">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

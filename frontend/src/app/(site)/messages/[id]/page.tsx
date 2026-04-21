"use client";

import { use, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { messageService } from "@/services/message.service";
import { mockMessages } from "@/data/messages";
import { mockListings } from "@/data/listings";
import { mockUsers } from "@/data/users";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Conversation, Message } from "@/types";

type ConversationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function ConversationDetailPage({
  params,
}: ConversationDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await messageService.getConversation(Number(id));
        setConversation(data);
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to fetch conversation:", err);
        setError(true);
        const mockConv = {
          id,
          listing_id: 1,
          buyer_id: 1,
          seller_id: 2,
          last_message_at: new Date().toISOString(),
        } as Conversation;
        setConversation(mockConv);
        setMessages(mockMessages as Message[]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversation();
  }, [id]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const tempMessage: Message = {
      id: Date.now(),
      conversation_id: Number(id),
      sender_id: 1,
      body: messageInput,
      read_at: null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      await messageService.sendMessage(Number(id), messageInput);
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    setMessageInput("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 text-center">
        <p className="text-[var(--color-muted)]">Conversation introuvable</p>
        <button
          onClick={() => router.push("/messages")}
          className="mt-4 text-[var(--color-primary)]"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Retour aux messages
        </button>
      </div>
    );
  }

  const listing = mockListings.find(
    (l) => String(l.id) === String(conversation.listing_id),
  );
  const otherUser = mockUsers.find(
    (u) =>
      String(u.id) ===
      String(
        conversation.buyer_id === 1
          ? conversation.seller_id
          : conversation.buyer_id,
      ),
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {error && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
          Mode hors ligne — Les nouveaux messages ne seront pas envoyés
        </div>
      )}

      <div className="mb-6 rounded-[28px] border border-[var(--color-border)] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
              {otherUser?.name || "Utilisateur"}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              À propos de :{" "}
              <strong>
                {listing?.title || conversation.listing?.title || "Annonce"}
              </strong>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
              {listing?.price != null ? `${listing.price}FCFA` : "Gratuit"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex h-96 flex-col rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-[var(--color-muted)]">
                Aucun message pour l'instant. Commence la conversation !
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === 1 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-[16px] px-4 py-3 text-sm ${
                    msg.sender_id === 1
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-foreground)]"
                  }`}
                >
                  <p>{msg.body}</p>
                  <p
                    className={`mt-1 text-xs ${msg.sender_id === 1 ? "text-white/70" : "text-[var(--color-muted)]"}`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={messageInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessageInput(e.target.value)
          }
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

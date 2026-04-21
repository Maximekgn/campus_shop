import { useEffect, useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import MobileLayout from '@/Layouts/MobileLayout'
import api from '@/lib/api'
import { getAuthToken, getAuthUser } from '@/lib/auth'

function partnerName(conversation, currentUser) {
    if (!conversation || !currentUser) return 'Conversation'
    const isBuyer = conversation.buyer_id === currentUser.id
    return isBuyer ? conversation.seller?.name : conversation.buyer?.name
}

export default function ConversationShow({ conversationId }) {
    const [conversation, setConversation] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const currentUser = useMemo(() => getAuthUser(), [])

    const loadConversation = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await api.get(`/conversations/${conversationId}`)
            setConversation(response.data.conversation)
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Impossible de charger la conversation.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!getAuthToken()) {
            router.visit('/login')
            return
        }
        loadConversation()
    }, [conversationId])

    const sendMessage = async () => {
        if (!message.trim()) return

        setSending(true)
        setError('')
        try {
            await api.post(`/conversations/${conversationId}/messages`, { body: message })
            setMessage('')
            await loadConversation()
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Impossible d’envoyer le message.')
        } finally {
            setSending(false)
        }
    }

    return (
        <MobileLayout>
            <div className="sticky top-0 z-10 bg-[#F9F7F2]/95 backdrop-blur border-b border-[#E8E4DC] px-4 py-3">
                <button
                    type="button"
                    onClick={() => router.visit('/mobile/conversations')}
                    className="text-xs text-[#7A7572] flex items-center gap-1"
                >
                    <ArrowLeft size={14} />
                    Retour
                </button>
                <p className="text-sm font-semibold text-[#1A1A1A] mt-1">
                    {partnerName(conversation, currentUser)}
                </p>
                <p className="text-xs text-[#7A7572]">
                    {conversation?.listing?.title ?? 'Annonce'}
                </p>
            </div>

            {error && (
                <div className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="px-4 py-4 space-y-2">
                {loading && <p className="text-sm text-[#7A7572]">Chargement...</p>}

                {!loading && (conversation?.messages ?? []).map((item) => {
                    const mine = item.sender_id === currentUser?.id
                    return (
                        <div
                            key={item.id}
                            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                                mine ? 'ml-auto text-[#1A1200]' : 'mr-auto text-[#1A1A1A]'
                            }`}
                            style={{
                                background: mine ? '#C9A84C' : '#FFFFFF',
                                border: mine ? 'none' : '1px solid #E8E4DC',
                            }}
                        >
                            {item.body}
                        </div>
                    )
                })}
            </div>

            <div className="fixed bottom-16 left-0 right-0 bg-[#F9F7F2] border-t border-[#E8E4DC] px-3 py-2">
                <div className="flex items-center gap-2">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Écrire un message..."
                        className="flex-1 h-10 rounded-xl border border-[#E8E4DC] bg-white px-3 text-sm focus:outline-none focus:border-[#C9A84C]"
                    />
                    <button
                        type="button"
                        onClick={sendMessage}
                        disabled={sending}
                        className="h-10 px-4 rounded-xl text-sm font-semibold"
                        style={{ background: '#C9A84C', color: '#1A1200' }}
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </MobileLayout>
    )
}

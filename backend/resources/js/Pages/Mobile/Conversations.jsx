import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { MessageCircle } from 'lucide-react'
import MobileLayout from '@/Layouts/MobileLayout'
import api from '@/lib/api'
import { getAuthToken, getAuthUser } from '@/lib/auth'

function conversationName(conversation, currentUser) {
    if (!currentUser) return 'Conversation'
    const isBuyer = conversation.buyer_id === currentUser.id
    return isBuyer ? conversation.seller?.name : conversation.buyer?.name
}

export default function Conversations() {
    const [items, setItems] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const currentUser = getAuthUser()

    useEffect(() => {
        const token = getAuthToken()
        if (!token) {
            router.visit('/login')
            return
        }

        const loadConversations = async () => {
            setLoading(true)
            setError('')
            try {
                const response = await api.get('/conversations', { params: { per_page: 50 } })
                setItems(response.data.data ?? [])
            } catch (err) {
                setError(err?.response?.data?.message ?? 'Impossible de charger les conversations.')
            } finally {
                setLoading(false)
            }
        }

        loadConversations()
    }, [])

    return (
        <MobileLayout>
            <div className="px-4 pt-4">
                <h1 className="text-lg font-semibold text-[#1A1A1A]">Messages</h1>
            </div>

            {error && (
                <div className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="px-4 mt-4 space-y-3">
                {loading && <p className="text-sm text-[#7A7572]">Chargement...</p>}

                {!loading && items.length === 0 && (
                    <div className="rounded-2xl border border-[#E8E4DC] bg-white p-4 text-center">
                        <MessageCircle size={20} className="mx-auto text-[#C9A84C]" />
                        <p className="text-sm text-[#7A7572] mt-2">Aucune conversation pour l’instant.</p>
                    </div>
                )}

                {items.map((conversation) => (
                    <button
                        key={conversation.id}
                        type="button"
                        onClick={() => router.visit(`/mobile/conversations/${conversation.id}`)}
                        className="w-full text-left rounded-2xl border border-[#E8E4DC] bg-white p-3"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-sm font-semibold text-[#1A1A1A]">
                                    {conversationName(conversation, currentUser) ?? 'Utilisateur'}
                                </p>
                                <p className="text-xs text-[#7A7572] mt-0.5">
                                    {conversation.listing?.title ?? 'Annonce'}
                                </p>
                                <p className="text-xs text-[#7A7572] mt-2 line-clamp-1">
                                    {conversation.latest_message?.body ?? 'Aucun message'}
                                </p>
                            </div>
                            {conversation.unread_count > 0 && (
                                <span className="min-w-5 h-5 rounded-full px-1.5 text-[10px] font-semibold flex items-center justify-center"
                                      style={{ background: '#C9A84C', color: '#1A1200' }}>
                                    {conversation.unread_count}
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </MobileLayout>
    )
}

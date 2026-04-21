import { useEffect, useMemo, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import { Heart, Share2 } from 'lucide-react'
import MobileLayout from '@/Layouts/MobileLayout'
import FeedLayout from '@/components/FeedLayout'
import SellerAvatar from '@/components/avatar'
import ActionButton from '@/components/ActionButton'
import ListingDetailsSheet from '@/components/ListingDetailsSheet'
import api from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

function listingImage(listing) {
    const firstPhoto = listing.photos?.[0]
    if (!firstPhoto?.path) return '/images/tom.jpg'
    return `/storage/${firstPhoto.path}`
}

function formatPrice(listing) {
    if (listing.type === 'don') return 'Don'
    if (listing.price == null) return 'Prix non défini'
    return `${Number(listing.price).toLocaleString('fr-FR')} FCFA`
}

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [liked, setLiked] = useState({})
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedListing, setSelectedListing] = useState(null)
    const scrollRef = useRef(null)
    const hasToken = useMemo(() => Boolean(getAuthToken()), [])

    useEffect(() => {
        const loadListings = async () => {
            setLoading(true)
            setError('')

            try {
                const response = await api.get('/listings', { params: { per_page: 25 } })
                setItems(response.data.data ?? [])
            } catch (err) {
                setError(err?.response?.data?.message ?? 'Impossible de charger le fil des annonces.')
            } finally {
                setLoading(false)
            }
        }

        loadListings()
    }, [])

    const handleScroll = () => {
        const el = scrollRef.current
        if (!el) return
        setActiveIndex(Math.round(el.scrollTop / window.innerHeight))
    }

    const handleContact = async (item) => {
        if (!hasToken) {
            router.visit('/login')
            return
        }

        try {
            const response = await api.post('/conversations', { listing_id: item.id })
            router.visit(`/mobile/conversations/${response.data.conversation.id}`)
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Impossible de démarrer la conversation.')
        }
    }

    const handleLike = async (item) => {
        if (!hasToken) {
            router.visit('/login')
            return
        }

        const oldValue = liked[item.id]
        setLiked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))

        try {
            const response = await api.post(`/listings/${item.id}/favorite`)
            setLiked((prev) => ({ ...prev, [item.id]: response.data.is_favorited }))
        } catch (err) {
            setLiked((prev) => ({ ...prev, [item.id]: oldValue }))
            setError(err?.response?.data?.message ?? 'Impossible de mettre à jour les favoris.')
        }
    }

    const openDetails = (item) => {
        setSelectedListing(item)
        setDetailsOpen(true)
    }

    if (loading) {
        return (
            <MobileLayout dark>
                <div className="h-screen flex items-center justify-center text-white/80">
                    Chargement du fil...
                </div>
            </MobileLayout>
        )
    }

    if (!items.length) {
        return (
            <MobileLayout dark>
                <div className="h-screen flex flex-col items-center justify-center px-6 text-center">
                    <p className="text-white font-semibold">Aucune annonce publiée pour le moment.</p>
                    <button
                        onClick={() => router.visit('/mobile/listings/create')}
                        className="mt-4 h-10 px-5 rounded-full font-semibold text-sm"
                        style={{ background: '#C9A84C', color: '#1A1200' }}
                    >
                        Publier une annonce
                    </button>
                </div>
            </MobileLayout>
        )
    }

    return (
        <MobileLayout dark>
            {error && (
                <div
                    className="fixed top-4 left-4 right-4 z-30 px-4 py-3 text-sm rounded-xl text-white"
                    style={{ background: 'rgba(0,0,0,0.72)', border: '1px solid rgba(201,168,76,0.5)' }}
                >
                    {error}
                </div>
            )}

            <FeedLayout
                items={items.map((listing) => ({
                    ...listing,
                    image: listingImage(listing),
                }))}
                activeIndex={activeIndex}
                scrollRef={scrollRef}
                onScroll={handleScroll}
                onContact={handleContact}
                renderTopBar={(item) => (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => openDetails(item)}
                            className="h-10 px-4 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur"
                        >
                            Détails
                        </button>
                        <button
                            type="button"
                            onClick={() => handleContact(item)}
                            className="h-10 px-4 rounded-full text-sm font-semibold"
                            style={{ background: '#C9A84C', color: '#1A1200' }}
                        >
                            Contacter
                        </button>
                    </div>
                )}
                renderActions={(item) => (
                    <>
                        <SellerAvatar alt={item.user?.name ?? 'Vendeur'} fallback={(item.user?.name ?? 'VD').slice(0, 2).toUpperCase()} />
                        <ActionButton
                            icon={Heart}
                            onClick={() => handleLike(item)}
                            active={Boolean(liked[item.id])}
                            activeColor="#ef4444"
                        />
                        <ActionButton icon={Share2} onClick={() => navigator.share?.({ title: item.title, url: window.location.href })} />
                    </>
                )}
                renderInfo={(item) => (
                    <>
                        <h2 className="text-white text-xl font-bold leading-tight">{item.title}</h2>
                        <p className="text-white/60 text-sm mt-1">{item.description}</p>
                        <span className="text-[#C9A84C] font-bold text-lg mt-1 block">{formatPrice(item)}</span>
                        <span className="text-white/70 text-xs block mt-1">Par {item.user?.name ?? 'Vendeur'}</span>
                    </>
                )}
            />

            <ListingDetailsSheet
                listing={selectedListing}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                onContact={handleContact}
            />
        </MobileLayout>
    )
}

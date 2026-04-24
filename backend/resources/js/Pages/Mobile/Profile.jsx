import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import MobileLayout from '@/Layouts/MobileLayout'
import api from '@/lib/api'
import { clearAuthSession, getAuthToken, getAuthUser, setAuthSession } from '@/lib/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ListingDetailsSheet from '@/components/ListingDetailsSheet'

function listingImage(listing) {
    const firstPhoto = listing.photos?.[0]
    return firstPhoto?.path ? firstPhoto.path : '/images/tom.jpg'
}

function formatPrice(listing) {
    if (listing.type === 'don') return 'Don'
    if (listing.price == null) return 'Prix non défini'
    return `${Number(listing.price).toLocaleString('fr-FR')} FCFA`
}

export default function Profile() {
    const [user, setUser] = useState(getAuthUser())
    const [myListings, setMyListings] = useState([])
    const [myListingsCount, setMyListingsCount] = useState(0)
    const [favorites, setFavorites] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedListing, setSelectedListing] = useState(null)

    useEffect(() => {
        const token = getAuthToken()
        if (!token) {
            setLoading(false)
            return
        }

        const loadProfile = async () => {
            setLoading(true)
            setError('')
            try {
                const [me, mine, fav] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/my-listings', { params: { per_page: 8 } }),
                    api.get('/favorites', { params: { per_page: 8 } }),
                ])

                setUser(me.data.user)
                setAuthSession(token, me.data.user)
                setMyListings(mine.data.data ?? [])
                setMyListingsCount(mine.data.total ?? (mine.data.data?.length ?? 0))
                setFavorites(fav.data.data ?? [])
            } catch (err) {
                setError(err?.response?.data?.message ?? 'Impossible de charger le profil.')
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    const logout = async () => {
        try {
            if (getAuthToken()) {
                await api.post('/auth/logout')
            }
        } catch {
            // Keep local logout even if API logout fails.
        } finally {
            clearAuthSession()
            router.visit('/login')
        }
    }

    if (!getAuthToken()) {
        return (
            <MobileLayout>
                <div className="px-4 pt-6">
                    <h1 className="text-lg font-semibold text-[#1A1A1A]">Profil</h1>
                    <p className="text-sm text-[#7A7572] mt-2">Connecte-toi pour voir ton profil et tes annonces.</p>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => router.visit('/login')}
                            className="h-10 px-4 rounded-xl text-sm font-semibold"
                            style={{ background: '#C9A84C', color: '#1A1200' }}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => router.visit('/register')}
                            className="h-10 px-4 rounded-xl text-sm font-semibold border border-[#E8E4DC] bg-white"
                        >
                            Inscription
                        </button>
                    </div>
                </div>
            </MobileLayout>
        )
    }

    return (
        <MobileLayout>
            <div className="px-4 pt-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-[#1A1A1A]">Profil</h1>
                <button
                    type="button"
                    onClick={logout}
                    className="h-9 px-3 rounded-xl border border-[#E8E4DC] bg-white text-xs font-semibold text-[#7A7572] flex items-center gap-1"
                >
                    <LogOut size={14} />
                    Déconnexion
                </button>
            </div>

            <div className="mx-4 mt-4 rounded-2xl border border-[#E8E4DC] bg-white p-5 text-center">
                <Avatar className="size-20 mx-auto border-2 border-[#C9A84C]">
                    <AvatarFallback className="bg-[#FDF3DC] text-[#1A1A1A] font-semibold text-xl">
                        {(user?.name ?? 'U').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <p className="text-base font-semibold text-[#1A1A1A] mt-3">{user?.name ?? 'Utilisateur'}</p>
                <p className="text-xs text-[#7A7572] mt-1">{user?.email ?? ''}</p>
                <p className="text-xs text-[#7A7572] mt-2">
                    {myListingsCount} annonce{myListingsCount > 1 ? 's' : ''}
                </p>
            </div>

            {error && (
                <div className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="px-4 mt-4">
                <h2 className="text-sm font-semibold text-[#1A1A1A]">Mes annonces</h2>
                {loading && <p className="text-xs text-[#7A7572] mt-2">Chargement...</p>}
                {!loading && myListings.length === 0 && (
                    <p className="text-xs text-[#7A7572] mt-2">Aucune annonce pour le moment.</p>
                )}
                <div className="mt-2 space-y-2">
                    {myListings.map((listing) => (
                        <button
                            key={listing.id}
                            type="button"
                            onClick={() => {
                                setSelectedListing(listing)
                                setDetailsOpen(true)
                            }}
                            className="w-full text-left rounded-xl border border-[#E8E4DC] bg-white p-2 flex gap-2"
                        >
                            <img src={listingImage(listing)} alt={listing.title} className="w-14 h-14 rounded-lg object-cover" />
                            <div>
                                <p className="text-xs font-semibold text-[#1A1A1A]">{listing.title}</p>
                                <p className="text-xs text-[#C9A84C] mt-1">{formatPrice(listing)}</p>
                                <p className="text-[11px] text-[#7A7572] mt-1 capitalize">{listing.status}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 mt-5">
                <h2 className="text-sm font-semibold text-[#1A1A1A]">Mes favoris</h2>
                {!loading && favorites.length === 0 && (
                    <p className="text-xs text-[#7A7572] mt-2">Aucun favori.</p>
                )}
                <div className="mt-2 space-y-2">
                    {favorites.map((listing) => (
                        <div key={listing.id} className="rounded-xl border border-[#E8E4DC] bg-white p-2 flex gap-2">
                            <img src={listingImage(listing)} alt={listing.title} className="w-14 h-14 rounded-lg object-cover" />
                            <div>
                                <p className="text-xs font-semibold text-[#1A1A1A]">{listing.title}</p>
                                <p className="text-xs text-[#C9A84C] mt-1">{formatPrice(listing)}</p>
                                <p className="text-[11px] text-[#7A7572] mt-1">Par {listing.user?.name ?? 'Vendeur'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ListingDetailsSheet
                listing={selectedListing}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
        </MobileLayout>
    )
}

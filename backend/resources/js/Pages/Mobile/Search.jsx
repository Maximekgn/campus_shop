import { useEffect, useState } from 'react'
import { Search as SearchIcon, Filter } from 'lucide-react'
import MobileLayout from '@/Layouts/MobileLayout'
import api from '@/lib/api'
import ListingDetailsSheet from '@/components/ListingDetailsSheet'

function formatPrice(listing) {
    if (listing.type === 'don') return 'Don'
    if (listing.price == null) return 'Prix non défini'
    return `${Number(listing.price).toLocaleString('fr-FR')} FCFA`
}

function listingImage(listing) {
    const firstPhoto = listing.photos?.[0]
    return firstPhoto?.path ? `/storage/${firstPhoto.path}` : '/images/tom.jpg'
}

export default function Search() {
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('recent')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedListing, setSelectedListing] = useState(null)

    useEffect(() => {
        const timeout = setTimeout(async () => {
            setLoading(true)
            setError('')

            try {
                const response = await api.get('/listings', {
                    params: { q: query, sort, per_page: 20 },
                })
                setResults(response.data.data ?? [])
            } catch (err) {
                setError(err?.response?.data?.message ?? 'Impossible de charger les annonces.')
            } finally {
                setLoading(false)
            }
        }, 250)

        return () => clearTimeout(timeout)
    }, [query, sort])

    return (
        <MobileLayout>
            <div className="px-4 pt-4">
                <h1 className="text-lg font-semibold text-[#1A1A1A]">Recherche</h1>

                <div className="mt-4 flex items-center gap-2">
                    <div className="relative flex-1">
                        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher une annonce..."
                            className="w-full h-11 rounded-xl border border-[#E8E4DC] bg-white pl-9 pr-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                        />
                    </div>

                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="h-11 rounded-xl border border-[#E8E4DC] bg-white pl-8 pr-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C9A84C]"
                        >
                            <option value="recent">Récent</option>
                            <option value="price_asc">Prix croissant</option>
                            <option value="price_desc">Prix décroissant</option>
                            <option value="popular">Populaire</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="px-4 mt-4 space-y-3">
                {loading && <p className="text-sm text-[#7A7572]">Chargement...</p>}

                {!loading && results.length === 0 && (
                    <p className="text-sm text-[#7A7572]">Aucun résultat.</p>
                )}

                {results.map((listing) => (
                    <button
                        key={listing.id}
                        type="button"
                        onClick={() => {
                            setSelectedListing(listing)
                            setDetailsOpen(true)
                        }}
                        className="w-full text-left rounded-2xl border border-[#E8E4DC] bg-white p-3 flex gap-3"
                    >
                        <img
                            src={listingImage(listing)}
                            alt={listing.title}
                            className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#1A1A1A] truncate">{listing.title}</p>
                            <p className="text-xs text-[#7A7572] mt-1 line-clamp-2">{listing.description}</p>
                            <p className="text-sm font-semibold text-[#C9A84C] mt-2">{formatPrice(listing)}</p>
                        </div>
                    </button>
                ))}
            </div>

            <ListingDetailsSheet
                listing={selectedListing}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            />
        </MobileLayout>
    )
}

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import api from '@/lib/api'

function formatPrice(listing) {
    if (listing?.type === 'don') return 'Don'
    if (listing?.price == null) return 'Prix non défini'
    return `${Number(listing.price).toLocaleString('fr-FR')} FCFA`
}

function listingImage(listing) {
    const firstPhoto = listing?.photos?.[0]
    return firstPhoto?.path ? `/storage/${firstPhoto.path}` : '/images/tom.jpg'
}

export default function ListingDetailsSheet({ listing, open, onOpenChange, onContact }) {
    const [details, setDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadDetails = async () => {
            if (!open || !listing?.id) return

            setLoading(true)
            setError('')
            try {
                const response = await api.get(`/listings/${listing.id}`)
                setDetails(response.data.listing)
            } catch (err) {
                setDetails(null)
                setError(err?.response?.data?.message ?? 'Impossible de charger les détails.')
            } finally {
                setLoading(false)
            }
        }

        loadDetails()
    }, [open, listing?.id])

    const data = details ?? listing

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="rounded-t-3xl border-t border-[#E8E4DC] bg-[#F9F7F2] text-[#1A1A1A] max-h-[85dvh] overflow-y-auto"
            >
                <SheetHeader className="px-4 pt-6 pb-3">
                    <SheetTitle className="text-[#1A1A1A] normal-case tracking-normal font-semibold text-lg">
                        Détails de l’annonce
                    </SheetTitle>
                    <SheetDescription className="text-[#7A7572]">
                        Consulte toutes les infos avant de contacter le vendeur.
                    </SheetDescription>
                </SheetHeader>

                {!loading && data && (
                    <div className="px-4 pb-5">
                        <img
                            src={listingImage(data)}
                            alt={data.title}
                            className="w-full h-52 rounded-2xl object-cover border border-[#E8E4DC]"
                        />
                        <h3 className="mt-4 text-base font-semibold text-[#1A1A1A]">{data.title}</h3>
                        <p className="mt-1 text-sm text-[#7A7572]">{data.description}</p>
                        <p className="mt-3 text-lg font-semibold text-[#C9A84C]">{formatPrice(data)}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-xl border border-[#E8E4DC] bg-white px-3 py-2">
                                <p className="text-[#7A7572]">Type</p>
                                <p className="font-semibold text-[#1A1A1A] capitalize">{data.type ?? '-'}</p>
                            </div>
                            <div className="rounded-xl border border-[#E8E4DC] bg-white px-3 py-2">
                                <p className="text-[#7A7572]">Vues</p>
                                <p className="font-semibold text-[#1A1A1A]">{data.views_count ?? 0}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-[#7A7572]">Vendeur : {data.user?.name ?? 'Vendeur'}</p>

                        {onContact && (
                            <button
                                type="button"
                                onClick={() => onContact(data)}
                                className="mt-4 w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                                style={{ background: '#C9A84C', color: '#1A1200' }}
                            >
                                <MessageCircle size={16} />
                                Contacter le vendeur
                            </button>
                        )}
                    </div>
                )}

                {loading && <p className="px-4 pb-5 text-sm text-[#7A7572]">Chargement des détails...</p>}
                {!loading && error && <p className="px-4 pb-5 text-sm text-red-600">{error}</p>}
            </SheetContent>
        </Sheet>
    )
}

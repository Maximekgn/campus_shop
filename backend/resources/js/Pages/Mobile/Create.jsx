import { useEffect, useMemo, useState } from 'react'
import { router } from '@inertiajs/react'
import { ImagePlus } from 'lucide-react'
import MobileLayout from '@/Layouts/MobileLayout'
import api from '@/lib/api'
import { getAuthToken } from '@/lib/auth'

const TYPE_OPTIONS = [
    { value: 'vente', label: 'Vente' },
    { value: 'don', label: 'Don' },
    { value: 'echange', label: 'Échange' },
]

export default function Create() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        type: 'vente',
        price: '',
    })
    const [photos, setPhotos] = useState([])
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState('')
    const [processing, setProcessing] = useState(false)
    const hasToken = useMemo(() => Boolean(getAuthToken()), [])
    const [forceCreate, setForceCreate] = useState(false)

    const photoPreviews = useMemo(
        () => photos.map((photo) => ({ file: photo, url: URL.createObjectURL(photo) })),
        [photos]
    )

    useEffect(() => {
        return () => {
            photoPreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
        }
    }, [photoPreviews])

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const submit = async () => {
        if (!hasToken) {
            router.visit('/login')
            return
        }

        setProcessing(true)
        setErrors({})
        setMessage('')

        try {
            const payload = {
                title: form.title,
                description: form.description,
                type: form.type,
                price: form.type === 'don' || form.price === '' ? null : Number(form.price),
                force_create: forceCreate,
            }

            const listingResponse = await api.post('/listings', payload)
            const listing = listingResponse.data.listing

            if (photos.length > 0) {
                const formData = new FormData()
                photos.forEach((photo) => formData.append('photos[]', photo))
                await api.post(`/listings/${listing.id}/photos`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            }

            setMessage('Annonce créée. Elle sera visible après validation.')
            setForm({ title: '', description: '', type: 'vente', price: '' })
            setPhotos([])
            setForceCreate(false)
        } catch (err) {
            if (err?.response?.status === 422 && err.response.data.errors) {
                setErrors(err.response.data.errors)
            } else if (err?.response?.status === 409) {
                setMessage(`${err?.response?.data?.message ?? 'Annonce similaire détectée.'} Clique sur "Publier quand même" pour forcer.`)
                setForceCreate(true)
            } else if (err?.response?.status === 403) {
                setMessage(err?.response?.data?.message ?? 'Accès refusé.')
            } else {
                setMessage(err?.response?.data?.message ?? 'Impossible de créer l’annonce.')
            }
        } finally {
            setProcessing(false)
        }
    }

    return (
        <MobileLayout>
            <div className="px-4 pt-4">
                <h1 className="text-lg font-semibold text-[#1A1A1A]">Nouvelle annonce</h1>
                <p className="text-sm text-[#7A7572] mt-1">Style mobile CampusShop en blanc et or.</p>
            </div>

            {message && (
                <div className="mx-4 mt-3 rounded-xl border border-[#E8E4DC] bg-white px-3 py-2 text-sm text-[#1A1A1A]">
                    {message}
                </div>
            )}

            <div className="mx-4 mt-4 rounded-2xl border border-[#E8E4DC] bg-white p-4 space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-[#7A7572] mb-1">Titre</label>
                    <input
                        value={form.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        className="w-full h-11 rounded-xl border border-[#E8E4DC] px-3 text-sm focus:outline-none focus:border-[#C9A84C]"
                        placeholder="Ex: iPhone 12 128Go"
                    />
                    {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title[0]}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#7A7572] mb-1">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        className="w-full rounded-xl border border-[#E8E4DC] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                        rows={4}
                        placeholder="Décris ton article"
                    />
                    {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description[0]}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#7A7572] mb-1">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {TYPE_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => updateField('type', option.value)}
                                className={`h-10 rounded-xl border text-sm ${
                                    form.type === option.value
                                        ? 'border-[#C9A84C] text-[#1A1A1A] bg-[#FDF3DC]'
                                        : 'border-[#E8E4DC] text-[#7A7572] bg-white'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type[0]}</p>}
                </div>

                {form.type !== 'don' && (
                    <div>
                        <label className="block text-xs font-semibold text-[#7A7572] mb-1">Prix (FCFA)</label>
                        <input
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={(e) => updateField('price', e.target.value)}
                            className="w-full h-11 rounded-xl border border-[#E8E4DC] px-3 text-sm focus:outline-none focus:border-[#C9A84C]"
                            placeholder="25000"
                        />
                        {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price[0]}</p>}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-[#7A7572] mb-1">Photos (max 3)</label>
                    <label className="h-11 rounded-xl border border-dashed border-[#C9A84C] bg-[#FDF3DC] text-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer text-sm">
                        <ImagePlus size={16} />
                        Choisir des photos
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                setPhotos(Array.from(e.target.files || []).slice(0, 3))
                                setErrors((prev) => ({ ...prev, photos: undefined }))
                            }}
                        />
                    </label>
                    {photos.length > 0 && (
                        <p className="text-xs text-[#7A7572] mt-2">{photos.length} fichier(s) sélectionné(s).</p>
                    )}
                    {photoPreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {photoPreviews.map((preview) => (
                                <img
                                    key={`${preview.file.name}-${preview.file.size}`}
                                    src={preview.url}
                                    alt={preview.file.name}
                                    className="w-full h-20 rounded-xl object-cover border border-[#E8E4DC]"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={submit}
                    disabled={processing}
                    className="w-full h-11 rounded-xl font-semibold text-sm"
                    style={{ background: '#C9A84C', color: '#1A1200' }}
                >
                    {processing ? 'Publication...' : forceCreate ? 'Publier quand même' : 'Publier'}
                </button>
            </div>
        </MobileLayout>
    )
}

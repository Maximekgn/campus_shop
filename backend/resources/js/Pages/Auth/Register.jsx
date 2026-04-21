import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { setAuthSession } from '@/lib/auth'

export default function Register() {
    const [show, setShow] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({})
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit = async () => {
        setProcessing(true)
        setMessage('')
        setErrors({})

        try {
            const response = await api.post('/auth/register', data)
            setAuthSession(response.data.token, response.data.user)
            router.visit('/mobile')
        } catch (err) {
            if (err?.response?.status === 422 && err.response.data.errors) {
                setErrors(err.response.data.errors)
            } else {
                setMessage(err?.response?.data?.message ?? 'Inscription impossible.')
            }
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col justify-center px-6 py-10">


            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-[#1A1A1A] text-xl font-semibold mb-1">Créer un compte</h2>
                    <p className="text-[#7A7572] text-sm">Inscris-toi pour publier et discuter</p>
                </div>

                <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                    <Input
                        placeholder="Ton nom complet"
                        value={data.name}
                        onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                        className="pl-9 bg-white border border-[#E8E4DC] text-[#1A1A1A] rounded-xl h-12"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>}
                </div>

                <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                    <Input
                        type="email"
                        placeholder="ton@email.com"
                        value={data.email}
                        onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                        className="pl-9 bg-white border border-[#E8E4DC] text-[#1A1A1A] rounded-xl h-12"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>}
                </div>

                <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        value={data.password}
                        onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                        className="pl-9 pr-10 bg-white border border-[#E8E4DC] text-[#1A1A1A] rounded-xl h-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7572]"
                    >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password[0]}</p>}
                </div>

                <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Confirmer le mot de passe"
                        value={data.password_confirmation}
                        onChange={(e) => setData((prev) => ({ ...prev, password_confirmation: e.target.value }))}
                        className="pl-9 bg-white border border-[#E8E4DC] text-[#1A1A1A] rounded-xl h-12"
                    />
                    {errors.password_confirmation && <p className="text-red-600 text-xs mt-1">{errors.password_confirmation[0]}</p>}
                </div>

                {message && (
                    <p className="text-xs text-red-600 rounded-lg border border-red-200 bg-red-50 px-2 py-1">
                        {message}
                    </p>
                )}

                <Button
                    onClick={submit}
                    disabled={processing}
                    className="h-12 rounded-xl font-semibold text-sm mt-1"
                    style={{ background: '#C9A84C', color: '#1A1200' }}
                >
                    {processing ? 'Création...' : 'Créer mon compte'}
                </Button>

                <p className="text-center text-[#7A7572] text-sm">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="font-semibold" style={{ color: '#C9A84C' }}>
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    )
}

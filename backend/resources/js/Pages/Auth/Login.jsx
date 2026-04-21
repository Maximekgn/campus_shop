import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { setAuthSession } from '@/lib/auth'

export default function Login() {
    const [show, setShow] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({})
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const submit = async () => {
        setProcessing(true)
        setMessage('')
        setErrors({})

        try {
            const response = await api.post('/auth/login', data)
            setAuthSession(response.data.token, response.data.user)
            router.visit('/mobile')
        } catch (err) {
            if (err?.response?.status === 422 && err.response.data.errors) {
                setErrors(err.response.data.errors)
            } else {
                setMessage(err?.response?.data?.message ?? 'Connexion impossible.')
            }
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col items-center justify-center px-6 py-10">
            <Card className="w-full shadow-sm border border-[#E8E4DC]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[#1A1A1A] text-xl">Connexion</CardTitle>
                    <CardDescription className="text-[#7A7572]">Accède à ton compte CampusShop</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email" className="text-[#7A7572] text-sm">Email</Label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="ton@email.com"
                                value={data.email}
                                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
                                className="pl-9 h-11 rounded-xl border border-[#E8E4DC] bg-white text-[#1A1A1A] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs">{errors.email[0]}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password" className="text-[#7A7572] text-sm">Mot de passe</Label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7572]" />
                            <Input
                                id="password"
                                type={show ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
                                className="pl-9 pr-10 h-11 rounded-xl border border-[#E8E4DC] bg-white text-[#1A1A1A] focus-visible:ring-[#C9A84C] focus-visible:border-[#C9A84C]"
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7572]"
                            >
                                {show ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs">{errors.password[0]}</p>}
                    </div>

                    {message && (
                        <p className="text-xs text-red-600 rounded-lg border border-red-200 bg-red-50 px-2 py-1">
                            {message}
                        </p>
                    )}

                    <Button
                        onClick={submit}
                        disabled={processing}
                        className="h-11 rounded-xl font-semibold text-sm mt-1 w-full"
                        style={{ background: '#C9A84C', color: '#1A1200' }}
                    >
                        {processing ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-0">
                    <Separator className="bg-[#E8E4DC]" />
                    <p className="text-center text-[#7A7572] text-sm">
                        Pas encore de compte ?{' '}
                        <Link href="/register" className="font-semibold" style={{ color: '#C9A84C' }}>
                            S'inscrire
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

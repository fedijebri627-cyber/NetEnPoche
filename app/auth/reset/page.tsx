'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, KeyRound, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const router = useRouter()
    const supabase = createBrowserClient()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        })

        if (updateError) {
            setError(updateError.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="bg-brand-green/10 p-4 rounded-full inline-flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-brand-green" />
                </div>
                <h1 className="text-2xl font-bold font-syne text-slate-900 tracking-tight">Mot de passe modifié</h1>
                <p className="text-slate-500">
                    Votre compte est désormais sécurisé avec ce nouveau sésame.
                </p>
                <div className="pt-4">
                    <Link href="/dashboard" className="text-sm font-medium bg-brand-green text-white px-6 py-3 border border-transparent rounded-xl hover:bg-brand-green/90 transition inline-block">
                        Aller au Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-center">
                <div className="bg-slate-100 p-3 rounded-2xl">
                    <KeyRound className="w-8 h-8 text-slate-600" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold font-syne text-slate-900 tracking-tight">Nouveau mot de passe</h1>
                <p className="text-slate-500 text-sm">Veuillez choisir un nouveau mot de passe fort contenant au moins 8 caractères.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center justify-center text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700" htmlFor="password">Nouveau Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-brand-green text-white font-medium py-3 rounded-xl hover:bg-brand-green/90 transition disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sauvegarder et continuer"}
                </button>
            </form>
        </div>
    )
}

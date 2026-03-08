'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { createAppUrl, getBrowserAppUrl, sanitizeNextPath } from '@/lib/app-url'

export default function RegisterPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const searchParams = useSearchParams()
    const supabase = createBrowserClient()
    const nextPath = sanitizeNextPath(searchParams.get('next'))

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: createAppUrl(`/auth/callback?next=${encodeURIComponent(nextPath)}`, getBrowserAppUrl()),
            }
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError(null)
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: createAppUrl(`/auth/callback?next=${encodeURIComponent(nextPath)}`, getBrowserAppUrl()),
            },
        })

        if (oauthError) {
            setError(oauthError.message)
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="bg-brand-green/10 p-4 rounded-full inline-flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-brand-green" />
                </div>
                <h1 className="text-2xl font-bold font-syne text-slate-900 tracking-tight">Verifiez vos emails</h1>
                <p className="text-slate-500">
                    Nous vous avons envoye un lien magique pour valider votre inscription.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold font-syne text-slate-900 tracking-tight">Creer un compte</h1>
                <p className="text-slate-500">Demarrez l aventure NetEnPoche aujourd hui.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center justify-center">
                    {error}
                </div>
            )}

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition active:scale-[0.98]"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>S&apos;inscrire avec Google</span>
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">Ou avec votre email</span>
                </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700" htmlFor="fullName">Nom complet</label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Jean Dupont"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700" htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition"
                    />
                    <p className="text-xs text-slate-500">8 caracteres minimum.</p>
                </div>

                <div className="pt-2 flex flex-col items-center space-y-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-brand-green text-white font-medium py-3 rounded-xl hover:bg-brand-green/90 transition disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Commencer l essai gratuit'}
                    </button>

                    <span className="text-xs font-medium text-brand-green bg-brand-green/10 px-3 py-1 rounded-full">
                        Essai gratuit 14 jours - aucune carte requise
                    </span>
                </div>
            </form>

            <p className="text-center text-sm text-slate-500">
                Vous avez deja un compte ?{' '}
                <Link href="/auth/login" className="text-brand-green hover:underline font-medium">Se connecter</Link>
            </p>
        </div>
    )
}


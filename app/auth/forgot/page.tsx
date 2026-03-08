'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Loader2, ArrowLeft, Send } from 'lucide-react'
import { createAppUrl, getBrowserAppUrl } from '@/lib/app-url'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const supabase = createBrowserClient()

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: createAppUrl('/auth/reset', getBrowserAppUrl()),
        })

        if (resetError) {
            setError(resetError.message)
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
                    <Send className="w-12 h-12 text-brand-green" />
                </div>
                <h1 className="text-2xl font-bold font-syne text-slate-900 tracking-tight">Verifiez vos emails</h1>
                <p className="text-slate-500">
                    Si un compte est associe a cette adresse, vous allez recevoir un lien secret pour reinitialiser votre mot de passe.
                </p>
                <div className="pt-4">
                    <Link href="/auth/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-200 px-6 py-2 rounded-lg transition inline-block">
                        Retour a la connexion
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-start">
                <Link href="/auth/login" className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                </Link>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold font-syne text-slate-900 tracking-tight">Mot de passe oublie ?</h1>
                <p className="text-slate-500 text-sm">Entrez votre adresse email, nous vous enverrons un lien d acces.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center justify-center text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleResetRequest} className="space-y-4">
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-brand-green text-white font-medium py-3 rounded-xl hover:bg-brand-green/90 transition disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer le lien'}
                </button>
            </form>
        </div>
    )
}


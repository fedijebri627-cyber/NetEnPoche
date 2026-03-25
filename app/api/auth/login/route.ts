import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sanitizeNextPath } from '@/lib/app-url'

function toAuthErrorMessage(message: string) {
    if (/failed to fetch/i.test(message)) {
        return "Connexion impossible au service d'authentification. Reessayez dans quelques instants."
    }

    return message
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const email = typeof body?.email === 'string' ? body.email.trim() : ''
        const password = typeof body?.password === 'string' ? body.password : ''
        const nextPath = sanitizeNextPath(typeof body?.next === 'string' ? body.next : null)

        if (!email || !password) {
            return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 })
        }

        const supabase = await createServerClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json({ error: toAuthErrorMessage(error.message) }, { status: 400 })
        }

        return NextResponse.json({ ok: true, nextPath })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Connexion impossible pour le moment."
        return NextResponse.json({ error: toAuthErrorMessage(message) }, { status: 500 })
    }
}

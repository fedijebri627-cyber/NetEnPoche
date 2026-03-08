import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getRequestAppUrl, sanitizeNextPath } from '@/lib/app-url'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = sanitizeNextPath(searchParams.get('next'))
    const appUrl = getRequestAppUrl(request)

    if (code) {
        const supabase = await createServerClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(new URL(next, `${appUrl}/`))
        }
    }

    return NextResponse.redirect(new URL('/auth/login?error=oauth_callback', `${appUrl}/`))
}


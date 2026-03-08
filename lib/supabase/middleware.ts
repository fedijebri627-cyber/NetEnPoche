import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sanitizeNextPath } from '@/lib/app-url'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
        return NextResponse.redirect(url)
    }

    if (
        user &&
        !request.nextUrl.pathname.startsWith('/auth/callback') &&
        (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/auth'))
    ) {
        const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get('next'))
        const url = request.nextUrl.clone()
        url.pathname = nextPath
        url.search = ''
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}


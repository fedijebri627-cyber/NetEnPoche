import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

async function performLogout() {
    try {
        const supabase = await createServerClient();
        await supabase.auth.signOut();
        return null;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Logout failed';
        return message;
    }
}

export async function POST() {
    const error = await performLogout();
    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
    await performLogout();

    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
}

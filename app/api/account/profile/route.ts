import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { resolveAccountProfileWithSessionClient } from '@/lib/account/profile';

export async function GET() {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await resolveAccountProfileWithSessionClient(supabase, user);

        return NextResponse.json({
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            tier: profile.subscription_tier,
            status: profile.subscription_status,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load profile';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}


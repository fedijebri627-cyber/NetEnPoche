import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { getBusinessAccountProfile, updateBusinessAccountProfile } from '@/lib/account/profile';

export async function GET() {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await getBusinessAccountProfile(user);

        return NextResponse.json({
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            businessName: profile.business_name,
            siret: profile.siret,
            tier: profile.subscription_tier,
            status: profile.subscription_status,
            businessFieldsReady: profile.business_fields_ready,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load business profile';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const fullName = typeof body.fullName === 'string' ? body.fullName.trim() || null : null;
        const businessName = typeof body.businessName === 'string' ? body.businessName.trim() || null : null;
        const siret = typeof body.siret === 'string' ? body.siret.replace(/\D/g, '').slice(0, 14) || null : null;

        const updated = await updateBusinessAccountProfile(user.id, {
            full_name: fullName,
            business_name: businessName,
            siret,
        });

        return NextResponse.json({
            id: updated.id,
            email: updated.email,
            fullName: updated.full_name,
            businessName: updated.business_name,
            siret: updated.siret,
            tier: updated.subscription_tier,
            status: updated.subscription_status,
            businessFieldsReady: true,
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'BUSINESS_PROFILE_COLUMNS_MISSING') {
            return NextResponse.json(
                {
                    error: 'Les colonnes SIRET / business_name ne sont pas encore deployees dans Supabase. La migration de production doit etre appliquee.',
                },
                { status: 409 }
            );
        }

        const message = error instanceof Error ? error.message : 'Failed to save business profile';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}


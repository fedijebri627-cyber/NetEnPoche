import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

function getDefaultConfig(year: number) {
    return {
        year,
        activity_type: 'services_bnc',
        secondary_activity_type: null,
        secondary_activity_share: null,
        acre_enabled: false,
        versement_liberatoire: false,
        annual_ca_goal: null,
        situation_familiale: 'celibataire',
        parts_fiscales: 1,
        autres_revenus: 0,
    };
}

export async function GET(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString(), 10);

        const { data: config } = await supabase
            .from('activity_config')
            .select('*')
            .eq('user_id', user.id)
            .eq('year', year)
            .single();

        return NextResponse.json({
            ...getDefaultConfig(year),
            ...(config || {}),
            year,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const {
            year,
            activity_type,
            secondary_activity_type,
            secondary_activity_share,
            acre_enabled,
            versement_liberatoire,
            annual_ca_goal,
            situation_familiale,
            parts_fiscales,
            autres_revenus,
        } = body;

        const payload = {
            user_id: user.id,
            year,
            activity_type,
            secondary_activity_type: secondary_activity_type || null,
            secondary_activity_share:
                secondary_activity_type && secondary_activity_share !== null && secondary_activity_share !== undefined
                    ? Number(secondary_activity_share)
                    : null,
            acre_enabled,
            versement_liberatoire,
            annual_ca_goal,
            situation_familiale,
            parts_fiscales,
            autres_revenus,
        };

        const { data, error } = await supabase
            .from('activity_config')
            .upsert(payload, { onConflict: 'user_id,year' })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
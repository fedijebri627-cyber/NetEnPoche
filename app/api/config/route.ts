import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

        let { data: config } = await supabase
            .from('activity_config')
            .select('*')
            .eq('user_id', user.id)
            .eq('year', year)
            .single();

        if (!config) {
            // Return default values if no config found yet
            config = {
                year,
                activity_type: 'services_bnc',
                acre_enabled: false,
                versement_liberatoire: false,
                annual_ca_goal: null,
                situation_familiale: 'celibataire',
                parts_fiscales: 1,
                autres_revenus: 0
            };
        }

        return NextResponse.json(config);
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
        const { year, activity_type, acre_enabled, versement_liberatoire, annual_ca_goal, situation_familiale, parts_fiscales, autres_revenus } = body;

        const { data, error } = await supabase
            .from('activity_config')
            .upsert(
                {
                    user_id: user.id,
                    year,
                    activity_type,
                    acre_enabled,
                    versement_liberatoire,
                    annual_ca_goal,
                    situation_familiale,
                    parts_fiscales,
                    autres_revenus
                },
                { onConflict: 'user_id,year' }
            )
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

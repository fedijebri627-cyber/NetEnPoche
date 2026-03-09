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
        const anchorYear = parseInt(searchParams.get('year') || new Date().getFullYear().toString(), 10);
        const totalYears = Math.min(6, Math.max(2, parseInt(searchParams.get('years') || '4', 10)));
        const startYear = anchorYear - totalYears + 1;

        const [entriesResponse, configsResponse] = await Promise.all([
            supabase
                .from('monthly_entries')
                .select('year, month, ca_amount, notes')
                .eq('user_id', user.id)
                .gte('year', startYear)
                .lte('year', anchorYear)
                .order('year', { ascending: true })
                .order('month', { ascending: true }),
            supabase
                .from('activity_config')
                .select('*')
                .eq('user_id', user.id)
                .gte('year', startYear)
                .lte('year', anchorYear)
                .order('year', { ascending: true }),
        ]);

        if (entriesResponse.error) throw entriesResponse.error;
        if (configsResponse.error) throw configsResponse.error;

        const entries = entriesResponse.data || [];
        const configs = configsResponse.data || [];
        const years = Array.from({ length: totalYears }, (_, index) => startYear + index).map((year) => ({
            year,
            config: {
                ...getDefaultConfig(year),
                ...(configs.find((config) => config.year === year) || {}),
                year,
            },
            entries: entries.filter((entry) => entry.year === year),
        }));

        return NextResponse.json(years);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
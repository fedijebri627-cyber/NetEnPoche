import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

        const { data: entries, error } = await supabase
            .from('monthly_entries')
            .select('month, ca_amount, notes')
            .eq('user_id', user.id)
            .eq('year', year)
            .order('month', { ascending: true });

        if (error) throw error;

        return NextResponse.json(entries || []);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { year, month, ca_amount, notes } = body;

        if (!year || !month) return NextResponse.json({ error: 'Year and Month required' }, { status: 400 });

        const { data, error } = await supabase
            .from('monthly_entries')
            .upsert(
                {
                    user_id: user.id,
                    year,
                    month,
                    ca_amount: ca_amount || 0,
                    notes: notes || null
                },
                { onConflict: 'user_id,year,month' }
            )
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

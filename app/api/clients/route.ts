import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Feature lock verification
    const tier = user.user_metadata?.subscription_tier;
    if (tier !== 'expert') return NextResponse.json({ error: 'Requires Expert tier' }, { status: 403 });

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Feature lock verification
    const tier = user.user_metadata?.subscription_tier;
    if (tier !== 'expert') return NextResponse.json({ error: 'Requires Expert tier' }, { status: 403 });

    const body = await req.json();
    const { name, type, email } = body;

    if (!name || !type) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const { data, error } = await supabase
        .from('clients')
        .insert([{ user_id: user.id, name, type, email }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

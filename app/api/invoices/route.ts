import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check DB for truth
    const { data: dbUser } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

    const tier = dbUser?.subscription_tier || user.user_metadata?.subscription_tier;
    if (tier !== 'expert') return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    const { data, error } = await supabase
        .from('invoices')
        .select('*, client:clients(name, type, email)')
        .eq('year', parseInt(year))
        .order('invoice_date', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check DB for truth
    const { data: dbUserPost } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

    const tierPost = dbUserPost?.subscription_tier || user.user_metadata?.subscription_tier;
    if (tierPost !== 'expert') return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });

    const body = await req.json();
    const { client_id, amount_ht, invoice_date, due_date, status } = body;

    // 1. Insert Invoice
    const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert([{ user_id: user.id, client_id, amount_ht, invoice_date, due_date, status }])
        .select()
        .single();

    if (invError) return NextResponse.json({ error: invError.message }, { status: 500 });

    // 2. Automatically sync to CA in `monthly_entries`
    // Convert string date to JS date
    const d = new Date(invoice_date);
    const month = d.getMonth() + 1; // 1-12
    const year = d.getFullYear();

    // Fetch existing entry
    const { data: entry } = await supabase
        .from('monthly_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('month', month)
        .single();

    let oldAmount = 0;
    let newAmount = parseFloat(amount_ht);

    if (entry) {
        oldAmount = parseFloat(entry.ca_amount.toString());
        newAmount = oldAmount + parseFloat(amount_ht);
        await supabase
            .from('monthly_entries')
            .update({ ca_amount: newAmount })
            .eq('id', entry.id);
    } else {
        await supabase
            .from('monthly_entries')
            .insert([{ user_id: user.id, year, month, ca_amount: newAmount }]);
    }

    return NextResponse.json({
        invoice,
        sync: { month, oldAmount, newAmount }
    });
}

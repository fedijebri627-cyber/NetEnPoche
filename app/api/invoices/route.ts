import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { ensureAccountProfile } from '@/lib/account/profile';

export async function GET(req: Request) {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await ensureAccountProfile(user);
    if (profile.subscription_tier !== 'expert') {
        return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    const { data, error } = await supabase
        .from('invoices')
        .select('*, client:clients(name, type, email)')
        .eq('year', parseInt(year, 10))
        .order('invoice_date', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await ensureAccountProfile(user);
    if (profile.subscription_tier !== 'expert') {
        return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });
    }

    const body = await req.json();
    const { client_id, amount_ht, invoice_date, due_date, status } = body;

    const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert([{ user_id: user.id, client_id, amount_ht, invoice_date, due_date, status }])
        .select()
        .single();

    if (invError) return NextResponse.json({ error: invError.message }, { status: 500 });

    const invoiceDate = new Date(invoice_date);
    const month = invoiceDate.getMonth() + 1;
    const year = invoiceDate.getFullYear();

    const { data: entry } = await supabase
        .from('monthly_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();

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
        sync: { month, oldAmount, newAmount },
    });
}


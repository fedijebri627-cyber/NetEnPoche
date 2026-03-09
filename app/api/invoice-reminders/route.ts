import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { resolveAccountProfileWithSessionClient } from '@/lib/account/profile';

export async function GET() {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await resolveAccountProfileWithSessionClient(supabase, user);
    if (profile.subscription_tier !== 'expert') {
        return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });
    }

    const { data, error } = await supabase
        .from('invoice_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
}

export async function POST(req: Request) {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await resolveAccountProfileWithSessionClient(supabase, user);
    if (profile.subscription_tier !== 'expert') {
        return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });
    }

    const body = await req.json();
    const invoiceId = typeof body.invoiceId === 'string' ? body.invoiceId : '';
    const channel = typeof body.channel === 'string' ? body.channel : 'email';
    const templateKey = typeof body.templateKey === 'string' ? body.templateKey : 'friendly';
    const recipient = typeof body.recipient === 'string' ? body.recipient : null;
    const note = typeof body.note === 'string' ? body.note : null;

    if (!invoiceId) {
        return NextResponse.json({ error: 'invoiceId is required' }, { status: 400 });
    }

    const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('id, user_id')
        .eq('id', invoiceId)
        .eq('user_id', user.id)
        .single();

    if (invoiceError || !invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const { data, error } = await supabase
        .from('invoice_reminders')
        .insert({
            user_id: user.id,
            invoice_id: invoiceId,
            channel,
            template_key: templateKey,
            recipient,
            note,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
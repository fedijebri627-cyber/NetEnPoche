import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.user_metadata?.subscription_tier !== 'expert') return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });

    const body = await req.json();
    const { status } = body;

    const { data, error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', params.id)
        .eq('user_id', user.id) // Enforce ownership implicitly via backend, alongside RLS
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.user_metadata?.subscription_tier !== 'expert') return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });

    // Note: If you delete an invoice, you should theoretically deduct the CA from `monthly_entries`
    // However the prompt says soft-delete or basic delete. We will simply delete it from history.

    const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

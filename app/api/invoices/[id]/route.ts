import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { resolveAccountProfileWithSessionClient } from '@/lib/account/profile';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await resolveAccountProfileWithSessionClient(supabase, user);
        if (profile.subscription_tier !== 'expert') {
            return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;
        const updates = await req.json();
        const normalizedUpdates = { ...updates };

        if (normalizedUpdates.status === 'paid' && !normalizedUpdates.paid_at) {
            normalizedUpdates.paid_at = new Date().toISOString().slice(0, 10);
        }

        if (normalizedUpdates.status && normalizedUpdates.status !== 'paid' && normalizedUpdates.paid_at === undefined) {
            normalizedUpdates.paid_at = null;
        }

        const { data, error } = await supabase
            .from('invoices')
            .update(normalizedUpdates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await resolveAccountProfileWithSessionClient(supabase, user);
        if (profile.subscription_tier !== 'expert') {
            return NextResponse.json({ error: 'Expert tier required' }, { status: 403 });
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;

        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
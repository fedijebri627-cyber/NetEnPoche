import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';
import { resolveAccountProfileWithSessionClient } from '@/lib/account/profile';
import { createAppUrl, getRequestAppUrl } from '@/lib/app-url';

export async function POST(req: Request) {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await resolveAccountProfileWithSessionClient(supabase, user);

        if (!profile.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No active Stripe customer found.' },
                { status: 400 }
            );
        }

        const { url } = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: createAppUrl('/dashboard/settings', getRequestAppUrl(req)),
        });

        return NextResponse.json({ url });
    } catch (error: unknown) {
        console.error('Stripe Portal Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}


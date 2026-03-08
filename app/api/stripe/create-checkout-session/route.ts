import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { getRequestAppUrl } from '@/lib/app-url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
    apiVersion: '2026-02-25.clover',
});

const STRIPE_PLANS = {
    pro: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
        annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
    },
    expert: {
        monthly: process.env.STRIPE_PRICE_EXPERT_MONTHLY,
        annual: process.env.STRIPE_PRICE_EXPERT_ANNUAL,
    },
};

export async function POST(req: Request) {
    try {
        const supabase = await createServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { tier, billingPeriod } = body;

        if (!tier || !billingPeriod || !STRIPE_PLANS[tier as keyof typeof STRIPE_PLANS]) {
            return NextResponse.json({ error: 'Invalid tier or billing period' }, { status: 400 });
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'La configuration Stripe est manquante sur ce serveur.' },
                { status: 500 }
            );
        }

        const priceId = STRIPE_PLANS[tier as keyof typeof STRIPE_PLANS][billingPeriod as 'monthly' | 'annual'];
        if (!priceId) {
            return NextResponse.json(
                { error: `Le prix Stripe ${tier}/${billingPeriod} n'est pas configure.` },
                { status: 500 }
            );
        }

        const appUrl = getRequestAppUrl(req);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            subscription_data: {
                trial_period_days: 14,
            },
            success_url: `${appUrl}/dashboard?upgrade=success`,
            cancel_url: `${appUrl}/dashboard`,
            client_reference_id: user.id,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}


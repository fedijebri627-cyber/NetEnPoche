import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
    apiVersion: '2026-02-25.clover',
});

// Since we might not have STRIPE_PLANS exported correctly from config, let's define them here
const STRIPE_PLANS = {
    pro: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_123',
        annual: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_456'
    },
    expert: {
        monthly: process.env.STRIPE_PRICE_EXPERT_MONTHLY || 'price_789',
        annual: process.env.STRIPE_PRICE_EXPERT_ANNUAL || 'price_012'
    }
};

export async function POST(req: Request) {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { tier, billingPeriod } = body;

        if (!tier || !billingPeriod || !STRIPE_PLANS[tier as keyof typeof STRIPE_PLANS]) {
            return NextResponse.json({ error: 'Invalid tier or billing period' }, { status: 400 });
        }

        const priceId = STRIPE_PLANS[tier as keyof typeof STRIPE_PLANS][billingPeriod as 'monthly' | 'annual'];
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json(
                { error: 'La configuration Stripe est manquante sur ce serveur. Veuillez contacter l\'administrateur.' },
                { status: 500 }
            );
        }

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
                trial_period_days: 14, // 14-day free trial
            },
            success_url: `${appUrl}/dashboard?upgrade=success`,
            cancel_url: `${appUrl}/dashboard`,
            client_reference_id: user.id,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

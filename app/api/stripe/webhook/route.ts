import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize a Supabase Service Role client to bypass RLS during webhook processing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                if (session.mode === 'subscription' && session.client_reference_id) {
                    const subscriptionId = session.subscription as string;
                    const customerId = session.customer as string;

                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    console.log(subscription) // Temporary debug

                    // Determine tier based on plan ID checking against our environment variables
                    const priceId = subscription.items.data[0].price.id;
                    const expertMonthlyPriceId = process.env.STRIPE_PRICE_EXPERT_MONTHLY;
                    const expertAnnualPriceId = process.env.STRIPE_PRICE_EXPERT_ANNUAL;

                    let tier = 'pro'; // Default fallback
                    if (priceId === expertMonthlyPriceId || priceId === expertAnnualPriceId) {
                        tier = 'expert';
                    }

                    // Ensure timestamps
                    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;

                    // Update DB
                    await supabase
                        .from('users')
                        .update({
                            subscription_tier: tier,
                            subscription_status: subscription.status,
                            stripe_customer_id: customerId,
                            stripe_subscription_id: subscriptionId,
                            trial_ends_at: trialEnd,
                        })
                        .eq('id', session.client_reference_id);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;

                const priceId = subscription.items.data[0].price.id;
                const expertMonthlyPriceId = process.env.STRIPE_PRICE_EXPERT_MONTHLY;
                const expertAnnualPriceId = process.env.STRIPE_PRICE_EXPERT_ANNUAL;

                let tier = 'pro';
                if (priceId === expertMonthlyPriceId || priceId === expertAnnualPriceId) {
                    tier = 'expert';
                }

                const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null;

                await supabase
                    .from('users')
                    .update({
                        subscription_tier: tier,
                        subscription_status: subscription.status,
                        trial_ends_at: trialEnd,
                    })
                    .eq('stripe_subscription_id', subscription.id);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                await supabase
                    .from('users')
                    .update({
                        subscription_tier: 'free',
                        subscription_status: 'canceled',
                        stripe_subscription_id: null,
                    })
                    .eq('stripe_subscription_id', subscription.id);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const subscriptionId = (invoice as any).subscription as string;

                if (subscriptionId) {
                    await supabase
                        .from('users')
                        .update({
                            subscription_status: 'past_due',
                        })
                        .eq('stripe_subscription_id', subscriptionId);

                    // Note: Add logic here to trigger a Resend email alerting the user of payment failure
                }
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook handler failed:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

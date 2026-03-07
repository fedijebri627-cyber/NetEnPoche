import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export type RequiredTier = 'pro' | 'expert';

/**
 * Server-side helper to protect API routes based on subscription tier.
 * Extracts the user's tier directly from their JWT session metadata (synced via pgSQL trigger).
 * Returns early with a 403 Forbidden Response if requirements aren't met.
 */
export async function requireSubscription(requiredTier: RequiredTier, req?: Request) {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) {
        return {
            authorized: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
            user: null,
            tier: 'free'
        };
    }

    // The subscription_tier is injected into raw_user_meta_data by our SQL trigger
    const userTier = session.user.user_metadata?.subscription_tier || 'free';

    const tierRanks = {
        'free': 0,
        'pro': 1,
        'expert': 2
    };

    const userRank = tierRanks[userTier as keyof typeof tierRanks] || 0;
    const requiredRank = tierRanks[requiredTier];

    if (userRank < requiredRank) {
        return {
            authorized: false,
            response: NextResponse.json(
                {
                    error: 'upgrade_required',
                    requiredTier,
                    currentTier: userTier,
                    message: `This feature requires the ${requiredTier.toUpperCase()} plan.`
                },
                { status: 403 }
            ),
            user: session.user,
            tier: userTier
        };
    }

    return {
        authorized: true,
        response: null,
        user: session.user,
        tier: userTier
    };
}

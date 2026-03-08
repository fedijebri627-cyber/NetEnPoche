import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ensureAccountProfile } from '@/lib/account/profile';

export type RequiredTier = 'pro' | 'expert';

export async function requireSubscription(requiredTier: RequiredTier) {
    const supabase = await createServerClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session || !session.user) {
        return {
            authorized: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
            user: null,
            tier: 'free',
        };
    }

    const profile = await ensureAccountProfile(session.user);
    const userTier = profile.subscription_tier;

    const tierRanks = {
        free: 0,
        pro: 1,
        expert: 2,
    };

    const userRank = tierRanks[userTier];
    const requiredRank = tierRanks[requiredTier];

    if (userRank < requiredRank) {
        return {
            authorized: false,
            response: NextResponse.json(
                {
                    error: 'upgrade_required',
                    requiredTier,
                    currentTier: userTier,
                    message: `This feature requires the ${requiredTier.toUpperCase()} plan.`,
                },
                { status: 403 }
            ),
            user: session.user,
            tier: userTier,
        };
    }

    return {
        authorized: true,
        response: null,
        user: session.user,
        tier: userTier,
    };
}


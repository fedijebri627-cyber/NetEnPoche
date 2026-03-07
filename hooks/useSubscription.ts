'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export type FeatureFlag = 'ir_estimator' | 'client_tracker' | 'pdf_export' | 'advanced_alerts';

export function useSubscription() {
    const [user, setUser] = useState<User | null>(null);
    const [tier, setTier] = useState<'free' | 'pro' | 'expert'>('free');
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);

    const supabase = createBrowserClient();

    // Fetch tier from the users table (source of truth)
    async function fetchTierFromDB(userId: string) {
        const { data } = await supabase
            .from('users')
            .select('subscription_tier, subscription_status')
            .eq('id', userId)
            .single();

        if (data?.subscription_tier) {
            setTier(data.subscription_tier as 'free' | 'pro' | 'expert');
            setStatus(data.subscription_status || null);
        }
    }

    useEffect(() => {
        async function loadSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                // Set initial tier from metadata, then fetch from DB for accuracy
                setTier(session.user.user_metadata?.subscription_tier || 'free');
                await fetchTierFromDB(session.user.id);
            }
            setLoading(false);
        }
        loadSession();

        // Listen for auth changes (like logging in or token refreshes post-upgrade)
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
            if (session?.user) {
                setUser(session.user);
                setTier(session.user.user_metadata?.subscription_tier || 'free');
                await fetchTierFromDB(session.user.id);
            } else {
                setUser(null);
                setTier('free');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const canAccess = (feature: FeatureFlag): boolean => {
        switch (feature) {
            case 'ir_estimator':
            case 'pdf_export':
                // Available to Pro and Expert
                return tier === 'pro' || tier === 'expert';

            case 'client_tracker':
            case 'advanced_alerts':
                // Exclusive to Expert
                return tier === 'expert';

            default:
                return false;
        }
    };

    return {
        user,
        tier,
        status,
        loading,
        canAccess,
        isTrialing: status === 'trialing',
        upgradeToPro: () => { /* Redirect logic placeholder */ },
        manageBilling: () => { /* Redirect logic placeholder */ }
    };
}

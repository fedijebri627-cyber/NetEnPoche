'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import {
    getHighestSubscriptionTier,
    normalizeSubscriptionTier,
    type SubscriptionTier,
} from '@/lib/account/profile';

export type FeatureFlag = 'ir_estimator' | 'client_tracker' | 'pdf_export' | 'advanced_alerts';

export function useSubscription() {
    const [user, setUser] = useState<User | null>(null);
    const [tier, setTier] = useState<SubscriptionTier>('free');
    const [fullName, setFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);

    const supabase = createBrowserClient();

    async function fetchProfileFromApi() {
        try {
            const response = await fetch('/api/account/profile', { cache: 'no-store' });
            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setTier((currentTier) => getHighestSubscriptionTier(currentTier, data.tier));
            setStatus(data.status || null);
            setFullName(data.fullName || null);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    useEffect(() => {
        let isMounted = true;

        async function hydrate(sessionOverride?: Session | null) {
            setLoading(true);
            const session = sessionOverride ?? (await supabase.auth.getSession()).data.session;

            if (!isMounted) {
                return;
            }

            if (session?.user) {
                const sessionTier = normalizeSubscriptionTier(session.user.user_metadata?.subscription_tier);
                setUser(session.user);
                setTier((currentTier) => getHighestSubscriptionTier(currentTier, sessionTier));
                setFullName(
                    typeof session.user.user_metadata?.full_name === 'string'
                        ? session.user.user_metadata.full_name
                        : null
                );
                await fetchProfileFromApi();
            } else {
                setUser(null);
                setTier('free');
                setFullName(null);
                setStatus(null);
            }

            if (isMounted) {
                setLoading(false);
            }
        }

        void hydrate();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
            await hydrate(session);
        });

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, [supabase]);

    const canAccess = (feature: FeatureFlag): boolean => {
        switch (feature) {
            case 'ir_estimator':
            case 'pdf_export':
                return tier === 'pro' || tier === 'expert';
            case 'client_tracker':
            case 'advanced_alerts':
                return tier === 'expert';
            default:
                return false;
        }
    };

    return {
        user,
        tier,
        fullName,
        status,
        loading,
        canAccess,
        isTrialing: status === 'trialing',
        isPro: tier === 'pro' || tier === 'expert',
        isExpert: tier === 'expert',
        upgradeToPro: () => { },
        manageBilling: () => { },
    };
}



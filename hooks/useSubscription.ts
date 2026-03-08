'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export type FeatureFlag = 'ir_estimator' | 'client_tracker' | 'pdf_export' | 'advanced_alerts';

export function useSubscription() {
    const [user, setUser] = useState<User | null>(null);
    const [tier, setTier] = useState<'free' | 'pro' | 'expert'>('free');
    const [fullName, setFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);

    const supabase = createBrowserClient();

    // Fetch tier and profile from the users table (source of truth)
    async function fetchProfileFromDB(userId: string) {
        try {
            const { data } = await supabase
                .from('users')
                .select('subscription_tier, subscription_status, full_name')
                .eq('id', userId)
                .single();

            if (data) {
                setTier((data.subscription_tier as 'free' | 'pro' | 'expert') || 'free');
                setStatus(data.subscription_status || null);
                setFullName(data.full_name || null);
            }
        } catch (e) {
            console.error('Error fetching profile:', e);
        }
    }

    useEffect(() => {
        async function loadSession() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                // Set initial tier from metadata for speed, but fetch from DB for truth
                setTier(session.user.user_metadata?.subscription_tier || 'free');
                await fetchProfileFromDB(session.user.id);
            }
            setLoading(false);
        }
        loadSession();

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                await fetchProfileFromDB(session.user.id);
            } else {
                setUser(null);
                setTier('free');
                setFullName(null);
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
        upgradeToPro: () => { /* Redirect logic placeholder */ },
        manageBilling: () => { /* Redirect logic placeholder */ }
    };
}

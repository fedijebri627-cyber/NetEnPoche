import { createClient, type User } from '@supabase/supabase-js';

export type SubscriptionTier = 'free' | 'pro' | 'expert';

export interface AccountProfileCore {
    id: string;
    email: string | null;
    full_name: string | null;
    subscription_tier: SubscriptionTier;
    subscription_status: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    trial_ends_at: string | null;
}

export interface AccountBusinessProfile extends AccountProfileCore {
    business_name: string | null;
    siret: string | null;
    business_fields_ready: boolean;
}

const ACCOUNT_CORE_SELECT = 'id, email, full_name, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, trial_ends_at';
const ACCOUNT_BUSINESS_SELECT = 'id, email, full_name, business_name, siret, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, trial_ends_at';

const tierRank: Record<SubscriptionTier, number> = {
    free: 0,
    pro: 1,
    expert: 2,
};

let adminClient: ReturnType<typeof createClient> | null = null;

function normalizeNullableString(value: unknown) {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

function getSupabaseAdminClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase admin client is not configured.');
    }

    if (!adminClient) {
        adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }

    return adminClient;
}

function extractErrorDetail(error: unknown) {
    if (typeof error !== 'object' || error === null || !('details' in error)) {
        return '';
    }

    return typeof error.details === 'string' ? error.details : '';
}

function isBusinessFieldError(error: unknown) {
    const message = `${error instanceof Error ? error.message : ''} ${extractErrorDetail(error)}`;
    return message.includes('business_name') || message.includes('siret');
}

export function normalizeSubscriptionTier(value: unknown): SubscriptionTier {
    return value === 'expert' || value === 'pro' ? value : 'free';
}

export function getHighestSubscriptionTier(...values: unknown[]) {
    return values
        .map(normalizeSubscriptionTier)
        .reduce<SubscriptionTier>((highest, current) => {
            return tierRank[current] > tierRank[highest] ? current : highest;
        }, 'free');
}

function mapCoreProfile(row: Partial<AccountProfileCore> | null, user: User): AccountProfileCore {
    return {
        id: row?.id || user.id,
        email: row?.email || user.email || null,
        full_name: normalizeNullableString(row?.full_name) || normalizeNullableString(user.user_metadata?.full_name),
        subscription_tier: getHighestSubscriptionTier(row?.subscription_tier, user.user_metadata?.subscription_tier),
        subscription_status: normalizeNullableString(row?.subscription_status),
        stripe_customer_id: normalizeNullableString(row?.stripe_customer_id),
        stripe_subscription_id: normalizeNullableString(row?.stripe_subscription_id),
        trial_ends_at: normalizeNullableString(row?.trial_ends_at),
    };
}

export async function ensureAccountProfile(user: User) {
    const supabaseAdmin = getSupabaseAdminClient();

    const { data: existing, error } = await supabaseAdmin
        .from('users')
        .select(ACCOUNT_CORE_SELECT)
        .eq('id', user.id)
        .maybeSingle<AccountProfileCore>();

    if (error) {
        throw error;
    }

    if (!existing) {
        const { data: created, error: createError } = await supabaseAdmin
            .from('users')
            .upsert(
                {
                    id: user.id,
                    email: user.email || '',
                    full_name: normalizeNullableString(user.user_metadata?.full_name),
                    subscription_tier: normalizeSubscriptionTier(user.user_metadata?.subscription_tier),
                } as never,
                { onConflict: 'id' }
            )
            .select(ACCOUNT_CORE_SELECT)
            .single<AccountProfileCore>();

        if (createError) {
            throw createError;
        }

        return mapCoreProfile(created, user);
    }

    const merged = mapCoreProfile(existing, user);
    const shouldSync =
        merged.subscription_tier !== existing.subscription_tier ||
        (!existing.email && merged.email) ||
        (!existing.full_name && merged.full_name);

    if (!shouldSync) {
        return merged;
    }

    const { data: updated, error: updateError } = await supabaseAdmin
        .from('users')
        .update(
            {
                email: merged.email || user.email || '',
                full_name: merged.full_name,
                subscription_tier: merged.subscription_tier,
            } as never
        )
        .eq('id', user.id)
        .select(ACCOUNT_CORE_SELECT)
        .single<AccountProfileCore>();

    if (updateError) {
        throw updateError;
    }

    return mapCoreProfile(updated, user);
}

export async function getBusinessAccountProfile(user: User): Promise<AccountBusinessProfile> {
    const core = await ensureAccountProfile(user);
    const supabaseAdmin = getSupabaseAdminClient();

    const { data, error } = await supabaseAdmin
        .from('users')
        .select(ACCOUNT_BUSINESS_SELECT)
        .eq('id', user.id)
        .maybeSingle<AccountBusinessProfile>();

    if (error) {
        if (isBusinessFieldError(error)) {
            return {
                ...core,
                business_name: null,
                siret: null,
                business_fields_ready: false,
            };
        }

        throw error;
    }

    return {
        ...core,
        full_name: normalizeNullableString(data?.full_name) || core.full_name,
        business_name: normalizeNullableString(data?.business_name),
        siret: normalizeNullableString(data?.siret),
        business_fields_ready: true,
    };
}

export async function updateBusinessAccountProfile(
    userId: string,
    updates: Pick<AccountBusinessProfile, 'full_name' | 'business_name' | 'siret'>
) {
    const supabaseAdmin = getSupabaseAdminClient();

    const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates as never)
        .eq('id', userId)
        .select(ACCOUNT_BUSINESS_SELECT)
        .single<AccountBusinessProfile>();

    if (error) {
        if (isBusinessFieldError(error)) {
            throw new Error('BUSINESS_PROFILE_COLUMNS_MISSING');
        }

        throw error;
    }

    return {
        ...data,
        business_fields_ready: true,
        subscription_tier: normalizeSubscriptionTier(data.subscription_tier),
    };
}

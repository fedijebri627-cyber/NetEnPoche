export const STRIPE_PLANS = {
    pro: {
        name: 'Pro',
        monthly: 'price_pro_monthly_id_placeholder', // To be replaced with actual Stripe Price IDs
        annual: 'price_pro_annual_id_placeholder',
    },
    expert: {
        name: 'Expert',
        monthly: 'price_expert_monthly_id_placeholder',
        annual: 'price_expert_annual_id_placeholder',
    }
} as const;

export type PlanTier = keyof typeof STRIPE_PLANS;
export type BillingPeriod = 'monthly' | 'annual';

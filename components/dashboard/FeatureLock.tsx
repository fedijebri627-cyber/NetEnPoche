'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';
import { useSubscription } from '@/hooks/useSubscription';

export interface FeatureLockProps {
    children: React.ReactNode;
    featureName: string;
    requiredTier: 'pro' | 'expert';
}

const LABELS = {
    unlockCopy: 'Passez au plan',
    unlockMiddle: 'pour debloquer cette fonctionnalite exclusive.',
    unlockButton: 'Debloquer',
};

export function FeatureLock({ children, featureName, requiredTier }: FeatureLockProps) {
    const [showModal, setShowModal] = useState(false);
    const { tier, loading } = useSubscription();

    if (loading) return null;

    const isExpert = tier === 'expert';
    const isPro = tier === 'pro' || isExpert;
    const hasAccess = requiredTier === 'expert' ? isExpert : isPro;

    if (hasAccess) return <>{children}</>;

    return (
        <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="pointer-events-none h-full select-none blur-[6px] opacity-40 filter">
                {children}
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 p-6 backdrop-blur-[2px]">
                <div className="flex w-full max-w-[340px] transform flex-col items-center rounded-3xl bg-white px-8 py-6 text-center shadow-xl transition-transform duration-300 group-hover:scale-105">
                    <div className="mb-4 rounded-2xl bg-[#0d1b35] p-3 shadow-md">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 font-syne text-xl font-bold text-[#0d1b35]">{featureName}</h3>
                    <p className="mb-6 max-w-[250px] text-sm leading-6 text-slate-500">
                        {LABELS.unlockCopy} <strong className="capitalize text-slate-800">{requiredTier}</strong> {LABELS.unlockMiddle}
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full rounded-xl bg-[#00c875] px-6 py-3 font-bold text-white shadow-lg shadow-[#00c875]/20 transition hover:bg-[#00c875]/90"
                    >
                        {LABELS.unlockButton} {featureName}
                    </button>
                </div>
            </div>

            <UpgradeModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}

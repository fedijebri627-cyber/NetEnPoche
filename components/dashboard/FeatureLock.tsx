'use client';

import { useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';
import { useSubscription } from '@/hooks/useSubscription';

export interface FeatureLockProps {
    children: React.ReactNode;
    featureName: string;
    requiredTier: 'pro' | 'expert';
}

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
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="flex w-full max-w-[340px] transform flex-col items-center rounded-3xl bg-white px-8 py-6 text-center shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                >
                    <div className="mb-4 rounded-2xl bg-[#0d1b35] p-3 shadow-md">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-slate-900">{featureName}</h3>
                    <p className="mb-5 max-w-[260px] text-sm leading-6 text-slate-500">
                        Disponible avec le plan <strong className="font-medium capitalize text-slate-800">{requiredTier}</strong>. La mise a niveau globale debloque toutes les cartes premium d'un coup.
                    </p>
                    <span className="inline-flex items-center gap-2 text-[12px] font-medium text-slate-500">
                        Voir l'offre
                        <ChevronRight className="h-4 w-4" />
                    </span>
                </button>
            </div>

            <UpgradeModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}

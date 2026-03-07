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

export function FeatureLock({ children, featureName, requiredTier }: FeatureLockProps) {
    const [showModal, setShowModal] = useState(false);
    const { tier, loading } = useSubscription();

    if (loading) return null;

    const isExpert = tier === 'expert';
    const isPro = tier === 'pro' || isExpert;
    const hasAccess = requiredTier === 'expert' ? isExpert : isPro;

    if (hasAccess) return <>{children}</>;

    return (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200">
            {/* Blurred Content */}
            <div className="filter blur-[6px] pointer-events-none opacity-40 select-none">
                {children}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 p-6 backdrop-blur-[2px]">
                <div className="bg-white px-8 py-6 rounded-3xl shadow-xl flex flex-col items-center text-center transform group-hover:scale-105 transition-transform duration-300">
                    <div className="bg-[#0d1b35] p-3 rounded-2xl mb-4 shadow-md">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold font-syne text-[#0d1b35] mb-2">{featureName}</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-[250px]">
                        Passez au plan <strong className="text-slate-800 capitalize">{requiredTier}</strong> pour débloquer cette fonctionnalité exclusive.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full bg-[#00c875] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#00c875]/90 transition shadow-lg shadow-[#00c875]/20"
                    >
                        Débloquer {featureName}
                    </button>
                </div>
            </div>

            <UpgradeModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}

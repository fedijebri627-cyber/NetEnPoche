'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { calculateCompositeNetBreakdown, formatCurrency } from '@/lib/dashboard-insights';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';

function WaterfallContent() {
    const { entries, config } = useDashboard();
    const totalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const totals = calculateCompositeNetBreakdown(totalCA, config);

    return (
        <div className="rounded-[12px] border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-slate-100 p-2">
                    <Wallet className="h-4 w-4 text-slate-500" />
                </div>
                <h2 className="text-lg font-medium text-slate-900">De votre CA brut à votre poche</h2>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between rounded-[8px] bg-slate-50 px-4 py-3 text-[13px]">
                    <span className="text-slate-700">CA annuel brut</span>
                    <span className="font-medium text-slate-900">{formatCurrency(totalCA)}</span>
                </div>
                <div className="flex items-center justify-between rounded-[8px] border border-slate-200 px-4 py-3 text-[13px]">
                    <span className="text-slate-700">- URSSAF</span>
                    <span className="font-medium text-[#791f1f]">-{formatCurrency(totals.urssaf)}</span>
                </div>
                <div className="flex items-center justify-between rounded-[8px] border border-slate-200 px-4 py-3 text-[13px]">
                    <span className="text-slate-700">- Impôt estimé</span>
                    <span className="font-medium text-[#791f1f]">-{formatCurrency(totals.ir)}</span>
                </div>
                <div className="flex items-center justify-between rounded-[8px] border border-slate-200 px-4 py-3 text-[13px]">
                    <span className="text-slate-700">- CFE provision</span>
                    <span className="font-medium text-[#791f1f]">-{formatCurrency(totals.cfe)}</span>
                </div>
            </div>

            <div className="my-4 h-px bg-slate-200" />

            <div className="flex items-center justify-between rounded-[8px] border border-[#b5dfc7] bg-[#eaf3de] px-4 py-4">
                <div>
                    <div className="text-[12px] uppercase tracking-[0.04em] text-[#27500a]">Net réel en poche</div>
                    <div className="mt-1 text-[22px] font-medium text-[#1d9e75]">{formatCurrency(totals.netReel)}</div>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                    Taux global d&apos;imposition : {(totals.tauxGlobal * 100).toFixed(1)}%
                </div>
            </div>
        </div>
    );
}

export function IRWaterfallChart() {
    const { loading } = useDashboard();
    const { tier } = useSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    if (loading) return <div className="h-[320px] animate-pulse rounded-xl bg-slate-100" />;

    if (tier !== 'free') {
        return <WaterfallContent />;
    }

    return (
        <div className="group relative">
            <div className="pointer-events-none blur-[6px] opacity-45">
                <WaterfallContent />
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-white/35 p-6 backdrop-blur-[2px]">
                <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="rounded-[12px] bg-white px-6 py-5 text-center shadow-xl"
                >
                    <div className="mb-3 text-lg font-medium text-slate-900">Découvrez votre vrai net</div>
                    <div className="text-sm text-slate-600">Débloquez le détail complet URSSAF, impôt et CFE.</div>
                    <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium text-slate-700">
                        Passer à Pro
                    </div>
                </button>
            </div>

            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
}

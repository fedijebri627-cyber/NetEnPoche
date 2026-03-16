'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Settings2, Percent, Layers3, Lock } from 'lucide-react';
import { TAX_RATES_2026 } from '@/config/tax-rates-2026';
import type { ActivityType } from '@/lib/calculations';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from './UpgradeModal';

const activityOptions: Array<{ value: ActivityType; label: string }> = [
    { value: 'services_bnc', label: 'Prestations de services (BNC)' },
    { value: 'services_bic', label: 'Prestations de services (BIC)' },
    { value: 'liberal', label: 'Activite liberale (BNC)' },
    { value: 'vente', label: 'Achat / Revente (BIC)' },
];

function getFallbackSecondaryType(primaryType: ActivityType): ActivityType {
    return primaryType === 'vente' ? 'services_bnc' : 'vente';
}

function getVlRate(activityType: ActivityType) {
    if (activityType === 'services_bic') return TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BIC * 100;
    if (activityType === 'vente') return TAX_RATES_2026.VERSEMENT_LIBERATOIRE.VENTE * 100;
    return TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BNC * 100;
}

function getUrssafRate(activityType: ActivityType, acreEnabled: boolean) {
    const baseRate = activityType === 'vente'
        ? TAX_RATES_2026.URSSAF.VENTE
        : activityType === 'services_bic'
            ? TAX_RATES_2026.URSSAF.SERVICES_BIC
            : activityType === 'liberal'
                ? TAX_RATES_2026.URSSAF.LIBERAL
                : TAX_RATES_2026.URSSAF.SERVICES_BNC;

    return (acreEnabled ? baseRate * TAX_RATES_2026.ACRE_MULTIPLIER : baseRate) * 100;
}

export function ActivityConfigPanel() {
    const { config, updateConfig, loading } = useDashboard();
    const { isExpert } = useSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    if (loading) return <div className="animate-pulse h-36 bg-slate-100 rounded-2xl mb-6"></div>;

    const mixedModeEnabled = Boolean(config.secondary_activity_type && Number(config.secondary_activity_share || 0) > 0);
    const primaryShare = Math.round((1 - Number(config.secondary_activity_share || 0)) * 100);
    const secondaryShare = Math.round(Number(config.secondary_activity_share || 0) * 100);
    const currentUrssafRate = getUrssafRate(config.activity_type, config.acre_enabled);
    const currentIrVLRate = config.versement_liberatoire ? getVlRate(config.activity_type) : 0;

    const handlePrimaryTypeChange = (nextType: ActivityType) => {
        const nextConfig: Partial<typeof config> = { activity_type: nextType };
        if (config.secondary_activity_type === nextType) {
            nextConfig.secondary_activity_type = getFallbackSecondaryType(nextType);
        }
        void updateConfig(nextConfig);
    };

    const toggleMixedMode = (enabled: boolean) => {
        if (!isExpert) {
            setShowUpgradeModal(true);
            return;
        }

        if (!enabled) {
            void updateConfig({
                secondary_activity_type: null,
                secondary_activity_share: null,
            });
            return;
        }

        void updateConfig({
            secondary_activity_type: config.secondary_activity_type || getFallbackSecondaryType(config.activity_type),
            secondary_activity_share: config.secondary_activity_share ?? 0.2,
        });
    };

    return (
        <>
            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-2">
                        <div className="bg-slate-100 p-2 rounded-lg"><Settings2 className="w-5 h-5 text-slate-600" /></div>
                        <div>
                            <h2 className="text-lg font-medium text-slate-900">Configuration d'activite</h2>
                            <p className="mt-1 text-[12px] text-slate-500">Le cockpit fiscal et les projections s'appuient sur ce profil d'activite.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => toggleMixedMode(!mixedModeEnabled)}
                        className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 transition ${mixedModeEnabled ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                    >
                        {isExpert ? <Layers3 className="w-4 h-4 text-indigo-500" /> : <Lock className="w-4 h-4 text-slate-400" />}
                        <span className="text-[12px] font-medium">Mix d'activites</span>
                        {!isExpert && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.04em] text-slate-600">Expert</span>}
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-4 space-y-2">
                        <label className="text-[12px] font-medium text-slate-700">Activite principale</label>
                        <select
                            value={config.activity_type}
                            onChange={(event) => handlePrimaryTypeChange(event.target.value as ActivityType)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00c875]/20 focus:border-[#00c875] transition"
                        >
                            {activityOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {mixedModeEnabled && (
                        <>
                            <div className="xl:col-span-4 space-y-2">
                                <label className="text-[12px] font-medium text-slate-700">Activite secondaire</label>
                                <select
                                    value={config.secondary_activity_type || ''}
                                    onChange={(event) => void updateConfig({ secondary_activity_type: event.target.value as ActivityType })}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                                >
                                    {activityOptions
                                        .filter((option) => option.value !== config.activity_type)
                                        .map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="xl:col-span-4 space-y-2">
                                <label className="text-[12px] font-medium text-slate-700">Part de l'activite secondaire</label>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max="90"
                                        step="5"
                                        value={secondaryShare || 20}
                                        onChange={(event) => void updateConfig({ secondary_activity_share: Number(event.target.value) / 100 })}
                                        className="w-full accent-indigo-600"
                                    />
                                    <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-500">
                                        <span>Principale {primaryShare}%</span>
                                        <span>Secondaire {secondaryShare}%</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={`${mixedModeEnabled ? 'xl:col-span-12' : 'xl:col-span-8'} flex flex-col sm:flex-row sm:items-end gap-4`}>
                        <label className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition flex-1">
                            <input
                                type="checkbox"
                                checked={config.acre_enabled}
                                onChange={(event) => void updateConfig({ acre_enabled: event.target.checked })}
                                className="w-4 h-4 text-[#00c875] rounded focus:ring-[#00c875]"
                            />
                            <span className="text-[12px] font-medium text-slate-700">Bénéficiaire ACRE</span>
                        </label>

                        <label className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition flex-1">
                            <input
                                type="checkbox"
                                checked={config.versement_liberatoire}
                                onChange={(event) => void updateConfig({ versement_liberatoire: event.target.checked })}
                                className="w-4 h-4 text-[#00c875] rounded focus:ring-[#00c875]"
                            />
                            <span className="text-[12px] font-medium text-slate-700">Versement libératoire (IR)</span>
                        </label>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                    <div className="flex items-center space-x-1.5 rounded-full border border-[#f09595] bg-[#fcebeb] px-3 py-1 text-[11px] font-medium text-[#791f1f]">
                        <Percent className="w-3.5 h-3.5" />
                        <span>URSSAF principal: {currentUrssafRate.toFixed(1)}%</span>
                    </div>
                    {config.versement_liberatoire && (
                        <div className="flex items-center space-x-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-900">
                            <Percent className="w-3.5 h-3.5" />
                            <span>IR libératoire : {currentIrVLRate.toFixed(1)}%</span>
                        </div>
                    )}
                    {mixedModeEnabled && config.secondary_activity_type && (
                        <div className="flex items-center space-x-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
                            <Layers3 className="w-3.5 h-3.5" />
                            <span>Mix: {primaryShare}% / {secondaryShare}%</span>
                        </div>
                    )}
                </div>
            </div>
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </>
    );
}

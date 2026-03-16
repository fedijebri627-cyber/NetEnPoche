'use client';

import { useMemo, useState } from 'react';
import { FeatureLock } from './FeatureLock';
import { useDashboard } from '@/contexts/DashboardContext';
import { formatCurrency, simulateScenario } from '@/lib/dashboard-insights';
import { ArrowRight, TrendingUp } from 'lucide-react';

type ScenarioMode = 'extra_invoice' | 'price_increase' | 'tva_crossing' | 'vl_toggle';

const modeLabels: Record<ScenarioMode, { title: string; description: string; defaultValue: number }> = {
    extra_invoice: {
        title: 'Facture supplémentaire',
        description: "Simulez l'impact d'une facture en plus sur votre net et vos réserves.",
        defaultValue: 2000,
    },
    price_increase: {
        title: 'Hausse tarifaire',
        description: 'Mesurez le gain net si vous relevez vos prix moyens.',
        defaultValue: 10,
    },
    tva_crossing: {
        title: 'Passage TVA',
        description: "Visualisez l'effet d'un dépassement du seuil TVA sur votre trajectoire.",
        defaultValue: 1500,
    },
    vl_toggle: {
        title: 'Versement libératoire',
        description: 'Comparez instantanément votre situation avec et sans versement libératoire.',
        defaultValue: 0,
    },
};

export function ScenarioSimulatorCard() {
    const { entries, config, loading } = useDashboard();
    const [mode, setMode] = useState<ScenarioMode>('extra_invoice');
    const [value, setValue] = useState(modeLabels.extra_invoice.defaultValue.toString());

    const scenario = useMemo(
        () => simulateScenario(entries, config, mode, parseFloat(value) || 0),
        [config, entries, mode, value]
    );

    if (loading) return <div className="h-72 animate-pulse rounded-[12px] bg-slate-100" />;

    const switchMode = (nextMode: ScenarioMode) => {
        setMode(nextMode);
        setValue(modeLabels[nextMode].defaultValue.toString());
    };

    const needsInput = mode !== 'vl_toggle';
    const valueSuffix = mode === 'price_increase' ? '%' : 'EUR';

    return (
        <FeatureLock featureName="Scenario Lab v2" requiredTier="pro">
            <div className="rounded-[12px] border border-slate-200 bg-white p-4">
                <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                        <h3 className="flex items-center gap-2 text-[18px] font-medium text-slate-900">
                            <TrendingUp className="h-5 w-5 text-[#6366f1]" />
                            Scenario Lab v2
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-slate-500">Testez vos décisions de facturation, de prix, de TVA et d'option fiscale avant d'agir.</p>
                    </div>
                    <div className="max-w-full rounded-[10px] bg-slate-50 px-4 py-3 text-[13px] leading-6 text-slate-600 xl:max-w-[240px] xl:text-right">
                        <span className="font-medium text-slate-900">Mode actif :</span>{' '}
                        <span className="break-words">{modeLabels[mode].title}</span>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
                    <div className="space-y-5" data-tour="scenario-lab-controls">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {(Object.keys(modeLabels) as ScenarioMode[]).map((scenarioMode) => (
                                <button
                                    key={scenarioMode}
                                    onClick={() => switchMode(scenarioMode)}
                                    className={`rounded-[10px] border px-4 py-4 text-left transition ${mode === scenarioMode ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <div className="text-[18px] font-medium leading-7">{modeLabels[scenarioMode].title}</div>
                                    <div className="mt-1 text-[13px] leading-7 text-inherit/85">{modeLabels[scenarioMode].description}</div>
                                </button>
                            ))}
                        </div>

                        <div className="rounded-[10px] border border-slate-100 bg-slate-50 p-4">
                            <label className="mb-2 block text-[13px] font-medium text-slate-600">
                                {needsInput ? (mode === 'price_increase' ? 'Pourcentage de hausse' : 'Valeur de simulation') : 'Comparaison active'}
                            </label>
                            {needsInput ? (
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step={mode === 'price_increase' ? '1' : '100'}
                                        value={value}
                                        onChange={(event) => setValue(event.target.value)}
                                        className="w-full rounded-[8px] border border-slate-200 bg-white px-4 py-3 pr-16 text-[18px] font-medium text-slate-900 transition focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">{valueSuffix}</span>
                                </div>
                            ) : (
                                <div className="rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-[13px] leading-6 text-slate-600">
                                    Le simulateur compare votre configuration actuelle avec l'autre option fiscale.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[10px] border border-slate-100 bg-slate-50 p-4">
                        <div className="grid gap-3">
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] uppercase tracking-[0.04em] text-slate-500">Net final estimé</div>
                                <div className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[22px] font-medium leading-none tracking-tight text-slate-900">{formatCurrency(scenario.finalNet)}</div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] uppercase tracking-[0.04em] text-slate-500">Delta net</div>
                                <div className={`mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[22px] font-medium leading-none tracking-tight ${scenario.netDelta >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                                    {scenario.netDelta >= 0 ? '+' : ''}{formatCurrency(scenario.netDelta)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-[0.04em] text-slate-500">URSSAF supplémentaire</div>
                                <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium leading-none tracking-tight text-slate-800">{scenario.urssafDelta >= 0 ? '+' : ''}{formatCurrency(scenario.urssafDelta)}</div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-[0.04em] text-slate-500">Impact impôt</div>
                                <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium leading-none tracking-tight text-slate-800">{scenario.irDelta >= 0 ? '+' : ''}{formatCurrency(scenario.irDelta)}</div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-[0.04em] text-slate-500">Projection TVA</div>
                                <div className="mt-2 flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium leading-none tracking-tight text-slate-800">
                                    <span className={`h-2.5 w-2.5 rounded-full ${scenario.finalTvaStatus === 'danger' ? 'bg-red-500' : scenario.finalTvaStatus === 'warning' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                    {scenario.finalTvaPercentage.toFixed(1)}%
                                </div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-[0.04em] text-slate-500">CA simulé</div>
                                <div className="mt-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium leading-none tracking-tight text-slate-900">
                                    {formatCurrency(scenario.finalCa)}
                                    <ArrowRight className="h-3 w-3 shrink-0 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FeatureLock>
    );
}

'use client';

import { useMemo, useState } from 'react';
import { FeatureLock } from './FeatureLock';
import { useDashboard } from '@/contexts/DashboardContext';
import { formatCurrency, simulateScenario } from '@/lib/dashboard-insights';
import { ArrowRight, TrendingUp } from 'lucide-react';

type ScenarioMode = 'extra_invoice' | 'price_increase' | 'tva_crossing' | 'vl_toggle';

const modeLabels: Record<ScenarioMode, { title: string; description: string; defaultValue: number }> = {
    extra_invoice: {
        title: 'Facture supplementaire',
        description: "Simulez l'impact d'une facture en plus sur votre net et vos reserves.",
        defaultValue: 2000,
    },
    price_increase: {
        title: 'Hausse tarifaire',
        description: 'Mesurez le gain net si vous relevez vos prix moyens.',
        defaultValue: 10,
    },
    tva_crossing: {
        title: 'Passage TVA',
        description: "Visualisez l'effet d'un depassement du seuil TVA sur votre trajectoire.",
        defaultValue: 1500,
    },
    vl_toggle: {
        title: 'Versement liberatoire',
        description: 'Comparez instantanement votre situation avec et sans versement liberatoire.',
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

    if (loading) return <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />;

    const switchMode = (nextMode: ScenarioMode) => {
        setMode(nextMode);
        setValue(modeLabels[nextMode].defaultValue.toString());
    };

    const needsInput = mode !== 'vl_toggle';
    const valueSuffix = mode === 'price_increase' ? '%' : 'EUR';

    return (
        <FeatureLock featureName="Scenario Lab v2" requiredTier="pro">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                        <h3 className="flex items-center gap-2 font-syne text-lg font-bold text-[#0d1b35]">
                            <TrendingUp className="h-5 w-5 text-[#6366f1]" />
                            Scenario Lab v2
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-slate-500">Testez vos decisions de facturation, de prix, de TVA et d'option fiscale avant d'agir.</p>
                    </div>
                    <div className="max-w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 xl:max-w-[240px] xl:text-right">
                        <span className="font-semibold text-slate-900">Mode actif :</span>{' '}
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
                                    className={`rounded-2xl border px-4 py-4 text-left transition ${mode === scenarioMode ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <div className="text-base font-bold leading-7">{modeLabels[scenarioMode].title}</div>
                                    <div className="mt-1 text-sm leading-7 text-inherit/85">{modeLabels[scenarioMode].description}</div>
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <label className="mb-2 block text-sm font-medium text-slate-600">
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
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-lg font-medium text-[#0d1b35] transition focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">{valueSuffix}</span>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                                    Le simulateur compare votre configuration actuelle avec l'autre option fiscale.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="grid gap-3">
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] uppercase tracking-wide text-slate-500 sm:text-xs">Net final estime</div>
                                <div className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-syne text-[clamp(1.05rem,1.7vw,1.45rem)] font-black leading-none tracking-tight text-[#0d1b35]">{formatCurrency(scenario.finalNet)}</div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] uppercase tracking-wide text-slate-500 sm:text-xs">Delta net</div>
                                <div className={`mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-syne text-[clamp(1.05rem,1.7vw,1.45rem)] font-black leading-none tracking-tight ${scenario.netDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {scenario.netDelta >= 0 ? '+' : ''}{formatCurrency(scenario.netDelta)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-wide text-slate-500 sm:text-xs">URSSAF supplementaire</div>
                                <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.95rem,1.35vw,1.1rem)] font-bold leading-none tracking-tight text-slate-800">{scenario.urssafDelta >= 0 ? '+' : ''}{formatCurrency(scenario.urssafDelta)}</div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-wide text-slate-500 sm:text-xs">Impact impot</div>
                                <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.95rem,1.35vw,1.1rem)] font-bold leading-none tracking-tight text-slate-800">{scenario.irDelta >= 0 ? '+' : ''}{formatCurrency(scenario.irDelta)}</div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-wide text-slate-500 sm:text-xs">Projection TVA</div>
                                <div className="mt-2 flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.95rem,1.3vw,1.05rem)] font-bold leading-none tracking-tight text-slate-800">
                                    <span className={`h-2.5 w-2.5 rounded-full ${scenario.finalTvaStatus === 'danger' ? 'bg-red-500' : scenario.finalTvaStatus === 'warning' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                    {scenario.finalTvaPercentage.toFixed(1)}%
                                </div>
                            </div>
                            <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
                                <div className="text-[11px] leading-4 uppercase tracking-wide text-slate-500 sm:text-xs">CA simule</div>
                                <div className="mt-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.95rem,1.3vw,1.05rem)] font-bold leading-none tracking-tight text-[#0d1b35]">
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
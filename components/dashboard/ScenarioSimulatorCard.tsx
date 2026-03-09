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
        description: 'Simulez l impact d une facture en plus sur votre net et vos reserves.',
        defaultValue: 2000,
    },
    price_increase: {
        title: 'Hausse tarifaire',
        description: 'Mesurez le gain net si vous relevez vos prix moyens.',
        defaultValue: 10,
    },
    tva_crossing: {
        title: 'Passage TVA',
        description: 'Visualisez l effet d un depassement du seuil TVA sur votre trajectoire.',
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

    if (loading) return <div className="animate-pulse h-72 bg-slate-100 rounded-3xl" />;

    const switchMode = (nextMode: ScenarioMode) => {
        setMode(nextMode);
        setValue(modeLabels[nextMode].defaultValue.toString());
    };

    const needsInput = mode !== 'vl_toggle';
    const valueSuffix = mode === 'price_increase' ? '%' : 'EUR';

    return (
        <FeatureLock featureName="Scenario Lab v2" requiredTier="pro">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col gap-2 mb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-lg font-bold font-syne text-[#0d1b35] flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#6366f1]" />
                            Scenario Lab v2
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Testez vos decisions de facturation, de prix, de TVA et d option fiscale avant d agir.</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">Mode actif:</span> {modeLabels[mode].title}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
                            {(Object.keys(modeLabels) as ScenarioMode[]).map((scenarioMode) => (
                                <button
                                    key={scenarioMode}
                                    onClick={() => switchMode(scenarioMode)}
                                    className={`rounded-2xl border px-4 py-4 text-left transition ${mode === scenarioMode ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <div className="text-sm font-bold">{modeLabels[scenarioMode].title}</div>
                                    <div className="mt-1 text-xs text-inherit/80 leading-5">{modeLabels[scenarioMode].description}</div>
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <label className="text-sm font-medium text-slate-600 block mb-2">
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
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-medium text-[#0d1b35] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{valueSuffix}</span>
                                </div>
                            ) : (
                                <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-600">
                                    Le simulateur compare votre configuration actuelle avec l autre option fiscale.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex flex-col justify-between">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
                            <div className="rounded-xl bg-white p-4 border border-slate-100">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Net final estime</div>
                                <div className="mt-1 text-2xl font-black font-syne text-[#0d1b35]">{formatCurrency(scenario.finalNet)}</div>
                            </div>
                            <div className="rounded-xl bg-white p-4 border border-slate-100">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Delta net</div>
                                <div className={`mt-1 text-2xl font-black font-syne ${scenario.netDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {scenario.netDelta >= 0 ? '+' : ''}{formatCurrency(scenario.netDelta)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-white p-4 border border-slate-100">
                                <div className="text-xs uppercase tracking-wide text-slate-500">URSSAF supplementaire</div>
                                <div className="mt-1 text-lg font-bold text-slate-800">{scenario.urssafDelta >= 0 ? '+' : ''}{formatCurrency(scenario.urssafDelta)}</div>
                            </div>
                            <div className="rounded-xl bg-white p-4 border border-slate-100">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Impact impot</div>
                                <div className="mt-1 text-lg font-bold text-slate-800">{scenario.irDelta >= 0 ? '+' : ''}{formatCurrency(scenario.irDelta)}</div>
                            </div>
                            <div className="rounded-xl bg-white p-4 border border-slate-100">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Projection TVA</div>
                                <div className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-800">
                                    <span className={`h-2.5 w-2.5 rounded-full ${scenario.finalTvaStatus === 'danger' ? 'bg-red-500' : scenario.finalTvaStatus === 'warning' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                    {scenario.finalTvaPercentage.toFixed(1)}%
                                </div>
                            </div>
                            <div className="rounded-xl bg-white p-4 border border-slate-100">
                                <div className="text-xs uppercase tracking-wide text-slate-500">CA simule</div>
                                <div className="mt-1 text-lg font-bold text-[#0d1b35] flex items-center gap-1">
                                    {formatCurrency(scenario.finalCa)}
                                    <ArrowRight className="w-3 h-3 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FeatureLock>
    );
}
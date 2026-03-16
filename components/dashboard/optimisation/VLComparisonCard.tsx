'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { calculateCompositeNetBreakdown, formatCurrency } from '@/lib/dashboard-insights';
import { Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';

export function VLComparisonCard() {
    const { entries, config, loading } = useDashboard();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (loading || !mounted) return <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />;

    const totalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const withVL = calculateCompositeNetBreakdown(totalCA, { ...config, versement_liberatoire: true });
    const withoutVL = calculateCompositeNetBreakdown(totalCA, { ...config, versement_liberatoire: false });

    const costWithVL = withVL.ir;
    const costWithoutVL = withoutVL.ir;
    const difference = Math.abs(costWithVL - costWithoutVL);
    const vlIsBetter = costWithVL < costWithoutVL;
    const baremeIsBetter = costWithoutVL < costWithVL;

    return (
        <div className="rounded-[12px] border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-slate-100 p-2">
                    <Calculator className="h-4 w-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Analyse versement libératoire</h3>
            </div>

            <div>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className={`rounded-2xl border p-4 transition-all ${vlIsBetter && difference > 0 ? 'border-[#5dcaa5] bg-[#e1f5ee]' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="mb-2 flex items-start justify-between">
                            <span className="text-[14px] font-medium text-slate-700">Option versement libératoire</span>
                            {vlIsBetter && difference > 0 && <span className="rounded-full bg-[#e1f5ee] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#1d9e75]">Meilleur choix</span>}
                        </div>
                        <div className={`text-[22px] font-medium ${vlIsBetter && difference > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                            {formatCurrency(costWithVL)}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                            Taux effectif : {(totalCA > 0 ? (costWithVL / totalCA) * 100 : 0).toFixed(1)}% du CA
                        </div>
                    </div>

                    <div className={`rounded-2xl border p-4 transition-all ${baremeIsBetter && difference > 0 ? 'border-[#5dcaa5] bg-[#e1f5ee]' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="mb-2 flex items-start justify-between">
                            <span className="text-[14px] font-medium text-slate-700">Barème progressif</span>
                            {baremeIsBetter && difference > 0 && <span className="rounded-full bg-[#e1f5ee] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.04em] text-[#1d9e75]">Meilleur choix</span>}
                        </div>
                        <div className={`text-[22px] font-medium ${baremeIsBetter && difference > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
                            {formatCurrency(costWithoutVL)}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-500">
                            Tranche marginale estimée : {(withoutVL.trancheMarginale * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                {difference > 0 ? (
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#b5dfc7] bg-[#e1f5ee] p-4">
                        <div>
                            <span className="block text-[14px] font-medium text-slate-900">Le gagnant est visible.</span>
                            <span className="block text-sm text-slate-600">L&apos;option {vlIsBetter ? 'versement libératoire' : 'barème progressif'} vous laisse plus de marge cette année.</span>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-1.5 text-lg font-medium text-[#1d9e75] shadow-sm">
                            {formatCurrency(difference)}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm font-medium text-slate-600">
                        L&apos;impact financier est quasiment identique pour les deux options cette année.
                    </div>
                )}

                <div className="mt-3 rounded-[6px] bg-[#faeeda] px-3 py-2 text-[12px] text-[#633806]">
                    En micro-entreprise, la clé n&apos;est pas seulement le taux. Ce qui compte est la combinaison revenus, rythme, TVA et option fiscale.
                </div>
            </div>
        </div>
    );
}

'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { calculateCompositeNetBreakdown, formatCurrency } from '@/lib/dashboard-insights';
import { Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';

export function VLComparisonCard() {
    const { entries, config, loading } = useDashboard();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (loading || !mounted) return <div className="animate-pulse h-40 bg-slate-100 rounded-3xl" />;

    const totalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const withVL = calculateCompositeNetBreakdown(totalCA, { ...config, versement_liberatoire: true });
    const withoutVL = calculateCompositeNetBreakdown(totalCA, { ...config, versement_liberatoire: false });

    const costWithVL = withVL.ir;
    const costWithoutVL = withoutVL.ir;
    const difference = Math.abs(costWithVL - costWithoutVL);
    const vlIsBetter = costWithVL < costWithoutVL;
    const baremeIsBetter = costWithoutVL < costWithVL;

    return (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-slate-900 to-[#162848] p-5">
                <h3 className="text-white font-bold font-syne flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    Analyse versement liberatoire
                </h3>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-2xl border-2 transition-all ${vlIsBetter && difference > 0 ? 'border-[#00c875] bg-[#00c875]/5 scale-[1.02]' : 'border-slate-100 bg-slate-50 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-slate-700">Option versement liberatoire</span>
                            {vlIsBetter && difference > 0 && <span className="bg-[#00c875] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Meilleur</span>}
                        </div>
                        <div className={`text-2xl font-black font-syne ${vlIsBetter && difference > 0 ? 'text-[#0d1b35]' : 'text-slate-500'}`}>
                            {formatCurrency(costWithVL)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Taux effectif: {(totalCA > 0 ? (costWithVL / totalCA) * 100 : 0).toFixed(1)}% du CA
                        </div>
                    </div>

                    <div className={`p-4 rounded-2xl border-2 transition-all ${baremeIsBetter && difference > 0 ? 'border-[#00c875] bg-[#00c875]/5 scale-[1.02]' : 'border-slate-100 bg-slate-50 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-slate-700">Bareme progressif</span>
                            {baremeIsBetter && difference > 0 && <span className="bg-[#00c875] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Meilleur</span>}
                        </div>
                        <div className={`text-2xl font-black font-syne ${baremeIsBetter && difference > 0 ? 'text-[#0d1b35]' : 'text-slate-500'}`}>
                            {formatCurrency(costWithoutVL)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Tranche marginale estimee: {(withoutVL.trancheMarginale * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                {difference > 0 ? (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                            <span className="block text-sm font-bold text-indigo-900">Le gagnant est visible.</span>
                            <span className="block text-sm text-indigo-700">L'option {vlIsBetter ? 'versement liberatoire' : 'bareme progressif'} vous laisse plus de marge cette annee.</span>
                        </div>
                        <div className="text-xl font-black text-indigo-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                            {formatCurrency(difference)}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-sm font-medium text-slate-600">
                        L'impact financier est quasiment identique pour les deux options cette annee.
                    </div>
                )}
            </div>
        </div>
    );
}
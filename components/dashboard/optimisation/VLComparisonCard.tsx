/* eslint-disable */
'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { calculateUrssaf, calculateIR, getAbattement } from '@/lib/calculations';
import { ArrowRight, Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';

export function VLComparisonCard() {
    const { entries, config, loading } = useDashboard();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (loading || !mounted) return <div className="animate-pulse h-40 bg-slate-100 rounded-3xl" />;

    const totalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);

    // 1. Calculate IR WITH Versement Libératoire
    const irResultVL = calculateIR({
        ca: totalCA,
        activityType: config.activity_type,
        versementLiberatoire: true,
        situationFamiliale: config.situation_familiale,
        parts: config.parts_fiscales,
        autresRevenus: config.autres_revenus
    });

    // 2. Calculate IR WITHOUT Versement Libératoire (Barème Progressif)
    const irResultBareme = calculateIR({
        ca: totalCA,
        activityType: config.activity_type,
        versementLiberatoire: false,
        situationFamiliale: config.situation_familiale,
        parts: config.parts_fiscales,
        autresRevenus: config.autres_revenus
    });

    const costWithVL = irResultVL.irEstime;
    const costWithoutVL = irResultBareme.irEstime;

    // Calculate Diff
    const difference = Math.abs(costWithVL - costWithoutVL);
    const vlIsBetter = costWithVL < costWithoutVL;
    const baremeIsBetter = costWithoutVL < costWithVL;

    return (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-slate-900 to-[#162848] p-5">
                <h3 className="text-white font-bold font-syne flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    Analyse Versement Libératoire
                </h3>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                    {/* Card: With VL */}
                    <div className={`p-4 rounded-2xl border-2 transition-all ${vlIsBetter && difference > 0 ? 'border-[#00c875] bg-[#00c875]/5 scale-[1.02]' : 'border-slate-100 bg-slate-50 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-slate-700">Option Versement Libératoire</span>
                            {vlIsBetter && difference > 0 && <span className="bg-[#00c875] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Meilleur</span>}
                        </div>
                        <div className={`text-2xl font-black font-syne ${vlIsBetter && difference > 0 ? 'text-[#0d1b35]' : 'text-slate-500'}`}>
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(costWithVL)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Taux imposé : {(irResultVL.trancheMaginale * 100).toFixed(1)}% du CA
                        </div>
                    </div>

                    {/* Card: Without VL */}
                    <div className={`p-4 rounded-2xl border-2 transition-all ${baremeIsBetter && difference > 0 ? 'border-[#00c875] bg-[#00c875]/5 scale-[1.02]' : 'border-slate-100 bg-slate-50 opacity-80'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-slate-700">Barème Progressif (Classique)</span>
                            {baremeIsBetter && difference > 0 && <span className="bg-[#00c875] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Meilleur</span>}
                        </div>
                        <div className={`text-2xl font-black font-syne ${baremeIsBetter && difference > 0 ? 'text-[#0d1b35]' : 'text-slate-500'}`}>
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(costWithoutVL)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Abattement {getAbattement(config.activity_type) * 100}% appliqué
                        </div>
                    </div>

                </div>

                {/* Verdict Box */}
                {difference > 0 ? (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-bold text-indigo-900">Le gagnant est évident.</span>
                            <span className="block text-sm text-indigo-700">En choisissant l'option {vlIsBetter ? 'Versement Libératoire' : 'Barème Classique'}, vous économisez :</span>
                        </div>
                        <div className="text-xl font-black text-indigo-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(difference)}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-sm font-medium text-slate-600">
                        L'impact financier est identique pour les deux options cette année.
                    </div>
                )}
            </div>
        </div>
    );
}

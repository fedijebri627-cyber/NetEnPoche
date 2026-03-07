'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { calculateUrssaf, calculateIR, getAbattement } from '@/lib/calculations';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Wallet } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';

export function IRWaterfallChart() {
    const { entries, config, loading } = useDashboard();
    const { tier } = useSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (loading || !mounted) return <div className="animate-pulse h-[500px] bg-slate-100 rounded-3xl" />;

    const isFreeTier = tier === 'free';

    const totalCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const totalUrssaf = calculateUrssaf(totalCA, config.activity_type, config.acre_enabled);

    // Calculate IR
    const irResult = calculateIR({
        ca: totalCA,
        activityType: config.activity_type,
        versementLiberatoire: config.versement_liberatoire,
        situationFamiliale: config.situation_familiale,
        parts: config.parts_fiscales,
        autresRevenus: config.autres_revenus
    });

    const totalIR = irResult.irEstime;
    const netReel = totalCA - totalUrssaf - totalIR; // Simplified for the chart, ignoring CFE for pure tax visualization

    // Prepare data for Waterfall Chart
    // Waterfall charts typically show base value, then cascading deductions, then final result.
    // We'll simulate this with a stacked bar approach using 'transparent' padding.

    const data = [
        {
            name: 'CA Brut',
            value: totalCA,
            fill: '#0d1b35', // Navy
            padding: 0
        },
        {
            name: 'URSSAF',
            value: totalUrssaf,
            fill: '#f5a623', // Amber
            padding: totalCA - totalUrssaf
        },
        {
            name: 'IR',
            value: totalIR,
            fill: '#e84040', // Red
            padding: totalCA - totalUrssaf - totalIR
        },
        {
            name: 'Net Final',
            value: netReel > 0 ? netReel : 0,
            fill: '#00c875', // Green
            padding: 0
        }
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    const ChartContent = () => (
        <div className="relative border border-slate-200 bg-white rounded-3xl p-6 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex items-center space-x-2 mb-8">
                <div className="bg-[#00c875]/10 p-2 rounded-lg"><Wallet className="w-5 h-5 text-[#00c875]" /></div>
                <h2 className="text-xl font-bold font-syne text-[#0d1b35]">De votre CA Brut à votre Poche</h2>
            </div>

            <div className="flex-1 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0d1b35', fontSize: 13, fontWeight: 700 }} width={80} />

                        <Bar dataKey="padding" stackId="a" fill="transparent" />
                        <Bar dataKey="value" stackId="a" radius={4} animationDuration={1500} isAnimationActive={!isFreeTier}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Overlay Text Values on the bars conceptually */}
                <div className="absolute top-0 right-0 h-full flex flex-col justify-around py-4 w-32 items-end pointer-events-none pr-8">
                    <span className="font-bold text-[#0d1b35] text-lg font-syne bg-white/50 px-2 rounded">{formatCurrency(totalCA)}</span>
                    <span className="font-bold text-[#f5a623] text-lg font-syne bg-white/50 px-2 rounded">-{formatCurrency(totalUrssaf)}</span>
                    <span className="font-bold text-[#e84040] text-lg font-syne bg-white/50 px-2 rounded">-{formatCurrency(totalIR)}</span>
                    <span className="font-black text-[#00c875] text-2xl font-syne bg-white/50 px-2 rounded">{formatCurrency(netReel)}</span>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <span className="text-slate-500 text-sm font-medium">Taux Global d'Imposition (TGI)</span>
                    <div className="text-2xl font-black text-[#0d1b35] font-syne">
                        {totalCA > 0 ? (((totalUrssaf + totalIR) / totalCA) * 100).toFixed(1) : '0.0'}%
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-slate-500 text-sm font-medium">Net Réel en Poche</span>
                    <div className="text-3xl font-black text-[#00c875] font-syne bg-[#00c875]/10 px-4 py-2 rounded-xl mt-1">
                        {formatCurrency(netReel)}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!isFreeTier) return <ChartContent />;

    // Free Tier Experience
    return (
        <div className="relative group min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 filter blur-[8px] opacity-30 select-none pointer-events-none scale-[0.98] transition-all duration-300">
                <ChartContent />
            </div>

            <div className="relative z-20 bg-white/80 backdrop-blur-md border border-slate-200 p-8 rounded-3xl shadow-xl max-w-md text-center transform group-hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-[#00c875] to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00c875]/20 rotate-12 group-hover:rotate-0 transition-transform">
                    <Wallet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-syne text-[#0d1b35] mb-3">Découvrez votre vrai Net</h3>
                <p className="text-slate-600 mb-8 max-w-[280px] mx-auto text-sm">
                    L'URSSAF n'est que la première étape. Calculez exactement ce qu'il vous restera dans la poche après l'Impôt sur le Revenu.
                </p>
                <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full bg-[#162848] text-white py-4 rounded-xl font-bold hover:bg-[#0d1b35] hover:shadow-xl transition-all flex justify-center items-center group-hover:bg-[#00c875]"
                >
                    Débloquer le simulateur <span className="ml-2">→</span>
                </button>
            </div>

            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
}

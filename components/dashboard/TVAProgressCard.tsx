'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { getCompositeTvaStatus, formatCurrency } from '@/lib/dashboard-insights';
import { BadgeEuro, Info } from 'lucide-react';

export function TVAProgressCard() {
    const { entries, config, loading, year } = useDashboard();

    if (loading) return <div className="animate-pulse h-40 bg-slate-100 rounded-3xl" />;

    const runningCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const tva = getCompositeTvaStatus(runningCA, config);

    let barGradient = 'from-[#00c875] to-[#00c875]/80';
    if (tva.percentage >= 70 && tva.percentage < 90) barGradient = 'from-[#00c875] via-[#f5a623] to-[#f5a623]';
    if (tva.percentage >= 90) barGradient = 'from-[#f5a623] to-[#e84040]';

    const currentMonth = year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
    const avgMonthlyCA = currentMonth > 0 ? runningCA / currentMonth : 0;
    let estimatedBreachText = tva.isMixedEstimate
        ? 'Estimation prudente basee sur votre mix d activites.'
        : 'Vous avez de la marge cette annee.';

    if (avgMonthlyCA > 0 && tva.remaining > 0) {
        const monthsLeft = tva.remaining / avgMonthlyCA;
        if (currentMonth + monthsLeft <= 12) {
            const breachMonthIndex = Math.min(11, Math.floor(currentMonth + monthsLeft - 1));
            const date = new Date(year, breachMonthIndex);
            const monthName = date.toLocaleString('fr-FR', { month: 'long' });
            estimatedBreachText = `Estimation de depassement: ${monthName} ${year}`;
        }
    } else if (tva.percentage >= 100) {
        estimatedBreachText = 'Seuil franchi. Preparez votre passage en TVA.';
    }

    return (
        <div className="h-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-syne text-[#0d1b35] flex items-center gap-2">
                    <BadgeEuro className="w-5 h-5 text-slate-400" />
                    Franchise en base de TVA
                </h3>
            </div>

            <div className="relative pt-8 pb-2">
                <div className="absolute top-0 bottom-0 left-[90%] border-l-2 border-dashed border-red-300 z-10">
                    <span className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-red-400 uppercase tracking-wider bg-white px-1">Seuil</span>
                </div>

                <div className="h-4 bg-slate-100 rounded-full w-full overflow-hidden relative">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(tva.percentage, 100)}%` }}
                    />
                </div>

                <div
                    className="absolute top-1 transform -translate-x-1/2 transition-all duration-1000 ease-out z-20"
                    style={{ left: `${Math.min(tva.percentage, 100)}%` }}
                >
                    <div className={`text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-sm ${tva.percentage >= 90 ? 'bg-[#e84040]' : tva.percentage >= 70 ? 'bg-[#f5a623]' : 'bg-[#00c875]'}`}>
                        {tva.percentage.toFixed(1)}%
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] mx-auto mt-0.5"
                        style={{ borderTopColor: tva.percentage >= 90 ? '#e84040' : tva.percentage >= 70 ? '#f5a623' : '#00c875' }} />
                </div>
            </div>

            <div className="flex justify-between items-end mt-2 mb-4">
                <span className="text-sm font-medium text-slate-700">{formatCurrency(runningCA)}</span>
                <span className="text-xs text-slate-400 font-medium">Max: {formatCurrency(tva.threshold)}</span>
            </div>

            <div className={`mt-4 p-3 rounded-xl flex items-start gap-3 text-sm ${tva.percentage >= 90 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                <Info className={`w-5 h-5 shrink-0 ${tva.percentage >= 90 ? 'text-red-500' : 'text-slate-400'}`} />
                <div>
                    <p className="font-medium mb-0.5">Marge restante: {formatCurrency(tva.remaining)}</p>
                    <p className={tva.percentage >= 90 ? 'text-red-600' : 'text-slate-500'}>{estimatedBreachText}</p>
                </div>
            </div>
        </div>
    );
}
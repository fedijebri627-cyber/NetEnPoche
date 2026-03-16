'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { formatCurrency, getCompositeTvaStatus } from '@/lib/dashboard-insights';
import { BadgeEuro, Info } from 'lucide-react';

export function TVAProgressCard() {
    const { entries, config, loading, year } = useDashboard();

    if (loading) return <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />;

    const runningCA = entries.reduce((acc, curr) => acc + curr.ca_amount, 0);
    const tva = getCompositeTvaStatus(runningCA, config);

    let barGradient = 'from-[#00c875] to-[#00c875]/80';
    if (tva.percentage >= 70 && tva.percentage < 90) barGradient = 'from-[#00c875] via-[#f5a623] to-[#f5a623]';
    if (tva.percentage >= 90) barGradient = 'from-[#f5a623] to-[#e84040]';

    const currentMonth = year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
    const avgMonthlyCA = currentMonth > 0 ? runningCA / currentMonth : 0;
    let estimatedBreachText = tva.isMixedEstimate
        ? 'Estimation prudente bas?e sur votre mix d?activit?s.'
        : 'Vous avez de la marge cette ann?e.';

    if (avgMonthlyCA > 0 && tva.remaining > 0) {
        const monthsLeft = tva.remaining / avgMonthlyCA;
        if (currentMonth + monthsLeft <= 12) {
            const breachMonthIndex = Math.min(11, Math.floor(currentMonth + monthsLeft - 1));
            const date = new Date(year, breachMonthIndex);
            const monthName = date.toLocaleString('fr-FR', { month: 'long' });
            estimatedBreachText = `Estimation de d?passement : ${monthName} ${year}`;
        }
    } else if (tva.percentage >= 100) {
        estimatedBreachText = 'Seuil franchi. Pr?parez votre passage en TVA.';
    }

    return (
        <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900">
                    <BadgeEuro className="h-5 w-5 text-slate-400" />
                    Franchise en base de TVA
                </h3>
            </div>

            <div className="relative pb-2 pt-8">
                <div className="absolute bottom-0 left-[90%] top-0 z-10 border-l-2 border-dashed border-red-300">
                    <span className="absolute -top-6 -translate-x-1/2 bg-white px-1 text-[11px] font-medium uppercase tracking-[0.04em] text-red-400">Seuil</span>
                </div>

                <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(tva.percentage, 100)}%` }}
                    />
                </div>

                <div
                    className="absolute top-1 z-20 -translate-x-1/2 transform transition-all duration-1000 ease-out"
                    style={{ left: `${Math.min(tva.percentage, 100)}%` }}
                >
                    <div className={`rounded px-2 py-0.5 text-[11px] font-medium text-white shadow-sm ${tva.percentage >= 90 ? 'bg-[#e84040]' : tva.percentage >= 70 ? 'bg-[#f5a623]' : 'bg-[#00c875]'}`}>
                        {tva.percentage.toFixed(1)}%
                    </div>
                    <div
                        className="mx-auto mt-0.5 h-0 w-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px]"
                        style={{ borderTopColor: tva.percentage >= 90 ? '#e84040' : tva.percentage >= 70 ? '#f5a623' : '#00c875' }}
                    />
                </div>
            </div>

            <div className="mb-4 mt-2 flex items-end justify-between">
                <span className="text-[14px] font-medium text-slate-700">{formatCurrency(runningCA)}</span>
                <span className="text-[11px] font-medium text-slate-400">Max: {formatCurrency(tva.threshold)}</span>
            </div>

            <div className={`mt-4 flex items-start gap-3 rounded-xl border p-3 text-sm ${tva.percentage >= 90 ? 'border-red-100 bg-red-50 text-red-700' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                <Info className={`h-5 w-5 shrink-0 ${tva.percentage >= 90 ? 'text-red-500' : 'text-slate-400'}`} />
                <div>
                    <p className="mb-0.5 text-[14px] font-medium">Marge restante : {formatCurrency(tva.remaining)}</p>
                    <p className={tva.percentage >= 90 ? 'text-red-600' : 'text-slate-500'}>{estimatedBreachText}</p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { calculateCompositeNetBreakdown, formatCurrency } from '@/lib/dashboard-insights';
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react';

export function URSSAFCalendarCard() {
    const { entries, config, loading } = useDashboard();

    if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-3xl" />;

    const quarterRanges = [
        { label: 'T1', start: 1, end: 3, dueDate: new Date(config.year, 3, 30) },
        { label: 'T2', start: 4, end: 6, dueDate: new Date(config.year, 6, 31) },
        { label: 'T3', start: 7, end: 9, dueDate: new Date(config.year, 9, 31) },
        { label: 'T4', start: 10, end: 12, dueDate: new Date(config.year + 1, 0, 31) },
    ];

    const today = new Date();
    const quarters = quarterRanges.map((quarter) => {
        const quarterCA = entries
            .filter((entry) => entry.month >= quarter.start && entry.month <= quarter.end)
            .reduce((sum, entry) => sum + entry.ca_amount, 0);
        const amount = calculateCompositeNetBreakdown(quarterCA, config).urssaf;
        const status = quarter.dueDate < today ? 'paid' : quarter.dueDate.getTime() - today.getTime() <= 45 * 86400000 ? 'upcoming' : 'future';
        return {
            ...quarter,
            amount,
            status,
        };
    });

    const nextPayment = quarters.find((quarter) => quarter.status !== 'paid') || quarters[quarters.length - 1];
    const daysLeft = Math.max(0, Math.ceil((nextPayment.dueDate.getTime() - today.getTime()) / 86400000));

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'paid') return <span className="flex items-center gap-1 rounded bg-[#00c875]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#00c875]"><CheckCircle2 className="h-3 w-3" /> Payé</span>;
        if (status === 'upcoming') return <span className="flex items-center gap-1 rounded bg-[#f5a623]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#f5a623]"><Clock className="h-3 w-3" /> À venir</span>;
        return <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">Estimé</span>;
    };

    return (
        <div className="flex h-full min-h-[460px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative bg-gradient-to-br from-[#0d1b35] to-[#162848] p-6 text-white">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

                <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-300">
                            <CalendarDays className="h-4 w-4" /> Prochaine échéance
                        </h3>
                        <p className="font-syne text-3xl font-bold tracking-tight">{formatCurrency(nextPayment.amount)}</p>
                    </div>
                    <div className="shrink-0 rounded-xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-md">
                        <span className="mb-1 block text-2xl font-black leading-none text-[#00c875]">{daysLeft}</span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">Jours</span>
                    </div>
                </div>
                <p className="relative z-10 text-sm text-slate-400">
                    Avant le <strong className="text-white">{nextPayment.dueDate.toLocaleDateString('fr-FR')}</strong>
                </p>
            </div>

            <div className="flex-1 bg-slate-50/50 p-4">
                <ul className="space-y-3">
                    {quarters.map((quarter) => (
                        <li key={quarter.label} className={`flex items-center justify-between rounded-xl border p-3 ${quarter.status === 'upcoming' ? 'border-[#f5a623]/30 bg-white shadow-sm' : 'border-slate-100 bg-transparent'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-lg font-syne text-sm font-bold ${quarter.status === 'upcoming' ? 'bg-[#f5a623]/10 text-[#f5a623]' : 'bg-slate-100 text-slate-500'}`}>
                                    {quarter.label}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-800">{formatCurrency(quarter.amount)}</span>
                                    <span className="text-xs text-slate-400">{quarter.dueDate.toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                            <StatusBadge status={quarter.status} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { calculateQuarterlyURSSAF } from '@/lib/calculations';
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react';

export function URSSAFCalendarCard() {
    const { entries, config, loading } = useDashboard();

    if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-3xl" />;

    const quarters = calculateQuarterlyURSSAF(entries, config.activity_type, config.acre_enabled);

    // Find the next payment due (first one that isn't paid)
    // For simulation, let's just pick the first 'upcoming' or default to the second quarter
    const nextPayment = quarters.find(q => q.status === 'upcoming') || quarters[1];

    // Mock days left (would be calculated off actual date in prod)
    const daysLeft = 24;

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'paid') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#00c875] uppercase bg-[#00c875]/10 px-2 py-0.5 rounded"><CheckCircle2 className="w-3 h-3" /> Payé</span>;
        if (status === 'upcoming') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#f5a623] uppercase bg-[#f5a623]/10 px-2 py-0.5 rounded"><Clock className="w-3 h-3" /> À venir</span>;
        return <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">— Estimé</span>;
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Hero Block */}
            <div className="bg-gradient-to-br from-[#0d1b35] to-[#162848] p-6 text-white relative">
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h3 className="text-slate-300 text-sm font-medium flex items-center gap-2 mb-1">
                            <CalendarDays className="w-4 h-4" /> Prochaine Échéance
                        </h3>
                        <p className="text-3xl font-bold font-syne tracking-tight">
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(nextPayment.amount)}
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10 shrink-0">
                        <span className="block text-2xl font-black text-[#00c875] leading-none mb-1">{daysLeft}</span>
                        <span className="block text-[10px] text-slate-300 uppercase font-bold tracking-wider">Jours</span>
                    </div>
                </div>
                <p className="text-sm text-slate-400 mb-0 relative z-10">
                    Avant le <strong className="text-white">{nextPayment.dueDate}</strong>
                </p>
            </div>

            {/* Quarters List */}
            <div className="p-4 bg-slate-50/50">
                <ul className="space-y-3">
                    {quarters.map((q, idx) => (
                        <li key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${q.status === 'upcoming' ? 'bg-white border-[#f5a623]/30 shadow-sm' : 'bg-transparent border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-syne text-sm ${q.status === 'upcoming' ? 'bg-[#f5a623]/10 text-[#f5a623]' : 'bg-slate-100 text-slate-500'}`}>
                                    T{idx + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-800">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(q.amount)}
                                    </span>
                                    <span className="text-xs text-slate-400">{q.dueDate}</span>
                                </div>
                            </div>
                            <StatusBadge status={q.status} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

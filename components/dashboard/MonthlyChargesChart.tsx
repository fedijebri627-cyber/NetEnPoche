'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { calculateCompositeNetBreakdown, formatCurrency } from '@/lib/dashboard-insights';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

const shortMonths = ['Jan', 'F?v', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Ao?', 'Sep', 'Oct', 'Nov', 'D?c'];

export function MonthlyChargesChart() {
    const { entries, config, loading, year } = useDashboard();
    const [viewMode, setViewMode] = useState<'mensuel' | 'cumule'>('mensuel');

    if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-3xl" />;

    const currentMonthIndex = year === new Date().getFullYear() ? new Date().getMonth() : 11;
    let runningCA = 0;
    let runningUrssaf = 0;
    let runningNet = 0;

    const sortedEntries = [...entries].sort((a, b) => a.month - b.month);
    const chartData = sortedEntries.map((entry) => {
        const monthBreakdown = calculateCompositeNetBreakdown(entry.ca_amount, config);
        runningCA += entry.ca_amount;
        runningUrssaf += monthBreakdown.urssaf;
        runningNet += monthBreakdown.netReel;

        const monthIdx = entry.month - 1;
        const isFuture = monthIdx > currentMonthIndex;

        if (viewMode === 'mensuel') {
            return {
                name: shortMonths[monthIdx],
                'Net en poche': Math.max(monthBreakdown.netReel, 0),
                URSSAF: monthBreakdown.urssaf,
                'CA global': entry.ca_amount,
                isFuture,
            };
        }

        return {
            name: shortMonths[monthIdx],
            'Net cumule': Math.max(runningNet, 0),
            'URSSAF cumule': runningUrssaf,
            'CA cumule': runningCA,
            isFuture,
        };
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium shadow-lg">
                    <p className="mb-2 text-[14px] font-medium text-slate-900">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4 mb-1">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="text-[13px] font-medium text-slate-800">{formatCurrency(entry.value)}</span>
                        </div>
                    ))}
                    {payload[0].payload['CA global'] !== undefined && (
                        <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-slate-100">
                            <span className="text-slate-500">Encaissement:</span>
                            <span className="text-[13px] font-medium text-slate-500">{formatCurrency(payload[0].payload['CA global'])}</span>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900">
                    <BarChart3 className="w-5 h-5 text-slate-400" />
                    R?partition des revenus
                </h3>

                <div className="bg-slate-100 p-1 rounded-full inline-flex self-start sm:self-auto">
                    <button
                        onClick={() => setViewMode('mensuel')}
                        className={`rounded-full px-4 py-1.5 text-[11px] font-medium transition ${viewMode === 'mensuel' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Mensuel
                    </button>
                    <button
                        onClick={() => setViewMode('cumule')}
                        className={`rounded-full px-4 py-1.5 text-[11px] font-medium transition ${viewMode === 'cumule' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Cumul?
                    </button>
                </div>
            </div>

            <div className="w-full" style={{ height: 300 }}>
                {runningCA === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                        <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
                        <p className="font-medium text-sm">Vos donn?es appara?tront ici</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} />
                            <ReferenceLine x={shortMonths[currentMonthIndex]} stroke="#CBD5E1" strokeDasharray="3 3" />

                            {viewMode === 'mensuel' ? (
                                <>
                                    <Bar dataKey="Net en poche" stackId="a" fill="#00c875" radius={[0, 0, 4, 4]} maxBarSize={40} />
                                    <Bar dataKey="URSSAF" stackId="a" fill="#e84040" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </>
                            ) : (
                                <>
                                    <Bar dataKey="Net cumule" stackId="a" fill="#00c875" radius={[0, 0, 4, 4]} maxBarSize={40} />
                                    <Bar dataKey="URSSAF cumule" stackId="a" fill="#e84040" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { calculateUrssaf, calculateCFEProvision } from '@/lib/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

const shortMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export function MonthlyChargesChart() {
    const { entries, config, loading } = useDashboard();
    const [viewMode, setViewMode] = useState<'mensuel' | 'cumule'>('mensuel');

    if (loading) return <div className="animate-pulse h-64 bg-slate-100 rounded-3xl" />;

    const currentMonthIndex = new Date().getMonth(); // 0-11
    let runningCA = 0;
    let runningUrssaf = 0;

    // Process data for Recharts — sort by month first
    const sortedEntries = [...entries].sort((a, b) => a.month - b.month);
    const chartData = sortedEntries.map((entry) => {
        const monthCA = entry.ca_amount;
        const monthUrssaf = calculateUrssaf(monthCA, config.activity_type, config.acre_enabled);

        // We'll prorate CFE provision evenly across the 12 months for chart display
        const cfeAnnual = calculateCFEProvision(entries.reduce((acc, e) => acc + e.ca_amount, 0), config.activity_type);
        const monthCFE = cfeAnnual / 12;

        // Net 
        const monthNet = monthCA - monthUrssaf - monthCFE;

        runningCA += monthCA;
        runningUrssaf += monthUrssaf;

        const monthIdx = entry.month - 1; // 0-11
        const isFuture = monthIdx > currentMonthIndex;

        if (viewMode === 'mensuel') {
            return {
                name: shortMonths[monthIdx],
                'Net en Poche': monthNet > 0 ? monthNet : 0,
                'URSSAF': monthUrssaf,
                'CA Global': monthCA,
                isFuture
            };
        } else {
            // Cumulé Mode
            const cumulNet = runningCA - runningUrssaf - (cfeAnnual * (entry.month / 12));
            return {
                name: shortMonths[monthIdx],
                'Net Cumulé': cumulNet > 0 ? cumulNet : 0,
                'URSSAF Cumulé': runningUrssaf,
                'CA Cumulé': runningCA,
                isFuture
            };
        }
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border text-sm border-slate-200 p-3 rounded-xl shadow-lg font-medium">
                    <p className="font-bold text-[#0d1b35] mb-2 text-base">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4 mb-1">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="font-bold text-slate-800">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(entry.value)}
                            </span>
                        </div>
                    ))}
                    {/* Show Total CA if available */}
                    {payload[0].payload['CA Global'] !== undefined && (
                        <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-slate-100">
                            <span className="text-slate-500">Total Encaissement:</span>
                            <span className="font-bold text-slate-500">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(payload[0].payload['CA Global'])}
                            </span>
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
                <h3 className="text-lg font-bold font-syne text-[#0d1b35] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-400" />
                    Répartition des revenus
                </h3>

                {/* Toggle */}
                <div className="bg-slate-100 p-1 rounded-full inline-flex self-start sm:self-auto">
                    <button
                        onClick={() => setViewMode('mensuel')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${viewMode === 'mensuel' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Mensuel
                    </button>
                    <button
                        onClick={() => setViewMode('cumule')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${viewMode === 'cumule' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Cumulé
                    </button>
                </div>
            </div>

            <div className="w-full" style={{ height: 300 }}>
                {runningCA === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                        <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
                        <p className="font-medium text-sm">Vos données apparaîtront ici</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                tickFormatter={(value) => `${value / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} />

                            {/* Draw current month line */}
                            <ReferenceLine x={shortMonths[currentMonthIndex]} stroke="#CBD5E1" strokeDasharray="3 3" />

                            {viewMode === 'mensuel' ? (
                                <>
                                    <Bar dataKey="Net en Poche" stackId="a" fill="#00c875" radius={[0, 0, 4, 4]} maxBarSize={40} />
                                    <Bar dataKey="URSSAF" stackId="a" fill="#e84040" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </>
                            ) : (
                                <>
                                    <Bar dataKey="Net Cumulé" stackId="a" fill="#00c875" radius={[0, 0, 4, 4]} maxBarSize={40} />
                                    <Bar dataKey="URSSAF Cumulé" stackId="a" fill="#e84040" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </>
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

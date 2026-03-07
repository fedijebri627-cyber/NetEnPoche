'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ClientData } from './ClientList';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#0d1b35', '#00c875', '#6366f1', '#f5a623', '#22d3ee', '#f43f5e', '#a855f7'];

export function ClientRevenuePieChart({ clients }: { clients: ClientData[] }) {
    // Transform clients into [ { name: ClientA, value: 5000 }, { name: ClientB, value: 2500 } ]
    const data = clients.map(c => {
        const total = c.invoices?.reduce((acc, inv) => acc + Number(inv.amount_ht), 0) || 0;
        return { name: c.name, value: total };
    }).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

    // Group long tails into "Divers" if there are many clients
    let finalData = data;
    if (data.length > 6) {
        const top5 = data.slice(0, 5);
        const rest = data.slice(5).reduce((sum, d) => sum + d.value, 0);
        finalData = [...top5, { name: 'Divers (Autres)', value: rest }];
    }

    if (finalData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-80">
                <PieIcon className="w-12 h-12 text-slate-200 mb-2" />
                <p className="text-slate-400 font-medium text-sm">Répartition non disponible</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-80">
            <h3 className="font-syne font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-slate-400" />
                Concentration des Revenus
            </h3>
            <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={finalData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {finalData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                        />
                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

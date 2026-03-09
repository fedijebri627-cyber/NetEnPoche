'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ClientData } from './ClientList';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#0d1b35', '#00c875', '#6366f1', '#f5a623', '#22d3ee', '#f43f5e', '#a855f7'];

export function ClientRevenuePieChart({ clients }: { clients: ClientData[] }) {
    const data = clients
        .map((client) => {
            const total = client.invoices?.reduce((acc, invoice) => acc + Number(invoice.amount_ht), 0) || 0;
            return { name: client.name, value: total };
        })
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value);

    let finalData = data;
    if (data.length > 6) {
        const top5 = data.slice(0, 5);
        const rest = data.slice(5).reduce((sum, item) => sum + item.value, 0);
        finalData = [...top5, { name: 'Divers (Autres)', value: rest }];
    }

    if (finalData.length === 0) {
        return (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <PieIcon className="mb-2 h-12 w-12 text-slate-200" />
                <p className="text-sm font-medium text-slate-400">Répartition non disponible</p>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-[320px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-syne font-bold text-slate-800">
                <PieIcon className="h-4 w-4 text-slate-400" />
                Concentration des Revenus
            </h3>
            <div className="relative w-full flex-1">
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
'use client';

import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { AlertCircle, FileStack } from 'lucide-react';
import Link from 'next/link';

export function InvoiceDashboardWidget() {
    const { tier } = useSubscription();
    interface StatsData { pendingCount: number; pendingAmount: number; overdueCount: number; topOverdue: any[]; }
    const [stats, setStats] = useState<StatsData>({ pendingCount: 0, pendingAmount: 0, overdueCount: 0, topOverdue: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tier !== 'expert') {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/invoices');
                const data = await res.json();

                if (Array.isArray(data)) {
                    const pending = data.filter(inv => inv.status === 'sent' || inv.status === 'draft'); // 'sent' usually means pending payment
                    const overdue = data.filter(inv => inv.status === 'overdue');

                    const pendingAmt = pending.reduce((acc, inv) => acc + Number(inv.amount_ht), 0);

                    setStats({
                        pendingCount: pending.length,
                        pendingAmount: pendingAmt,
                        overdueCount: overdue.length,
                        topOverdue: overdue.slice(0, 3) as any[]
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [tier]);

    if (tier !== 'expert' || loading) return null;

    return (
        <div className="bg-white border text-left border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-lg text-[#0d1b35] flex items-center gap-2">
                    <FileStack className="w-5 h-5 text-indigo-500" />
                    En attente d'encaissement
                </h3>
                <Link href="/dashboard/expert" className="text-xs font-bold text-indigo-600 hover:underline">
                    Gérer →
                </Link>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-slate-800">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.pendingAmount)}
                </span>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    / {stats.pendingCount} Factures
                </span>
            </div>

            {stats.overdueCount > 0 ? (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-sm font-bold text-red-600 flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4" />
                        Alerte : {stats.overdueCount} Facture{stats.overdueCount > 1 ? 's' : ''} en retard
                    </div>
                    <div className="space-y-2">
                        {stats.topOverdue.map((inv, i) => (
                            <div key={i} className="flex items-center justify-between bg-red-50 p-2 rounded-lg text-sm border border-red-100">
                                <span className="font-medium text-red-800">{inv.client?.name || 'Client Inconnu'}</span>
                                <span className="font-bold text-red-700">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(inv.amount_ht))}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-4 pt-4 border-t border-slate-100 text-sm font-bold text-emerald-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Zéro retard de paiement
                </div>
            )}
        </div>
    );
}

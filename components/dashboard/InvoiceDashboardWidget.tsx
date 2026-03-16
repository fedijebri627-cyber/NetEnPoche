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
                    const pending = data.filter((invoice) => invoice.status === 'sent' || invoice.status === 'draft');
                    const overdue = data.filter((invoice) => invoice.status === 'overdue');
                    const pendingAmount = pending.reduce((sum, invoice) => sum + Number(invoice.amount_ht), 0);

                    setStats({
                        pendingCount: pending.length,
                        pendingAmount,
                        overdueCount: overdue.length,
                        topOverdue: overdue.slice(0, 3) as any[],
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchStats();
    }, [tier]);

    if (tier !== 'expert' || loading) return null;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900">
                    <FileStack className="h-5 w-5 text-indigo-500" />
                    En attente d’encaissement
                </h3>
                <Link href="/dashboard/expert" className="text-[12px] font-medium text-indigo-600 hover:underline">
                    Gérer →
                </Link>
            </div>

            <div className="mb-2 flex items-baseline gap-2">
                <span className="text-[24px] font-medium text-slate-900">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.pendingAmount)}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">
                    / {stats.pendingCount} facture{stats.pendingCount > 1 ? 's' : ''}
                </span>
            </div>

            {stats.overdueCount > 0 ? (
                <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="mb-3 flex items-center gap-2 text-[12px] font-medium text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        Alerte : {stats.overdueCount} facture{stats.overdueCount > 1 ? 's' : ''} en retard
                    </div>
                    <div className="space-y-2">
                        {stats.topOverdue.map((invoice, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-2 text-sm">
                                <span className="text-[13px] font-medium text-red-800">{invoice.client?.name || 'Client inconnu'}</span>
                                <span className="text-[14px] font-medium text-red-700">
                                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(invoice.amount_ht))}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-[12px] font-medium text-emerald-600">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    Zéro retard de paiement
                </div>
            )}
        </div>
    );
}

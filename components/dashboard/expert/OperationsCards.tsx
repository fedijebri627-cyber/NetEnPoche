'use client';

import { useEffect, useMemo, useState } from 'react';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { buildClientRiskInsights, buildCollectionsInsight, formatCurrency, type InsightClient, type InsightInvoice } from '@/lib/dashboard-insights';
import { BellRing, Download, Loader2, ShieldAlert, WalletCards } from 'lucide-react';

interface CollectionsCockpitCardProps {
    invoices: InsightInvoice[];
    onRefresh: () => Promise<void> | void;
}

interface ClientInsightsCardProps {
    clients: InsightClient[];
    invoices: InsightInvoice[];
}

export function CollectionsCockpitCard({ invoices, onRefresh }: CollectionsCockpitCardProps) {
    const [sendingId, setSendingId] = useState<string | null>(null);
    const [reminderCounts, setReminderCounts] = useState<Record<string, number>>({});
    const collections = useMemo(() => buildCollectionsInsight(invoices), [invoices]);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await fetch('/api/invoice-reminders', { cache: 'no-store' });
                if (!response.ok) return;
                const rows = await response.json();
                const counts = (Array.isArray(rows) ? rows : []).reduce((acc: Record<string, number>, row: any) => {
                    if (typeof row.invoice_id === 'string') {
                        acc[row.invoice_id] = (acc[row.invoice_id] || 0) + 1;
                    }
                    return acc;
                }, {});
                setReminderCounts(counts);
            } catch (error) {
                console.error(error);
            }
        };

        void fetchReminders();
    }, [invoices]);

    const sendReminder = async (invoice: InsightInvoice) => {
        const email = invoice.client?.email;
        if (!email) {
            alert('Ajoutez un email client pour envoyer une relance.');
            return;
        }

        setSendingId(invoice.id);
        const subject = `Relance facture ${invoice.client?.name || ''}`;
        const body = `Bonjour,%0D%0A%0D%0ANous vous relancons concernant la facture du ${invoice.invoice_date} arrivee a echeance le ${invoice.due_date}.%0D%0AMontant HT: ${Number(invoice.amount_ht || 0).toFixed(2)} EUR.%0D%0A%0D%0AMerci d avance pour votre retour.%0D%0A%0D%0ACordialement.`;

        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;

        try {
            await fetch('/api/invoice-reminders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId: invoice.id,
                    channel: 'email',
                    templateKey: 'friendly',
                    recipient: email,
                    note: 'Relance manuelle envoyee depuis le cockpit collections.',
                }),
            });
            setReminderCounts((current) => ({ ...current, [invoice.id]: (current[invoice.id] || 0) + 1 }));
        } catch (error) {
            console.error(error);
        } finally {
            setSendingId(null);
        }
    };

    const markAsPaid = async (invoice: InsightInvoice) => {
        setSendingId(invoice.id);
        try {
            const response = await fetch(`/api/invoices/${invoice.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'paid' }),
            });
            if (!response.ok) throw new Error('Failed to mark invoice as paid');
            await onRefresh();
        } catch (error) {
            console.error(error);
            alert('Impossible de mettre la facture a jour.');
        } finally {
            setSendingId(null);
        }
    };

    return (
        <FeatureLock featureName="Cockpit de recouvrement" requiredTier="expert">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35]">
                            <WalletCards className="h-5 w-5 text-indigo-500" />
                            Collections cockpit
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Pilotage du cash a encaisser, relances et retard client.</p>
                    </div>
                    <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right">
                        <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Cash en attente</div>
                        <div className="text-2xl font-black font-syne text-indigo-700">{formatCurrency(collections.pendingCash)}</div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 mb-5">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">En retard</div>
                        <div className="mt-2 text-xl font-bold text-[#0d1b35]">{collections.overdueCount} - {formatCurrency(collections.overdueCash)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">A 7 jours</div>
                        <div className="mt-2 text-xl font-bold text-[#0d1b35]">{collections.dueSoonCount} - {formatCurrency(collections.dueSoonCash)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Delai moyen paye</div>
                        <div className="mt-2 text-xl font-bold text-[#0d1b35]">{collections.averagePaymentDelay.toFixed(0)} jours</div>
                    </div>
                </div>

                <div className="space-y-3">
                    {collections.topLateInvoices.length === 0 ? (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">Aucune facture en retard. Votre recouvrement est propre.</div>
                    ) : collections.topLateInvoices.map((invoice) => (
                        <div key={invoice.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="font-semibold text-slate-900">{invoice.client?.name || 'Client sans nom'} - {formatCurrency(Number(invoice.amount_ht || 0))}</div>
                                    <div className="mt-1 text-sm text-slate-500">Echeance {invoice.due_date} - {reminderCounts[invoice.id] || 0} relance(s)</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => sendReminder(invoice)}
                                        disabled={sendingId === invoice.id}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#0d1b35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#162848] disabled:opacity-50"
                                    >
                                        {sendingId === invoice.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}
                                        Relancer
                                    </button>
                                    <button
                                        onClick={() => markAsPaid(invoice)}
                                        disabled={sendingId === invoice.id}
                                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                    >
                                        Marquer payee
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FeatureLock>
    );
}

export function ClientInsightsCard({ clients, invoices }: ClientInsightsCardProps) {
    const insights = useMemo(() => buildClientRiskInsights(clients, invoices).slice(0, 5), [clients, invoices]);
    const topShare = insights[0]?.shareOfRevenue || 0;

    return (
        <FeatureLock featureName="Rentabilite clients" requiredTier="expert">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35]">
                            <ShieldAlert className="h-5 w-5 text-amber-500" />
                            Rentabilite et risque client
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Qui paie bien, qui concentre votre CA et ou se situe le vrai risque.</p>
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-right ${topShare >= 0.4 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wide ${topShare >= 0.4 ? 'text-amber-500' : 'text-emerald-500'}`}>Concentration</div>
                        <div className={`text-2xl font-black font-syne ${topShare >= 0.4 ? 'text-amber-700' : 'text-emerald-700'}`}>{Math.round(topShare * 100)}%</div>
                    </div>
                </div>

                <div className="space-y-3">
                    {insights.length === 0 ? (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">Ajoutez des clients et des factures pour activer l'analyse de portefeuille.</div>
                    ) : insights.map((item) => (
                        <div key={item.clientId} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="font-semibold text-slate-900">{item.name}</div>
                                    <div className="mt-1 text-sm text-slate-500">{item.invoiceCount} facture(s) - ticket moyen {formatCurrency(item.averageTicket)}</div>
                                </div>
                                <div className="text-sm font-bold text-slate-700">{Math.round(item.shareOfRevenue * 100)}% du CA</div>
                            </div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm text-slate-600">
                                <div className="rounded-xl bg-white p-3">CA: <span className="font-semibold text-slate-900">{formatCurrency(item.totalRevenue)}</span></div>
                                <div className="rounded-xl bg-white p-3">Retard: <span className="font-semibold text-slate-900">{formatCurrency(item.overdueAmount)}</span></div>
                                <div className="rounded-xl bg-white p-3">Delai moyen: <span className="font-semibold text-slate-900">{item.averageDelay.toFixed(0)} jours</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FeatureLock>
    );
}

export function AdminPackCard({ year }: { year: number }) {
    const [loadingKind, setLoadingKind] = useState<string | null>(null);

    const download = async (kind: 'excel' | 'bank' | 'accountant' | 'qonto' | 'pennylane') => {
        setLoadingKind(kind);
        try {
            const response = await fetch(`/api/exports/admin-pack?year=${year}&kind=${kind}`);
            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || 'Export failed');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const disposition = response.headers.get('Content-Disposition') || '';
            const fileNameMatch = disposition.match(/filename="?([^\"]+)"?/);
            link.download = fileNameMatch?.[1] || `netenpoche-${kind}-${year}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Export impossible pour le moment.');
        } finally {
            setLoadingKind(null);
        }
    };

    const buttons: Array<{ kind: 'excel' | 'bank' | 'accountant' | 'qonto' | 'pennylane'; label: string; note: string }> = [
        { kind: 'excel', label: 'Pack Excel', note: 'Synthese, mensuel, clients, factures' },
        { kind: 'bank', label: 'Pack banque', note: 'Resume annuel simplifie' },
        { kind: 'accountant', label: 'Pack comptable', note: 'CSV mensuel + factures' },
        { kind: 'qonto', label: 'Format Qonto', note: 'Mapping CSV v1' },
        { kind: 'pennylane', label: 'Format Pennylane', note: 'Mapping CSV v1' },
    ];

    return (
        <FeatureLock featureName="Admin pack" requiredTier="expert">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35]">
                            <Download className="h-5 w-5 text-indigo-500" />
                            Exports et admin pack
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Exports business-ready pour banque, comptable et migration outillage.</p>
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {buttons.map((button) => (
                        <button
                            key={button.kind}
                            onClick={() => download(button.kind)}
                            disabled={loadingKind !== null}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="font-semibold text-slate-900">{button.label}</div>
                                {loadingKind === button.kind ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : <Download className="h-4 w-4 text-slate-400" />}
                            </div>
                            <div className="mt-2 text-sm text-slate-500">{button.note}</div>
                        </button>
                    ))}
                </div>
            </div>
        </FeatureLock>
    );
}
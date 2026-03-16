'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { buildCollectionsInsight, formatCurrency, type InsightInvoice } from '@/lib/dashboard-insights';

interface CollectionsListCardProps {
    invoices: InsightInvoice[];
    onRefresh: () => Promise<void> | void;
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[8px] bg-slate-50 px-3 py-3">
            <div className="text-[11px] uppercase tracking-[0.04em] text-slate-500">{label}</div>
            <div className="mt-1 text-[16px] font-medium text-slate-900">{value}</div>
        </div>
    );
}

export function CollectionsListCard({ invoices, onRefresh }: CollectionsListCardProps) {
    const [busyId, setBusyId] = useState<string | null>(null);
    const [reminderCounts, setReminderCounts] = useState<Record<string, number>>({});
    const collections = useMemo(() => buildCollectionsInsight(invoices), [invoices]);

    useEffect(() => {
        let ignore = false;

        void (async () => {
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
                if (!ignore) {
                    setReminderCounts(counts);
                }
            } catch (error) {
                console.error(error);
            }
        })();

        return () => {
            ignore = true;
        };
    }, [invoices]);

    const visibleInvoices = useMemo(
        () =>
            [...invoices]
                .filter((invoice) => invoice.status !== 'paid')
                .sort((a, b) => {
                    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
                    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
                    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
                }),
        [invoices]
    );

    const sendReminder = async (invoice: InsightInvoice) => {
        const email = invoice.client?.email;
        if (!email) {
            alert('Ajoutez un email client pour envoyer une relance.');
            return;
        }

        setBusyId(invoice.id);
        const subject = `Relance facture ${invoice.client?.name || ''}`;
        const body = `Bonjour,%0D%0A%0D%0ANous vous relançons concernant la facture du ${invoice.invoice_date} arrivée à échéance le ${invoice.due_date}.%0D%0AMontant HT: ${Number(invoice.amount_ht || 0).toFixed(2)} EUR.%0D%0A%0D%0AMerci d'avance pour votre retour.%0D%0A%0D%0ACordialement.`;

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
                    note: 'Relance manuelle envoyée depuis la liste collections.',
                }),
            });
            setReminderCounts((current) => ({ ...current, [invoice.id]: (current[invoice.id] || 0) + 1 }));
        } catch (error) {
            console.error(error);
        } finally {
            setBusyId(null);
        }
    };

    const markAsPaid = async (invoice: InsightInvoice) => {
        setBusyId(invoice.id);
        try {
            const response = await fetch(`/api/invoices/${invoice.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'paid' }),
            });
            if (!response.ok) throw new Error('Impossible de mettre la facture à jour.');
            await onRefresh();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Impossible de mettre la facture à jour.');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <FeatureLock featureName="Cockpit de recouvrement" requiredTier="expert">
            <div className="rounded-[12px] border border-slate-200 bg-white p-4">
                <div className="mb-3">
                    <h3 className="text-[18px] font-medium text-slate-900">Collections - factures en cours</h3>
                    <p className="mt-1 text-[12px] text-slate-500">Vos factures à encaisser, triées par priorité de relance.</p>
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2">
                    <MiniStat label="En retard" value={formatCurrency(collections.overdueCash)} />
                    <MiniStat label="A 7 jours" value={formatCurrency(collections.dueSoonCash)} />
                    <MiniStat label="En attente" value={formatCurrency(collections.pendingCash)} />
                </div>

                <div className="space-y-2">
                    {visibleInvoices.length === 0 ? (
                        <div className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-500">
                            Aucune facture ouverte pour le moment.
                        </div>
                    ) : (
                        visibleInvoices.map((invoice) => {
                            const isOverdue = invoice.status === 'overdue';
                            return (
                                <div
                                    key={invoice.id}
                                    className={`flex items-center gap-[10px] rounded-[8px] border px-[10px] py-[9px] ${isOverdue ? 'border-[#f09595] bg-[#fcebeb]' : 'border-slate-200 bg-white'}`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className={`text-[13px] font-medium ${isOverdue ? 'text-[#791f1f]' : 'text-slate-900'}`}>
                                            {invoice.client?.name || 'Client sans nom'}
                                        </div>
                                        <div className="mt-0.5 text-[11px] text-slate-500">
                                            Échéance {new Date(invoice.due_date).toLocaleDateString('fr-FR')} - {reminderCounts[invoice.id] || 0} relance(s)
                                        </div>
                                    </div>
                                    <div className={`text-[13px] font-medium whitespace-nowrap ${isOverdue ? 'text-[#791f1f]' : 'text-slate-900'}`}>
                                        {formatCurrency(Number(invoice.amount_ht || 0))}
                                    </div>
                                    <div className="flex gap-[5px]">
                                        {isOverdue ? (
                                            <button
                                                type="button"
                                                onClick={() => sendReminder(invoice)}
                                                disabled={busyId === invoice.id}
                                                className="rounded-[5px] bg-[#e6f1fb] px-[9px] py-[4px] text-[11px] font-medium text-[#0c447c] disabled:opacity-50"
                                            >
                                                {busyId === invoice.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Relancer'}
                                            </button>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={() => markAsPaid(invoice)}
                                            disabled={busyId === invoice.id}
                                            className="rounded-[5px] border border-slate-200 bg-slate-50 px-[9px] py-[4px] text-[11px] font-medium text-slate-600 disabled:opacity-50"
                                        >
                                            Payée
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </FeatureLock>
    );
}

export function AdminPackCard({ year }: { year: number }) {
    const [loadingKind, setLoadingKind] = useState<string | null>(null);

    const download = async (kind: 'excel' | 'bank' | 'accountant' | 'qonto') => {
        setLoadingKind(kind);
        try {
            const response = await fetch(`/api/exports/admin-pack?year=${year}&kind=${kind}`);
            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || 'Export impossible pour le moment.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const disposition = response.headers.get('Content-Disposition') || '';
            const fileNameMatch = disposition.match(/filename=\"?([^\"]+)\"?/);
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

    const buttons: Array<{ kind: 'excel' | 'bank' | 'accountant' | 'qonto'; label: string; note: string }> = [
        { kind: 'excel', label: 'Pack Excel', note: 'Synthese annuelle et detail mensuel' },
        { kind: 'bank', label: 'Pack banque', note: 'Resume clair pour dossier bancaire' },
        { kind: 'accountant', label: 'Pack comptable', note: 'CSV mensuel et factures' },
        { kind: 'qonto', label: 'Format Qonto', note: 'Export CSV simplifie' },
    ];

    return (
        <FeatureLock featureName="Admin pack" requiredTier="expert">
            <div className="rounded-[12px] border border-slate-200 bg-white p-4">
                <div className="mb-3">
                    <h3 className="text-[18px] font-medium text-slate-900">Exports</h3>
                    <p className="mt-1 text-[12px] text-slate-500">Packs utiles pour banque, comptable et suivi outillage.</p>
                </div>
                <div className="grid grid-cols-2 gap-[6px]">
                    {buttons.map((button) => (
                        <button
                            key={button.kind}
                            type="button"
                            onClick={() => download(button.kind)}
                            disabled={loadingKind !== null}
                            className="rounded-[8px] border border-slate-200 bg-slate-50 px-[10px] py-[9px] text-left disabled:opacity-50"
                        >
                            <div className="text-[12px] font-medium text-slate-900">{button.label}</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                                {loadingKind === button.kind ? 'Préparation...' : button.note}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </FeatureLock>
    );
}

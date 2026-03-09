'use client';

import { FileText, Building2, User2, ChevronRight, Activity } from 'lucide-react';
import { useState } from 'react';

export interface ClientData {
    id: string;
    name: string;
    type: 'b2b' | 'b2c';
    email: string | null;
    invoices?: { amount_ht: number, status: string, invoice_date: string }[];
}

interface ClientListProps {
    clients: ClientData[];
}

export function ClientList({ clients }: ClientListProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const next = new Set(expandedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedIds(next);
    };

    if (clients.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Activity className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-800">Aucun client</h3>
                <p className="mt-1 text-sm text-slate-500">Ajoutez votre premier client pour commencer le tracking.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {clients.map((client) => {
                const totalInvoicesCounter = client.invoices?.length || 0;
                const totalBilled = client.invoices?.reduce((acc, invoice) => acc + Number(invoice.amount_ht), 0) || 0;
                const isExpanded = expandedIds.has(client.id);

                return (
                    <div key={client.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all">
                        <div
                            onClick={() => toggleExpand(client.id)}
                            className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${client.type === 'b2b' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {client.type === 'b2b' ? <Building2 className="h-5 w-5" /> : <User2 className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold leading-tight text-slate-800">{client.name}</h4>
                                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{client.type}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden text-right sm:block">
                                    <p className="text-sm font-bold text-slate-800">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalBilled)}</p>
                                    <p className="text-xs text-slate-500">{totalInvoicesCounter} factures</p>
                                </div>
                                <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50 p-4">
                                <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Historique des Factures</h5>
                                {totalInvoicesCounter > 0 ? (
                                    <div className="space-y-2">
                                        {client.invoices?.map((invoice, index) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-4 w-4 text-slate-400" />
                                                    <span className="text-slate-600">{new Date(invoice.invoice_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : invoice.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {invoice.status.toUpperCase()}
                                                    </span>
                                                    <span className="font-bold text-slate-800">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(invoice.amount_ht))}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm italic text-slate-500">{'Aucune facture \u00e9mise pour ce client.'}</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
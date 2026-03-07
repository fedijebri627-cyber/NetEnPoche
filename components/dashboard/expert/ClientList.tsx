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
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-800">Aucun client</h3>
                <p className="text-slate-500 text-sm mt-1">Ajoutez votre premier client pour commencer le tracking.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {clients.map(c => {
                const totalInvoicesCounter = c.invoices?.length || 0;
                const totalBilled = c.invoices?.reduce((acc, inv) => acc + Number(inv.amount_ht), 0) || 0;
                const isExpanded = expandedIds.has(c.id);

                return (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
                        <div
                            onClick={() => toggleExpand(c.id)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.type === 'b2b' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {c.type === 'b2b' ? <Building2 className="w-5 h-5" /> : <User2 className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{c.name}</h4>
                                    <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase mt-0.5">{c.type}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold text-slate-800">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalBilled)}</p>
                                    <p className="text-xs text-slate-500">{totalInvoicesCounter} factures</p>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="bg-slate-50 p-4 border-t border-slate-100">
                                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Historique des Factures</h5>
                                {totalInvoicesCounter > 0 ? (
                                    <div className="space-y-2">
                                        {c.invoices?.map((inv, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600">{new Date(inv.invoice_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {inv.status.toUpperCase()}
                                                    </span>
                                                    <span className="font-bold text-slate-800">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(inv.amount_ht))}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">Aucune facture émise pour ce client.</p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

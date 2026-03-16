'use client';

import { useMemo, useState } from 'react';
import type { InsightClient, InsightInvoice } from '@/lib/dashboard-insights';

interface ClientListProps {
    clients: InsightClient[];
    invoices: InsightInvoice[];
    onRefresh: () => Promise<void> | void;
}

export function ClientList({ clients, invoices, onRefresh }: ClientListProps) {
    const [showInlineForm, setShowInlineForm] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<'b2b' | 'b2c'>('b2b');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);

    const rows = useMemo(
        () =>
            clients.map((client) => {
                const clientInvoices = invoices.filter((invoice) => invoice.client_id === client.id);
                const totalAmount = clientInvoices.reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0);
                return {
                    ...client,
                    invoiceCount: clientInvoices.length,
                    totalAmount,
                };
            }),
        [clients, invoices]
    );

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) return;

        setSaving(true);
        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    type,
                    email: email.trim() || null,
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => null);
                throw new Error(payload?.error || 'Erreur lors de la creation du client.');
            }

            setName('');
            setEmail('');
            setType('b2b');
            setShowInlineForm(false);
            await onRefresh();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Erreur lors de la creation du client.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-[12px] border border-slate-200 bg-white p-4">
            <div className="mb-3">
                <h3 className="text-[18px] font-medium text-slate-900">Portefeuille clients</h3>
                <p className="mt-1 text-[12px] text-slate-500">Vos clients actifs, leur volume facture et leur poids dans le portefeuille.</p>
            </div>

            <div className="space-y-2">
                {rows.length === 0 ? (
                    <div className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-500">
                        Aucun client pour le moment.
                    </div>
                ) : (
                    rows.map((client) => (
                        <div key={client.id} className="rounded-[8px] border border-slate-200 bg-white px-3 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="truncate text-[13px] font-medium text-slate-900">{client.name}</div>
                                    <div className="mt-0.5 text-[11px] uppercase tracking-[0.04em] text-slate-500">
                                        {client.type} - {client.invoiceCount} facture{client.invoiceCount > 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[13px] font-medium text-slate-900">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(client.totalAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!showInlineForm ? (
                    <button
                        type="button"
                        onClick={() => setShowInlineForm(true)}
                        className="flex w-full items-center gap-3 rounded-[8px] border border-dashed border-slate-300 px-3 py-3 text-left hover:bg-slate-50"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[16px] font-medium text-slate-600">+</div>
                        <div className="text-[13px] font-medium text-slate-700">Nouveau client</div>
                    </button>
                ) : (
                    <form onSubmit={handleCreate} className="space-y-3 rounded-[8px] border border-slate-200 bg-slate-50 p-3">
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Nom ou raison sociale"
                            className="w-full rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-400"
                        />

                        <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-2">
                            <div className="flex rounded-[8px] border border-slate-200 bg-white p-1">
                                <button
                                    type="button"
                                    onClick={() => setType('b2b')}
                                    className={`flex-1 rounded-[6px] px-2 py-1 text-[11px] font-medium ${type === 'b2b' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                                >
                                    B2B
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('b2c')}
                                    className={`flex-1 rounded-[6px] px-2 py-1 text-[11px] font-medium ${type === 'b2c' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                                >
                                    B2C
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={saving || !name.trim()}
                                className="rounded-[8px] bg-[#0c447c] px-3 py-2 text-[12px] font-medium text-white disabled:opacity-50"
                            >
                                {saving ? 'Ajout...' : 'Ajouter'}
                            </button>
                        </div>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Email"
                            className="w-full rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-400"
                        />

                        <button
                            type="button"
                            onClick={() => {
                                setShowInlineForm(false);
                                setName('');
                                setEmail('');
                                setType('b2b');
                            }}
                            className="text-[11px] text-slate-500 underline underline-offset-2"
                        >
                            Annuler
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

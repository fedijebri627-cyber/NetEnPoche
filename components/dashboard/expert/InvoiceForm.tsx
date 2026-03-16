'use client';

import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Euro, FilePlus, FileText } from 'lucide-react';
import type { InsightClient } from '@/lib/dashboard-insights';

interface InvoiceFormProps {
    clients: InsightClient[];
    onSuccess: () => void;
}

export function InvoiceForm({ clients, onSuccess }: InvoiceFormProps) {
    const today = new Date().toISOString().split('T')[0];
    const [clientId, setClientId] = useState('');
    const [amountHt, setAmountHt] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(today);
    const [dueDate, setDueDate] = useState('');
    const [paidAt, setPaidAt] = useState(today);
    const [status, setStatus] = useState('draft');
    const [saving, setSaving] = useState(false);
    const [syncMessage, setSyncMessage] = useState<string | null>(null);

    useEffect(() => {
        if (status !== 'paid') {
            setPaidAt(today);
        }
    }, [status, today]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSyncMessage(null);

        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: clientId,
                    amount_ht: parseFloat(amountHt),
                    invoice_date: invoiceDate,
                    due_date: dueDate,
                    status,
                    paid_at: status === 'paid' ? paidAt : null,
                }),
            });

            if (!res.ok) throw new Error('Erreur de création de facture');

            const data = await res.json();
            const { month, oldAmount, newAmount } = data.sync;
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            const monthStr = monthNames[month - 1];

            setSyncMessage(`Facture enregistrée. Votre CA de ${monthStr} a été mis à jour : ${oldAmount} EUR -> ${newAmount} EUR`);
            setAmountHt('');
            setDueDate('');
            setPaidAt(today);
            onSuccess();
            setTimeout(() => setSyncMessage(null), 8000);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la création de la facture.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-[12px] border border-slate-200 bg-white p-4">
            <h3 className="mb-1 flex items-center gap-2 text-[18px] font-medium text-slate-900">
                <FilePlus className="h-5 w-5 text-indigo-500" />
                Nouvelle facture
            </h3>

            {syncMessage && (
                <div className="flex items-center gap-3 rounded-[8px] border border-emerald-100 bg-emerald-50 p-3 text-[13px] font-medium text-emerald-700">
                    <CheckCircle className="h-5 w-5" />
                    {syncMessage}
                </div>
            )}

            {clients.length === 0 ? (
                <div className="rounded-[8px] bg-amber-50 p-3 text-[13px] text-amber-700">
                    Vous devez créer au moins un client avant d'émettre une facture.
                </div>
            ) : (
                <>
                    <div>
                        <label className="mb-1 block text-[12px] font-medium text-slate-700">Client *</label>
                        <select
                            required
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="" disabled>Sélectionner un client...</option>
                            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-slate-700">Montant HT <Euro className="h-3 w-3" /></label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={amountHt}
                                onChange={(e) => setAmountHt(e.target.value)}
                            className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="1500.00"
                            />
                        </div>
                        <div>
                            <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-slate-700">Statut <FileText className="h-3 w-3" /></label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="draft">Brouillon</option>
                                <option value="sent">Envoyée</option>
                                <option value="paid">Payée</option>
                                <option value="overdue">En retard</option>
                            </select>
                        </div>
                    </div>

                    <div className={`grid gap-4 ${status === 'paid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                        <div>
                            <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-slate-700">Date facture <Calendar className="h-3 w-3" /></label>
                            <input
                                type="date"
                                required
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-slate-700">Date échéance <Calendar className="h-3 w-3" /></label>
                            <input
                                type="date"
                                required
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        {status === 'paid' && (
                            <div>
                                <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-slate-700">Date paiement <Calendar className="h-3 w-3" /></label>
                                <input
                                    type="date"
                                    required
                                    value={paidAt}
                                    onChange={(e) => setPaidAt(e.target.value)}
                                className="w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        )}
                    </div>

                    <button disabled={saving || !clientId || !amountHt || !dueDate || (status === 'paid' && !paidAt)} type="submit" className="mt-2 w-full rounded-[8px] bg-[#0c447c] py-3 text-[13px] font-medium text-white transition hover:bg-[#0a3764] disabled:opacity-50">
                        {saving ? 'Traitement et synchronisation...' : 'Enregistrer et imputer au CA'}
                    </button>
                    <p className="text-center text-[11px] uppercase tracking-[0.04em] text-slate-400">Le montant HT est fusionné avec votre CA NetEnPoche du mois comptable ciblé.</p>
                </>
            )}
        </form>
    );
}

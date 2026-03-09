'use client';

import { useEffect, useState } from 'react';
import { FilePlus, Calendar, Euro, FileText, CheckCircle } from 'lucide-react';
import { ClientData } from './ClientList';

interface InvoiceFormProps {
    clients: ClientData[];
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

            if (!res.ok) throw new Error('Erreur de creation de facture');

            const data = await res.json();
            const { month, oldAmount, newAmount } = data.sync;
            const monthNames = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthStr = monthNames[month - 1];

            setSyncMessage(`Facture enregistree. Votre CA de ${monthStr} a ete mis a jour: ${oldAmount} EUR -> ${newAmount} EUR`);
            setAmountHt('');
            setDueDate('');
            setPaidAt(today);
            onSuccess();
            setTimeout(() => setSyncMessage(null), 8000);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la creation de la facture.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-syne font-bold text-lg text-[#0d1b35] flex items-center gap-2 mb-2">
                <FilePlus className="w-5 h-5 text-indigo-500" />
                Nouvelle facture
            </h3>

            {syncMessage && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-emerald-100">
                    <CheckCircle className="w-5 h-5" />
                    {syncMessage}
                </div>
            )}

            {clients.length === 0 ? (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm">
                    Vous devez creer au moins un client avant d'emettre une facture.
                </div>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Client *</label>
                        <select
                            required value={clientId} onChange={(e) => setClientId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        >
                            <option value="" disabled>Selectionner un client...</option>
                            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Montant HT <Euro className="w-3 h-3" /></label>
                            <input
                                type="number" required min="0" step="0.01" value={amountHt} onChange={(e) => setAmountHt(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                placeholder="1500.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Statut <FileText className="w-3 h-3" /></label>
                            <select
                                value={status} onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            >
                                <option value="draft">Brouillon</option>
                                <option value="sent">Envoyee</option>
                                <option value="paid">Payee</option>
                                <option value="overdue">En retard</option>
                            </select>
                        </div>
                    </div>

                    <div className={`grid gap-4 ${status === 'paid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Date facture <Calendar className="w-3 h-3" /></label>
                            <input
                                type="date" required value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Date echeance <Calendar className="w-3 h-3" /></label>
                            <input
                                type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        {status === 'paid' && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Date paiement <Calendar className="w-3 h-3" /></label>
                                <input
                                    type="date" required value={paidAt} onChange={(e) => setPaidAt(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                            </div>
                        )}
                    </div>

                    <button disabled={saving || !clientId || !amountHt || !dueDate || (status === 'paid' && !paidAt)} type="submit" className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50">
                        {saving ? 'Traitement et synchronisation...' : 'Enregistrer et imputer au CA'}
                    </button>
                    <p className="text-xs text-slate-400 text-center uppercase tracking-wide">Le montant HT est fusionne avec votre CA NetEnPoche du mois comptable cible.</p>
                </>
            )}
        </form>
    );
}
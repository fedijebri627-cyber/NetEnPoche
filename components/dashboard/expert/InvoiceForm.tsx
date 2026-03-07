'use client';

import { useState } from 'react';
import { FilePlus, Calendar, Euro, FileText, CheckCircle } from 'lucide-react';
import { ClientData } from './ClientList';

interface InvoiceFormProps {
    clients: ClientData[];
    onSuccess: () => void;
}

export function InvoiceForm({ clients, onSuccess }: InvoiceFormProps) {
    const [clientId, setClientId] = useState('');
    const [amountHt, setAmountHt] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('draft');
    const [saving, setSaving] = useState(false);
    const [syncMessage, setSyncMessage] = useState<string | null>(null);

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
                    status
                })
            });

            if (!res.ok) throw new Error('Erreur de création de facture');

            const data = await res.json();

            // Format success message
            const { month, oldAmount, newAmount } = data.sync;
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            const monthStr = monthNames[month - 1];

            setSyncMessage(`Facture enregistrée ! Votre CA de ${monthStr} a été mis à jour : ${oldAmount}€ → ${newAmount}€`);

            // Reset numericals
            setAmountHt('');
            setDueDate('');
            onSuccess();

            // Auto hide message
            setTimeout(() => setSyncMessage(null), 8000);

        } catch (error) {
            console.error(error);
            alert("Erreur lors de la création de la facture.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-syne font-bold text-lg text-[#0d1b35] flex items-center gap-2 mb-2">
                <FilePlus className="w-5 h-5 text-indigo-500" />
                Nouvelle Facture
            </h3>

            {syncMessage && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-emerald-100">
                    <CheckCircle className="w-5 h-5" />
                    {syncMessage}
                </div>
            )}

            {clients.length === 0 ? (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm">
                    Vous devez créer au moins un client avant d'émettre une facture.
                </div>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Client *</label>
                        <select
                            required value={clientId} onChange={e => setClientId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        >
                            <option value="" disabled>Sélectionner un client...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Montant HT <Euro className="w-3 h-3" /></label>
                            <input
                                type="number" required min="0" step="0.01" value={amountHt} onChange={e => setAmountHt(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                placeholder="1500.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Status <FileText className="w-3 h-3" /></label>
                            <select
                                value={status} onChange={e => setStatus(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            >
                                <option value="draft">Brouillon</option>
                                <option value="sent">Envoyée</option>
                                <option value="paid">Payée</option>
                                <option value="overdue">En retard</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Date Facture <Calendar className="w-3 h-3" /></label>
                            <input
                                type="date" required value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Date Échéance <Calendar className="w-3 h-3" /></label>
                            <input
                                type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <button disabled={saving || !clientId || !amountHt || !dueDate} type="submit" className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50">
                        {saving ? 'Traitement & Synchronisation...' : 'Enregistrer et Imputer au CA'}
                    </button>
                    <p className="text-xs text-slate-400 text-center uppercase tracking-wide">Le montant HT sera automatiquement fusionné avec votre CA NetEnPoche du mois comptable cible.</p>
                </>
            )}
        </form>
    );
}

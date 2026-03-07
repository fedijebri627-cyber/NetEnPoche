'use client';

import { useState } from 'react';
import { UserPlus, Briefcase, User as UserIcon, Mail } from 'lucide-react';

interface ClientFormProps {
    onSuccess: () => void;
}

export function ClientForm({ onSuccess }: ClientFormProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState<'b2b' | 'b2c'>('b2b');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, email })
            });

            if (!res.ok) throw new Error('Failed to create client');

            setName('');
            setEmail('');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ajout du client.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-syne font-bold text-lg text-[#0d1b35] flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-indigo-500" />
                Nouveau Client
            </h3>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nom ou Raison Sociale *</label>
                <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Ex: Acme Corp"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setType('b2b')} className={`flex items-center justify-center gap-2 py-2 rounded-xl border ${type === 'b2b' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <Briefcase className="w-4 h-4" /> B2B
                </button>
                <button type="button" onClick={() => setType('b2c')} className={`flex items-center justify-center gap-2 py-2 rounded-xl border ${type === 'b2c' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <UserIcon className="w-4 h-4" /> B2C
                </button>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">Email <span className="text-slate-400 font-normal">(Optionnel)</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="email" value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        placeholder="contact@client.com"
                    />
                </div>
            </div>

            <button disabled={saving || !name} type="submit" className="w-full py-3 bg-[#0d1b35] text-white rounded-xl font-bold hover:bg-[#162848] transition disabled:opacity-50">
                {saving ? 'Création...' : 'Ajouter le client'}
            </button>
        </form>
    );
}

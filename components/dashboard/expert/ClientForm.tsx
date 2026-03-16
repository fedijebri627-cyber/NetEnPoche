'use client';

import { useState } from 'react';
import { Briefcase, Mail, User as UserIcon, UserPlus } from 'lucide-react';

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
                body: JSON.stringify({ name, type, email: email.trim() || null }),
            });

            if (!res.ok) {
                const payload = await res.json().catch(() => null);
                throw new Error(payload?.error || 'Failed to create client');
            }

            setName('');
            setEmail('');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Erreur lors de l'ajout du client.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-slate-900">
                <UserPlus className="h-5 w-5 text-indigo-500" />
                Nouveau client
            </h3>

            <div>
                <label className="mb-1 block text-[12px] font-medium text-slate-700">Nom ou raison sociale *</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Acme Corp"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setType('b2b')} className={`flex items-center justify-center gap-2 rounded-xl border py-2 ${type === 'b2b' ? 'border-indigo-200 bg-indigo-50 font-medium text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                    <Briefcase className="h-4 w-4" /> B2B
                </button>
                <button type="button" onClick={() => setType('b2c')} className={`flex items-center justify-center gap-2 rounded-xl border py-2 ${type === 'b2c' ? 'border-indigo-200 bg-indigo-50 font-medium text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                    <UserIcon className="h-4 w-4" /> B2C
                </button>
            </div>

            <div>
                <label className="mb-1 flex items-center gap-1 text-[12px] font-medium text-slate-700">Email <span className="font-normal text-slate-400">(optionnel)</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="contact@client.com"
                    />
                </div>
            </div>

            <button disabled={saving || !name} type="submit" className="w-full rounded-xl bg-[#0d1b35] py-3 font-medium text-white transition hover:bg-[#162848] disabled:opacity-50">
                {saving ? 'Creation...' : 'Ajouter le client'}
            </button>
        </form>
    );
}

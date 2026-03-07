'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Building2, Save, Loader2, CheckCircle2 } from 'lucide-react';

export function BusinessProfilePanel() {
    const supabase = createBrowserClient();

    const [siret, setSiret] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { setLoading(false); return; }

                const { data, error } = await supabase
                    .from('users')
                    .select('siret, business_name, full_name')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    setSiret(data.siret || '');
                    setBusinessName(data.business_name || '');
                    setFullName(data.full_name || '');
                }
            } catch (e) {
                console.error('Error loading profile:', e);
            }
            setLoading(false);
        };
        loadProfile();
    }, [supabase]);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('users')
            .update({
                siret: siret.trim() || null,
                business_name: businessName.trim() || null,
                full_name: fullName.trim() || null,
            })
            .eq('id', user.id);

        setSaving(false);
        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            alert("Erreur lors de la sauvegarde.");
        }
    };

    // Format SIRET with spaces (XXX XXX XXX XXXXX)
    const handleSiretChange = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 14);
        setSiret(digits);
    };

    const formatSiretDisplay = (value: string) => {
        const clean = value.replace(/\D/g, '');
        if (clean.length <= 3) return clean;
        if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
        if (clean.length <= 9) return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
        return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h3 className="font-bold text-[#0d1b35] font-syne">Profil Entreprise</h3>
                    <p className="text-sm text-slate-500">Ces informations apparaissent sur vos bilans PDF et factures.</p>
                </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                        Nom complet
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Jean Dupont"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                </div>

                {/* Business Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="businessName">
                        Nom commercial <span className="text-slate-400 font-normal">(optionnel)</span>
                    </label>
                    <input
                        id="businessName"
                        type="text"
                        placeholder="Mon Entreprise"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                </div>

                {/* SIRET */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="siret">
                        Numéro SIRET <span className="text-slate-400 font-normal">(14 chiffres)</span>
                    </label>
                    <input
                        id="siret"
                        type="text"
                        placeholder="123 456 789 01234"
                        value={formatSiretDisplay(siret)}
                        onChange={(e) => handleSiretChange(e.target.value)}
                        maxLength={17} /* 14 digits + 3 spaces */
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    {siret && siret.length > 0 && siret.length < 14 && (
                        <p className="text-xs text-amber-500 mt-1">
                            Le SIRET doit contenir 14 chiffres ({siret.length}/14)
                        </p>
                    )}
                    {siret.length === 14 && (
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> SIRET valide
                        </p>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {saved && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Enregistré !
                    </span>
                )}
                {!saved && <span />}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#162848] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#0d1b35] transition disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Enregistrer
                </button>
            </div>
        </div>
    );
}

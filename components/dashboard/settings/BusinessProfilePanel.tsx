'use client';

import { useEffect, useState } from 'react';
import { Building2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export function BusinessProfilePanel() {
    const { tier } = useSubscription();
    const [siret, setSiret] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [businessFieldsReady, setBusinessFieldsReady] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setError(null);
                const response = await fetch('/api/account/business-profile', { cache: 'no-store' });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Impossible de charger le profil.');
                }

                setSiret(data.siret || '');
                setBusinessName(data.businessName || '');
                setFullName(data.fullName || '');
                setBusinessFieldsReady(data.businessFieldsReady !== false);
            } catch (loadError: unknown) {
                console.error('Error loading profile:', loadError);
                setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les informations de l entreprise.');
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        setError(null);

        try {
            const response = await fetch('/api/account/business-profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    siret,
                    businessName,
                    fullName,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la sauvegarde.');
            }

            setSiret(data.siret || '');
            setBusinessName(data.businessName || '');
            setFullName(data.fullName || '');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (saveError: unknown) {
            console.error('Error saving profile:', saveError);
            setError(saveError instanceof Error ? saveError.message : 'Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

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
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h3 className="font-bold text-[#0d1b35] font-syne flex items-center gap-2">
                        Profil Entreprise
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-sans uppercase tracking-wider">
                            Plan {tier}
                        </span>
                    </h3>
                    <p className="text-sm text-slate-500">Ces informations apparaissent sur vos bilans PDF et factures.</p>
                </div>
            </div>

            <div className="p-6 space-y-5">
                {!businessFieldsReady && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        La base de donnees de production n a pas encore la migration SIRET / business_name. Cette section ne pourra pas etre sauvegardee tant que la migration Supabase ne sera pas appliquee.
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

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
                        disabled={!businessFieldsReady}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-60"
                    />
                </div>

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
                        disabled={!businessFieldsReady}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-60"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="siret">
                        Numero SIRET <span className="text-slate-400 font-normal">(14 chiffres)</span>
                    </label>
                    <input
                        id="siret"
                        type="text"
                        placeholder="123 456 789 01234"
                        value={formatSiretDisplay(siret)}
                        onChange={(e) => handleSiretChange(e.target.value)}
                        disabled={!businessFieldsReady}
                        maxLength={17}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition disabled:opacity-60"
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

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {saved ? (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Enregistre
                    </span>
                ) : <span />}
                <button
                    onClick={handleSave}
                    disabled={saving || !businessFieldsReady}
                    className="flex items-center gap-2 bg-[#162848] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#0d1b35] transition disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Enregistrer
                </button>
            </div>
        </div>
    );
}


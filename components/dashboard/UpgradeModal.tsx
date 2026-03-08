'use client';

import { useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createBrowserClient } from '@/lib/supabase/client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: Props) {
    const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
    const [loadingTier, setLoadingTier] = useState<'pro' | 'expert' | null>(null);
    const supabase = createBrowserClient();

    if (!isOpen) return null;

    const handleCheckout = async (tier: 'pro' | 'expert') => {
        setLoadingTier(tier);

        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tier,
                    billingPeriod: billing,
                }),
            });

            const data = await response.json();
            if (response.ok && data.url) {
                window.location.assign(data.url);
                return;
            }

            const fallbackLink =
                tier === 'pro'
                    ? billing === 'monthly'
                        ? process.env.NEXT_PUBLIC_STRIPE_LINK_PRO_MONTHLY
                        : process.env.NEXT_PUBLIC_STRIPE_LINK_PRO_ANNUAL
                    : billing === 'monthly'
                        ? process.env.NEXT_PUBLIC_STRIPE_LINK_EXPERT_MONTHLY
                        : process.env.NEXT_PUBLIC_STRIPE_LINK_EXPERT_ANNUAL;

            if (!fallbackLink) {
                throw new Error(data.error || 'Le checkout Stripe est indisponible.');
            }

            const {
                data: { user },
            } = await supabase.auth.getUser();
            const checkoutUrl = user ? `${fallbackLink}?client_reference_id=${user.id}` : fallbackLink;
            window.location.assign(checkoutUrl);
        } catch (error: unknown) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Une erreur de redirection est survenue.');
            setLoadingTier(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0d1b35]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh]">
                <div className="relative p-8 text-center bg-slate-50 border-b border-slate-100">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center py-6 bg-gradient-to-b from-slate-50 to-white rounded-t-2xl">
                        <Image
                            src="/brand/netenpoche-icon-1024.png"
                            alt="NetEnPoche Pro"
                            width={64}
                            height={64}
                            className="rounded-2xl shadow-xl shadow-green-500/30 mb-3"
                            priority
                        />
                    </div>
                    <h2 className="text-3xl font-bold font-syne text-[#0d1b35] mb-2">Passez au niveau superieur</h2>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Debloquez l optimisation fiscale, le suivi client et gagnez des milliers d euros chaque annee.
                    </p>

                    <div className="flex items-center justify-center mt-6">
                        <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm inline-flex">
                            <button
                                onClick={() => setBilling('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition ${billing === 'monthly' ? 'bg-[#0d1b35] text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Mensuel
                            </button>
                            <button
                                onClick={() => setBilling('annual')}
                                className={`flex items-center px-6 py-2 rounded-full text-sm font-bold transition ${billing === 'annual' ? 'bg-[#0d1b35] text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Annuel <span className="ml-2 bg-[#00c875]/20 text-[#00c875] px-2 py-0.5 rounded text-[10px] uppercase">-20%</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8 overflow-y-auto">
                    <div className="border border-slate-200 rounded-3xl p-6 relative bg-white hover:border-[#00c875] hover:shadow-lg transition">
                        <h3 className="text-xl font-bold font-syne text-[#0d1b35] mb-2">Pro</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-[#0d1b35]">
                                {billing === 'monthly' ? '5â‚¬' : '50â‚¬'}
                            </span>
                            <span className="text-slate-500 font-medium">/{billing === 'monthly' ? 'mois' : 'an'}</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Calculateur de net reel en temps reel</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Optimisation et simulation impot sur le revenu</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Alertes intelligentes franchissement TVA</li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('pro')}
                            disabled={loadingTier !== null}
                            className="w-full bg-[#162848] text-white py-4 rounded-xl font-bold hover:bg-[#0d1b35] transition flex items-center justify-center mt-auto"
                        >
                            {loadingTier === 'pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Selectionner Pro'}
                        </button>
                    </div>

                    <div className="border-2 border-[#00c875] rounded-3xl p-6 relative bg-gradient-to-b from-white to-[#00c875]/5 shadow-xl">
                        <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#00c875] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Le plus populaire
                        </div>
                        <h3 className="text-xl font-bold font-syne text-[#0d1b35] mb-2">Expert</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-[#0d1b35]">
                                {billing === 'monthly' ? '14â‚¬' : '140â‚¬'}
                            </span>
                            <span className="text-slate-500 font-medium">/{billing === 'monthly' ? 'mois' : 'an'}</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex gap-3 text-slate-900 font-medium"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Tout ce qui est inclus dans Pro</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Edition de factures conformes</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> CRM Client</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Multi-activites complexes (Mixte BIC/BNC)</li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('expert')}
                            disabled={loadingTier !== null}
                            className="w-full bg-[#00c875] text-white py-4 rounded-xl font-bold hover:bg-[#00c875]/90 transition flex items-center justify-center mt-auto shadow-lg shadow-[#00c875]/30"
                        >
                            {loadingTier === 'expert' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Selectionner Expert'}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 text-center border-t border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-[#00c875] bg-[#00c875]/10 px-4 py-1.5 rounded-full mb-2">
                        Essai gratuit 14 jours - aucune carte requise
                    </span>
                    <div className="flex space-x-4 text-xs text-slate-500">
                        <span>Paiement securise par Stripe</span>
                        <span>â€¢</span>
                        <span>Annulation en un clic</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


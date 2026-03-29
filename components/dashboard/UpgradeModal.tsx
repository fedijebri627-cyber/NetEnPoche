'use client';

import { useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createBrowserClient } from '@/lib/supabase/client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const euroFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
});

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

    const proPrice = euroFormatter.format(billing === 'monthly' ? 5 : 50);
    const expertPrice = euroFormatter.format(billing === 'monthly' ? 14 : 140);

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0d1b35]/80 p-3 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4">
            <div className="relative mx-auto my-4 flex w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl md:my-0 md:max-h-[90vh] md:overflow-hidden">
                <div className="relative border-b border-slate-100 bg-slate-50 p-6 text-center md:p-8">
                    <button onClick={onClose} className="absolute right-6 top-6 rounded-full bg-white p-2 text-slate-400 shadow-sm hover:text-slate-700">
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center rounded-t-2xl bg-gradient-to-b from-slate-50 to-white py-4 md:py-6">
                        <Image
                            src="/brand/netenpoche-icon-1024.png"
                            alt="NetEnPoche Pro"
                            width={64}
                            height={64}
                            className="mb-3 rounded-2xl shadow-xl shadow-green-500/30"
                            priority
                        />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-[#0d1b35] font-syne md:text-3xl">Passez au niveau supérieur</h2>
                    <p className="mx-auto max-w-lg text-slate-500">
                        Débloquez l'optimisation fiscale, le suivi client et gagnez des milliers d'euros chaque année.
                    </p>

                    <div className="mt-5 flex items-center justify-center md:mt-6">
                        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                            <button
                                onClick={() => setBilling('monthly')}
                                className={`rounded-full px-6 py-2 text-sm font-bold transition ${billing === 'monthly' ? 'bg-[#0d1b35] text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Mensuel
                            </button>
                            <button
                                onClick={() => setBilling('annual')}
                                className={`flex items-center rounded-full px-6 py-2 text-sm font-bold transition ${billing === 'annual' ? 'bg-[#0d1b35] text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                Annuel <span className="ml-2 rounded bg-[#00c875]/20 px-2 py-0.5 text-[10px] uppercase text-[#00c875]">-20%</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-4 md:grid-cols-2 md:gap-8 md:overflow-y-auto md:p-8">
                    <div className="relative rounded-3xl border border-slate-200 bg-white p-5 transition hover:border-[#00c875] hover:shadow-lg md:p-6">
                        <h3 className="mb-2 text-xl font-bold text-[#0d1b35] font-syne">Pro</h3>
                        <div className="mb-4">
                            <span className="text-3xl font-black text-[#0d1b35] md:text-4xl">{proPrice}</span>
                            <span className="font-medium text-slate-500">/{billing === 'monthly' ? 'mois' : 'an'}</span>
                        </div>
                        <ul className="mb-6 space-y-3 md:mb-8">
                            <li className="flex gap-3 text-sm text-slate-600 md:text-base"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00c875]" /> Calculateur de net réel en temps réel</li>
                            <li className="flex gap-3 text-sm text-slate-600 md:text-base"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00c875]" /> Optimisation et simulation d'impôt sur le revenu</li>
                            <li className="flex gap-3 text-sm text-slate-600 md:text-base"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00c875]" /> Alertes intelligentes de franchissement TVA</li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('pro')}
                            disabled={loadingTier !== null}
                            className="mt-auto flex w-full items-center justify-center rounded-xl bg-[#162848] py-3.5 font-bold text-white transition hover:bg-[#0d1b35] md:py-4"
                        >
                            {loadingTier === 'pro' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sélectionner Pro'}
                        </button>
                    </div>

                    <div className="relative rounded-3xl border-2 border-[#00c875] bg-gradient-to-b from-white to-[#00c875]/5 p-5 shadow-xl md:p-6">
                        <div className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-[#00c875] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                            Le plus populaire
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-[#0d1b35] font-syne">Expert</h3>
                        <div className="mb-4">
                            <span className="text-3xl font-black text-[#0d1b35] md:text-4xl">{expertPrice}</span>
                            <span className="font-medium text-slate-500">/{billing === 'monthly' ? 'mois' : 'an'}</span>
                        </div>
                        <ul className="mb-6 space-y-3 md:mb-8">
                            <li className="flex gap-3 text-sm font-medium text-slate-900 md:text-base"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00c875]" /> Tout ce qui est inclus dans Pro</li>
                            <li className="flex gap-3 text-sm text-slate-600 md:text-base"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00c875]" /> Édition de factures conformes</li>
                            <li className="flex gap-3 text-sm text-slate-600 md:text-base"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00c875]" /> CRM client</li>
                            <li className="flex gap-3 text-sm text-slate-600 md:text-base"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#00c875]" /> Multi-activités complexes (mixte BIC/BNC)</li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('expert')}
                            disabled={loadingTier !== null}
                            className="mt-auto flex w-full items-center justify-center rounded-xl bg-[#00c875] py-3.5 font-bold text-white shadow-lg shadow-[#00c875]/30 transition hover:bg-[#00c875]/90 md:py-4"
                        >
                            {loadingTier === 'expert' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sélectionner Expert'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center border-t border-slate-100 bg-slate-50 p-4 text-center">
                    <span className="mb-2 rounded-full bg-[#00c875]/10 px-4 py-1.5 text-sm font-bold text-[#00c875]">
                        Essai gratuit 14 jours - aucune carte requise
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Paiement sécurisé par Stripe</span>
                        <span>•</span>
                        <span>Annulation en un clic</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

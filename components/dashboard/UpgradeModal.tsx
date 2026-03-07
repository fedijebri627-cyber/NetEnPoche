'use client';
import { useState } from 'react';
import { X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: Props) {
    const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
    const [loadingTier, setLoadingTier] = useState<string | null>(null);
    const supabase = createBrowserClient();

    if (!isOpen) return null;

    const handleCheckout = async (tier: 'pro' | 'expert') => {
        setLoadingTier(tier);
        try {
            // Get user to append to the URL for webhooks
            const { data: { user } } = await supabase.auth.getUser();

            // Select the correct link based on tier and billing cycle from environment variables
            let link = '';

            if (tier === 'pro') {
                link = billing === 'monthly'
                    ? process.env.NEXT_PUBLIC_STRIPE_LINK_PRO_MONTHLY || ''
                    : process.env.NEXT_PUBLIC_STRIPE_LINK_PRO_ANNUAL || '';
            } else {
                link = billing === 'monthly'
                    ? process.env.NEXT_PUBLIC_STRIPE_LINK_EXPERT_MONTHLY || ''
                    : process.env.NEXT_PUBLIC_STRIPE_LINK_EXPERT_ANNUAL || '';
            }

            if (!link) {
                console.error("Stripe link not configured for", tier, billing);
                alert("Ce lien de paiement n'est pas encore configuré.");
                setLoadingTier(null);
                return;
            }

            // Append client_reference_id so the webhook knows who paid
            const checkoutUrl = user ? `${link}?client_reference_id=${user.id}` : link;

            window.location.href = checkoutUrl;
        } catch (error: any) {
            console.error(error);
            alert("Une erreur de redirection est survenue.");
            setLoadingTier(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0d1b35]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative p-8 text-center bg-slate-50 border-b border-slate-100">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="inline-flex items-center justify-center p-3 bg-[#00c875]/10 rounded-2xl mb-4">
                        <Sparkles className="w-8 h-8 text-[#00c875]" />
                    </div>
                    <h2 className="text-3xl font-bold font-syne text-[#0d1b35] mb-2">Passez au niveau supérieur</h2>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Débloquez l'optimisation fiscale, le suivi client et gagnez des milliers d'euros chaque année.
                    </p>

                    {/* Billing Toggle */}
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

                {/* Pricing Grid */}
                <div className="p-8 grid md:grid-cols-2 gap-8 overflow-y-auto">
                    {/* Pro Plan */}
                    <div className="border border-slate-200 rounded-3xl p-6 relative bg-white hover:border-[#00c875] hover:shadow-lg transition">
                        <h3 className="text-xl font-bold font-syne text-[#0d1b35] mb-2">Pro</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-[#0d1b35]">
                                {billing === 'monthly' ? '5€' : '50€'}
                            </span>
                            <span className="text-slate-500 font-medium">/{billing === 'monthly' ? 'mois' : 'an'}</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Calculateur de net réel en temps réel</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Optimisation et simulation Impôt sur le Revenu</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Alertes intelligentes franchissement TVA</li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('pro')}
                            disabled={loadingTier !== null}
                            className="w-full bg-[#162848] text-white py-4 rounded-xl font-bold hover:bg-[#0d1b35] transition flex items-center justify-center mt-auto"
                        >
                            {loadingTier === 'pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sélectionner Pro"}
                        </button>
                    </div>

                    {/* Expert Plan */}
                    <div className="border-2 border-[#00c875] rounded-3xl p-6 relative bg-gradient-to-b from-white to-[#00c875]/5 shadow-xl">
                        <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#00c875] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Le plus populaire
                        </div>
                        <h3 className="text-xl font-bold font-syne text-[#0d1b35] mb-2">Expert</h3>
                        <div className="mb-4">
                            <span className="text-4xl font-black text-[#0d1b35]">
                                {billing === 'monthly' ? '14€' : '140€'}
                            </span>
                            <span className="text-slate-500 font-medium">/{billing === 'monthly' ? 'mois' : 'an'}</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex gap-3 text-slate-900 font-medium"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Tout ce qui est inclus dans Pro</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Édition de factures conformes</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> CRM Client</li>
                            <li className="flex gap-3 text-slate-600"><CheckCircle2 className="w-5 h-5 text-[#00c875] shrink-0" /> Multi-activités complexes (Mixte BIC/BNC)</li>
                        </ul>
                        <button
                            onClick={() => handleCheckout('expert')}
                            disabled={loadingTier !== null}
                            className="w-full bg-[#00c875] text-white py-4 rounded-xl font-bold hover:bg-[#00c875]/90 transition flex items-center justify-center mt-auto shadow-lg shadow-[#00c875]/30"
                        >
                            {loadingTier === 'expert' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sélectionner Expert"}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 text-center border-t border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-[#00c875] bg-[#00c875]/10 px-4 py-1.5 rounded-full mb-2">
                        Essai gratuit 14 jours — aucune carte requise
                    </span>
                    <div className="flex space-x-4 text-xs text-slate-500">
                        <span>🔒 Paiement sécurisé par Stripe</span>
                        <span>•</span>
                        <span>Annulation en un clic</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

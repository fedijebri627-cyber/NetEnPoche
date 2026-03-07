'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { ActivityType } from '@/lib/calculations';
import { Check, ChevronRight } from 'lucide-react';

export function OnboardingModal() {
    const { updateConfig } = useDashboard();
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);

    // Form State
    const [activityType, setActivityType] = useState<ActivityType>('services_bnc');
    const [acreEnabled, setAcreEnabled] = useState(false);
    const [versementLiberatoire, setVersementLiberatoire] = useState(false);
    const [caGoal, setCaGoal] = useState<string>('');

    useEffect(() => {
        const isCompleted = localStorage.getItem('nep_onboarding_completed');
        if (!isCompleted) {
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    const handleNext = () => setStep(step + 1);

    const handleComplete = async () => {
        await updateConfig({
            activity_type: activityType,
            acre_enabled: acreEnabled,
            versement_liberatoire: versementLiberatoire,
            annual_ca_goal: caGoal ? Number(caGoal) : null
        });
        localStorage.setItem('nep_onboarding_completed', 'true');
        setIsVisible(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-900 px-8 py-6 text-white text-center">
                    <h2 className="font-syne text-2xl font-bold mb-2">
                        Bienvenue sur NetEnPoche 👋
                    </h2>
                    <p className="text-slate-300 text-sm">
                        Configurons rapidement votre profil pour des calculs précis. (Étape {step}/3)
                    </p>
                </div>

                {/* Body */}
                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="font-syne text-xl font-bold text-slate-800 text-center">
                                Quel est votre type d'activité principal ?
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { id: 'services_bic', label: 'Prestations de services (BIC)' },
                                    { id: 'services_bnc', label: 'Prestations de services (BNC)' },
                                    { id: 'liberal', label: 'Profession libérale (BNC)' },
                                    { id: 'vente', label: 'Vente de marchandises (BIC)' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setActivityType(type.id as ActivityType)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${activityType === type.id
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <span className={`font-medium ${activityType === type.id ? 'text-emerald-900' : 'text-slate-700'}`}>
                                            {type.label}
                                        </span>
                                        {activityType === type.id && <Check size={20} className="text-emerald-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="font-syne text-xl font-bold text-slate-800 text-center mb-6">
                                Quelques détails supplémentaires
                            </h3>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <label className="flex items-start gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acreEnabled}
                                        onChange={(e) => setAcreEnabled(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <div className="font-bold text-slate-800">Je bénéficie de l'ACRE</div>
                                        <div className="text-sm text-slate-500 mt-1">
                                            Exonération partielle des charges sociales en début d'activité.
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <label className="flex items-start gap-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={versementLiberatoire}
                                        onChange={(e) => setVersementLiberatoire(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <div className="font-bold text-slate-800">Versement libératoire de l'IR</div>
                                        <div className="text-sm text-slate-500 mt-1">
                                            L'impôt sur le revenu est prélevé directement avec vos cotisations à un taux fixe.
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="font-syne text-xl font-bold text-slate-800 text-center mb-2">
                                Quel est votre objectif de CA annuel ?
                            </h3>
                            <p className="text-center text-slate-500 text-sm mb-6">
                                (Optionnel) Nous vous aiderons à suivre votre progression !
                            </p>

                            <div className="relative max-w-xs mx-auto">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-syne text-xl">€</span>
                                <input
                                    type="number"
                                    value={caGoal}
                                    onChange={(e) => setCaGoal(e.target.value)}
                                    placeholder="Ex: 50000"
                                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-xl font-syne font-bold text-slate-800 focus:ring-0 focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-5 py-2.5 text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Retour
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                            >
                                Continuer <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                Terminer <Check size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

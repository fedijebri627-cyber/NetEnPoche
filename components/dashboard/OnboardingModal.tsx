'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import type { ActivityType } from '@/lib/calculations';
import { calculateCompositeNetBreakdown, formatCurrency } from '@/lib/dashboard-insights';
import { Check, ChevronRight, PiggyBank, Sparkles, X } from 'lucide-react';

const activityOptions: Array<{ id: ActivityType; label: string; description: string }> = [
    { id: 'services_bic', label: 'Prestations de services (BIC)', description: 'Conseil, support, service commercial ou technique.' },
    { id: 'services_bnc', label: 'Prestations de services (BNC)', description: 'Freelance, création, consulting ou mission intellectuelle.' },
    { id: 'liberal', label: 'Profession libérale (BNC)', description: 'Activité libérale réglementée ou assimilée.' },
    { id: 'vente', label: 'Achat / revente (BIC)', description: 'Vente de marchandises, e-commerce ou stock.' },
];

const householdOptions = [
    { value: 'celibataire', label: 'Célibataire' },
    { value: 'marie', label: 'Marié(e)' },
    { value: 'pacse', label: 'Pacsé(e)' },
] as const;

function isMeaningfulProfile(config: ReturnType<typeof getDefaultFormState>, existingRevenue: number) {
    return (
        config.activityType !== 'services_bnc'
        || config.acreEnabled
        || config.versementLiberatoire
        || config.annualGoal.length > 0
        || config.autresRevenus.length > 0
        || Number(config.partsFiscales) !== 1
        || existingRevenue > 0
    );
}

function getDefaultFormState(params: {
    activityType: ActivityType;
    acreEnabled: boolean;
    versementLiberatoire: boolean;
    annualGoal: number | null;
    situationFamiliale: 'celibataire' | 'marie' | 'pacse';
    partsFiscales: number;
    autresRevenus: number;
    currentMonthRevenue: number;
}) {
    return {
        activityType: params.activityType,
        acreEnabled: params.acreEnabled,
        versementLiberatoire: params.versementLiberatoire,
        annualGoal: params.annualGoal ? String(params.annualGoal) : '',
        situationFamiliale: params.situationFamiliale,
        partsFiscales: String(params.partsFiscales || 1),
        autresRevenus: params.autresRevenus ? String(params.autresRevenus) : '',
        currentMonthRevenue: params.currentMonthRevenue ? String(params.currentMonthRevenue) : '',
    };
}

export function OnboardingModal() {
    const { config, entries, updateConfig, updateEntry } = useDashboard();
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(1);
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthEntry = entries.find((entry) => entry.month === currentMonth)?.ca_amount || 0;

    const [activityType, setActivityType] = useState<ActivityType>(config.activity_type);
    const [acreEnabled, setAcreEnabled] = useState(config.acre_enabled);
    const [versementLiberatoire, setVersementLiberatoire] = useState(config.versement_liberatoire);
    const [annualGoal, setAnnualGoal] = useState('');
    const [situationFamiliale, setSituationFamiliale] = useState<'celibataire' | 'marie' | 'pacse'>(config.situation_familiale);
    const [partsFiscales, setPartsFiscales] = useState('1');
    const [autresRevenus, setAutresRevenus] = useState('');
    const [currentMonthRevenue, setCurrentMonthRevenue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const syncFormWithContext = () => {
        const defaults = getDefaultFormState({
            activityType: config.activity_type,
            acreEnabled: config.acre_enabled,
            versementLiberatoire: config.versement_liberatoire,
            annualGoal: config.annual_ca_goal,
            situationFamiliale: config.situation_familiale,
            partsFiscales: config.parts_fiscales,
            autresRevenus: config.autres_revenus,
            currentMonthRevenue: currentMonthEntry,
        });

        setActivityType(defaults.activityType);
        setAcreEnabled(defaults.acreEnabled);
        setVersementLiberatoire(defaults.versementLiberatoire);
        setAnnualGoal(defaults.annualGoal);
        setSituationFamiliale(defaults.situationFamiliale);
        setPartsFiscales(defaults.partsFiscales);
        setAutresRevenus(defaults.autresRevenus);
        setCurrentMonthRevenue(defaults.currentMonthRevenue);
        setStep(1);
    };

    useEffect(() => {
        const onboardingCompleted = typeof window !== 'undefined' ? localStorage.getItem('nep_onboarding_completed') : null;
        const defaults = getDefaultFormState({
            activityType: config.activity_type,
            acreEnabled: config.acre_enabled,
            versementLiberatoire: config.versement_liberatoire,
            annualGoal: config.annual_ca_goal,
            situationFamiliale: config.situation_familiale,
            partsFiscales: config.parts_fiscales,
            autresRevenus: config.autres_revenus,
            currentMonthRevenue: currentMonthEntry,
        });

        if (!onboardingCompleted && !isMeaningfulProfile(defaults, currentMonthEntry)) {
            syncFormWithContext();
            setIsVisible(true);
        }
    }, [config, currentMonthEntry]);

    useEffect(() => {
        const handleOpen = () => {
            syncFormWithContext();
            setIsVisible(true);
        };

        window.addEventListener('nep:open-onboarding', handleOpen as EventListener);
        return () => window.removeEventListener('nep:open-onboarding', handleOpen as EventListener);
    }, [config, currentMonthEntry]);

    const annualGoalNumber = Number(annualGoal || 0);
    const currentMonthRevenueNumber = Number(currentMonthRevenue || 0);
    const autresRevenusNumber = Number(autresRevenus || 0);
    const partsFiscalesNumber = Math.max(1, Number(partsFiscales || 1));

    const previewConfig = useMemo(
        () => ({
            ...config,
            activity_type: activityType,
            acre_enabled: acreEnabled,
            versement_liberatoire: versementLiberatoire,
            annual_ca_goal: annualGoalNumber > 0 ? annualGoalNumber : null,
            situation_familiale: situationFamiliale,
            parts_fiscales: partsFiscalesNumber,
            autres_revenus: autresRevenusNumber,
        }),
        [config, activityType, acreEnabled, versementLiberatoire, annualGoalNumber, situationFamiliale, partsFiscalesNumber, autresRevenusNumber]
    );

    const previewBreakdown = useMemo(
        () => calculateCompositeNetBreakdown(currentMonthRevenueNumber, previewConfig),
        [currentMonthRevenueNumber, previewConfig]
    );

    const previewReserve = previewBreakdown.urssaf + previewBreakdown.ir + previewBreakdown.cfe;
    const previewActions = useMemo(() => {
        const actions: string[] = [];

        if (previewReserve > 0) {
            actions.push(`Mettre environ ${formatCurrency(previewReserve)} de côté si votre mois se répète.`);
        }

        if (annualGoalNumber > 0) {
            actions.push(`Suivre un objectif annuel de ${formatCurrency(annualGoalNumber)} dès le dashboard.`);
        } else {
            actions.push('Ajouter un objectif annuel pour activer le suivi de cadence.');
        }

        if (!versementLiberatoire) {
            actions.push('Comparer le versement libératoire dans l’onglet Optimisation avant de valider votre stratégie fiscale.');
        } else {
            actions.push('Vérifier régulièrement que le versement libératoire reste pertinent pour votre foyer fiscal.');
        }

        return actions.slice(0, 3);
    }, [previewReserve, annualGoalNumber, versementLiberatoire]);

    if (!isVisible) return null;

    const closeModal = (markCompleted: boolean) => {
        if (markCompleted) {
            localStorage.setItem('nep_onboarding_completed', 'true');
        }
        setIsVisible(false);
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            await updateConfig({
                activity_type: activityType,
                acre_enabled: acreEnabled,
                versement_liberatoire: versementLiberatoire,
                annual_ca_goal: annualGoalNumber > 0 ? annualGoalNumber : null,
                situation_familiale: situationFamiliale,
                parts_fiscales: partsFiscalesNumber,
                autres_revenus: autresRevenusNumber,
            });

            if (currentMonthRevenue.length > 0) {
                await updateEntry(currentMonth, currentMonthRevenueNumber);
            }

            closeModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
                <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(0,200,117,0.2),_transparent_35%),linear-gradient(135deg,#0d1b35_0%,#13264a_100%)] px-8 py-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
                                <Sparkles className="h-3.5 w-3.5" />
                                Onboarding guidé
                            </div>
                            <h2 className="font-syne text-3xl font-bold">Configurez NetEnPoche en 4 étapes</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-200">
                                On prépare votre activité, votre profil fiscal et vos premiers repères pour rendre le dashboard immédiatement utile.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => closeModal(true)}
                            className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-100 transition hover:bg-white/15"
                            aria-label="Fermer l'onboarding"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {['Activité', 'Fiscalité', 'Objectif', 'Synthèse'].map((label, index) => {
                            const active = step === index + 1;
                            const completed = step > index + 1;
                            return (
                                <div
                                    key={label}
                                    className={`rounded-2xl border px-4 py-3 text-sm transition ${active ? 'border-emerald-300 bg-emerald-400/20 text-white' : completed ? 'border-white/10 bg-white/10 text-slate-100' : 'border-white/10 bg-white/5 text-slate-300'}`}
                                >
                                    <div className="text-[11px] font-semibold uppercase tracking-wide">Étape {index + 1}</div>
                                    <div className="mt-1 font-semibold">{label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="max-h-[calc(92vh-210px)] overflow-y-auto px-8 py-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-syne text-2xl font-bold text-[#0d1b35]">Quel est votre type d’activité principal ?</h3>
                                <p className="mt-2 text-sm text-slate-500">Cette réponse pilote les taux URSSAF, la TVA et les comparaisons fiscales.</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {activityOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setActivityType(option.id)}
                                        className={`rounded-3xl border p-5 text-left transition ${activityType === option.id ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="font-syne text-lg font-bold text-[#0d1b35]">{option.label}</div>
                                                <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
                                            </div>
                                            {activityType === option.id && (
                                                <div className="rounded-full bg-emerald-500 p-1 text-white">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-syne text-2xl font-bold text-[#0d1b35]">Quel est votre cadre fiscal actuel ?</h3>
                                <p className="mt-2 text-sm text-slate-500">On affine vos estimations d’impôt et vos recommandations.</p>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="text-sm font-semibold text-slate-700">Situation familiale</div>
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        {householdOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setSituationFamiliale(option.value)}
                                                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${situationFamiliale === option.value ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="space-y-2 text-sm font-semibold text-slate-700">
                                            <span>Parts fiscales</span>
                                            <input
                                                type="number"
                                                min="1"
                                                step="0.5"
                                                value={partsFiscales}
                                                onChange={(event) => setPartsFiscales(event.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm font-semibold text-slate-700">
                                            <span>Autres revenus du foyer / an</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={autresRevenus}
                                                onChange={(event) => setAutresRevenus(event.target.value)}
                                                placeholder="Ex: 12000"
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <label className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <input
                                        type="checkbox"
                                        checked={acreEnabled}
                                        onChange={(event) => setAcreEnabled(event.target.checked)}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <div className="font-semibold text-slate-800">Je bénéficie de l’ACRE</div>
                                        <div className="mt-1 text-sm leading-6 text-slate-500">Réduction temporaire du taux de charges sociales en début d’activité.</div>
                                    </div>
                                </label>

                                <label className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <input
                                        type="checkbox"
                                        checked={versementLiberatoire}
                                        onChange={(event) => setVersementLiberatoire(event.target.checked)}
                                        className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <div className="font-semibold text-slate-800">J’utilise le versement libératoire</div>
                                        <div className="mt-1 text-sm leading-6 text-slate-500">L’impôt est prélevé avec vos cotisations à un taux fixe sur le CA.</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-syne text-2xl font-bold text-[#0d1b35]">Quel niveau d’activité visez-vous ?</h3>
                                <p className="mt-2 text-sm text-slate-500">Ces deux champs permettent de démarrer avec des objectifs et des alertes utiles.</p>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <label className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <span className="text-sm font-semibold text-slate-700">Objectif de CA annuel</span>
                                    <div className="relative mt-3">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">€</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={annualGoal}
                                            onChange={(event) => setAnnualGoal(event.target.value)}
                                            placeholder="Ex: 50000"
                                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-base font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                    <p className="mt-3 text-sm text-slate-500">Optionnel, mais très utile pour activer la lecture de votre avance ou retard.</p>
                                </label>

                                <label className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <span className="text-sm font-semibold text-slate-700">CA encaissé ce mois-ci</span>
                                    <div className="relative mt-3">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">€</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={currentMonthRevenue}
                                            onChange={(event) => setCurrentMonthRevenue(event.target.value)}
                                            placeholder="Ex: 3200"
                                            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-base font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                    <p className="mt-3 text-sm text-slate-500">Si vous le renseignez maintenant, les cartes de réserve et de projection seront déjà actives.</p>
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-syne text-2xl font-bold text-[#0d1b35]">Votre cockpit de départ est prêt</h3>
                                <p className="mt-2 text-sm text-slate-500">Voici les repères qui seront activés dès la fermeture de l’onboarding.</p>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="font-syne text-xl font-bold text-[#0d1b35]">Résumé de configuration</div>
                                            <p className="mt-2 text-sm text-slate-500">Activité, foyer fiscal et objectif qui serviront de base au dashboard.</p>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Net estimé du mois</div>
                                            <div className="font-syne text-2xl font-black text-emerald-600">{formatCurrency(previewBreakdown.netReel)}</div>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                                            <div className="font-semibold text-slate-800">Activité</div>
                                            <div className="mt-1">{activityOptions.find((option) => option.id === activityType)?.label}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                                            <div className="font-semibold text-slate-800">Foyer fiscal</div>
                                            <div className="mt-1">{householdOptions.find((option) => option.value === situationFamiliale)?.label} · {partsFiscalesNumber} part(s)</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                                            <div className="font-semibold text-slate-800">Objectif annuel</div>
                                            <div className="mt-1">{annualGoalNumber > 0 ? formatCurrency(annualGoalNumber) : 'Non défini pour l’instant'}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                                            <div className="font-semibold text-slate-800">CA du mois</div>
                                            <div className="mt-1">{currentMonthRevenueNumber > 0 ? formatCurrency(currentMonthRevenueNumber) : 'Non renseigné'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 text-emerald-700">
                                        <div className="rounded-2xl bg-white p-3 shadow-sm">
                                            <PiggyBank className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-syne text-xl font-bold">3 actions activées</div>
                                            <p className="mt-1 text-sm text-emerald-700/80">Les prochaines priorités apparaîtront aussi en haut du dashboard.</p>
                                        </div>
                                    </div>

                                    <ul className="mt-5 space-y-3">
                                        {previewActions.map((action) => (
                                            <li key={action} className="rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700">
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep((current) => Math.max(1, current - 1))}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                                Retour
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => closeModal(true)}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                            >
                                Plus tard
                            </button>
                        )}
                    </div>

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={() => setStep((current) => Math.min(4, current + 1))}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0d1b35] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#13264a]"
                        >
                            Continuer
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleComplete}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? 'Configuration en cours...' : 'Activer mon cockpit'}
                            <Check className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

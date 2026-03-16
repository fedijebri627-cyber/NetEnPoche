'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CalendarClock, ChevronRight, Loader2, PiggyBank, ShieldCheck, Sparkles, TrendingUpDown } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import {
    buildDecisionTimeline,
    buildHealthScoreInsight,
    buildMultiYearSummary,
    buildNetChangeInsight,
    buildReservePlan,
    formatCurrency,
    getCompositeTvaStatus,
    type InsightClient,
    type InsightInvoice,
    type MultiYearSummary,
} from '@/lib/dashboard-insights';
import { buildPriorityActions, type PriorityAction } from '@/lib/dashboard-actions';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import { useSubscription } from '@/hooks/useSubscription';

function SeverityDot({ level }: { level: 'good' | 'watch' | 'critical' }) {
    const color = level === 'critical' ? 'bg-red-500' : level === 'watch' ? 'bg-amber-400' : 'bg-emerald-500';
    return <span className={`mt-1 h-2.5 w-2.5 rounded-full ${color}`} />;
}

function ActionTone({ severity }: { severity: 'good' | 'watch' | 'critical' }) {
    if (severity === 'critical') {
        return {
            wrapper: 'border-red-200 bg-red-50/70',
            badge: 'bg-red-100 text-red-700',
            button: 'bg-red-600 hover:bg-red-700',
        };
    }

    if (severity === 'watch') {
        return {
            wrapper: 'border-amber-200 bg-amber-50/80',
            badge: 'bg-amber-100 text-amber-700',
            button: 'bg-[#0d1b35] hover:bg-[#13264a]',
        };
    }

    return {
        wrapper: 'border-emerald-200 bg-emerald-50/80',
        badge: 'bg-emerald-100 text-emerald-700',
        button: 'bg-emerald-600 hover:bg-emerald-700',
    };
}

function TrustFooter({
    basis,
    detailTitle,
    detailCopy,
}: {
    basis: string;
    detailTitle: string;
    detailCopy: string;
}) {
    const updatedAt = useMemo(
        () => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
        []
    );

    return (
        <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Barème 2026</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Mis à jour le {updatedAt}</span>
                <span>{basis}</span>
            </div>
            <details className="group mt-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <summary className="marker:hidden list-none cursor-pointer text-sm font-medium text-slate-700">
                    <span className="inline-flex items-center gap-2">
                        {detailTitle}
                        <ChevronRight className="h-4 w-4 transition group-open:rotate-90" />
                    </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{detailCopy}</p>
            </details>
        </div>
    );
}

function dispatchOnboardingOpen() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nep:open-onboarding'));
    }
}

function focusDashboardTarget(targetId: string) {
    const target = document.getElementById(targetId);
    if (!target || typeof window === 'undefined') return;

    const existingOverlay = document.getElementById('nep-dashboard-focus-overlay');
    existingOverlay?.remove();

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    window.setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.id = 'nep-dashboard-focus-overlay';
        overlay.className = 'pointer-events-none fixed inset-0 z-[70] bg-slate-950/50 backdrop-blur-[1px]';
        document.body.appendChild(overlay);

        target.setAttribute('data-tour-pulse', 'true');

        window.setTimeout(() => {
            target.removeAttribute('data-tour-pulse');
            overlay.remove();
        }, 1800);
    }, 320);
}

function handlePriorityAction(action: PriorityAction) {
    if (typeof window === 'undefined') return;

    if (action.kind === 'onboarding') {
        dispatchOnboardingOpen();
        return;
    }

    if (action.kind === 'route' && action.route) {
        window.location.href = action.route;
        return;
    }

    if (action.targetId) {
        focusDashboardTarget(action.targetId);
    }
}

export function PriorityActionCenterCard() {
    const { entries, config, loading } = useDashboard();
    const { tier } = useSubscription();

    const reserve = useMemo(() => buildReservePlan(entries, config), [config, entries]);
    const health = useMemo(() => buildHealthScoreInsight(entries, config), [config, entries]);
    const tva = useMemo(
        () => getCompositeTvaStatus(entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0), config),
        [config, entries]
    );
    const actions = useMemo(() => buildPriorityActions(entries, config), [config, entries]);

    if (loading) return <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(0,200,117,0.14),_transparent_35%),linear-gradient(135deg,#0d1b35_0%,#12244a_100%)] px-6 py-6 text-white sm:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-100">
                            <Sparkles className="h-3.5 w-3.5" />
                            Priorit?s du moment
                        </div>
                        <h2 className="text-[24px] font-medium sm:text-[32px]">NetEnPoche vous dit quoi faire ensuite.</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                            Vos trois prochaines actions sont tri?es selon votre tr?sorerie, votre rythme annuel et votre exposition fiscale.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[600px] xl:min-w-[680px]">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-300">R?serve</div>
                            <div className="mt-2 text-[22px] font-medium leading-tight tracking-tight tabular-nums">{formatCurrency(reserve.totalReserve)}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-300">Sant?</div>
                            <div className="mt-2 text-[22px] font-medium leading-tight tracking-tight tabular-nums">{health.score}/100</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-300">TVA</div>
                            <div className="mt-2 text-[22px] font-medium leading-tight tracking-tight tabular-nums">{tva.percentage.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3 xl:p-8">
                {actions.map((action) => {
                    const tone = ActionTone({ severity: action.severity });
                    return (
                        <div key={action.id} className={`flex h-full flex-col rounded-3xl border p-5 ${tone.wrapper}`}>
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.04em] ${tone.badge}`}>
                                    {action.severity === 'critical' ? 'Priorit? ?lev?e' : action.severity === 'watch' ? '? suivre' : 'Stable'}
                                </div>
                                <div className="text-[14px] font-medium text-slate-700">{action.value}</div>
                            </div>
                            <h3 className="text-lg font-medium leading-tight text-slate-900">{action.title}</h3>
                            <p className="mt-2 flex-1 break-words text-sm leading-6 text-slate-600">{action.detail}</p>
                            <button
                                type="button"
                                onClick={() => handlePriorityAction(action)}
                                className={`mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-white transition ${tone.button}`}
                            >
                                {action.ctaLabel}
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between xl:px-8">
                <p>
                    Plan actuel : <span className="font-medium capitalize text-slate-800">{tier}</span>. Les cartes d?taill?es plus bas donnent le calcul complet derri?re chaque action.
                </p>
                <button
                    type="button"
                    onClick={dispatchOnboardingOpen}
                    className="inline-flex items-center gap-2 self-start text-[12px] font-medium text-indigo-600 hover:text-indigo-700"
                >
                    Revoir l'onboarding guid?
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

export function UpgradeOverviewBanner() {
    const { tier, loading } = useSubscription();
    const [showModal, setShowModal] = useState(false);

    if (loading || tier !== 'free') return null;

    return (
        <>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                            Premium
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-slate-900">Passez ? Pro pour d?bloquer le cockpit complet</h3>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            D?bloquez d'un coup le Score de sant?, la R?serve intelligente, l'Analyse de votre net r?el, le Scenario Lab v2 et la Timeline de d?cisions.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00c875] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#00c875]/20 transition hover:bg-[#00b56a]"
                    >
                        Passer ? Pro
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <UpgradeModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}

export function HealthScoreCard({ clients = [], previousYearSummary = null }: { clients?: InsightClient[]; previousYearSummary?: MultiYearSummary | null }) {
    const { entries, config, loading } = useDashboard();

    const insight = useMemo(
        () => buildHealthScoreInsight(entries, config, clients, previousYearSummary),
        [clients, config, entries, previousYearSummary]
    );

    if (loading) return <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Score de santé financière" requiredTier="pro">
            <div className="h-full rounded-[12px] border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="flex items-center gap-2 text-[18px] font-medium text-slate-900">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Score de santé financière
                        </h3>
                        <p className="mt-1 text-[12px] text-slate-500">Régularité, marge, diversification et exposition fiscale.</p>
                    </div>
                    <div className="rounded-[10px] bg-[#eaf3de] px-3 py-2 text-right">
                        <div className="text-[22px] font-medium text-[#27500a]">{insight.score}/100</div>
                        <div className={`text-[11px] font-medium ${insight.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {insight.trend >= 0 ? '+' : ''}{insight.trend} vs N-1
                        </div>
                    </div>
                </div>

                <div className="space-y-2.5">
                    {insight.breakdown.map((item) => (
                        <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-[12px] font-medium text-slate-600">
                                <span>{item.label}</span>
                                <span>{item.value}/{item.max}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${(item.value / item.max) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3 rounded-[10px] border border-slate-100 bg-slate-50 p-3 text-[13px] text-slate-600">
                    <span className="font-medium text-slate-800">Levier prioritaire :</span> {insight.recommendation}
                </div>

                <div className="mt-3 text-[12px] text-slate-500">
                    Basé sur vos mois saisis, vos revenus clients et votre trajectoire fiscale actuelle.{' '}
                    <button type="button" className="font-medium text-slate-600 underline underline-offset-2">Comprendre le score</button>
                </div>
            </div>
        </FeatureLock>
    );
}

export function ReservePlannerCard() {
    const { entries, config, loading } = useDashboard();
    const reserve = useMemo(() => buildReservePlan(entries, config), [config, entries]);

    if (loading) return <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Réserve intelligente" requiredTier="pro">
            <div className="h-full rounded-[12px] border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="flex items-center gap-2 text-[18px] font-medium text-slate-900">
                            <PiggyBank className="h-5 w-5 text-indigo-500" />
                            À mettre de côté maintenant
                        </h3>
                        <p className="mt-1 text-[12px] text-slate-500">Montant recommandé pour rester serein sur URSSAF, IR et CFE.</p>
                    </div>
                    <div className="rounded-[10px] bg-slate-50 px-3 py-2 text-right">
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-indigo-500">Total réserve</div>
                        <div className="text-[22px] font-medium text-slate-900">{formatCurrency(reserve.totalReserve)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-[10px] border border-slate-100 bg-slate-50 p-3">
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">URSSAF</div>
                        <div className="mt-1 text-[16px] font-medium text-slate-900">{formatCurrency(reserve.urssaf)}</div>
                    </div>
                    <div className="rounded-[10px] border border-slate-100 bg-slate-50 p-3">
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Impôt</div>
                        <div className="mt-1 text-[16px] font-medium text-slate-900">{formatCurrency(reserve.impots)}</div>
                    </div>
                    <div className="rounded-[10px] border border-slate-100 bg-slate-50 p-3">
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">CFE</div>
                        <div className="mt-1 text-[16px] font-medium text-slate-900">{formatCurrency(reserve.cfe)}</div>
                    </div>
                </div>

                <div className="mt-3 rounded-[10px] border border-slate-100 bg-slate-50 p-3">
                    <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Disponible à dépenser</div>
                    <div className="mt-1 text-[22px] font-medium text-slate-900">{formatCurrency(reserve.safeToSpend)}</div>
                    <div className="mt-1 text-[12px] text-slate-600">Taux de réserve recommandé : {(reserve.reserveRate * 100).toFixed(1)}%</div>
                </div>

                <div className="mt-3 text-[12px] text-slate-500">
                    Calculé sur votre CA cumulé, votre option fiscale, votre statut ACRE et la provision CFE.{' '}
                    <button type="button" className="font-medium text-slate-600 underline underline-offset-2">Comment la réserve est calculée</button>
                </div>
            </div>
        </FeatureLock>
    );
}

export function DecisionTimelineCard({ invoices = [] }: { invoices?: InsightInvoice[] }) {
    const { entries, config, loading } = useDashboard();
    const items = useMemo(() => buildDecisionTimeline(entries, config, invoices), [config, entries, invoices]);

    if (loading) return <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Timeline de d?cisions" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-medium text-slate-900">
                    <CalendarClock className="h-5 w-5 text-amber-500" />
                    Prochaines actions utiles
                </h3>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <SeverityDot level={item.severity} />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-[14px] font-medium text-slate-900">{item.title}</p>
                                    <span className="text-[14px] font-medium text-slate-700">{item.value}</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <TrustFooter
                    basis="Rafra?chi selon votre ann?e active, vos ?ch?ances trimestrielles et le niveau de risque TVA."
                    detailTitle="D'o? viennent ces priorit?s"
                    detailCopy="La timeline croise votre CA saisi, votre objectif annuel, le prochain appel URSSAF et la progression vers le seuil TVA. D?s qu'une situation devient urgente, elle remonte automatiquement dans cette liste."
                />
            </div>
        </FeatureLock>
    );
}

export function NetChangeExplainerCard() {
    const { entries, config, loading } = useDashboard();
    const insight = useMemo(() => buildNetChangeInsight(entries, config), [config, entries]);

    if (loading) return <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Analyse de votre net réel" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900">
                            <TrendingUpDown className="h-5 w-5 text-indigo-500" />
                            Pourquoi votre net change
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Lecture simple de l'évolution récente de votre poche nette.</p>
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-right ${insight.deltaNet >= 0 ? 'bg-slate-50' : 'bg-red-50'}`}>
                        <div className={`text-[11px] font-medium uppercase tracking-[0.04em] ${insight.deltaNet >= 0 ? 'text-slate-500' : 'text-red-500'}`}>{insight.label}</div>
                        <div className={`text-[22px] font-medium ${insight.deltaNet >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                            {insight.deltaNet >= 0 ? '+' : ''}{formatCurrency(insight.deltaNet)}
                        </div>
                    </div>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Delta CA</div>
                        <div className="mt-2 text-lg font-medium text-slate-900">{insight.deltaCa >= 0 ? '+' : ''}{formatCurrency(insight.deltaCa)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em] text-slate-500">Delta charges</div>
                        <div className="mt-2 text-lg font-medium text-slate-900">{insight.deltaCharges >= 0 ? '+' : ''}{formatCurrency(insight.deltaCharges)}</div>
                    </div>
                </div>

                <ul className="space-y-2 text-sm text-slate-600">
                    {insight.drivers.map((driver) => (
                        <li key={driver} className="rounded-xl border border-slate-100 bg-white px-4 py-3">{driver}</li>
                    ))}
                </ul>

                <TrustFooter
                    basis="Analyse glissante construite sur vos deux derniers mois réellement saisis."
                    detailTitle="Comment lire cette carte"
                    detailCopy="La carte compare vos deux derniers mois avec encaissement. Elle isole l'effet du CA, puis celui des charges estimées pour expliquer en langage simple pourquoi votre net final a monté ou baissé."
                />
            </div>
        </FeatureLock>
    );
}

export function MultiYearReviewCard() {
    const { year } = useDashboard();
    const [history, setHistory] = useState<MultiYearSummary[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(year);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSelectedYear(year);
    }, [year]);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/analytics/multi-year?year=${year}&years=4`, { cache: 'no-store' });
                if (!response.ok) throw new Error('Failed to fetch multi-year data');
                const raw = await response.json();
                setHistory(buildMultiYearSummary(raw));
            } catch (error) {
                console.error(error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        void fetchHistory();
    }, [year]);

    const availableYears = useMemo(
        () => [...new Set(history.map((item) => item.year))].sort((a, b) => b - a),
        [history]
    );

    useEffect(() => {
        if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
            setSelectedYear(availableYears[0]);
        }
    }, [availableYears, selectedYear]);

    const selectedSummary = useMemo(
        () => history.find((item) => item.year === selectedYear) ?? history[0] ?? null,
        [history, selectedYear]
    );

    if (loading) return <div className="h-80 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Historique multi-années" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-medium text-slate-900">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            Revue multi-années
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Consultez un exercice à la fois et basculez rapidement entre les années disponibles.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
                        <select
                            value={selectedSummary?.year ?? ''}
                            onChange={(event) => setSelectedYear(Number(event.target.value))}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                            {availableYears.map((availableYear) => (
                                <option key={availableYear} value={availableYear}>
                                    Exercice {availableYear}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {!selectedSummary ? (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
                        Aucun historique disponible pour le moment.
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="text-lg font-medium text-slate-900">Exercice {selectedSummary.year}</div>
                                <div className="text-sm text-slate-500">CA {formatCurrency(selectedSummary.totalCA)} - Net {formatCurrency(selectedSummary.netReel)}</div>
                            </div>
                                <div className="text-sm font-medium text-slate-600">
                                {selectedSummary.goal && selectedSummary.goalProgress !== null
                                    ? `Objectif ${(selectedSummary.goalProgress * 100).toFixed(0)}%`
                                    : 'Sans objectif annuel'}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-white p-4">
                                <div className="text-[11px] uppercase tracking-[0.04em] text-slate-500">URSSAF</div>
                                <div className="mt-1 text-[14px] font-medium text-slate-800">{formatCurrency(selectedSummary.urssaf)}</div>
                            </div>
                            <div className="rounded-xl bg-white p-4">
                                <div className="text-[11px] uppercase tracking-[0.04em] text-slate-500">IR estimé</div>
                                <div className="mt-1 text-[14px] font-medium text-slate-800">{formatCurrency(selectedSummary.ir)}</div>
                            </div>
                            <div className="rounded-xl bg-white p-4">
                                <div className="text-[11px] uppercase tracking-[0.04em] text-slate-500">CFE</div>
                                <div className="mt-1 text-[14px] font-medium text-slate-800">{formatCurrency(selectedSummary.cfe)}</div>
                            </div>
                        </div>
                    </div>
                )}

                <TrustFooter
                    basis="Historique calculé année par année avec la configuration fiscale enregistrée pour chaque exercice."
                    detailTitle="Comment lire la revue annuelle"
                    detailCopy="Chaque exercice reprend le CA réellement saisi, puis recalcule URSSAF, IR et CFE avec la configuration active de cette année. Le sélecteur permet de comparer les millésimes sans surcharger l'écran."
                />
            </div>
        </FeatureLock>
    );
}

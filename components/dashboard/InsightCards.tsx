'use client';

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
import { useSubscription } from '@/hooks/useSubscription';
import { BarChart3, CalendarClock, ChevronRight, Loader2, PiggyBank, ShieldCheck, Sparkles, TrendingUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Bareme 2026</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Mis a jour le {updatedAt}</span>
                <span>{basis}</span>
            </div>
            <details className="group mt-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-700 marker:hidden">
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
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
                            <Sparkles className="h-3.5 w-3.5" />
                            Priorites du moment
                        </div>
                        <h2 className="font-syne text-2xl font-bold sm:text-3xl">NetEnPoche vous dit quoi faire ensuite.</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                            Vos trois prochaines actions sont triees selon votre tresorerie, votre rythme annuel et votre exposition fiscale.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px] xl:min-w-[560px]">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Reserve</div>
                            <div className="mt-2 overflow-hidden text-ellipsis font-syne text-[clamp(1.05rem,1.8vw,1.6rem)] font-black leading-none tracking-tight whitespace-nowrap">{formatCurrency(reserve.totalReserve)}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Sante</div>
                            <div className="mt-2 overflow-hidden text-ellipsis font-syne text-[clamp(1.05rem,1.8vw,1.6rem)] font-black leading-none tracking-tight whitespace-nowrap">{health.score}/100</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">TVA</div>
                            <div className="mt-2 overflow-hidden text-ellipsis font-syne text-[clamp(1.05rem,1.8vw,1.6rem)] font-black leading-none tracking-tight whitespace-nowrap">{tva.percentage.toFixed(0)}%</div>
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
                                <div className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${tone.badge}`}>
                                    {action.severity === 'critical' ? 'Priorite elevee' : action.severity === 'watch' ? 'A suivre' : 'Stable'}
                                </div>
                                <div className="text-sm font-bold text-slate-700">{action.value}</div>
                            </div>
                            <h3 className="font-syne text-lg font-bold leading-tight text-[#0d1b35]">{action.title}</h3>
                            <p className="mt-2 flex-1 break-words text-sm leading-6 text-slate-600">{action.detail}</p>
                            <button
                                type="button"
                                onClick={() => handlePriorityAction(action)}
                                className={`mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white transition ${tone.button}`}
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
                    Plan actuel : <span className="font-semibold capitalize text-slate-800">{tier}</span>. Les cartes detaillees plus bas donnent le calcul complet derriere chaque action.
                </p>
                <button
                    type="button"
                    onClick={dispatchOnboardingOpen}
                    className="inline-flex items-center gap-2 self-start font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    Revoir l'onboarding guide
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
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
        <FeatureLock featureName="Score de sante financiere" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="flex items-center gap-2 font-syne text-lg font-bold text-[#0d1b35]">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Score de sante financiere
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Vue d'ensemble de votre regularite, marge, diversification et exposition fiscale.</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                        <div className="font-syne text-3xl font-black text-emerald-600">{insight.score}/100</div>
                        <div className={`text-xs font-semibold ${insight.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {insight.trend >= 0 ? '+' : ''}{insight.trend} vs N-1
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {insight.breakdown.map((item) => (
                        <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-600">
                                <span>{item.label}</span>
                                <span>{item.value}/{item.max}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${(item.value / item.max) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Levier prioritaire :</span> {insight.recommendation}
                </div>

                <TrustFooter
                    basis="Base sur vos mois saisis, vos revenus clients et votre trajectoire fiscale actuelle."
                    detailTitle="Comprendre le score"
                    detailCopy="Le score combine la regularite de vos saisies, votre marge nette, votre diversification client, votre exposition au seuil TVA et la prise en compte de la CFE. Plus vos donnees sont completes, plus la note est utile."
                />
            </div>
        </FeatureLock>
    );
}

export function ReservePlannerCard() {
    const { entries, config, loading } = useDashboard();
    const reserve = useMemo(() => buildReservePlan(entries, config), [config, entries]);

    if (loading) return <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Reserve intelligente" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="flex items-center gap-2 font-syne text-lg font-bold text-[#0d1b35]">
                            <PiggyBank className="h-5 w-5 text-indigo-500" />
                            A mettre de cote maintenant
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Montant recommande pour rester serein sur URSSAF, IR et CFE.</p>
                    </div>
                    <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right">
                        <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Total reserve</div>
                        <div className="font-syne text-2xl font-black text-indigo-700">{formatCurrency(reserve.totalReserve)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">URSSAF</div>
                        <div className="mt-2 font-syne text-xl font-bold text-[#0d1b35]">{formatCurrency(reserve.urssaf)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Impot</div>
                        <div className="mt-2 font-syne text-xl font-bold text-[#0d1b35]">{formatCurrency(reserve.impots)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">CFE</div>
                        <div className="mt-2 font-syne text-xl font-bold text-[#0d1b35]">{formatCurrency(reserve.cfe)}</div>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Disponible a depenser</div>
                    <div className="mt-2 font-syne text-3xl font-black text-emerald-600">{formatCurrency(reserve.safeToSpend)}</div>
                    <div className="mt-1 text-sm text-emerald-700">Taux de reserve recommande : {(reserve.reserveRate * 100).toFixed(1)}%</div>
                </div>

                <TrustFooter
                    basis="Calcule sur votre CA cumule, votre option fiscale, votre statut ACRE et la provision CFE."
                    detailTitle="Comment la reserve est calculee"
                    detailCopy="La reserve additionne l'URSSAF estimee, l'impot calcule selon votre mode actuel et une provision CFE. Le disponible a depenser correspond a votre CA encaisse diminue de cette enveloppe de securite."
                />
            </div>
        </FeatureLock>
    );
}

export function DecisionTimelineCard({ invoices = [] }: { invoices?: InsightInvoice[] }) {
    const { entries, config, loading } = useDashboard();
    const items = useMemo(() => buildDecisionTimeline(entries, config, invoices), [config, entries, invoices]);

    if (loading) return <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Timeline de decisions" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 flex items-center gap-2 font-syne text-lg font-bold text-[#0d1b35]">
                    <CalendarClock className="h-5 w-5 text-amber-500" />
                    Prochaines actions utiles
                </h3>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <SeverityDot level={item.severity} />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="font-semibold text-slate-900">{item.title}</p>
                                    <span className="text-sm font-bold text-slate-700">{item.value}</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <TrustFooter
                    basis="Rafraichi selon votre annee active, vos echeances trimestrielles et le niveau de risque TVA."
                    detailTitle="D'ou viennent ces priorites"
                    detailCopy="La timeline croise votre CA saisi, votre objectif annuel, le prochain appel URSSAF et la progression vers le seuil TVA. Des qu'une situation devient urgente, elle remonte automatiquement dans cette liste."
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
        <FeatureLock featureName="Explication du net" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="flex items-center gap-2 font-syne text-lg font-bold text-[#0d1b35]">
                            <TrendingUpDown className="h-5 w-5 text-indigo-500" />
                            Pourquoi votre net change
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Lecture simple de l'evolution recente de votre poche nette.</p>
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-right ${insight.deltaNet >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wide ${insight.deltaNet >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{insight.label}</div>
                        <div className={`font-syne text-2xl font-black ${insight.deltaNet >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {insight.deltaNet >= 0 ? '+' : ''}{formatCurrency(insight.deltaNet)}
                        </div>
                    </div>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delta CA</div>
                        <div className="mt-2 font-syne text-xl font-bold text-[#0d1b35]">{insight.deltaCa >= 0 ? '+' : ''}{formatCurrency(insight.deltaCa)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delta charges</div>
                        <div className="mt-2 font-syne text-xl font-bold text-[#0d1b35]">{insight.deltaCharges >= 0 ? '+' : ''}{formatCurrency(insight.deltaCharges)}</div>
                    </div>
                </div>

                <ul className="space-y-2 text-sm text-slate-600">
                    {insight.drivers.map((driver) => (
                        <li key={driver} className="rounded-xl border border-slate-100 bg-white px-4 py-3">{driver}</li>
                    ))}
                </ul>

                <TrustFooter
                    basis="Analyse glissante construite sur vos deux derniers mois reellement saisis."
                    detailTitle="Comment lire cette carte"
                    detailCopy="La carte compare vos deux derniers mois avec encaissement. Elle isole l'effet du CA, puis celui des charges estimees pour expliquer en langage simple pourquoi votre net final a monte ou baisse."
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
        <FeatureLock featureName="Historique multi-annees" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="flex items-center gap-2 font-syne text-lg font-bold text-[#0d1b35]">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            Revue multi-annees
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Consultez un exercice a la fois et basculez rapidement entre les annees disponibles.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
                        <select
                            value={selectedSummary?.year ?? ''}
                            onChange={(event) => setSelectedYear(Number(event.target.value))}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
                                <div className="font-syne text-lg font-bold text-[#0d1b35]">Exercice {selectedSummary.year}</div>
                                <div className="text-sm text-slate-500">CA {formatCurrency(selectedSummary.totalCA)} - Net {formatCurrency(selectedSummary.netReel)}</div>
                            </div>
                            <div className="text-sm font-semibold text-slate-600">
                                {selectedSummary.goal && selectedSummary.goalProgress !== null
                                    ? `Objectif ${(selectedSummary.goalProgress * 100).toFixed(0)}%`
                                    : 'Sans objectif annuel'}
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl bg-white p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-500">URSSAF</div>
                                <div className="mt-1 font-bold text-slate-800">{formatCurrency(selectedSummary.urssaf)}</div>
                            </div>
                            <div className="rounded-xl bg-white p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-500">IR estime</div>
                                <div className="mt-1 font-bold text-slate-800">{formatCurrency(selectedSummary.ir)}</div>
                            </div>
                            <div className="rounded-xl bg-white p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-500">CFE</div>
                                <div className="mt-1 font-bold text-slate-800">{formatCurrency(selectedSummary.cfe)}</div>
                            </div>
                        </div>
                    </div>
                )}

                <TrustFooter
                    basis="Historique calcule annee par annee avec la configuration fiscale enregistree pour chaque exercice."
                    detailTitle="Comment lire la revue annuelle"
                    detailCopy="Chaque exercice reprend le CA reellement saisi, puis recalcule URSSAF, IR et CFE avec la configuration active de cette annee. Le selecteur permet de comparer les millesimes sans surcharger l'ecran."
                />
            </div>
        </FeatureLock>
    );
}
'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import {
    buildDecisionTimeline,
    buildHealthScoreInsight,
    buildMultiYearSummary,
    buildNetChangeInsight,
    buildReservePlan,
    formatCurrency,
    type InsightClient,
    type InsightInvoice,
    type MultiYearSummary,
} from '@/lib/dashboard-insights';
import { FeatureLock } from '@/components/dashboard/FeatureLock';
import { BarChart3, CalendarClock, Loader2, PiggyBank, ShieldCheck, TrendingUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function SeverityDot({ level }: { level: 'good' | 'watch' | 'critical' }) {
    const color = level === 'critical' ? 'bg-red-500' : level === 'watch' ? 'bg-amber-400' : 'bg-emerald-500';
    return <span className={`mt-1 h-2.5 w-2.5 rounded-full ${color}`} />;
}

export function HealthScoreCard({ clients = [], previousYearSummary = null }: { clients?: InsightClient[]; previousYearSummary?: MultiYearSummary | null }) {
    const { entries, config, loading } = useDashboard();

    const insight = useMemo(
        () => buildHealthScoreInsight(entries, config, clients, previousYearSummary),
        [clients, config, entries, previousYearSummary]
    );

    if (loading) return <div className="animate-pulse h-72 rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Score de sante financiere" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35]">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Score de sante financiere
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Vue d'ensemble de votre regularite, marge, diversification et exposition fiscale.</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                        <div className="text-3xl font-black font-syne text-emerald-600">{insight.score}/100</div>
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
                    <span className="font-semibold text-slate-800">Levier prioritaire:</span> {insight.recommendation}
                </div>
            </div>
        </FeatureLock>
    );
}

export function ReservePlannerCard() {
    const { entries, config, loading } = useDashboard();
    const reserve = useMemo(() => buildReservePlan(entries, config), [config, entries]);

    if (loading) return <div className="animate-pulse h-72 rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Reserve intelligente" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35]">
                            <PiggyBank className="h-5 w-5 text-indigo-500" />
                            A mettre de cote maintenant
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Montant recommande pour rester serein sur URSSAF, IR et CFE.</p>
                    </div>
                    <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right">
                        <div className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Total reserve</div>
                        <div className="text-2xl font-black font-syne text-indigo-700">{formatCurrency(reserve.totalReserve)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">URSSAF</div>
                        <div className="mt-2 text-xl font-bold font-syne text-[#0d1b35]">{formatCurrency(reserve.urssaf)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Impot</div>
                        <div className="mt-2 text-xl font-bold font-syne text-[#0d1b35]">{formatCurrency(reserve.impots)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">CFE</div>
                        <div className="mt-2 text-xl font-bold font-syne text-[#0d1b35]">{formatCurrency(reserve.cfe)}</div>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Disponible a depenser</div>
                    <div className="mt-2 text-3xl font-black font-syne text-emerald-600">{formatCurrency(reserve.safeToSpend)}</div>
                    <div className="mt-1 text-sm text-emerald-700">Taux de reserve recommande: {(reserve.reserveRate * 100).toFixed(1)}%</div>
                </div>
            </div>
        </FeatureLock>
    );
}

export function DecisionTimelineCard({ invoices = [] }: { invoices?: InsightInvoice[] }) {
    const { entries, config, loading } = useDashboard();
    const items = useMemo(() => buildDecisionTimeline(entries, config, invoices), [config, entries, invoices]);

    if (loading) return <div className="animate-pulse h-72 rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Timeline de decisions" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35] mb-5">
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
            </div>
        </FeatureLock>
    );
}

export function NetChangeExplainerCard() {
    const { entries, config, loading } = useDashboard();
    const insight = useMemo(() => buildNetChangeInsight(entries, config), [config, entries]);

    if (loading) return <div className="animate-pulse h-64 rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Explication du net" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35]">
                            <TrendingUpDown className="h-5 w-5 text-indigo-500" />
                            Pourquoi votre net change
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Lecture simple de l'evolution recente de votre poche nette.</p>
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-right ${insight.deltaNet >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        <div className={`text-xs font-semibold uppercase tracking-wide ${insight.deltaNet >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{insight.label}</div>
                        <div className={`text-2xl font-black font-syne ${insight.deltaNet >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {insight.deltaNet >= 0 ? '+' : ''}{formatCurrency(insight.deltaNet)}
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 mb-5">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delta CA</div>
                        <div className="mt-2 text-xl font-bold font-syne text-[#0d1b35]">{insight.deltaCa >= 0 ? '+' : ''}{formatCurrency(insight.deltaCa)}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delta charges</div>
                        <div className="mt-2 text-xl font-bold font-syne text-[#0d1b35]">{insight.deltaCharges >= 0 ? '+' : ''}{formatCurrency(insight.deltaCharges)}</div>
                    </div>
                </div>

                <ul className="space-y-2 text-sm text-slate-600">
                    {insight.drivers.map((driver) => (
                        <li key={driver} className="rounded-xl border border-slate-100 bg-white px-4 py-3">{driver}</li>
                    ))}
                </ul>
            </div>
        </FeatureLock>
    );
}

export function MultiYearReviewCard() {
    const { year } = useDashboard();
    const [history, setHistory] = useState<MultiYearSummary[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="animate-pulse h-80 rounded-3xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Historique multi-annees" requiredTier="pro">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold font-syne text-[#0d1b35]">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            Revue multi-annees
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">Comparez votre rythme de croissance, votre net et votre objectif sur plusieurs exercices.</p>
                    </div>
                    {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
                </div>

                <div className="space-y-3">
                    {history.map((item) => (
                        <div key={item.year} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="text-lg font-bold font-syne text-[#0d1b35]">Exercice {item.year}</div>
                                    <div className="text-sm text-slate-500">CA {formatCurrency(item.totalCA)} - Net {formatCurrency(item.netReel)}</div>
                                </div>
                                <div className="text-sm font-semibold text-slate-600">
                                    {item.goal && item.goalProgress !== null
                                        ? `Objectif ${(item.goalProgress * 100).toFixed(0)}%`
                                        : 'Sans objectif annuel'}
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl bg-white p-3">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">URSSAF</div>
                                    <div className="mt-1 font-bold text-slate-800">{formatCurrency(item.urssaf)}</div>
                                </div>
                                <div className="rounded-xl bg-white p-3">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">IR estime</div>
                                    <div className="mt-1 font-bold text-slate-800">{formatCurrency(item.ir)}</div>
                                </div>
                                <div className="rounded-xl bg-white p-3">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">CFE</div>
                                    <div className="mt-1 font-bold text-slate-800">{formatCurrency(item.cfe)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FeatureLock>
    );
}
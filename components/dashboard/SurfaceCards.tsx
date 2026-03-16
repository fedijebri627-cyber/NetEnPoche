'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useSubscription } from '@/hooks/useSubscription';
import { buildPriorityActions, type PriorityAction } from '@/lib/dashboard-actions';
import {
    buildClientRiskInsights,
    buildCollectionsInsight,
    buildDecisionTimeline,
    buildHealthScoreInsight,
    buildReservePlan,
    calculateCompositeNetBreakdown,
    formatCurrency,
    getCompositeTvaStatus,
    getUpcomingUrssafDeadline,
    type InsightClient,
    type InsightInvoice,
} from '@/lib/dashboard-insights';
import { FeatureLock } from './FeatureLock';

type StatTone = 'default' | 'danger';
type InlineTone = 'default' | 'good' | 'danger' | 'amber';

interface StatItem {
    label: string;
    value: string;
    subLine?: string;
    tone?: StatTone;
    valueTone?: InlineTone;
    subTone?: InlineTone;
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

function statCellClasses(tone: StatTone = 'default') {
    if (tone === 'danger') {
        return {
            wrapper: 'border-[#f09595] bg-[#fcebeb]',
            label: 'text-[#a32d2d]',
            value: 'text-[#791f1f]',
            subLine: 'text-[#791f1f]',
        };
    }

    return {
        wrapper: 'border-slate-200 bg-white',
        label: 'text-slate-500',
        value: 'text-slate-900',
        subLine: 'text-slate-500',
    };
}

function inlineToneClass(tone: InlineTone = 'default') {
    if (tone === 'good') return 'text-[#1d9e75]';
    if (tone === 'danger') return 'text-[#791f1f]';
    if (tone === 'amber') return 'text-[#633806]';
    return 'text-slate-900';
}

export function SummaryStatBar({
    items,
    tourTarget,
    tourGroup,
}: {
    items: StatItem[];
    tourTarget?: string;
    tourGroup?: string;
}) {
    return (
        <div
            data-tour={tourTarget}
            data-tour-group={tourGroup}
            className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-4"
        >
            {items.map((item) => {
                const colors = statCellClasses(item.tone);
                return (
                    <div key={item.label} className={`rounded-[10px] border p-[12px_14px] ${colors.wrapper}`}>
                        <div className={`text-[11px] font-medium uppercase tracking-[0.04em] ${colors.label}`}>{item.label}</div>
                        <div className={`mt-1 text-[20px] font-medium leading-tight ${item.tone === 'danger' ? colors.value : inlineToneClass(item.valueTone)}`}>
                            {item.value}
                        </div>
                        {item.subLine ? (
                            <div className={`mt-1 text-[11px] ${item.tone === 'danger' ? colors.subLine : item.subTone ? inlineToneClass(item.subTone) : colors.subLine}`}>
                                {item.subLine}
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}

export function DashboardStatBar() {
    const { entries, config, loading, year } = useDashboard();

    const items = useMemo<StatItem[]>(() => {
        const totalCA = entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
        const totals = calculateCompositeNetBreakdown(totalCA, config);
        const reserve = buildReservePlan(entries, config);
        const tva = getCompositeTvaStatus(totalCA, config);
        const upcoming = getUpcomingUrssafDeadline(entries, config);

        const recentMonths = [...entries]
            .sort((a, b) => a.month - b.month)
            .filter((entry) => entry.ca_amount > 0)
            .slice(-2);
        const previousMonth = recentMonths.length > 1 ? recentMonths[recentMonths.length - 2] : null;
        const currentMonthEntry = recentMonths.length > 0 ? recentMonths[recentMonths.length - 1] : null;
        const previousNet = previousMonth ? calculateCompositeNetBreakdown(previousMonth.ca_amount, config).netReel : 0;
        const currentNet = currentMonthEntry ? calculateCompositeNetBreakdown(currentMonthEntry.ca_amount, config).netReel : 0;
        const netTrend = previousNet > 0 ? Math.round(((currentNet - previousNet) / previousNet) * 100) : 0;
        const projectedDate = upcoming?.dueDate.toLocaleDateString('fr-FR') ?? new Date(year, 3, 30).toLocaleDateString('fr-FR');

        return [
            {
                label: 'Net en poche',
                value: formatCurrency(totals.netReel),
                subLine: `${netTrend >= 0 ? '+' : ''}${netTrend}% vs mois préc.`,
                subTone: netTrend >= 0 ? 'good' : 'danger',
            },
            {
                label: 'URSSAF à payer',
                value: formatCurrency(upcoming?.amount ?? 0),
                subLine: `Prochaine éch. ${projectedDate}`,
                subTone: 'amber',
            },
            {
                label: 'Réserve totale',
                value: formatCurrency(reserve.totalReserve),
                subLine: 'URSSAF + IR + CFE',
            },
            {
                label: 'Franchise TVA',
                value: `${tva.percentage.toFixed(0)}%`,
                subLine: tva.percentage >= 100 ? 'Seuil dépassé - agir' : `Seuil à ${Math.max(0, 100 - tva.percentage).toFixed(0)}%`,
                tone: tva.percentage >= 100 ? 'danger' : 'default',
                valueTone: tva.percentage >= 100 ? 'danger' : 'default',
                subTone: tva.percentage >= 100 ? 'danger' : 'amber',
            },
        ];
    }, [config, entries, year]);

    if (loading) return <div className="h-24 animate-pulse rounded-xl bg-slate-100" />;

    return <SummaryStatBar items={items} tourTarget="dashboard-kpis" tourGroup="stat-bar" />;
}

export function CollectionsStatBar({ invoices }: { invoices: InsightInvoice[] }) {
    const collections = useMemo(() => buildCollectionsInsight(invoices), [invoices]);
    const pendingCount = invoices.filter((invoice) => invoice.status === 'draft' || invoice.status === 'sent' || invoice.status === 'overdue').length;

    const items: StatItem[] = [
        {
            label: 'Cash en attente',
            value: formatCurrency(collections.pendingCash),
            subLine: `${pendingCount} factures en cours`,
        },
        {
            label: 'En retard',
            value: formatCurrency(collections.overdueCash),
            subLine: `${collections.overdueCount} facture${collections.overdueCount > 1 ? 's' : ''} - relancer`,
            tone: collections.overdueCash > 0 ? 'danger' : 'default',
            valueTone: collections.overdueCash > 0 ? 'danger' : 'default',
            subTone: collections.overdueCash > 0 ? 'danger' : 'default',
        },
        {
            label: 'A 7 jours',
            value: formatCurrency(collections.dueSoonCash),
            subLine: `${collections.dueSoonCount} facture(s)`,
        },
        {
                label: 'Délai moyen payé',
            value: `${collections.averagePaymentDelay.toFixed(0)} j`,
                subLine: collections.averagePaymentDelay <= 30 ? 'Bonne cadence' : 'À surveiller',
            valueTone: collections.averagePaymentDelay <= 30 ? 'good' : 'amber',
            subTone: collections.averagePaymentDelay <= 30 ? 'good' : 'amber',
        },
    ];

    return <SummaryStatBar items={items} />;
}

export function PriorityActionCenterCard() {
    const { entries, config, loading } = useDashboard();
    const actions = useMemo(() => buildPriorityActions(entries, config), [config, entries]);

    if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

    return (
        <div id="dashboard-priority-list" className="rounded-[12px] border border-slate-200 bg-white p-4">
            <div className="mb-3">
                <h3 className="text-[18px] font-medium text-slate-900">Priorités</h3>
                <p className="mt-1 text-[12px] text-slate-500">Les 3 prochaines actions utiles, triées par urgence.</p>
            </div>

            <div className="space-y-2">
                {actions.map((action) => {
                    const dotColor =
                        action.severity === 'critical'
                            ? 'bg-[#e24b4a]'
                            : action.severity === 'watch'
                                ? 'bg-[#ef9f27]'
                                : 'bg-slate-400';

                    return (
                        <button
                            key={action.id}
                            type="button"
                            onClick={() => handlePriorityAction(action)}
                            className="flex w-full items-center gap-[10px] rounded-[8px] px-3 py-[10px] text-left hover:bg-slate-50"
                        >
                            <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                            <span className="flex-1 text-[13px] text-slate-700">{action.title}</span>
                            <span className="text-[12px] text-[#0c447c]">{action.ctaLabel} -&gt;</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function UrssafDeadlineCard() {
    const { entries, config, loading } = useDashboard();
    const upcoming = useMemo(() => getUpcomingUrssafDeadline(entries, config, 60), [config, entries]);

    if (loading) return <div className="h-28 animate-pulse rounded-xl bg-slate-100" />;
    if (!upcoming) return null;

    const isCritical = upcoming.daysLeft <= 30;
    return (
        <div
            id="urssaf-deadline-card"
            className={`rounded-[12px] border p-4 ${isCritical ? 'border-[#f09595] bg-[#fcebeb]' : 'border-[#f1d29c] bg-[#faeeda]'}`}
        >
            <div className={`text-[24px] font-medium ${isCritical ? 'text-[#791f1f]' : 'text-[#633806]'}`}>{formatCurrency(upcoming.amount)}</div>
            <div className={`mt-1 text-[12px] uppercase tracking-[0.04em] ${isCritical ? 'text-[#a32d2d]' : 'text-[#633806]'}`}>Prochaine échéance URSSAF</div>
            <div className={`mt-2 text-[12px] ${isCritical ? 'text-[#791f1f]' : 'text-[#633806]'}`}>
                Avant le {upcoming.dueDate.toLocaleDateString('fr-FR')} - {upcoming.daysLeft} jours
            </div>
        </div>
    );
}

function PendingActionRow({
    tone,
    iconLabel,
    title,
    description,
    right,
    onClick,
}: {
    tone: 'red' | 'amber' | 'gray';
    iconLabel: string;
    title: string;
    description: string;
    right: string;
    onClick: () => void;
}) {
    const toneClasses =
        tone === 'red'
            ? 'bg-[#fcebeb] text-[#a32d2d]'
            : tone === 'amber'
                ? 'bg-[#faeeda] text-[#633806]'
                : 'bg-slate-100 text-slate-500';

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-start gap-[10px] rounded-[8px] border border-slate-200 px-[10px] py-[9px] text-left"
        >
            <div className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[5px] text-[11px] font-medium ${toneClasses}`}>
                {iconLabel}
            </div>
            <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-slate-900">{title}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{description}</div>
            </div>
            <div className="text-[12px] font-medium text-slate-700">{right}</div>
        </button>
    );
}

export function PendingActionsCard() {
    const { entries, config, loading } = useDashboard();
    const { isExpert } = useSubscription();
    const [invoices, setInvoices] = useState<InsightInvoice[]>([]);

    useEffect(() => {
        if (!isExpert) {
            setInvoices([]);
            return;
        }

        let ignore = false;
        const loadInvoices = async () => {
            try {
                const response = await fetch('/api/invoices', { cache: 'no-store' });
                if (!response.ok) return;
                const rows = await response.json();
                if (!ignore) {
                    setInvoices(Array.isArray(rows) ? rows : []);
                }
            } catch (error) {
                console.error(error);
            }
        };

        void loadInvoices();
        return () => {
            ignore = true;
        };
    }, [isExpert]);

    const upcoming = useMemo(() => getUpcomingUrssafDeadline(entries, config, 60), [config, entries]);
    const collections = useMemo(() => buildCollectionsInsight(invoices), [invoices]);
    const currentMonth = config.year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
    const missingMonths = entries.filter((entry) => entry.month <= currentMonth && Number(entry.ca_amount || 0) === 0).length;

    const items = useMemo(() => {
        const rows: Array<{
            key: string;
            tone: 'red' | 'amber' | 'gray';
            iconLabel: string;
            title: string;
            description: string;
            right: string;
            onClick: () => void;
            rank: number;
        }> = [];

        if (collections.overdueCash > 0) {
            rows.push({
                key: 'overdue',
                tone: 'red',
                iconLabel: '!',
                title: 'Factures en retard',
                description: `${collections.overdueCount} facture(s) a relancer`,
                right: formatCurrency(collections.overdueCash),
                onClick: () => {
                    window.location.href = '/dashboard/expert';
                },
                rank: 0,
            });
        }

        if (upcoming) {
            rows.push({
                key: 'urssaf',
                tone: upcoming.daysLeft <= 30 ? 'red' : 'amber',
                iconLabel: upcoming.label,
                title: 'Échéance URSSAF à venir',
                description: `Paiement avant le ${upcoming.dueDate.toLocaleDateString('fr-FR')}`,
                right: formatCurrency(upcoming.amount),
                onClick: () => focusDashboardTarget('urssaf-deadline-card'),
                rank: upcoming.daysLeft <= 30 ? 1 : 2,
            });
        }

        if (missingMonths > 0) {
            rows.push({
                key: 'missing-ca',
                tone: 'gray',
                iconLabel: 'CA',
                title: 'Saisies CA manquantes',
                description: `${missingMonths} mois à compléter pour fiabiliser vos alertes`,
                right: 'Voir',
                onClick: () => focusDashboardTarget('monthly-entries'),
                rank: 3,
            });
        }

        return rows.sort((a, b) => a.rank - b.rank).slice(0, 3);
    }, [collections.overdueCash, collections.overdueCount, missingMonths, upcoming]);

    if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

    return (
        <div className="rounded-[12px] border border-slate-200 bg-white p-4">
            <div className="mb-3">
                <h3 className="text-[18px] font-medium text-slate-900">Actions en attente</h3>
                <p className="mt-1 text-[12px] text-slate-500">Urgences operationnelles triees par niveau de risque.</p>
            </div>

            <div className="space-y-2">
                {items.length === 0 ? (
                    <div className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-500">
                        Rien d'urgent pour le moment.
                    </div>
                ) : (
                    items.map(({ key, ...item }) => <PendingActionRow key={key} {...item} />)
                )}
            </div>
        </div>
    );
}

export function FiscalActionsCard() {
    const { entries, config, loading } = useDashboard();
    const items = useMemo(
        () => buildDecisionTimeline(entries, config).filter((item) => item.id === 'urssaf' || item.id === 'tva' || item.id === 'goal').slice(0, 3),
        [config, entries]
    );

    if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

    return (
        <div className="rounded-[12px] border border-slate-200 bg-white p-4">
            <div className="mb-3">
                <h3 className="text-[18px] font-medium text-slate-900">Actions fiscales</h3>
                <p className="mt-1 text-[12px] text-slate-500">TVA, échéance URSSAF et objectif annuel réunis au même endroit.</p>
            </div>

            <div className="space-y-2">
                {items.map((item) => {
                    const tone = item.severity === 'critical' ? 'red' : item.severity === 'watch' ? 'amber' : 'gray';
                    const iconLabel = item.id === 'urssaf' ? 'T' : item.id === 'tva' ? 'TVA' : 'CA';
                    return (
                        <PendingActionRow
                            key={item.id}
                            tone={tone}
                            iconLabel={iconLabel}
                            title={item.title}
                            description={item.detail}
                            right={item.value}
                            onClick={() => {
                                if (item.id === 'tva') {
                                    focusDashboardTarget('scenario-lab');
                                    return;
                                }
                                if (item.id === 'goal') {
                                    dispatchOnboardingOpen();
                                    return;
                                }
                                focusDashboardTarget('urssaf-deadline-card');
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export function RiskConcentrationCard({ clients, invoices }: { clients: InsightClient[]; invoices: InsightInvoice[] }) {
    const insights = useMemo(() => buildClientRiskInsights(clients, invoices).slice(0, 5), [clients, invoices]);

    return (
        <FeatureLock featureName="Rentabilité clients" requiredTier="expert">
            <div className="rounded-[12px] border border-slate-200 bg-white p-4">
                <div className="mb-3">
                    <h3 className="text-[18px] font-medium text-slate-900">Risque & concentration</h3>
                    <p className="mt-1 text-[12px] text-slate-500">Quels clients concentrent le plus votre chiffre d'affaires.</p>
                </div>

                <div className="space-y-3">
                    {insights.length === 0 ? (
                        <div className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-500">
                            Ajoutez des clients et des factures pour activer cette lecture.
                        </div>
                    ) : (
                        insights.map((item) => {
                            const share = Math.round(item.shareOfRevenue * 100);
                            const risky = share > 40;
                            return (
                                <div key={item.clientId} className="rounded-[8px] border border-slate-200 bg-white p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="truncate text-[13px] font-medium text-slate-900">{item.name}</div>
                                            <div className="mt-1 text-[11px] text-slate-500">
                                                {item.invoiceCount} facture(s) - {item.overdueAmount > 0 ? `retard ${formatCurrency(item.overdueAmount)}` : `ticket moy. ${formatCurrency(item.averageTicket)}`}
                                            </div>
                                        </div>
                                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${risky ? 'bg-[#faeeda] text-[#633806]' : 'bg-[#eaf3de] text-[#27500a]'}`}>
                                            {share}%
                                        </span>
                                    </div>
                                    <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-slate-100">
                                        <div className={`h-full rounded-full ${risky ? 'bg-[#ef9f27]' : 'bg-[#1d9e75]'}`} style={{ width: `${Math.max(6, share)}%` }} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </FeatureLock>
    );
}

export function CompactClientHealthScoreCard({ clients }: { clients: InsightClient[] }) {
    const { entries, config, loading } = useDashboard();
    const insight = useMemo(() => buildHealthScoreInsight(entries, config, clients), [clients, config, entries]);

    if (loading) return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;

    return (
        <FeatureLock featureName="Score de santé financière" requiredTier="pro">
            <div className="rounded-[12px] border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="flex items-center gap-2 text-[16px] font-medium text-slate-900">
                            <ShieldCheck className="h-4 w-4 text-[#1d9e75]" />
                            Santé financière
                        </h3>
                        <div className="mt-1 text-[12px] text-slate-500">Version compacte du score global.</div>
                    </div>
                    <div className="text-[32px] font-medium leading-none text-[#1d9e75]">
                        {insight.score}
                        <span className="text-[18px] text-slate-500">/100</span>
                    </div>
                </div>

                <div className="space-y-2">
                    {insight.breakdown.map((item) => (
                        <div key={item.label} className="grid grid-cols-[34px_1fr] items-center gap-2">
                            <span className="text-[11px] uppercase tracking-[0.04em] text-slate-500">
                                {item.label === 'Regularite'
                                    ? 'REG'
                                    : item.label === 'Diversification'
                                        ? 'DIV'
                                        : item.label === 'Marge'
                                            ? 'MAR'
                                            : item.label}
                            </span>
                            <div className="h-[3px] overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-[#1d9e75]" style={{ width: `${(item.value / item.max) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3 text-[12px] text-slate-600">
                    <span className="font-medium text-slate-800">Levier :</span> {insight.recommendation}
                </div>
            </div>
        </FeatureLock>
    );
}

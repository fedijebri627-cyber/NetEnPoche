import { TAX_RATES_2026 } from '@/config/tax-rates-2026';
import {
    calculateAnnualProjection,
    calculateCFEProvision,
    calculateHealthScore,
    getAbattement,
    type ActivityType,
    type MonthlyEntry as CalculationMonthlyEntry,
} from '@/lib/calculations';

export type HouseholdStatus = 'celibataire' | 'marie' | 'pacse';
export type TimelineSeverity = 'good' | 'watch' | 'critical';

export interface InsightConfig {
    year: number;
    activity_type: ActivityType;
    secondary_activity_type?: ActivityType | null;
    secondary_activity_share?: number | null;
    acre_enabled: boolean;
    versement_liberatoire: boolean;
    annual_ca_goal: number | null;
    situation_familiale: HouseholdStatus;
    parts_fiscales: number;
    autres_revenus: number;
}

export interface InsightMonthlyEntry extends CalculationMonthlyEntry {
    notes?: string | null;
}

export interface InsightInvoice {
    id: string;
    client_id: string;
    amount_ht: number | string;
    invoice_date: string;
    due_date: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    paid_at?: string | null;
    last_alert_sent?: string | null;
    client?: {
        name?: string | null;
        type?: 'b2b' | 'b2c' | null;
        email?: string | null;
    } | null;
}

export interface InsightClient {
    id: string;
    name: string;
    type: 'b2b' | 'b2c';
    email: string | null;
    invoices?: InsightInvoice[];
}

export interface CompositeNetBreakdown {
    caBrut: number;
    urssaf: number;
    ir: number;
    cfe: number;
    netReel: number;
    tauxGlobal: number;
    revenuImposable: number;
    trancheMarginale: number;
}

export interface ReservePlan {
    urssaf: number;
    impots: number;
    cfe: number;
    totalReserve: number;
    safeToSpend: number;
    reserveRate: number;
}

export interface TimelineItem {
    id: string;
    title: string;
    detail: string;
    value: string;
    severity: TimelineSeverity;
}

export interface HealthScoreInsight {
    score: number;
    trend: number;
    breakdown: {
        label: string;
        value: number;
        max: number;
    }[];
    recommendation: string;
}

export interface NetChangeInsight {
    label: string;
    deltaNet: number;
    deltaCa: number;
    deltaCharges: number;
    drivers: string[];
}

export interface ScenarioResult {
    label: string;
    netDelta: number;
    urssafDelta: number;
    irDelta: number;
    cfeDelta: number;
    finalNet: number;
    finalCa: number;
    finalTvaPercentage: number;
    finalTvaStatus: 'safe' | 'warning' | 'danger';
}

export interface MultiYearSummary {
    year: number;
    totalCA: number;
    netReel: number;
    urssaf: number;
    ir: number;
    cfe: number;
    projection: number;
    goal: number | null;
    goalProgress: number | null;
}

export interface CollectionsInsight {
    pendingCash: number;
    overdueCash: number;
    dueSoonCash: number;
    overdueCount: number;
    dueSoonCount: number;
    averagePaymentDelay: number;
    topLateInvoices: InsightInvoice[];
}

export interface ClientRiskInsight {
    clientId: string;
    name: string;
    totalRevenue: number;
    overdueAmount: number;
    invoiceCount: number;
    averageTicket: number;
    shareOfRevenue: number;
    averageDelay: number;
}

export interface UrssafQuarterInsight {
    label: 'T1' | 'T2' | 'T3' | 'T4';
    start: number;
    end: number;
    dueDate: Date;
    amount: number;
    quarterCA: number;
    hasData: boolean;
    daysLeft: number;
    status: 'past' | 'future' | 'watch' | 'critical';
}

const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
const dueDateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' });

export function formatCurrency(value: number, maximumFractionDigits = 0) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits,
    }).format(value);
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function getShareConfig(config: InsightConfig) {
    const secondaryShare = config.secondary_activity_type
        ? clamp(Number(config.secondary_activity_share || 0), 0, 0.9)
        : 0;

    const primaryShare = clamp(1 - secondaryShare, 0.1, 1);

    return [
        { type: config.activity_type, share: primaryShare },
        ...(config.secondary_activity_type && secondaryShare > 0
            ? [{ type: config.secondary_activity_type, share: secondaryShare }]
            : []),
    ];
}

function getUrssafRateForActivity(activityType: ActivityType, acreEnabled: boolean) {
    const baseRate = activityType === 'vente'
        ? TAX_RATES_2026.URSSAF.VENTE
        : activityType === 'services_bic'
            ? TAX_RATES_2026.URSSAF.SERVICES_BIC
            : activityType === 'liberal'
                ? TAX_RATES_2026.URSSAF.LIBERAL
                : TAX_RATES_2026.URSSAF.SERVICES_BNC;

    return acreEnabled ? baseRate * TAX_RATES_2026.ACRE_MULTIPLIER : baseRate;
}

function getVersementLiberatoireRate(activityType: ActivityType) {
    if (activityType === 'vente') return TAX_RATES_2026.VERSEMENT_LIBERATOIRE.VENTE;
    if (activityType === 'services_bic') return TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BIC;
    return TAX_RATES_2026.VERSEMENT_LIBERATOIRE.SERVICES_BNC;
}

function calculateProgressiveIr(revenuImposableCA: number, parts: number, autresRevenus: number) {
    const revenuImposableFoyer = revenuImposableCA + autresRevenus;
    if (revenuImposableFoyer <= 0) {
        return {
            irEstime: 0,
            trancheMarginale: 0,
            revenuImposable: revenuImposableCA,
        };
    }

    const quotientFamilial = revenuImposableFoyer / Math.max(parts, 1);
    let totalIrParPart = 0;
    let previousMax = 0;
    let tmi = 0;

    for (const bracket of TAX_RATES_2026.IR_BAREME) {
        if (quotientFamilial <= previousMax) {
            break;
        }

        tmi = bracket.rate;
        const taxableInBracket = Math.min(quotientFamilial, bracket.max) - previousMax;
        totalIrParPart += taxableInBracket * bracket.rate;
        previousMax = bracket.max;
    }

    const irGlobal = totalIrParPart * Math.max(parts, 1);
    const ratioAE = revenuImposableCA / revenuImposableFoyer;

    return {
        irEstime: irGlobal * ratioAE,
        trancheMarginale: tmi,
        revenuImposable: revenuImposableCA,
    };
}

export function getCompositeTvaStatus(cumulativeCA: number, config: InsightConfig) {
    const mix = getShareConfig(config);
    const threshold = mix.some((item) => item.type !== 'vente')
        ? TAX_RATES_2026.TVA_THRESHOLDS_FRANCHISE.SERVICES
        : TAX_RATES_2026.TVA_THRESHOLDS_FRANCHISE.VENTE;

    const percentage = threshold > 0 ? (cumulativeCA / threshold) * 100 : 0;
    const remaining = Math.max(0, threshold - cumulativeCA);

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percentage >= 100) status = 'danger';
    else if (percentage >= 85) status = 'warning';

    return {
        threshold,
        percentage,
        remaining,
        status,
        isMixedEstimate: Boolean(config.secondary_activity_type && Number(config.secondary_activity_share || 0) > 0),
    };
}

export function calculateCompositeNetBreakdown(ca: number, config: InsightConfig): CompositeNetBreakdown {
    const mix = getShareConfig(config);
    const urssaf = mix.reduce((sum, item) => {
        return sum + (ca * item.share * getUrssafRateForActivity(item.type, config.acre_enabled));
    }, 0);

    let ir = 0;
    let revenuImposable = 0;
    let trancheMarginale = 0;

    if (config.versement_liberatoire) {
        ir = mix.reduce((sum, item) => {
            return sum + (ca * item.share * getVersementLiberatoireRate(item.type));
        }, 0);
        revenuImposable = ca;
        trancheMarginale = mix.reduce((sum, item) => sum + (getVersementLiberatoireRate(item.type) * item.share), 0);
    } else {
        revenuImposable = mix.reduce((sum, item) => {
            return sum + (ca * item.share * (1 - getAbattement(item.type)));
        }, 0);
        const irResult = calculateProgressiveIr(
            revenuImposable,
            config.parts_fiscales,
            config.autres_revenus
        );
        ir = irResult.irEstime;
        trancheMarginale = irResult.trancheMarginale;
    }

    const cfe = calculateCFEProvision(ca, config.activity_type);
    const netReel = ca - urssaf - ir - cfe;
    const tauxGlobal = ca > 0 ? (urssaf + ir + cfe) / ca : 0;

    return {
        caBrut: ca,
        urssaf,
        ir,
        cfe,
        netReel,
        tauxGlobal,
        revenuImposable,
        trancheMarginale,
    };
}

export function buildReservePlan(entries: InsightMonthlyEntry[], config: InsightConfig): ReservePlan {
    const totalCA = entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
    const totals = calculateCompositeNetBreakdown(totalCA, config);
    const totalReserve = totals.urssaf + totals.ir + totals.cfe;

    return {
        urssaf: totals.urssaf,
        impots: totals.ir,
        cfe: totals.cfe,
        totalReserve,
        safeToSpend: Math.max(0, totalCA - totalReserve),
        reserveRate: totalCA > 0 ? totalReserve / totalCA : 0,
    };
}

function getTodayForYear(year: number) {
    const now = new Date();
    if (year !== now.getFullYear()) {
        return new Date(year, 11, 31);
    }

    return now;
}

export function buildUrssafQuarterSchedule(
    entries: InsightMonthlyEntry[],
    config: InsightConfig
): UrssafQuarterInsight[] {
    const today = getTodayForYear(config.year);
    const quarterRanges: Array<{ label: 'T1' | 'T2' | 'T3' | 'T4'; start: number; end: number; dueDate: Date }> = [
        { label: 'T1', start: 1, end: 3, dueDate: new Date(config.year, 3, 30) },
        { label: 'T2', start: 4, end: 6, dueDate: new Date(config.year, 6, 31) },
        { label: 'T3', start: 7, end: 9, dueDate: new Date(config.year, 9, 31) },
        { label: 'T4', start: 10, end: 12, dueDate: new Date(config.year + 1, 0, 31) },
    ];

    return quarterRanges.map((quarter) => {
        const quarterCA = entries
            .filter((entry) => entry.month >= quarter.start && entry.month <= quarter.end)
            .reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
        const amount = calculateCompositeNetBreakdown(quarterCA, config).urssaf;
        const daysLeft = Math.ceil((quarter.dueDate.getTime() - today.getTime()) / 86400000);

        let status: UrssafQuarterInsight['status'] = 'future';
        if (daysLeft < 0) status = 'past';
        else if (daysLeft <= 30) status = 'critical';
        else if (daysLeft <= 60) status = 'watch';

        return {
            ...quarter,
            amount,
            quarterCA,
            hasData: quarterCA > 0,
            daysLeft,
            status,
        };
    });
}

export function getUpcomingUrssafDeadline(
    entries: InsightMonthlyEntry[],
    config: InsightConfig,
    maxDays = Number.POSITIVE_INFINITY
) {
    const schedule = buildUrssafQuarterSchedule(entries, config);
    const actionable =
        schedule.find((quarter) => quarter.daysLeft >= 0 && quarter.hasData)
        ?? schedule.find((quarter) => quarter.daysLeft >= 0);

    if (!actionable || actionable.daysLeft > maxDays) {
        return null;
    }

    return actionable;
}

export function buildDecisionTimeline(
    entries: InsightMonthlyEntry[],
    config: InsightConfig,
    invoices: InsightInvoice[] = []
): TimelineItem[] {
    const today = getTodayForYear(config.year);
    const totalCA = entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
    const tva = getCompositeTvaStatus(totalCA, config);
    const currentMonth = config.year === today.getFullYear() ? today.getMonth() + 1 : 12;
    const projection = calculateAnnualProjection(entries, Math.max(currentMonth, 1));
    const nextQuarter = Math.min(4, Math.floor((today.getMonth()) / 3) + 1);
    const dueDates = [
        new Date(config.year, 3, 30),
        new Date(config.year, 6, 31),
        new Date(config.year, 9, 31),
        new Date(config.year + 1, 0, 31),
    ];
    const nextDueDate = dueDates[Math.min(nextQuarter, dueDates.length - 1)];
    const quarterEntries = entries.filter((entry) => {
        const quarterStart = (nextQuarter - 1) * 3 + 1;
        return entry.month >= quarterStart && entry.month <= quarterStart + 2;
    });
    const nextUrssafAmount = calculateCompositeNetBreakdown(
        quarterEntries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0),
        config
    ).urssaf;

    const missingMonths = entries
        .filter((entry) => entry.month <= currentMonth && Number(entry.ca_amount || 0) === 0)
        .map((entry) => entry.month);

    const annualGoal = Number(config.annual_ca_goal || 0);
    const expectedPace = annualGoal > 0 ? (annualGoal / 12) * Math.max(currentMonth, 1) : 0;
    const overdueInvoices = invoices.filter((invoice) => invoice.status === 'overdue');
    const dueSoonInvoices = invoices.filter((invoice) => {
        if (invoice.status === 'paid') return false;
        const dueDate = new Date(invoice.due_date);
        const diffDays = (dueDate.getTime() - today.getTime()) / 86400000;
        return diffDays >= 0 && diffDays <= 7;
    });

    const timeline: TimelineItem[] = [
        {
            id: 'urssaf',
            title: 'Prochaine échéance URSSAF',
            detail: `À provisionner avant le ${dueDateFormatter.format(nextDueDate)}`,
            value: formatCurrency(nextUrssafAmount),
            severity: nextUrssafAmount > 0 ? 'watch' : 'good',
        },
        {
            id: 'tva',
            title: tva.status === 'danger' ? 'TVA à régulariser' : 'Surveillance seuil TVA',
            detail: tva.status === 'danger'
                ? 'Le seuil est franchi, préparez votre bascule TVA.'
                : `Projection annuelle: ${formatCurrency(projection)}`,
            value: `${tva.percentage.toFixed(0)}%`,
            severity: tva.status === 'danger' ? 'critical' : tva.status === 'warning' ? 'watch' : 'good',
        },
        {
            id: 'goal',
            title: 'Objectif annuel',
            detail: annualGoal > 0
                ? (totalCA >= expectedPace ? 'Vous tenez le rythme cible.' : 'Vous êtes sous le rythme cible pour la date.')
                : 'Ajoutez un objectif annuel pour activer ce suivi.',
            value: annualGoal > 0 ? `${Math.round((totalCA / annualGoal) * 100)}%` : 'À définir',
            severity: annualGoal === 0 ? 'watch' : totalCA >= expectedPace ? 'good' : 'watch',
        },
    ];

    if (missingMonths.length > 0) {
        timeline.push({
            id: 'entries',
            title: 'Saisies mensuelles manquantes',
            detail: `Mois sans CA renseigné: ${missingMonths.join(', ')}`,
            value: `${missingMonths.length} mois`,
            severity: 'watch',
        });
    }

    if (overdueInvoices.length > 0 || dueSoonInvoices.length > 0) {
        timeline.push({
            id: 'collections',
            title: 'Factures à suivre',
            detail: overdueInvoices.length > 0
                ? `${overdueInvoices.length} facture(s) en retard`
                : `${dueSoonInvoices.length} facture(s) arrivent à échéance`,
            value: formatCurrency(
                [...overdueInvoices, ...dueSoonInvoices].reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0)
            ),
            severity: overdueInvoices.length > 0 ? 'critical' : 'watch',
        });
    }

    return timeline.slice(0, 5);
}

export function buildHealthScoreInsight(
    entries: InsightMonthlyEntry[],
    config: InsightConfig,
    clients: InsightClient[] = [],
    previousYearSummary?: MultiYearSummary | null
): HealthScoreInsight {
    const totalCA = entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
    const totals = calculateCompositeNetBreakdown(totalCA, config);
    const tva = getCompositeTvaStatus(totalCA, config);
    const monthsEntered = entries.filter((entry) => Number(entry.ca_amount || 0) > 0).length;
    const currentMonth = config.year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
    const activeClients = clients.filter((client) => (client.invoices?.length || 0) > 0).length;

    const scoreResult = calculateHealthScore({
        monthsEnteredCount: monthsEntered,
        currentMonth,
        caSourcesCount: activeClients || (totalCA > 0 ? 1 : 0),
        netMarginPercentage: totalCA > 0 ? totals.netReel / totalCA : 0,
        tvaStatus: tva.status,
        cfeAccountedFor: totals.cfe > 0 || totalCA === 0,
    });

    const previousScore = previousYearSummary && previousYearSummary.totalCA > 0
        ? Math.round((previousYearSummary.netReel / previousYearSummary.totalCA) * 100)
        : scoreResult.score;

    const recommendation = scoreResult.breakdown.diversification <= 10
        ? 'Diversifiez votre portefeuille client pour réduire votre risque de dépendance.'
        : scoreResult.breakdown.tva <= 7
            ? 'Le seuil TVA se rapproche. Vérifiez votre prix net et votre trésorerie.'
            : scoreResult.breakdown.regularite <= 12
                ? 'Compléter tous les mois vous donnera des projections et alertes plus fiables.'
                : 'Votre pilotage est sain. Le prochain levier se joue surtout sur le cash disponible.';

    return {
        score: scoreResult.score,
        trend: scoreResult.score - previousScore,
        breakdown: [
            { label: 'Régularité', value: scoreResult.breakdown.regularite, max: 20 },
            { label: 'Diversification', value: scoreResult.breakdown.diversification, max: 20 },
            { label: 'Marge', value: scoreResult.breakdown.marge, max: 30 },
            { label: 'TVA', value: scoreResult.breakdown.tva, max: 15 },
            { label: 'CFE', value: scoreResult.breakdown.cfe, max: 15 },
        ],
        recommendation,
    };
}

function getMonthlyNetMap(entries: InsightMonthlyEntry[], config: InsightConfig) {
    return entries
        .sort((a, b) => a.month - b.month)
        .map((entry) => ({
            month: entry.month,
            ca: Number(entry.ca_amount || 0),
            breakdown: calculateCompositeNetBreakdown(Number(entry.ca_amount || 0), config),
        }));
}

export function buildNetChangeInsight(entries: InsightMonthlyEntry[], config: InsightConfig): NetChangeInsight {
    const monthlySnapshots = getMonthlyNetMap(entries, config).filter((entry) => entry.ca > 0);

    if (monthlySnapshots.length === 0) {
        return {
            label: 'Pas encore assez de données',
            deltaNet: 0,
            deltaCa: 0,
            deltaCharges: 0,
            drivers: ['Ajoutez un premier mois de chiffre d’affaires pour activer cette analyse.'],
        };
    }

    const current = monthlySnapshots[monthlySnapshots.length - 1];
    const previous = monthlySnapshots[Math.max(monthlySnapshots.length - 2, 0)];

    const deltaNet = current.breakdown.netReel - previous.breakdown.netReel;
    const deltaCa = current.ca - previous.ca;
    const deltaCharges =
        (current.breakdown.urssaf + current.breakdown.ir + current.breakdown.cfe)
        - (previous.breakdown.urssaf + previous.breakdown.ir + previous.breakdown.cfe);

    const drivers: string[] = [];
    if (Math.abs(deltaCa) >= 1) {
        drivers.push(deltaCa >= 0
            ? `Le chiffre d’affaires progresse de ${formatCurrency(deltaCa)}.`
            : `Le chiffre d’affaires recule de ${formatCurrency(Math.abs(deltaCa))}.`);
    }

    if (Math.abs(deltaCharges) >= 1) {
        drivers.push(deltaCharges >= 0
            ? `Les charges provisionnées montent de ${formatCurrency(deltaCharges)}.`
            : `Les charges provisionnées baissent de ${formatCurrency(Math.abs(deltaCharges))}.`);
    }

    if (drivers.length === 0) {
        drivers.push('Votre net est stable par rapport au mois précédent.');
    }

    return {
        label: `${monthFormatter.format(new Date(config.year, current.month - 1, 1))} vs ${monthFormatter.format(new Date(config.year, previous.month - 1, 1))}`,
        deltaNet,
        deltaCa,
        deltaCharges,
        drivers,
    };
}

export function simulateScenario(
    entries: InsightMonthlyEntry[],
    config: InsightConfig,
    mode: 'extra_invoice' | 'price_increase' | 'tva_crossing' | 'vl_toggle',
    value: number
): ScenarioResult {
    const totalCA = entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
    const base = calculateCompositeNetBreakdown(totalCA, config);
    let simulatedCA = totalCA;
    let simulatedConfig = config;

    if (mode === 'extra_invoice') {
        simulatedCA = totalCA + Math.max(0, value);
    } else if (mode === 'price_increase') {
        simulatedCA = totalCA * (1 + Math.max(-100, value) / 100);
    } else if (mode === 'tva_crossing') {
        simulatedCA = Math.max(totalCA, getCompositeTvaStatus(totalCA, config).threshold + Math.max(500, value));
    } else if (mode === 'vl_toggle') {
        simulatedConfig = {
            ...config,
            versement_liberatoire: !config.versement_liberatoire,
        };
    }

    const next = calculateCompositeNetBreakdown(simulatedCA, simulatedConfig);
    const nextTva = getCompositeTvaStatus(simulatedCA, simulatedConfig);

    return {
        label: mode === 'extra_invoice'
            ? 'Facture supplémentaire'
            : mode === 'price_increase'
                ? 'Hausse tarifaire'
                : mode === 'tva_crossing'
                    ? 'Passage TVA simulé'
                    : 'Versement libératoire',
        netDelta: next.netReel - base.netReel,
        urssafDelta: next.urssaf - base.urssaf,
        irDelta: next.ir - base.ir,
        cfeDelta: next.cfe - base.cfe,
        finalNet: next.netReel,
        finalCa: simulatedCA,
        finalTvaPercentage: nextTva.percentage,
        finalTvaStatus: nextTva.status,
    };
}

export function buildMultiYearSummary(
    years: Array<{ year: number; entries: InsightMonthlyEntry[]; config: InsightConfig }>
): MultiYearSummary[] {
    return years
        .map((item) => {
            const totalCA = item.entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
            const breakdown = calculateCompositeNetBreakdown(totalCA, item.config);
            const projection = calculateAnnualProjection(item.entries, 12);
            const goal = item.config.annual_ca_goal ?? null;
            const goalProgress = goal && goal > 0 ? totalCA / goal : null;

            return {
                year: item.year,
                totalCA,
                netReel: breakdown.netReel,
                urssaf: breakdown.urssaf,
                ir: breakdown.ir,
                cfe: breakdown.cfe,
                projection,
                goal,
                goalProgress,
            };
        })
        .sort((a, b) => a.year - b.year);
}

function daysBetween(start: Date, end: Date) {
    return Math.round((end.getTime() - start.getTime()) / 86400000);
}

export function buildCollectionsInsight(invoices: InsightInvoice[]): CollectionsInsight {
    const today = new Date();
    const overdueInvoices = invoices.filter((invoice) => invoice.status === 'overdue');
    const dueSoonInvoices = invoices.filter((invoice) => {
        if (invoice.status === 'paid') return false;
        const days = daysBetween(today, new Date(invoice.due_date));
        return days >= 0 && days <= 7;
    });

    const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid' && invoice.paid_at);
    const averagePaymentDelay = paidInvoices.length > 0
        ? paidInvoices.reduce((sum, invoice) => {
            return sum + daysBetween(new Date(invoice.due_date), new Date(invoice.paid_at || invoice.due_date));
        }, 0) / paidInvoices.length
        : 0;

    return {
        pendingCash: invoices
            .filter((invoice) => invoice.status === 'draft' || invoice.status === 'sent' || invoice.status === 'overdue')
            .reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0),
        overdueCash: overdueInvoices.reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0),
        dueSoonCash: dueSoonInvoices.reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0),
        overdueCount: overdueInvoices.length,
        dueSoonCount: dueSoonInvoices.length,
        averagePaymentDelay,
        topLateInvoices: [...overdueInvoices].sort((a, b) => Number(b.amount_ht) - Number(a.amount_ht)).slice(0, 5),
    };
}

export function buildClientRiskInsights(
    clients: InsightClient[],
    invoices: InsightInvoice[]
): ClientRiskInsight[] {
    const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0);

    return clients
        .map((client) => {
            const clientInvoices = invoices.filter((invoice) => invoice.client_id === client.id);
            const clientRevenue = clientInvoices.reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0);
            const overdueAmount = clientInvoices
                .filter((invoice) => invoice.status === 'overdue')
                .reduce((sum, invoice) => sum + Number(invoice.amount_ht || 0), 0);
            const paidInvoices = clientInvoices.filter((invoice) => invoice.status === 'paid' && invoice.paid_at);
            const averageDelay = paidInvoices.length > 0
                ? paidInvoices.reduce((sum, invoice) => {
                    return sum + daysBetween(new Date(invoice.due_date), new Date(invoice.paid_at || invoice.due_date));
                }, 0) / paidInvoices.length
                : 0;

            return {
                clientId: client.id,
                name: client.name,
                totalRevenue: clientRevenue,
                overdueAmount,
                invoiceCount: clientInvoices.length,
                averageTicket: clientInvoices.length > 0 ? clientRevenue / clientInvoices.length : 0,
                shareOfRevenue: totalRevenue > 0 ? clientRevenue / totalRevenue : 0,
                averageDelay,
            };
        })
        .filter((client) => client.invoiceCount > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue);
}

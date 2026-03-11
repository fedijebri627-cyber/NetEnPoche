import {
    buildDecisionTimeline,
    buildHealthScoreInsight,
    buildReservePlan,
    formatCurrency,
    getCompositeTvaStatus,
    type InsightConfig,
    type InsightMonthlyEntry,
    type TimelineSeverity,
} from '@/lib/dashboard-insights';

export type PriorityActionKind = 'scroll' | 'route' | 'onboarding';

export interface PriorityAction {
    id: string;
    title: string;
    detail: string;
    value: string;
    ctaLabel: string;
    severity: TimelineSeverity;
    kind: PriorityActionKind;
    targetId?: string;
    route?: string;
}

function severityRank(severity: TimelineSeverity) {
    if (severity === 'critical') return 0;
    if (severity === 'watch') return 1;
    return 2;
}

export function buildPriorityActions(entries: InsightMonthlyEntry[], config: InsightConfig): PriorityAction[] {
    const totalCA = entries.reduce((sum, entry) => sum + Number(entry.ca_amount || 0), 0);
    const currentMonth = config.year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
    const filledMonths = entries.filter((entry) => Number(entry.ca_amount || 0) > 0).length;
    const missingMonths = entries
        .filter((entry) => entry.month <= currentMonth && Number(entry.ca_amount || 0) === 0)
        .map((entry) => entry.month);
    const reserve = buildReservePlan(entries, config);
    const tva = getCompositeTvaStatus(totalCA, config);
    const health = buildHealthScoreInsight(entries, config);
    const annualGoal = Number(config.annual_ca_goal || 0);
    const expectedPace = annualGoal > 0 ? (annualGoal / 12) * Math.max(currentMonth, 1) : 0;
    const paceGap = Math.max(0, expectedPace - totalCA);
    const timeline = buildDecisionTimeline(entries, config);

    const actions: PriorityAction[] = [];

    if (filledMonths === 0) {
        actions.push({
            id: 'first-entry',
            title: 'Activez votre cockpit en saisissant un premier mois de CA',
            detail: 'Sans premier encaissement, les projections et alertes restent quasi inactives.',
            value: '2 min',
            ctaLabel: 'Saisir mon premier CA',
            severity: 'watch',
            kind: 'scroll',
            targetId: 'monthly-entries',
        });
    }

    if (reserve.totalReserve > 0) {
        actions.push({
            id: 'reserve',
            title: 'Mettez votre tresorerie de securite de cote maintenant',
            detail: `Gardez ${formatCurrency(reserve.totalReserve)} pour couvrir URSSAF, impot et CFE sans tension.`,
            value: formatCurrency(reserve.safeToSpend),
            ctaLabel: 'Voir la reserve',
            severity: reserve.reserveRate >= 0.35 ? 'critical' : 'watch',
            kind: 'scroll',
            targetId: 'reserve-card',
        });
    }

    if (!annualGoal) {
        actions.push({
            id: 'goal-missing',
            title: 'Definissez un objectif annuel pour piloter votre rythme',
            detail: "L'objectif active les alertes de cadence et la lecture de votre avance ou retard.",
            value: 'A definir',
            ctaLabel: 'Renseigner mon objectif',
            severity: 'watch',
            kind: 'scroll',
            targetId: 'activity-config',
        });
    } else if (paceGap > 0) {
        actions.push({
            id: 'goal-gap',
            title: 'Vous etes sous le rythme de votre objectif annuel',
            detail: `Il manque ${formatCurrency(paceGap)} pour rester au niveau attendu a date.`,
            value: `${Math.round((totalCA / annualGoal) * 100)}%`,
            ctaLabel: 'Revoir mon objectif',
            severity: paceGap > annualGoal * 0.12 ? 'critical' : 'watch',
            kind: 'scroll',
            targetId: 'activity-config',
        });
    }

    if (tva.status !== 'safe') {
        actions.push({
            id: 'tva-risk',
            title: tva.status === 'danger' ? 'Preparez votre bascule TVA' : 'Surveillez de pres votre seuil TVA',
            detail: tva.status === 'danger'
                ? 'Votre franchise est franchie ou quasiment franchie. Verifiez vos prix et vos prochaines factures.'
                : 'Votre marge de securite TVA se reduit. Anticipez votre scenario de depassement.',
            value: `${tva.percentage.toFixed(0)}%`,
            ctaLabel: 'Voir le suivi TVA',
            severity: tva.status === 'danger' ? 'critical' : tva.status === 'warning' ? 'watch' : 'good',
            kind: 'scroll',
            targetId: 'tva-card',
        });
    }

    if (missingMonths.length > 0 && filledMonths > 0) {
        actions.push({
            id: 'missing-months',
            title: 'Completez vos mois manquants pour fiabiliser les alertes',
            detail: `Il vous manque ${missingMonths.length} mois saisis sur l'exercice en cours.`,
            value: `${missingMonths.length} mois`,
            ctaLabel: 'Completer la table CA',
            severity: missingMonths.length >= 3 ? 'critical' : 'watch',
            kind: 'scroll',
            targetId: 'monthly-entries',
        });
    }

    if (health.score < 70) {
        actions.push({
            id: 'optimisation',
            title: 'Votre score de pilotage peut etre ameliore rapidement',
            detail: "Passez par l'optimisation pour comparer votre poche nette, votre option fiscale et votre trajectoire.",
            value: `${health.score}/100`,
            ctaLabel: "Ouvrir l'optimisation",
            severity: health.score < 55 ? 'critical' : 'watch',
            kind: 'route',
            route: '/dashboard/optimisation',
        });
    }

    if (actions.length < 3) {
        const urssafItem = timeline.find((item) => item.id === 'urssaf');
        if (urssafItem) {
            actions.push({
                id: 'urssaf-deadline',
                title: urssafItem.title,
                detail: urssafItem.detail,
                value: urssafItem.value,
                ctaLabel: "Voir l'echeancier",
                severity: urssafItem.severity,
                kind: 'scroll',
                targetId: 'urssaf-calendar',
            });
        }
    }

    if (actions.length < 3) {
        actions.push({
            id: 'onboarding-refresh',
            title: "Votre situation a change ?",
            detail: 'Mettez a jour votre profil fiscal en 2 minutes pour garder des priorites fiables.',
            value: 'Rapide',
            ctaLabel: "Relancer l'onboarding",
            severity: 'good',
            kind: 'onboarding',
        });
    }

    return actions
        .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
        .slice(0, 3);
}
